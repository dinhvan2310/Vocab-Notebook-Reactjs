import { Timestamp } from "firebase/firestore";
import { WordType } from "./WordType";

export interface WordSetType {
    id_word_set?: string;
    image_url?: string;
    name_lowercase?: string;

    id_folder: string;
    name: string;

    visibility: 'public' | 'private';

    createAt: Timestamp;
    modifiedAt: Timestamp;

    words: WordType[];
}