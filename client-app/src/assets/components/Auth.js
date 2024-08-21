import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { app } from "../../firebase/firebaseConfig";

const provider = new GoogleAuthProvider();

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

const signIn = (userCredentials) => {
    console.log(userCredentials);
}

export const signInWithGoogleAuth = () => {
    signInWithPopup(auth, provider)
        .then(signIn)
        .catch((error) => {
            console.log(error)
        });
}

export const createUserWithEmail = (name, surname, email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
            updateProfile(auth.currentUser, {
                displayName: name + " " + surname
            }).then(() => {
                console.log("Profile updated");
                auth.currentUser.providerData.forEach((profile) => {
                    console.log("Sign-in provider: " + profile.providerId);
                    console.log("  Provider-specific UID: " + profile.uid);
                    console.log("  Name: " + profile.displayName);
                    console.log("  Email: " + profile.email);
                });
            }).catch((error) => {
                console.log(error);
            });
        }).catch((error) => {
            console.log(error)
        });
}

export const signInWithEmail = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
        .then(signIn)
        .catch((error) => {
            console.log(error)
        });
}