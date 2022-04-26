import 'dotenv/config';
import express from 'express';

import { S3_GET_FILES_FROM_BUCKET } from './s3/utils/types/query.js';
import { removeUnnecessaryProperties } from './s3/utils/removeUnnecessaryProperties.js';
import { generateFileTypeByExtension } from './s3/utils/generateFileTypeByExtension.js';

import { getFiles } from './s3/getFilesFromBucket.js';
import { getFileContents } from './s3/getFileContents.js';

const app = express();
const port = 3000;

async function getFileBody(fileName) {
    return new Promise((resolve, reject) => 
        setTimeout(() => {
            let result = await getFileContents(fileName);
            resolve(result);
        }, 200));
}


async function generatePathAndType(files) {
    return new Promise((resolve, reject) => 
        setTimeout(() => {
            files.map((file) => {
                file.Path = `https://${process.env.S3_BUCKET}.${process.env.S3_KEYWORD}.${process.env.AWS_REGION}.${process.env.AWS_ENDPOINT}/${file.Key}`;
                file.Type = generateFileTypeByExtension(file.Key);
            })
            resolve(files);
        }, 200));
}

app.get('/files', async function (req, res) {
    let files = (await getFiles()).Contents;
    files = await generatePathAndType(files);
    files.map((file) => {
        removeUnnecessaryProperties(file, S3_GET_FILES_FROM_BUCKET);
        if(file.Type == "text") {
            file.Body = await getFileBody(file.Key);
        }
    })
    console.log(files);
    return res.status(200).json(await Promise.all(files));
})

app.listen(port, () => console.log(`api listening on port ${port}`));