export async function captureFileExtension(fileName) {
    const regex = /(?:\.([^.]+))?$/
    let extension = regex.exec(fileName)[1]
    if (!extension)
        throw new Error(
            "Couldn't capture extension from file name. S3 endpoint might have changed the files' objects structure."
        )
    return extension
}
