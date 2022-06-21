import * as fs from 'fs'

function customLogReport(route: string, message: string) {
    const date = new Date()
    const formattedDate = new Date(date).toJSON()
    fs.appendFile(
        `/logs/access.${route}.log`,
        `[${formattedDate}] ${message} \n`,
        'utf-8',
        (err) => {
            if (err) throw new Error(`Failed to append [${formattedDate}] ${message} inside /logs/access.${route}.log`);
        }
    )
}

export { customLogReport }
