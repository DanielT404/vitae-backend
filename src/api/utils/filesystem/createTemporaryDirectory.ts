import path from 'path'
import { mkdir } from 'fs/promises';
import { getCurrentTime } from 'utils/date/getCurrentTime'

async function createTemporaryDirectory(dirName = 'tmp') {
    await mkdir(path.join(process.cwd(), dirName));
    return `[${getCurrentTime()} | FS: create tmp dir] Succesfully created temporary dir ${dirName}.`;
}

export { createTemporaryDirectory }