import { randomUUID } from 'crypto'

import { QueryTypes, removeUnnecessaryProperties } from './removeUnnecessaryProperties'
import { FileTypes, generateFileTypeByExtension } from './generateFileTypeByExtension'
import { shrinkFileName } from './shrinkFileName'
import { captureFileExtension } from './captureFileExtension'
import { getMaterialIcon } from './getMaterialIcon'
import { getFileContents } from '../getFileContents';

export async function modelFiles(files) {
    for (const file of files) {
        await removeUnnecessaryProperties(file, QueryTypes.S3_GET_FILES_FROM_BUCKET)
        file.Id = randomUUID()
        file.ResourcePath = `https://images.idratherprogram.com/${file.Key}`
        file.Type = await generateFileTypeByExtension(file.Key);
        if (file.Type === FileTypes.text) {
            file.Contents = await getFileContents(file.Key)
        }
        file.KeyShrinked = await shrinkFileName(file.Key)
        file.Extension = await captureFileExtension(file.Key);
        file.MaterialIcon = await getMaterialIcon(file.Type)
    }
    return files
}
