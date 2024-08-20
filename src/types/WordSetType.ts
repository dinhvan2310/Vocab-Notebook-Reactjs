import { Timestamp } from "firebase/firestore";
import { WordType } from "./WordType";

export interface WordSetType {
    id_word_set: string;
    id_folder: string;
    name: string;
    visibility: 'public' | 'private';
    image_url: string;

    createAt: Timestamp;
    modifiedAt: Timestamp;

    words: WordType[];
}