import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, orderBy, query, Timestamp, updateDoc, where } from "firebase/firestore";
import FolderType from "../types/FolderType";
import { auth, db } from "./firebase-config";
import { deleteImage } from "./utils/uploadImage";

/// Add a folder to the database and update the user's folders array in the user document
export const addFolder = async (folder: FolderType) => {

    console.log('addFolder');

    const user = auth.currentUser;
    if (!user) throw new Error("User is not logged in");

    if (!folder.id_user) throw new Error("User id is not provided");
    if (!folder.name) throw new Error("Folder name is not provided");
    if (folder.name.trim() === '') throw new Error("Folder name is empty");

    const collectionRef = collection(db, "folders");

    // add folder
    return (await addDoc(collectionRef, {
        id_user: folder.id_user,
        
        name: folder.name.trim(),
        imageUrl: folder.imageUrl,
        name_lowercase: folder.name.trim().toLowerCase(),
        createAt: folder.createAt,
        modifiedAt: folder.modifiedAt,
        word_sets: folder.word_sets,
    }));
}

export const updateFolder = async (folder: FolderType) => {

    console.log('updateFolder');

    const user = auth.currentUser;
    if (!user) throw new Error("User is not logged in");

    console.log('updateFolder', folder);

    if (folder.id_folder === undefined) throw new Error("Folder id is not provided");
    if (!folder.name) throw new Error("Folder name is not provided");
    if (folder.name.trim() === '') throw new Error("Folder name is empty");

    const folderRef = doc(db, "folders", folder.id_folder);
    const folderDoc = await getDoc(folderRef);
    if (folderDoc.exists()){
        console.log(folderDoc.data());
        // Check permission to update the folder (only the owner can update the folder)
        if (folderDoc.data().id_user === user?.uid) {
                await updateDoc(folderRef, {
                    name: folder.name,
                    imageUrl: folder.imageUrl,
                    name_lowercase: folder.name.toLowerCase(),
                    modifiedAt: Timestamp.now(),
                })
            
        }
        else {
            throw new Error("You don't have permission to update this folder");
        }
    }
    else {
        throw new Error("Folder is not found");
    }
}

/// Remove a folder from the database and update the user's folders array in the user document
export const removeFolder = async (id_folder: string) => {

    console.log('removeFolder');

    const user = auth.currentUser;
    if (!user) throw new Error("User is not logged in");
     
    
    const folderRef = doc(db, "folders", id_folder);
    const folderDoc = await getDoc(folderRef);
    if (folderDoc.exists()){
        // Check permission to delete the folder (only the owner can delete the folder)
        if (folderDoc.data().id_user === user?.uid) {
            await deleteDoc(doc(db, "folders", id_folder));
            
            if (folderDoc.data().imageUrl) {
                await deleteImage(folderDoc.data().imageUrl);
            }
        }
        else {
            throw new Error("You don't have permission to delete this folder");
        }
    }
}


export const onSnapshotFolders = (userid: string , callback: () => void) => {

    

    const q = query(collection(db, "folders"), where("id_user", "==", userid));
    return onSnapshot(q, () => {

        console.log('onSnapshotFolders');
        // const folders: FolderType[] = [];
        // snapshot.forEach((doc) => {
        //     const folder = doc.data() as FolderType;
        //     folder.id_folder = doc.id;
        //     folders.push(folder);
        // });
        callback();
    });
}

export const getFolders = async (
    id_user: string,
    stringSearch: string = '',

    sortBy: 'name_lowercase' | 'createAt' | 'none' = 'none',

    _startAt: number = 0,
    _limit: number = 5,
) => {

    console.log('getFolders');

    const __startAt = _startAt < 0 ? 0 : _startAt;
    const __limit = _limit < 0 ? 0 : _limit;
    
    const collectionRef = collection(db, "folders");

    
    const _stringSearch = stringSearch.trim().toLowerCase();
    // query
    let q = 
        query(
            collectionRef, 
            where("id_user", "==", id_user),
            where("name_lowercase", ">=", _stringSearch),
            where("name_lowercase", "<=", _stringSearch + "\uf8ff"),
        ) 
    if (sortBy !== 'none') {
        q = query(q, orderBy(sortBy, 'desc'));
    }

    

    // get data from query
    const querySnapshot = await getDocs(q);
    const numOfTotalFolders = querySnapshot.size;
    const folders: FolderType[] = [];
    querySnapshot.docs.slice(__startAt, __startAt + __limit).forEach((doc) => {
        const folder = doc.data() as FolderType;
        folder.id_folder = doc.id;
        folders.push(folder);
    });

    return { folders , numOfTotalFolders };
}

export const getFolder = async (id_folder: string | undefined) => {

    console.log('getFolder');

    if (!id_folder) throw new Error("Folder id is not provided");
    const folderRef = doc(db, "folders", id_folder);
    const folderDoc = await getDoc(folderRef);
    if (folderDoc.exists()){
        return folderDoc.data() as FolderType;
    }
    return null;
}

export const getFolderViewModeDefault = () => {

    const viewMode = localStorage.getItem('viewMode');
    if (viewMode === null) {
        localStorage.setItem('viewMode', 'table');
        return 'table';
    }

    return viewMode as 'table' | 'list' | 'card';
}

export const setFolderViewModeDefault = (viewMode: 'table' | 'list' | 'card') => {
    localStorage.setItem('viewMode', viewMode);
}
