import 'dotenv/config';
import express from 'express';

import { S3_GET_FILES_FROM_BUCKET } from './s3/utils/types/query.js';
import { removeUnnecessaryProperties } from './s3/utils/removeUnnecessaryProperties.js';
import { generateFileTypeByExtension } from './s3/utils/generateFileTypeByExtension.js';

import { getFiles } from './s3/getFilesFromBucket.js';
import { getFileContents } from './s3/getFileContents.js';
import { log } from './dev/performanceLogger.js';


const app = express();
const port = 3000;
if (process.env.APP_ENV === 'development') {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
}
if (process.env.APP_ENV === 'production') {
    app.use(express.errorHandler());
}

async function modelFiles(files) {
    if(process.env.APP_ENV == "DEVELOPMENT") {
        log(files, "before modelling files");
    }
    for await (const file of files) {
        await removeUnnecessaryProperties(file, S3_GET_FILES_FROM_BUCKET);
        file.Path = `https://${process.env.S3_BUCKET}.${process.env.S3_KEYWORD}.${process.env.AWS_REGION}.${process.env.AWS_ENDPOINT}/${file.Key}`;
        file.Type = await generateFileTypeByExtension(file.Key);
        if(file.Type === "text") {
            file.Contents = await getFileContents(file.Key)
        }
    }
    if(process.env.APP_ENV == "DEVELOPMENT") {
        log(files, "after modelling files");
    }
    return files;
}

app.get('/files', async (req, res)  => {
    try {
        if(process.env.APP_ENV == "DEVELOPMENT") {
            log(req, "initial PoE");
        }
        let files = (await getFiles()).Contents;
        if(process.env.APP_ENV == "DEVELOPMENT") {
            log(files, "populating files coming from AWS API")
        }
        files = await modelFiles(files);
        if(process.env.APP_ENV == "DEVELOPMENT") {
            log(files, "final PoE");
        }
        return res.status(200).json({success: true, files: files});
    } catch (error) {
        console.log(`Error encountered while trying to get files. \n Error message: ${error} \n`);
        return res.status(500).json({success: false, message: "Service is temporarily unavailable, please try again later."});
    }
})

app.listen(port, () => console.log(`API listening on port ${port} \n`));