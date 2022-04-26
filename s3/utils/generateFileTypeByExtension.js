export function generateFileTypeByExtension(fileName) {
    const regex = /(?:\.([^.]+))?$/;
    let extension = regex.exec(fileName)[1];
    if(!extension) throw new Error("Couldn't capture extension from file name. S3 endpoint might have changed the files' objects structure.");
    console.log(extension);
    let type;
    switch(extension) {
        case "jpg":
            type = "image";
            break;
        case "gif":
            type = "image";
            break;
        case "bmp":
            type = "image";
            break;
        case "tiff":
            type = "image";
            break;
        case "webp":
            type = "image";
            break;
        case "png":
            type = "image";
            break;
        case "txt":
            type = "text";
            break;
        default:
            type = "abstract";
            break;
    }
    return type;
}