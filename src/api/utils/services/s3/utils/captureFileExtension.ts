export async function captureFileExtension(fileName: string) : Promise<string> {
    const regex = /(?:\.([^.]+))?$/
    const regexArr : RegExpExecArray | null = regex.exec(fileName);
    return new Promise((resolve, reject) => {
        if (regexArr && !regexArr[1]) reject(`Couldn't capture extension from file name '${fileName}'. S3 endpoint might have changed the files' objects structure.`)
        if (regexArr) resolve(regexArr[1] as string);
    })
}
