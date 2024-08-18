import { Timestamp } from "firebase/firestore";
import { WordType } from "./WordType";

export default interface FolderType {
    id_folder?: string;
    id_user: string;
    name: string;
    visibility: 'public' | 'private';
    createAt: Timestamp;
    nums_words: number;
    words: WordType[];
}