/*
    Backwards compatibility with Google Material Icons pack used in the (P)react front-end environment. 
    This function returns the icon to be used depending on the file type.
    Get the list of all possible icons from: https://mui.com/material-ui/material-icons/
*/

export async function getMaterialIcon(fileType) {
    // maps file type to specific-named material icon to be displayed
    const icon = {
        text: 'article',
        image: 'image',
    }
    if (!icon[fileType])
        throw new Error("File type currently doesn't have a material icon set.")
    return icon[fileType]
}
