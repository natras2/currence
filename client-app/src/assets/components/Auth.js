import { getAuth, signInWithRedirect, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, getRedirectResult } from "firebase/auth"
import { app } from "../../firebase/firebaseConfig";
import { makeAPIRequest } from "./Utils";

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
    prompt: 'select_account',
});

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

const authenticate = async (user) => {
    console.log("You are authenticating as " + user.displayName + "");
    console.log("Authenticating you to the Currence API web service....");
    console.log("Check more at " + ((!!process.env.REACT_APP_IS_LOCALE) ? "http://localhost:8080/" : "https://currence-dzfvg2chhch0h3hd.northeurope-01.azurewebsites.net/"));

    sessionStorage.setItem("fullName", user.displayName);
    sessionStorage.setItem("email", user.email);
    sessionStorage.setItem("token", await user.getIdToken());

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
}

// Function to trigger Google sign-in with redirect
export const SignInWithGoogleAuth = () => {
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
    } catch (error) {
        console.error("Error during redirect result:", error.code, error.message);
        return false;
    }
};

export const CreateUserWithEmail = async (name, surname, email, password) => {
    try {
        await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(auth.currentUser, {
            displayName: `${name} ${surname}`,
        });
        console.log("Profile updated");
        return true;
    } catch (error) {
        console.error("User creation error:", error);
        return false;
    }
};

export const SignInWithEmail = async (email, password) => {
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        return await authenticate(result.user);
    } catch (error) {
        console.error("Sign-in error:", error);
        return false;
    }
};

export const SignOut = () => {
    auth.signOut().then(function () {
        sessionStorage.removeItem("fullName");
        sessionStorage.removeItem("email");
        sessionStorage.removeItem("token");
        console.log('Signed Out');
    }, function (error) {
        console.error('Sign Out Error', error);
    });
}