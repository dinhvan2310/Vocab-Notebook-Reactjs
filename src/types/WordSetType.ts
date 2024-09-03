import { DocumentReference, Timestamp } from "firebase/firestore";
import { WordType } from "./WordType";

export interface WordSetType {
    wordsetId?: string;
    imageUrl?: string;
    folderRef: DocumentReference | string;
    
    name: string;
    nameLowercase?: string;


    visibility: 'public' | 'private';
    editableBy: 'owner' | 'everyone';
    editablePassword?: string;

    createAt: Timestamp;
    modifiedAt: Timestamp;

    words: WordType[];
}