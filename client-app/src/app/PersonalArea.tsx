import { useEffect, useState } from "react";
import { GetUser, UpdateHiddenBalance } from "../assets/controllers/Users";
import { getAuth } from "firebase/auth";
import { app } from "../firebase/firebaseConfig";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BiSolidDashboard } from "react-icons/bi";
import { IoIosWallet } from "react-icons/io";
import { GrList } from "react-icons/gr";
import { PiHandCoinsFill } from "react-icons/pi";
import { FaChartSimple } from "react-icons/fa6";
import { IoSearchSharp } from "react-icons/io5";
import { LuEye } from "react-icons/lu";
import { LuEyeOff } from "react-icons/lu";
import { MdGroupAdd } from "react-icons/md";
import { MdPersonAddAlt1 } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
import Dashboard from "./PersonalArea/Dashboard";
import Wallet from "./PersonalArea/Wallet";
import Transactions from "./PersonalArea/Transactions";
import Evener from "./PersonalArea/Evener";
import Stats from "./PersonalArea/Stats";
import ProfileImage from "../assets/components/ProfileImage";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'
import Asset from "../assets/model/Asset";
import AssetDetail from "./PersonalArea/Wallet/AssetDetail";
import Transaction from "../assets/model/Transaction";

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

    const buttons = [
        {
            id: "search",
            page: ["Dashboard", "Wallet", "Transactions", "Evener"],
            icon: <IoSearchSharp />,
            link: "/search",
            index: 999
        },
        {
            id: "eye",
            page: ["Dashboard", "Wallet"],
            icon: <LuEye />,
            iconActive: <LuEyeOff />,
            activeCondition: props.hiddenBalance as boolean,
            action: () => {props.handleHiddenBalance()},
            index: 10
        },
        {
            id: "addAsset",
            page: ["Wallet"],
            icon: <FaPlus />,
            link: "/wallet/create",
            index: 5
        },
        {
            id: "addCluster",
            page: ["Evener"],
            icon: <MdGroupAdd />,
            link: "/evener/new-cluster",
            index: 10
        },
        {
            id: "addPerson",
            page: ["Evener"],
            icon: <MdPersonAddAlt1 />,
            link: "/evener/new-person",
            index: 5
        }
    ];
    const content = (isSkeleton)
        ? <Skeleton circle={true} width={props.dimension} height={props.dimension} />
        : <Link to={"../settings"}><ProfileImage {...props} /></Link>;

    const icons = buttons.filter((button) => button.page.includes(props.page)).sort((a, b) => a.index - b.index);

    return (
        <>
            <div id="top-right-buttons" style={(isSkeleton) ? { marginTop: -4 } : {}}>
                {(icons && icons.length > 0)
                    ? <>
                        {icons.map((icon, i) => {
                            return icon.link 
                                ? <Link key={i} to={icon.link} className="icon" style={{color: "#212529", textTransform: "none"}}>{icon.icon}</Link>
                                : <div key={i} onClick={icon.action} className="icon" style={{color: "#212529", textTransform: "none"}}>{(icon.activeCondition) ? icon.iconActive : icon.icon}</div>

                        })}
                    </>
                    : <></>
                }
                {content}
            </div>
        </>
    );
}

export default function PersonalArea(props: any) {
    const [page, setPage] = useState<string>(props.page);
    const [user, setUser] = useState<any>(null);
    const [assets, setAssets] = useState<Asset[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>(props.page);
    const [userProcessing, setUserProcessing] = useState(true);
    const [assetsProcessing, setAssetsProcessing] = useState(true);
    const [transactionsProcessing, setTransactionsProcessing] = useState(false);

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
                } 
                catch (error) {
                    console.error("An error occurred while retrieving the user:", error);
                    navigate("/"); // Redirect to root on error
                } 
                finally {
                    setUserProcessing(false); // Stop processing after everything is done
                }
            });

            // Cleanup the auth listener on component unmount
            return () => unsubscribe();
        }

        initialize();
    }, [navigate, user, assets, transactions]);

    const changePageHandler = (target: string) => {
        setPage(target);
        navigate("../" + target.toLowerCase());
    }

    const handleHiddenBalance = () => {
        UpdateHiddenBalance(user.uid, !user.hiddenBalance)
    }

    const checkProcessing = () => {
        return userProcessing || assetsProcessing || transactionsProcessing
    }

    return (
        <>
            <div className='personal-area page'>
                {(userProcessing)
                    ? <>{/*<Skeleton width={250} style={{marginTop: 3, height: 27}}/> */}<TopRightButtons type="skeleton" dimension={35} /></>
                    : (
                        <>
                            <TopRightButtons 
                                page={page} 
                                uid={user.uid} 
                                firstLetters={user.fullName.charAt(0) + user.fullName.split(" ")[1].charAt(0)} 
                                dimension={35} 
                                hiddenBalance={user.hiddenBalance} 
                                handleHiddenBalance={handleHiddenBalance}
                            />
                            {page === 'Dashboard' && <Dashboard user={user} />}
                            {page === 'Wallet' && <Wallet user={user} />}
                            {page === 'Transactions' && <Transactions user={user} />}
                            {page === 'Evener' && <Evener user={user} />}
                            {page === 'Stats' && <Stats user={user} />}</>
                    )}
                <NavigationBar active={page} handler={changePageHandler} />
            </div>
        </>
    );
}