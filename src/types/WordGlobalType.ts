import { Timestamp } from "firebase/firestore";

export interface WordGlobalType {
    name: string;

    meanings: MeaningGlobalType[];

    contexts: string[];
}

export interface MeaningGlobalType {
    meaning: string;

    lastUsedAt: Timestamp;
    usageCount: number;
}

