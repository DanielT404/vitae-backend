export async function captureFileExtension(fileName) {
    const regex = /(?:\.([^.]+))?$/
    let extension = regex.exec(fileName)[1]
    return new Promise((resolve, reject) => {
        if (!extension) reject(`Couldn't capture extension from file name '${fileName}'. S3 endpoint might have changed the files' objects structure.`)
        resolve(extension);
    })
}
