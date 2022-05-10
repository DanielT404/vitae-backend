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
    }
    const extension = await captureFileExtension(fileName)
    return fileTypes[extension] || 'abstract'
}
