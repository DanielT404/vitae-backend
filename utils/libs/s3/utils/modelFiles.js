import { randomUUID } from 'crypto'

import { S3_GET_FILES_FROM_BUCKET } from './types/query.js'

import { removeUnnecessaryProperties } from './removeUnnecessaryProperties.js'
import { generateFileTypeByExtension } from './generateFileTypeByExtension.js'
import { shrinkFileName } from './shrinkFileName.js'
import { captureFileExtension } from './captureFileExtension.js'
import { getMaterialIcon } from './getMaterialIcon.js'
import { getFileContents } from '../getFileContents.js'

export async function modelFiles(files) {
    for (const file of files) {
        await removeUnnecessaryProperties(file, S3_GET_FILES_FROM_BUCKET)
        file.Id = randomUUID()
        file.ResourcePath = `https://images.idratherprogram.com/${file.Key}`
        file.Type = await generateFileTypeByExtension(file.Key);
        if (file.Type === 'text') {
            file.Contents = await getFileContents(file.Key)
        }
        file.KeyShrinked = await shrinkFileName(file.Key)
        file.Extension = await captureFileExtension(file.Key);
        file.MaterialIcon = await getMaterialIcon(file.Type)
    }
    return files
}
