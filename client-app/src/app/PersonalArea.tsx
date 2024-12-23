import { useEffect, useState } from "react";
import UserController, { GetUser } from "../assets/controllers/Users";
import { getAuth } from "firebase/auth";
import { app } from "../firebase/firebaseConfig";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
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
import ProfileImage from "../assets/components/ProfileImage";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'
import Asset from "../assets/model/Asset";
import Transaction from "../assets/model/Transaction";
import User from "../assets/model/User";
import AssetsController from "../assets/controllers/Assets";
import { titleCase } from "../assets/libraries/Utils";

export interface PersonalAreaContext {
    data: DataContext,
    controllers: ControllersContext
}

export interface DataContext {
    user: User,
    setUser: React.Dispatch<React.SetStateAction<User>>,
    assets: Asset[],
    setAssets: React.Dispatch<React.SetStateAction<Asset[]>>,
    transactions: Transaction[],
    setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>,
    userProcessing: boolean,
    assetsProcessing: boolean,
    transactionsProcessing: boolean
}

export interface ControllersContext {
    userController: UserController,
    assetsController: AssetsController,
    transactionsController: AssetsController
}

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
            action: () => { props.handleHiddenBalance() },
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
                                ? <Link key={i} to={icon.link} className="icon" style={{ textTransform: "none" }}>{icon.icon}</Link>
                                : <div key={i} onClick={icon.action} className="icon" style={{ textTransform: "none" }}>{(icon.activeCondition) ? icon.iconActive : icon.icon}</div>

                        })}
                    </>
                    : <></>
                }
                {content}
            </div>
        </>
    );
}

export default function PersonalArea() {
    const location = useLocation();

    const [page, setPage] = useState<string>(titleCase(location.pathname.split("/")[1]));
    const [user, setUser] = useState<any>(null);
    const [assets, setAssets] = useState<Asset[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [userProcessing, setUserProcessing] = useState(true);
    const [assetsProcessing, setAssetsProcessing] = useState(true);
    const [transactionsProcessing, setTransactionsProcessing] = useState(false);

    const data = {
        user: user,
        setUser: setUser,
        assets: assets,
        setAssets: setAssets,
        transactions: transactions,
        setTransactions: setTransactions,
        userProcessing: userProcessing,
        assetsProcessing: assetsProcessing,
        transactionsProcessing: transactionsProcessing
    } as DataContext;

    const controllers = {
        userController: new UserController(data),
        assetsController: new AssetsController(data),
        transactionsController: new AssetsController(data)
    } as ControllersContext;

    const navigate = useNavigate();
    const auth = getAuth(app);

    useEffect (() => {
        console.log("AAA");
        setPage(titleCase(location.pathname.split("/")[1]));
    }, [location]);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (loggedUser) => {
            if (!loggedUser) {
                console.log("The user is not logged. Redirecting to root...");
                navigate("/");
                return;
            }

            try {
                const retrievedUser = await GetUser(loggedUser.uid);
                if (!retrievedUser) {
                    console.log("The user is not registered on Firestore. Redirecting to root...");
                    navigate("/");
                    return;
                }

                setUser(retrievedUser);
            }
            catch (error) {
                console.error("An error occurred while retrieving the user:", error);
                navigate("/");
            }
            finally {
                setUserProcessing(false); // Stop processing after everything is done
            }
        });

        // Cleanup on component unmount
        return () => unsubscribe();
    }, [auth, navigate]);

    // Fetch assets when the user is available
    useEffect(() => {
        if (userProcessing) return; // Ensure user is set before fetching assets

        async function fetchAssets() {
            try {
                const retrievedAssets = await controllers.assetsController.GetUserAssets();
                console.log("Assets retrieved");
                setAssets(retrievedAssets || []);
            } 
            catch (error) {
                console.error("An error occurred while retrieving the assets:", error);
            }
            finally {
                setAssetsProcessing(false);
            }
        }

        fetchAssets();
    }, [userProcessing]);

    const changePageHandler = (target: string) => {
        //setPage(target);
        navigate("../" + target.toLowerCase());
    }

    const handleHiddenBalance = () => {
        controllers.userController.UpdateHiddenBalance(!user.hiddenBalance);
    }

    return (
        <>
            <div className='personal-area page'>
                {(userProcessing || assetsProcessing || transactionsProcessing)
                    ? <><Skeleton width={250} style={{marginTop: 3, height: 27}}/><TopRightButtons type="skeleton" dimension={35} /></>
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
                            <Outlet context={{ data, controllers }} />
                        </>
                    )}
                <NavigationBar active={page} handler={changePageHandler} />
            </div>
        </>
    );
}