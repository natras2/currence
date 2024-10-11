import { getAuth, signInWithRedirect, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, getRedirectResult, onAuthStateChanged } from "firebase/auth"
import { app } from "../../firebase/firebaseConfig";

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
    prompt: 'select_account',
});

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

const signIn = (user) => {
    console.log("Here we are");
    console.log("Welcome, " + user.displayName);
}

// Function to trigger Google sign-in with redirect
export const signInWithGoogleAuth = () => {
    signInWithRedirect(auth, provider);
};

// Function to check for the redirect result (on app load)
export const checkSignIn = () => {
    console.log("Auth listener initialized");

    getRedirectResult(auth)
        .then((result) => {
            if (result) {
                const user = result.user;
                if (user) {
                    // Successfully signed in after redirect
                    console.log("User signed in via redirect");
                    signIn(user);
                }
            }
        })
        .catch((error) => {
            // Handle any errors that occurred during the redirect flow
            console.error("Error during redirect result", error.code, error.message);
        });

    // Check if the user is already signed in when the page loads
    onAuthStateChanged(auth, (user) => {
        if (user) {
            signIn(result);
        }
    });
};

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
        .then((result) => signIn(result.user))
        .catch((error) => {
            console.log(error)
        });
}

export const signOut = () => {
    auth.signOut().then(function () {
        console.log('Signed Out');
    }, function (error) {
        console.error('Sign Out Error', error);
    });
}