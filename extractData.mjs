import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import fs from "fs";

const firebaseConfig = {
  projectId: "hassan-portfolio-1",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function extract() {
    try {
        console.log("Fetching projects...");
        const pSnap = await getDocs(collection(db, "projects"));
        const projects = pSnap.docs.map(d => ({ id: d.id, ...d.data() }));

        console.log("Fetching highlights...");
        const hSnap = await getDocs(collection(db, "highlights"));
        const highlights = hSnap.docs.map(d => ({ id: d.id, ...d.data() }));

        console.log("Fetching tags...");
        const tSnap = await getDocs(collection(db, "tags"));
        const tags = tSnap.docs.map(d => ({ id: d.id, ...d.data() }));

        if (!fs.existsSync("./src/data")) {
            fs.mkdirSync("./src/data", { recursive: true });
        }

        fs.writeFileSync("./src/data/projects.json", JSON.stringify(projects, null, 2));
        fs.writeFileSync("./src/data/highlights.json", JSON.stringify(highlights, null, 2));
        fs.writeFileSync("./src/data/tags.json", JSON.stringify(tags, null, 2));

        console.log("Data successfully extracted to src/data/");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

extract();
