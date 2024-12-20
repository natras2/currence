import { useState } from "react";
import ProfileImage from "../assets/components/ProfileImage";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { BackButton } from "../assets/components/Utils";
import { PersonalAreaContext } from "./PersonalArea";
import User from "../assets/model/User";

export default function Settings() {
    const { data, controllers } = useOutletContext<PersonalAreaContext>();

    const user: User = data.user;
    const [processing, setProcessing] = useState(false);

    const navigate = useNavigate();

    const backHandler = () => {
        navigate(-1);
    }

    return (
        <>
            <div id="settings" className="callout page">
                <BackButton handler={backHandler}/>
                {(processing)
                    ? <></>
                    : (
                        <>
                            <div className="settings-header">
                                <ProfileImage uid={user.uid} firstLetters={user.fullName.charAt(0) + user.fullName.split(" ")[1].charAt(0)} dimension="115" />
                                <h1>{user.fullName}</h1>
                                <div className="text-secondary fw-normal fs-5 mb-4" style={{marginTop: -20}}>{user.email}</div>
                            </div>
                            <Link to="/logout" className="btn w-100 btn-lg btn-outline-danger"><small>Logout</small></Link>
                        </>
                    )
                }
            </div>
        </>
    )
}