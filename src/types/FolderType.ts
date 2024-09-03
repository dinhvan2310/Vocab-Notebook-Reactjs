import { DocumentReference, Timestamp } from "firebase/firestore";

export default interface FolderType {
    folderId?: string;
    userRef?: DocumentReference;
    
    name: string; // Folder name
    nameLowercase?: string; // Folder name in lowercase

    createAt: Timestamp; // Folder created date
    modifiedAt: Timestamp; // Folder modified date

    imageUrl?: string; // Folder image URL
    
    wordSets: DocumentReference[]; // Reference to WordSet document
}
