export const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

export const getYouTubeThumbnail = (url, quality = 'hqdefault') => {
    const ytId = getYouTubeId(url);
    if (!ytId) return null;
    return `https://i.ytimg.com/vi/${ytId}/${quality}.jpg`;
};
