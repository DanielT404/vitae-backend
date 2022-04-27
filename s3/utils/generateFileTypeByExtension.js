export async function generateFileTypeByExtension(fileName) {
    const fileTypes = {
        "jpg": "image",
        "gif": "image",
        "bmp": "image",
        "tiff": "image",
        "webp": "image", 
        "png": "image",
        "txt": "text"
    }
    const regex = /(?:\.([^.]+))?$/;
    let extension = regex.exec(fileName)[1];
    if(!extension) throw new Error("Couldn't capture extension from file name. S3 endpoint might have changed the files' objects structure.");
    return fileTypes[extension] || "abstract";
}