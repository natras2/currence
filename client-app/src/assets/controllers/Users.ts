import { createUserWithEmailAndPassword, getAuth, updateProfile } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { app, db } from "../../firebase/firebaseConfig";
import { userConverter } from "../model/User";
import Controller from "./Controller";
import { DataContext } from "../../app/PersonalArea";

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export default class UserController extends Controller {
    constructor(context: DataContext) {
        super(context);
    };

    async UpdateHiddenBalance(updatedHiddenBalance: boolean) {
        try {
            const userRef = doc(db, 'Users', this.user.uid).withConverter(userConverter);

            await updateDoc(userRef, {
                hiddenBalance: updatedHiddenBalance
            });

            this.setUser((prevUser: any) => ({
                ...prevUser,
                hiddenBalance: updatedHiddenBalance,
            }));

            return true;
        }
        catch (error) {
            console.error("Error updating the field hiddenBalance:", error);
            return false;
        }
    }

    async UpdateTotalBalance(totalBalance: number) {
        try{
    const userRef = doc(db, 'Users', this.user.uid).withConverter(userConverter);

    await updateDoc(userRef, {
        totalBalance: totalBalance
    });

    this.setUser((prevUser: any) => ({
        ...prevUser,
        totalBalance: totalBalance,
    }));
    
    return true;
}
catch (error) {
    console.error("Error updating the field totalBalance:", error);
    return false;
}
}
}


export async function CreateNewUser(name: string, surname: string, email: string, password: string) {
    try {
        await createUserWithEmailAndPassword(auth, email, password);
        if (auth.currentUser) {
            await updateProfile(auth.currentUser, {
                displayName: `${name} ${surname}`,
            });
            console.log("Profile updated");
        }
        else {
            throw (Error("No user to update. The name hasn't been saved"));
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
export async function GetUser(uid: string) {
    const userRef = doc(db, 'Users', uid).withConverter(userConverter);
    const userInstance = await getDoc(userRef);

    return (userInstance.exists()) ? userInstance.data() : null;
}

export async function UpdateTotalBalance(uid: string, totalBalance: number) {
    const userRef = doc(db, 'Users', uid).withConverter(userConverter);

    await updateDoc(userRef, {
        totalBalance: totalBalance
    });
}