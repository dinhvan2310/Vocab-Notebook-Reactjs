import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    DocumentReference,
    getDoc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    Timestamp,
    updateDoc,
    where
} from 'firebase/firestore';
import FolderType from '../types/FolderType';
import { auth, db } from './firebase-config';
import { deleteImage } from './utils/uploadImage';
import { removeWordSet } from './wordSetAPI';

const validateFolder = (folder: FolderType) => {
    if (!folder.name) throw new Error('Folder name is not provided');
    if (folder.name.length > 50) throw new Error('Folder name is too long');
};

/// Add a folder to the database and update the user's folders array in the user document
export const addFolder = async (folder: FolderType) => {
    console.log('addFolder', folder);

    const user = auth.currentUser;
    if (!user) throw new Error('User is not logged in');

    validateFolder(folder);

    const folderRef = collection(db, 'folders');

    // add folder
    return await addDoc(folderRef, {
        userRef: folder.userRef ?? doc(db, 'users', user.uid),

        name: folder.name.trim() || '', // not happen because of validateFolder
        nameLowercase: folder.name.trim().toLowerCase() || '', // not happen because of validateFolder
        imageUrl: folder.imageUrl || '',
        createAt: folder.createAt || Timestamp.now(),
        modifiedAt: folder.modifiedAt || Timestamp.now(),
        wordSets: folder.wordSets || []
    });
};

export const updateFolder = async (
    folderRef: string | DocumentReference | undefined,
    name: string,
    imageUrl: string | undefined
) => {
    console.log('updateFolder', imageUrl);

    const user = auth.currentUser;
    if (!user) throw new Error('User is not logged in');

    if (!folderRef) throw new Error('Folder reference is not provided');

    const _folderRef =
        typeof folderRef === 'string' ? doc(db, 'folders', folderRef) : folderRef;
    const _folderDoc = await getDoc(_folderRef);
    if (!_folderDoc.exists()) throw new Error('Folder is not found');
    // Check permission to update the folder (only the owner can update the folder)
    if (_folderDoc.data().userRef.id !== user?.uid)
        throw new Error("You don't have permission to update this folder");


    // ---------------------------------------------------------------------------------------------------------------
    // if (imageUrl === undefined) imageUrl = _folderDoc.data().imageUrl;
    // xoá image cũ bên storage nếu có
    if ( imageUrl !== _folderDoc.data().imageUrl && _folderDoc.data().imageUrl !== '') {
        await deleteImage(_folderDoc.data().imageUrl);
    // không có gì thay đổi thì không cần update
    }
    // update folder, modifiedAt is updated automatically
    await updateDoc(_folderRef, {
        name: name.trim(),
        nameLowercase: name.trim().toLowerCase(),
        imageUrl: imageUrl || '',
        modifiedAt: Timestamp.now()
    });
};

/// Remove a folder from the database and update the user's folders array in the user document
export const removeFolder = async (folderRef: string | DocumentReference) => {
    console.log('removeFolder', folderRef);

    const user = auth.currentUser;
    if (!user) throw new Error('User is not logged in');

    const _folderRef =
        typeof folderRef === 'string' ? doc(db, 'folders', folderRef) : folderRef;
    const _folderDoc = await getDoc(_folderRef);
    if (!_folderDoc.exists()) throw new Error('Folder is not found');

    // Check permission to delete the folder (only the owner can delete the folder)
    if (_folderDoc.data().userRef.id !== user?.uid)
        throw new Error("You don't have permission to delete this folder");

    // ---------------------------------------------------------------------------------------------------------------
    
    // delete image from storage if it exists
    if (_folderDoc.data().imageUrl) {
        console.log('deleteImageCoverFolder');
        await deleteImage(_folderDoc.data().imageUrl);
    }
    // delete all wordsets in the folder
    const wordSetsRef = _folderDoc.data().wordSets;
    for (let i = 0; i < wordSetsRef.length; i++) {
        await removeWordSet(wordSetsRef[i].id);
    }

    // delete folder
    deleteDoc(_folderRef);
};

export const onSnapshotFolders = (userId: string, callback: () => void) => {
    const userRef = doc(db, 'users', userId);
    const q = query(collection(db, 'folders'), where('userRef', '==', userRef));
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
};

// export const getFolders = async (
//     userId: string,
//     stringSearch: string = '',

//     sortBy: 'nameLowercase' | 'createAt'  = 'nameLowercase',

//     _startAt: number = 0,
//     _limit: number = 5,
// ) => {
//     console.log('getFolders');

//     // if (!userId) throw new Error("User id is not provided");
//     const userRef = doc(db, "users", userId);

//     const collectionRef = collection(db, "folders");
//     const _stringSearch = stringSearch.trim().toLowerCase();

//     console.log(userId, _stringSearch, sortBy, _startAt, _limit);

//     console.log(sortBy)

//     // query
//     let q =
//         query(
//             collectionRef,
//             where("userRef", "==", userRef),
//         )
//     q = query(q, orderBy(sortBy));

//     // get data from query
//     const querySnapshot = await getDocs(q);
//     const numOfTotalFolders = querySnapshot.size;
//     const folders: FolderType[] = [];
//     querySnapshot.docs.forEach((doc) => {
//         const folder = doc.data() as FolderType;
//         folder.folderId = doc.id;
//         folders.push(folder);
//     });

//     return { folders , numOfTotalFolders };
// }

export const getFolders = async (
    userId: string,
    startAt: number = 0,
    limit: number = 5,
    search: string = '',
    sortBy: 'nameLowercase' | 'modifiedAt' | 'createAt' = 'nameLowercase'
) => {
    if (!userId) throw new Error('User id is not provided');
    const userRef = doc(db, 'users', userId);
    let q;
    if (search) {
        q = query(
            collection(db, 'folders'),
            where('userRef', '==', userRef),
            where('nameLoweprcase', '>=', search.toLowerCase()),
            where('nameLowercase', '<=', search.toLowerCase() + '\uf8ff'),
            orderBy(sortBy, sortBy === 'nameLowercase' ? 'asc' : 'desc')
        );
    } else {
        q = query(
            collection(db, 'folders'),
            where('userRef', '==', userRef),
            orderBy(sortBy, sortBy === 'nameLowercase' ? 'asc' : 'desc')
        );
    }
    const querySnapshot = await getDocs(q);
    const folders: FolderType[] = [];
    querySnapshot.docs.slice(startAt, startAt + limit).forEach((doc) => {
        const folder = doc.data() as FolderType;
        folder.folderId = doc.id;
        folders.push(folder);
    });

    console.log('getFolders', folders);

    return {
        folders: folders,
        numOfTotalFolders: querySnapshot.size
    };
};

export const getFolder = async (folderId: string | undefined) => {
    console.log('getFolder');
    if (!folderId) throw new Error('Folder id is not provided');

    const folderRef = doc(db, 'folders', folderId);
    const folderDoc = await getDoc(folderRef);
    if (folderDoc.exists()) {
        const folder = folderDoc.data() as FolderType;
        folder.folderId = folderDoc.id;
        return folder;
    } else {
        throw new Error('Folder is not found');
    }
};

export const getFolderViewModeDefault = () => {
    const viewMode = localStorage.getItem('viewMode');
    if (viewMode === null) {
        localStorage.setItem('viewMode', 'table');
        return 'table';
    }

    return viewMode as 'table' | 'list' | 'card';
};

export const setFolderViewModeDefault = (viewMode: 'table' | 'list' | 'card') => {
    const viewModeDefault = localStorage.getItem('viewMode');
    if (viewModeDefault !== viewMode) {
        localStorage.setItem('viewMode', viewMode);
    }
};
