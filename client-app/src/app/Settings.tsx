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
            // check if the user is logged.
            const loggedUser = auth.currentUser;
            if (!loggedUser) {
                console.error("The user is not logged. Redirecting to root...")
                navigate("/");
                return;
            }

            //returns the user from Firestore
            const retrievedUser = await GetUser(loggedUser.uid);
            if (!retrievedUser) {
                console.error("The user is not registered on Firestore. Redirecting to root...")
                navigate("/");
                return;
            }
            else setUser(retrievedUser);

            setProcessing(false);
        }
        initialize();
    }, [auth.currentUser, navigate]);

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