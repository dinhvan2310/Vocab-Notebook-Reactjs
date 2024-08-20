import { DocumentReference, Timestamp } from "firebase/firestore";

export interface UserType {
    id_user?: string;
    name: string;
    email: string;
    photoURL: string;

    provider: string;
    createAt: Timestamp;
    folders: DocumentReference[];
}