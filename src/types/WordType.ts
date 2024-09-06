import { Timestamp } from "firebase/firestore";

export interface WordType {

    imageURL?: string | File;
    meaning: string;
    contexts: string[];
    name: string;

    learned?: boolean;
    createdAt?: Timestamp;
    audio?: string;
}

