import 'dotenv/config';
import express from 'express';

import { S3_GET_FILES_FROM_BUCKET } from './s3/utils/types/query.js';
import { removeUnnecessaryProperties } from './s3/utils/removeUnnecessaryProperties.js';
import { generateFileTypeByExtension } from './s3/utils/generateFileTypeByExtension.js';

import { getFiles } from './s3/getFilesFromBucket.js';
import { getFileContents } from './s3/getFileContents.js';

const app = express();
const port = 3000;

async function modelFiles(files) {
    for (const file of files) {
        removeUnnecessaryProperties(file, S3_GET_FILES_FROM_BUCKET);
        file.Path = `https://${process.env.S3_BUCKET}.${process.env.S3_KEYWORD}.${process.env.AWS_REGION}.${process.env.AWS_ENDPOINT}/${file.Key}`;
        file.Type = generateFileTypeByExtension(file.Key);
        if(file.Type === "text") {
            file.Contents = await getFileContents(file.Key)
        }
    }
    return files;
}

app.get('/files', async (req, res)  => {
    let files = (await getFiles()).Contents;
    files = await modelFiles(files);
    return res.status(200).json(files);
})

app.listen(port, () => console.log(`api listening on port ${port}`));