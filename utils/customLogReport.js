import fs from 'fs'

function customLogReport(path, route, message) {
    const date = new Date()
    const formattedDate = new Date(date).toJSON()
    fs.appendFile(
        `${path}/logs/access.${route}.log`,
        `[${formattedDate}] ${message} \n`,
        'utf-8'
    )
}

export { customLogReport }
