import { DocumentReference, Timestamp } from "firebase/firestore";

export interface WordType {

    imageURL?: string | File;
    meaning: string;
    contexts: string[];
    name: string;

    learned?: boolean;
    createdAt?: Timestamp;

    wordSetRef?: DocumentReference;
    wordId?: string;
}

