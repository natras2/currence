import { useEffect, useState } from "react";
import { GetUser } from "../assets/controllers/Users";
import { getAuth } from "firebase/auth";
import { app } from "../firebase/firebaseConfig";
import { Link, useNavigate } from "react-router-dom";
import { BiSolidDashboard } from "react-icons/bi";
import { IoIosWallet } from "react-icons/io";
import { GrList } from "react-icons/gr";
import { PiHandCoinsFill } from "react-icons/pi";
import { FaChartSimple } from "react-icons/fa6";
import Dashboard from "./PersonalArea/Dashboard";
import Wallet from "./PersonalArea/Wallet";
import Transactions from "./PersonalArea/Transactions";
import Evener from "./PersonalArea/Evener";
import Stats from "./PersonalArea/Stats";
import ProfileImage from "../assets/components/ProfileImage";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'

function NavigationBar(props: any) {
    const navButtons = [
        {
            id: 0,
            name: "Dashboard",
            icon: <BiSolidDashboard />
        },

        {
            id: 1,
            name: "Wallet",
            icon: <IoIosWallet />
        },
        {
            id: 2,
            name: "Transactions",
            icon: <GrList />
        },
        {
            id: 3,
            name: "Evener",
            icon: <PiHandCoinsFill />
        },
        {
            id: 4,
            name: "Stats",
            icon: <FaChartSimple />
        },
    ];

    return (
        <>
            <div id="navigation-bar">
                {navButtons.map(btn =>
                    <div key={btn.id} className={`nav-btn ${(props.active === btn.name) ? 'active' : ''}`} onClick={() => props.handler(btn.name)}>
                        <div className="icon">{btn.icon}</div>
                        <div className="name">{btn.name}</div>
                    </div>
                )}
            </div>
        </>
    );
}

function TopRightButtons(props: any) {
    const isSkeleton = (props.type && props.type === "skeleton");

    const content = (isSkeleton)
        ? <Skeleton circle={true} width={props.dimension} height={props.dimension}/>
        : <Link to={"../settings"}><ProfileImage {...props} /></Link>;
    
    return (
        <>
            <div id="top-right-buttons" style={(isSkeleton) ? {marginTop: -4} : {}}>
                {content}
            </div>
        </>
    );
}

export default function PersonalArea(props: any) {
    const [user, setUser] = useState<any>(null);
    const [page, setPage] = useState<string>(props.page);
    const [processing, setProcessing] = useState(true);

    const navigate = useNavigate();
    const auth = getAuth(app);

    useEffect(() => {
        async function initialize() {
            // Set up an auth state listener
            const unsubscribe = auth.onAuthStateChanged(async (loggedUser) => {
                if (!loggedUser) {
                    console.log("The user is not logged. Redirecting to root...");
                    navigate("/");
                    return;
                }

                try {
                    // Fetch the user data from Firestore
                    const retrievedUser = await GetUser(loggedUser.uid);
                    if (!retrievedUser) {
                        console.log("The user is not registered on Firestore. Redirecting to root...");
                        navigate("/");
                        return;
                    }

                    // Set the retrieved user to state
                    setUser(retrievedUser);
                } catch (error) {
                    console.error("An error occurred while retrieving the user:", error);
                    navigate("/"); // Redirect to root on error
                } finally {
                    setProcessing(false); // Stop processing after everything is done
                }
            });

            // Cleanup the auth listener on component unmount
            return () => unsubscribe();
        }

        initialize();
    }, [auth, navigate]);

    const changePageHandler = (target: string) => {
        setPage(target);
        navigate("../" + target.toLowerCase());
    }

    return (
        <>
            <div className='personal-area page'>
                {(processing)
                    ? <><Skeleton width={250} style={{marginTop: 3, height: 27}}/><TopRightButtons type="skeleton" dimension={35}/></>
                    : (
                        <>
                            <TopRightButtons uid={user.uid} firstLetters={user.fullName.charAt(0) + user.fullName.split(" ")[1].charAt(0)} dimension={35} />
                            {page === 'Dashboard' && <Dashboard user={user} />}
                            {page === 'Wallet' && <Wallet />}
                            {page === 'Transactions' && <Transactions />}
                            {page === 'Evener' && <Evener />}
                            {page === 'Stats' && <Stats />}</>
                    )}
                <NavigationBar active={page} handler={changePageHandler} />
            </div>
        </>
    );
}