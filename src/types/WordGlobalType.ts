import { Timestamp } from "firebase/firestore";

export interface WordGlobalType {
    name: string;

    meanings: MeaningGlobalType[];

    contexts: string[];

    imageUrl: string[];

}

export interface MeaningGlobalType {
    meaning: string;

    lastUsedAt: Timestamp;
    usageCount: number;
}

