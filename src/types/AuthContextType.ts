import { User } from "firebase/auth";


export default interface AuthContextType {
    user: User | null;
    signInWithGoogle: () => void;
    signInWithFacebook: () => void;
    signInWithEmailLink: (email: string) => void;
    signOut: () => void;
}