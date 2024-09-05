import { Timestamp } from "firebase/firestore";

export interface WordType {

    imageURL?: string | File;
    meaning: string;
    contexts: string[];
    name: string;
    nameLowercase?: string;

    learned?: boolean;
    createdAt?: Timestamp;
}

