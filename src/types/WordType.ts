export interface WordType {
    meanings: Meaning[];
    contexts: Context[];
    name: string;
}

export interface Context {
    context: string;
}

export interface Meaning {
    meaning: string;
}
