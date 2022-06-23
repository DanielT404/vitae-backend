/*
    Backwards compatibility with Google Material Icons pack used in the (P)react front-end environment. 
    This function returns the icon to be used depending on the file type.
    Get the list of all possible icons from: https://mui.com/material-ui/material-icons/
*/
import { FileTypes } from "./generateFileTypeByExtension";

type MaterialIcon = {
    [key in FileTypes] : string | undefined
}
export async function getMaterialIcon(fileType: FileTypes) : Promise<string> {
    // maps file type to specific-named material icon to be displayed
    const icon : MaterialIcon = {
        text: 'article',
        image: 'image',
    }
    return new Promise((resolve, reject) => {
        if (!icon[fileType]) reject(`File type '${fileType}' currently doesn't have a material icon type set.`);
        resolve(icon[fileType] as string);
    })
}
