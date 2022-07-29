import { captureFileExtension } from './captureFileExtension'

interface IFileTypes {
    [key: string]: FileTypes | undefined
}
export enum FileTypes {
    image = "image",
    text = "text"
}
export async function generateFileTypeByExtension(fileName: string): Promise<string> {
    const fileTypes: IFileTypes = {
        jpg: FileTypes.image,
        gif: FileTypes.image,
        bmp: FileTypes.image,
        tiff: FileTypes.image,
        webp: FileTypes.image,
        png: FileTypes.image,
        txt: FileTypes.text,
        yml: FileTypes.text,
        js: FileTypes.text
    }
    const extension = await captureFileExtension(fileName);
    return new Promise((resolve, reject) => {
        if (extension && !fileTypes[extension]) {
            reject(`File ('${fileName}') extension '.${extension}' doesn't have a file type set. Valid types: ENUM['image', 'text']`);
        }
        resolve(fileTypes[extension] as string)
    })
}
