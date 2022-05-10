export async function shrinkFileName(fileName) {
    let shrinkedName = fileName
    if (fileName.length > 6) {
        shrinkedName = fileName.substr(0, 5)
        let dots = Array(4).fill('.')
        shrinkedName = shrinkedName.split('').concat(dots).join('')
        shrinkedName = shrinkedName.replace('-', '')
    }
    return shrinkedName
}
