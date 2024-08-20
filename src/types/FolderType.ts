import { DocumentReference, Timestamp } from "firebase/firestore";

export default interface FolderType {
    id_folder?: string;
    id_user: string; // User ID
    
    name: string; // Folder name
    name_lowercase?: string; // Folder name in lowercase

    createAt: Timestamp; // Folder created date
    modifiedAt: Timestamp; // Folder modified date
    
    word_sets: DocumentReference[]; // Reference to WordSet document
}
