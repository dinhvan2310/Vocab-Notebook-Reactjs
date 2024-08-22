import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, orderBy, query, where } from "firebase/firestore";
import FolderType from "../types/FolderType";
import { auth, db } from "./firebase-config";

/// Add a folder to the database and update the user's folders array in the user document
export const addFolder = async (folder: FolderType) => {
    const user = auth.currentUser;
    if (!user) throw new Error("User is not logged in");

    const collectionRef = collection(db, "folders");

    // add folder
    await addDoc(collectionRef, {
        id_user: folder.id_user,
        
        name: folder.name,
        name_lowercase: folder.name_lowercase,
        createAt: folder.createAt,
        modifiedAt: folder.modifiedAt,
        word_sets: folder.word_sets,
    });

    // 
    // await updateDoc(userRef, {
    //     folders: arrayUnion(folderRef)
    // });
}

/// Remove a folder from the database and update the user's folders array in the user document
export const removeFolder = async (id_folder: string) => {
    const user = auth.currentUser;
    if (!user) throw new Error("User is not logged in");
     
    
    const folderRef = doc(db, "folders", id_folder);
    const folderDoc = await getDoc(folderRef);
    if (folderDoc.exists()){
        // Check permission to delete the folder (only the owner can delete the folder)
        if (folderDoc.data().id_user === user?.uid) {
            await deleteDoc(doc(db, "folders", id_folder));
            // const userRef = doc(db, "users", user.uid);
            // Remove the folder from the user's folders array 
            // await updateDoc(userRef, {
            //     folders: arrayRemove(folderRef)
            // });
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

// export const getFolders = async (
//     id_user: string, 
//     stringSearch: string = '',
//     sortByName: 'asc' | 'desc' | 'none' = 'none',
//     sortByDate: 'asc' | 'desc' | 'none' = 'none',
//     _startAt: number = 0,
//     _limit: number = 5,
// ) => {
//     const __startAt = _startAt < 0 ? 0 : _startAt;
//     const __limit = _limit < 0 ? 0 : _limit;
//     const __stringSearch = stringSearch.trim().toLowerCase();

//     const userRef = doc(db, "users", id_user);
//     const userDoc = await getDoc(userRef);
//     if (!userDoc.exists()) {
//         throw new Error("User not found");
//     }

//     const foldersRef = userDoc.data()?.folders as DocumentReference[];

//     const folders = getDocs(query(collection(db, "folders"), where("id_user", "==", id_user)));

// }

export const getFolders = async (
    id_user: string,
    stringSearch: string = '',

    sortByName: 'asc' | 'desc' | 'none' = 'none',
    sortByDate: 'asc' | 'desc' | 'none' = 'none',

    _startAt: number = 0,
    _limit: number = 5,
) => {
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
    if (sortByName !== 'none') {
        q = query(q, orderBy("name_lowercase", sortByName));
    }
    if (sortByDate !== 'none') {
        q = query(q, orderBy("createAt", sortByDate));
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