import { getDownloadURL, getStorage, ref, listAll } from "firebase/storage";

class Preloader {
    constructor() {
        this.cache = new Map();
        this.subscribers = new Map();
        this.isPreloading = false;
        this.queue = [];
        this.isProcessing = false;
    }

    init(projects) {
        if (this.isPreloading) return;
        this.isPreloading = true;
        if (!this.isProcessing) {
            this.isProcessing = true;
            this.processQueue();
        }
    }

    async processQueue() {
        if (this.queue.length === 0) {
            this.isProcessing = false;
            return;
        }
        this.isProcessing = true;

        const task = this.queue.shift();
        await this.loadAsset(task);

        if (typeof requestIdleCallback !== 'undefined') {
            requestIdleCallback(() => this.processQueue());
        } else {
            setTimeout(() => this.processQueue(), 50);
        }
    }

    async loadAsset(task) {
        const { type, id, name, hasThumbnail } = task;
        const cacheKey = `${type}_${id}`;

        if (this.cache.has(cacheKey)) return;

        if (type === 'profile') {
            if (hasThumbnail === false) {
                this.setCache(cacheKey, "");
                return;
            }
            try {
                let url = "";
                const storage = getStorage();

                const tryFetch = async (path) => {
                    try { return await getDownloadURL(ref(storage, path)); }
                    catch (e) { return null; }
                };

                url = await tryFetch(`${id}.jpg`);
                if (!url) url = await tryFetch(`${id}.png`);

                if (!url && id !== name) {
                    url = await tryFetch(`${name}.jpg`);
                    if (!url) url = await tryFetch(`${name}.png`);
                }

                if (!url) throw new Error("Not found");

                const img = new Image();
                img.src = url;
                try {
                    await img.decode();
                } catch (e) {
                    // Ignore decode errors, we still cached it
                }

                this.setCache(cacheKey, url);
            } catch (err) {
                this.setCache(cacheKey, "");
            }
        } else if (type === 'gallery') {
            try {
                const folderRef = ref(getStorage(), id);
                const res = await listAll(folderRef);
                const urls = await Promise.all(res.items.map(itemRef => getDownloadURL(itemRef)));

                await Promise.all(urls.map(async (url) => {
                    const img = new Image();
                    img.src = url;
                    try {
                        await img.decode();
                    } catch (e) { }
                }));

                this.setCache(cacheKey, urls);
            } catch (err) {
                this.setCache(cacheKey, []);
            }
        }
    }

    setCache(key, data) {
        this.cache.set(key, data);
        if (this.subscribers.has(key)) {
            this.subscribers.get(key).forEach(cb => cb(data));
        }
    }

    getAsset(type, id, cb) {
        const key = `${type}_${id}`;
        if (this.cache.has(key)) {
            cb(this.cache.get(key));
        } else {
            if (!this.subscribers.has(key)) {
                this.subscribers.set(key, new Set());
                this.queue.push({ type, id, name: id, hasThumbnail: true });
                if (!this.isProcessing) {
                    this.isProcessing = true;
                    this.processQueue();
                }
            }
            this.subscribers.get(key).add(cb);
        }

        return () => {
            if (this.subscribers.has(key)) {
                this.subscribers.get(key).delete(cb);
            }
        };
    }
}

export const AssetPreloader = new Preloader();
