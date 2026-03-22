const STORAGE_BASE_URL = "https://api.kalingangkababaihan.com/storage/";

export const resolveStorageImageUrl = (imagePath, fallback = "/images/avatar.png") => {
    if (!imagePath) return fallback;
    if (imagePath.startsWith("http")) return imagePath;

    const normalizedPath = `${imagePath}`.replace(/^\/+/, "").replace(/^storage\//, "");
    return `${STORAGE_BASE_URL}${normalizedPath}`;
};
