import { User } from "firebase/auth";


export default interface AuthContextType {
    user: User | null;
    signInWithGoogle: () => void;
    signInWithFacebook: () => void;
    signOut: () => void;
}