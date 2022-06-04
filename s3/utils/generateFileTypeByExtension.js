import { captureFileExtension } from '../utils/captureFileExtension.js'

export async function generateFileTypeByExtension(fileName) {
    const fileTypes = {
        jpg: 'image',
        gif: 'image',
        bmp: 'image',
        tiff: 'image',
        webp: 'image',
        png: 'image',
        txt: 'text',
        yml: 'text',
        js: 'text'
    }
    const extension = await captureFileExtension(fileName);
    return new Promise((resolve, reject) => {
        if (extension && !fileTypes[extension]) {
            reject(`File ('${fileName}') extension '.${extension}' doesn't have a file type set. Valid types: ENUM['image', 'text']`);
        }
        resolve(fileTypes[extension])
    })
}
