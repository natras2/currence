import { useEffect, useState } from "react";
import ProfileImage from "../assets/components/ProfileImage";
import { getAuth } from "firebase/auth";
import { app } from "../firebase/firebaseConfig";
import { Link, useNavigate } from "react-router-dom";
import { GetUser } from "../assets/controllers/Users";
import { BackButton } from "../assets/components/Utils";

export default function Settings() {
    const [processing, setProcessing] = useState(true);
    const [user, setUser] = useState<any>(null);

    const auth = getAuth(app);
    const navigate = useNavigate();

    useEffect(() => {
        async function initialize() {
            const unsubscribe = auth.onAuthStateChanged(async (loggedUser) => {
                if (!loggedUser) {
                    console.error("The user is not logged. Redirecting to root...");
                    navigate("/");
                    return;
                }

                try {
                    // Fetch the user data from Firestore
                    const retrievedUser = await GetUser(loggedUser.uid);
                    if (!retrievedUser) {
                        console.error("The user is not registered on Firestore. Redirecting to root...");
                        navigate("/");
                        return;
                    }

                    // Set the retrieved user to state
                    setUser(retrievedUser);
                } 
                catch (error) {
                    console.error("An error occurred while retrieving the user:", error);
                    navigate("/"); // Redirect to root on error
                } 
                finally {
                    setProcessing(false); // Stop processing after everything is done
                }
            });

            // Cleanup the auth listener on component unmount
            return () => unsubscribe();
        }
        initialize();
    }, [auth, navigate]);

    return (
        <>
            <div id="settings" className="page">
                <BackButton link="../dashboard" />
                {(processing)
                    ? <></>
                    : (
                        <>
                            <div className="settings-header">
                                <ProfileImage uid={user.uid} firstLetters={user.fullName.charAt(0) + user.fullName.split(" ")[1].charAt(0)} dimension="115" />
                                <h1>{user.fullName}</h1>
                            </div>
                            <Link to="/logout" className="btn w-100 btn-lg btn-outline-primary">Logout</Link>
                        </>
                    )
                }
            </div>
        </>
    )
}