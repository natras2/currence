import { getAuth, signInWithRedirect, GoogleAuthProvider, signInWithEmailAndPassword, getRedirectResult, User as FirebaseUser } from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore";
import { app, db } from "../../firebase/firebaseConfig";
import User, { userConverter } from "../model/User";
import { defaultExpenseCategories, defaultIncomeCategories } from "../model/Transaction";
// import { makeAPIRequest } from "./Utils";

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
    prompt: 'select_account',
});

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

const authenticate = async (submittedUser: FirebaseUser) => {
    console.log("You are authenticating as " + submittedUser.displayName + "");

    const userRef = doc(db, 'Users', submittedUser.uid).withConverter(userConverter);
    const userInstance = await getDoc(userRef);

    if (!userInstance.exists()) {
        console.log("It looks like this is the first time up here! I'm uploading your data...");
        const user = new User(
            submittedUser.uid,
            submittedUser.displayName as string,
            submittedUser.email as string,
            submittedUser.emailVerified,
            [...defaultIncomeCategories],
            [...defaultExpenseCategories],
            0
        );
        await setDoc(userRef, user);
    }

    return true;

    /*
    const response = await makeAPIRequest('Authenticate', null, null, true);

    if (response.code === 200) {
        console.log('The user got authenticated successfully');
        return true;
    }
    else {
        sessionStorage.clear();
        console.error(`API request failed with code ${response.code}:`, response.body);
        return false;
    }
    */
}

// Function to trigger Google sign-in with redirect
export const SignInWithGoogleAuth = () => {
    sessionStorage.setItem("signingInWithGoogle", "true");
    signInWithRedirect(auth, provider);
};

export const CheckRedirectSignIn = async () => {
    try {
        const result = await getRedirectResult(auth);
        if (result) {
            const user = result.user;
            if (user) {
                console.log("User signed in via redirect");
                return await authenticate(user);
            }
        }
        return false;
    }
    catch (error: any) {
        console.error("Error during redirect result:", error.code, error.message);
        return false;
    }
};

export const SignInWithEmail = async (email: string, password: string) => {
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        return await authenticate(result.user);
    } catch (error) {
        console.error("Sign-in error:", error);
        return false;
    }
};

export const SignOut = async () => {
    try {
        localStorage.clear();
        await auth.signOut();
        console.log('Signed Out');
    }
    catch (error) {
        console.error('Sign Out Error', error);
    };
}