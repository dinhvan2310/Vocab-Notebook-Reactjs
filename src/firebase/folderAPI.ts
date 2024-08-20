import { addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, limit, onSnapshot, or, orderBy, query, startAt, updateDoc, where } from "firebase/firestore";
import FolderType from "../types/FolderType";
import { auth, db } from "./firebase-config";

/// Add a folder to the database and update the user's folders array in the user document
export const addFolder = async (folder: FolderType) => {
    const user = auth.currentUser;
    if (!user) throw new Error("User is not logged in");

    const userRef = doc(db, "users", user.uid);
    const collectionRef = collection(db, "folders");

    // add folder
    const folderRef = await addDoc(collectionRef, {
        id_user: folder.id_user,
        
        name: folder.name,
        name_lowercase: folder.name_lowercase,
        createAt: folder.createAt,
        modifiedAt: folder.modifiedAt,

        word_sets: folder.word_sets
    });

    // 
    await updateDoc(userRef, {
        folders: arrayUnion(folderRef)
    });
}

/// Remove a folder from the database and update the user's folders array in the user document
export const removeFolder = async (id_folder: string) => {
    const user = auth.currentUser;
    if (!user) throw new Error("User is not logged in");
     
    const folderRef = await getDoc(doc(db, "folders", id_folder));
    if (folderRef.exists()){
        // Check permission to delete the folder (only the owner can delete the folder)
        if (folderRef.data().id_user === user?.uid) {
            await deleteDoc(doc(db, "folders", id_folder));
            const userRef = doc(db, "users", user.uid);
            // Remove the folder from the user's folders array 
            await updateDoc(userRef, {
                folders: arrayRemove(folderRef)
            });
        }
    }
}


export const onSnapshotFolders = async (callback: (folders: FolderType[]) => void) => {
    const user = auth.currentUser;
    if (!user) throw new Error("User is not logged in");

    const q = query(collection(db, "folders"), where("id_user", "==", user.uid));
    return onSnapshot(q, (snapshot) => {
        const folders: FolderType[] = [];
        snapshot.forEach((doc) => {
            const folder = doc.data() as FolderType;
            folder.id_folder = doc.id;
            folders.push(folder);
        });
        callback(folders);
    });
}

// export const getFolders = async (id_user: string, ) => {

//     // Get all folders that belong to the user
//     const q = query(collection(db, "folders"), where("id_user", "==", id_user));
//     const querySnapshot = await getDocs(q);

//     // Convert to FolderType[]
//     const folders: FolderType[] = [];
//     querySnapshot.forEach((doc) => {
//         const folder = doc.data() as FolderType;
//         folder.id_folder = doc.id;
//         folders.push(folder);
//     });

//     return folders;
// }

export const getFolders = async (
    id_user: string,
    stringSearch: string = '',

    _limit: number = 5,
    _startAt: number = 0
) => {
    const collectionRef = collection(db, "folders");

    // query
    const q = stringSearch ? 
        query(
            collectionRef, 
            where("id_user", "==", id_user),
            where("name_lowercase", ">=", stringSearch.toLowerCase()),
            where("name_lowercase", "<=", stringSearch.toLowerCase() + "\uf8ff"),
            
            orderBy("name_lowercase"),
            limit(_limit),
            startAt(_startAt),
        ) : 
        query(
            collectionRef, 
            where("id_user", "==", id_user),

            orderBy("name_lowercase"),
            limit(_limit),
            startAt(_startAt),
        );

    // get data from query
    const querySnapshot = await getDocs(q);
    const folders: FolderType[] = [];
    querySnapshot.forEach((doc) => {
        const folder = doc.data() as FolderType;
        folder.id_folder = doc.id;
        folders.push(folder);
    });

    console.log(folders.length);
    // return data
    return folders;
}