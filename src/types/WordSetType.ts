import { DocumentReference, Timestamp } from "firebase/firestore";

export interface WordSetType {
    wordsetId?: string;
    imageUrl?: string;
    folderRef: DocumentReference | string;
    userRef: DocumentReference;
    
    name: string;
    nameLowercase?: string;


    visibility: 'public' | 'private';
    editableBy: 'owner' | 'everyone';
    editablePassword?: string;

    createAt: Timestamp;
    modifiedAt: Timestamp;

    star?: DocumentReference[];

    words?: DocumentReference[];
}