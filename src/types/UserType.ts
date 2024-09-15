import { DocumentReference, Timestamp } from "firebase/firestore";

export interface UserType {
    userId: string;
    name: string;
    email: string;
    photoURL: string;

    provider: string;
    createAt: Timestamp;

    recentlyWordSet?: DocumentReference[];
}