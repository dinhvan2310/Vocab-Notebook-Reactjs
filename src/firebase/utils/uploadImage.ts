import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../firebase-config";


export const uploadImage = async (file: File) => {


    // refactor name of file to date + . + file extension
    const storageRef = ref(storage, 'images/' + Date.now() + '.' + file.name.split('.').pop());
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise<string>((resolve, reject) => {
        uploadTask.on('state_changed',
            () => {
                
            },
            (error) => {
                console.log(error);
                reject(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL);
                });
            }
        );
    });
}

export const deleteImage = async (url: string) => {
    const imagePath = getPathStorageFromUrl(url);

    const storageRef = ref(storage, imagePath);

    deleteObject(storageRef).then(() => {
        console.log("File deleted successfully");
        // File deleted successfully
      }).catch((error) => {
        // Uh-oh, an error occurred!
        console.log(error);
      });
}


function getPathStorageFromUrl(url:string){
    const baseUrl = "https://firebasestorage.googleapis.com/v0/b/vocabulary-notebook-989d7.appspot.com/o/";

    let imagePath:string = url.replace(baseUrl,"");
    
        const indexOfEndPath = imagePath.indexOf("?");
    
        imagePath = imagePath.substring(0,indexOfEndPath);
        
        imagePath = imagePath.replace(/%2F/g,"/");
        
        imagePath = imagePath.replace(/%20/g," ");
     
        return imagePath;
}