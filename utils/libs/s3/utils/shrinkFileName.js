export async function shrinkFileName(fileName) {
    let shrinkedName = fileName.trim();
    shrinkedName = shrinkedName.replace(/\s/g, '');
    if (fileName.length > 6) {
        const dots = Array(4).fill('.')
        shrinkedName = fileName.substr(0, 5)
        shrinkedName = shrinkedName.split('').concat(dots).join('')
    }
    return Promise.resolve().then(() => shrinkedName);
}
