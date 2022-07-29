import path from 'path'
import { rm } from 'fs/promises';
import { getCurrentTime } from 'utils/date/getCurrentTime'

async function removeTemporaryDirectory(dirName = 'tmp'): Promise<string> {
    await rm(path.join(process.cwd(), dirName), { recursive: true, force: true });
    return `[${getCurrentTime()} | FS: remove tmp dir] Succesfully removed temporary dir ${dirName}.`;
}

export { removeTemporaryDirectory }