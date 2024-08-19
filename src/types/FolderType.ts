import { Timestamp } from "firebase/firestore";

export default interface FolderType {
    id_folder?: string;
    id_user: string;
    name: string;
    createAt: Timestamp;
    modifiedAt: Timestamp;
    nums_word_sets: number;
}