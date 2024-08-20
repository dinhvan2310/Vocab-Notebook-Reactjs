export interface WordType {
    meanings: Meaning[] | Meaning;
    contexts: Context[];
    name: string;
}

export interface Context {
    point?: number;
    context: string;
    translation: string;
}

export interface Meaning {
    point?: number;
    meaning: string;
}
