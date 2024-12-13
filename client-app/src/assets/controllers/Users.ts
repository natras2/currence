import { createUserWithEmailAndPassword, getAuth, updateProfile } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { app, db } from "../../firebase/firebaseConfig";
import { userConverter } from "../model/User";

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export async function CreateNewUser (name: string, surname: string, email: string, password: string) {
    try {
        await createUserWithEmailAndPassword(auth, email, password);
        if (auth.currentUser) {
            await updateProfile(auth.currentUser, {
                displayName: `${name} ${surname}`,
            });
            console.log("Profile updated");
        }
        else {
            throw(Error("No user to update. The name hasn't been saved"));
        }
        localStorage.clear();
        await auth.signOut();
        return true;
    } 
    catch (error) {
        console.error("User creation error:", error);
        return false;
    }
}
export async function GetUser (uid: string) {
    const userRef = doc(db, 'Users', uid).withConverter(userConverter);
    const userInstance = await getDoc(userRef);

    return (userInstance.exists()) ? userInstance.data() : null;
}

export async function UpdateTotalBalance (uid: string, totalBalance: number) {
    const userRef = doc(db, 'Users', uid).withConverter(userConverter);

    await updateDoc(userRef, {
        totalBalance: totalBalance
    });
}

export async function UpdateHiddenBalance (uid: string, updatedHiddenBalance: boolean) {
    const userRef = doc(db, 'Users', uid).withConverter(userConverter);

    await updateDoc(userRef, {
        hiddenBalance: updatedHiddenBalance
    });
}