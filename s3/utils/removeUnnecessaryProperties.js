export function removeUnnecessaryProperties(obj, queryType) {
    return Promise.resolve().then(() => {
        switch(queryType) {
            case "S3_GET_FILES_FROM_BUCKET":
                delete obj?.ChecksumAlgorithm;
                delete obj?.ETag;
                delete obj?.Owner;
                delete obj?.StorageClass;
                delete obj?.Size;
                break;
            default:
                break;
        }
    })
}