import 'dotenv/config';
import express from 'express';

import { getFiles } from './s3/getFilesFromBucket.js';
import { modelFiles } from './s3/utils/modelFiles.js';

import { log } from './dev/performanceLogger.js';


const app = express();
const port = 3000;
if (process.env.APP_ENV === 'development') {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
}
if (process.env.APP_ENV === 'production') {
    app.use(express.errorHandler());
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