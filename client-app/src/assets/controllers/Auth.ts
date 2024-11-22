import { getAuth, signInWithRedirect, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, getRedirectResult, User } from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore";
import { app, db } from "../../firebase/firebaseConfig";
// import { makeAPIRequest } from "./Utils";

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
    prompt: 'select_account',
});

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

const authenticate = async (user: User) => {
    console.log("You are authenticating as " + user.displayName + "");

    const userRef = doc(db, 'Users', user.uid);
    const userInstance = await getDoc(userRef);

    if (!userInstance.exists()) {
        console.log("No such document! Creating it,");
        await setDoc(userRef, {
            uid: user.uid,
            fullName: user.displayName,
            email: user.email,
            emailVerified: user.emailVerified
        });
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

export const CreateUserWithEmail = async (name: string, surname: string, email: string, password: string) => {
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
        
        return true;
    } catch (error) {
        console.error("User creation error:", error);
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
        await auth.signOut();
        console.log('Signed Out');
    }
    catch (error) {
        console.error('Sign Out Error', error);
    };
}