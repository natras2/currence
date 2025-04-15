import { createContext, useContext, useEffect, useMemo, useState } from "react";
import UserController from "../assets/controllers/UserController";
import { getAuth } from "firebase/auth";
import { app } from "../firebase/firebaseConfig";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import ProfileImage from "../assets/components/ProfileImage";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'
import Asset from "../assets/model/Asset";
import Transaction from "../assets/model/Transaction";
import User from "../assets/model/User";
import AssetsController from "../assets/controllers/AssetsController";
import { titleCase } from "../assets/libraries/Utils";
import { ThemeContext } from "../App";
import TransactionsController from "../assets/controllers/TransactionsController";

import { BiSolidDashboard } from "react-icons/bi";
import { IoIosWallet } from "react-icons/io";
import { GrList } from "react-icons/gr";
import { PiHandCoinsFill } from "react-icons/pi";
import { FaChartSimple } from "react-icons/fa6";
import { IoSearchSharp } from "react-icons/io5";
import { LuEye } from "react-icons/lu";
import { LuEyeOff } from "react-icons/lu";
import { LuPlus } from "react-icons/lu";
import { MdGroupAdd } from "react-icons/md";
import { MdPersonAddAlt1 } from "react-icons/md";

export const PersonalAreaContext = createContext<PersonalAreaContextInterface>({} as PersonalAreaContextInterface);

export interface PersonalAreaContextInterface {
    data: DataContext,
    controllers: ControllersContext
}

export interface DataContext {
    user: User,
    assets: Asset[],
    transactions: Transaction[],
    userProcessing: boolean,
    assetsProcessing: boolean,
    transactionsProcessing: boolean
}

export interface ControllersContext {
    userController: UserController,
    assetsController: AssetsController,
    transactionsController: TransactionsController,
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
            page: ["Dashboard", "Wallet", "Transactions"],
            icon: <LuEye />,
            iconActive: <LuEyeOff />,
            activeCondition: props.hiddenBalance as boolean,
            action: () => { props.handleHiddenBalance() },
            index: 10
        },
        {
            id: "addAsset",
            page: ["Wallet"],
            icon: <LuPlus />,
            link: "/wallet/create",
            index: 5
        },
        {
            id: "addTransaction",
            page: ["Transactions"],
            icon: <LuPlus />,
            link: "/transactions/create",
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
        : <Link to={"../settings"}><ProfileImage user={props.user} dimension={props.dimension} /></Link>;

    const icons = buttons.filter((button) => button.page.includes(props.page)).sort((a, b) => a.index - b.index);

    return (
        <>
            <div id="top-right-buttons" style={(isSkeleton) ? { marginTop: -4 } : {}}>
                {(isSkeleton)
                    ? <>
                        <Skeleton circle={true} className="icon" width={props.dimension * 0.7} height={props.dimension * 0.7} />
                        <Skeleton circle={true} className="icon" width={props.dimension * 0.7} height={props.dimension * 0.7} />
                    </>
                    : <></>
                }
                {(!props.firstAccess && (icons && icons.length > 0))
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
    const [transactionsProcessing, setTransactionsProcessing] = useState(true);
    const theme = useContext(ThemeContext);

    const data = {
        user: user,
        assets: assets,
        transactions: transactions,
        userProcessing: userProcessing,
        assetsProcessing: assetsProcessing,
        transactionsProcessing: transactionsProcessing
    } as DataContext;

    const controllers = useMemo(() => ({
        userController: new UserController(data),
        assetsController: new AssetsController(data),
        transactionsController: new TransactionsController(data)
    } as ControllersContext), [data]);

    controllers.userController.assetsController = controllers.assetsController;
    controllers.userController.transactionsController = controllers.transactionsController;
    controllers.assetsController.userController = controllers.userController;
    controllers.assetsController.transactionsController = controllers.transactionsController;
    controllers.transactionsController.userController = controllers.userController;
    controllers.transactionsController.assetsController = controllers.assetsController;

    const navigate = useNavigate();
    const auth = getAuth(app);

    useEffect(() => {
        setPage(titleCase(location.pathname.split("/")[1]));
    }, [location]);

    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged((loggedUser) => {
            if (!loggedUser) {
                console.log("The user is not logged. Redirecting to root...");
                navigate("/");
                return;
            }

            const unsubscribeUser = controllers.userController.ListenForUserUpdates(
                loggedUser.uid,
                (updatedUser) => {
                    console.log("Updated user")
                    setUser(updatedUser);
                    setUserProcessing(false);
                }
            );

            // Cleanup user listener
            return () => unsubscribeUser();
        });

        // Cleanup auth listener
        return () => unsubscribeAuth();
    }, []);

    useEffect(() => {
        if (!user) return; // Only start listening for assets when the user is available

        const unsubscribeAssets = controllers.assetsController.ListenForAssetUpdates(
            user.uid,
            (updatedAssets) => {
                console.log("Updated assets")
                setAssets(updatedAssets);
                setAssetsProcessing(false);
            }
        );

        // Cleanup assets listener
        return () => unsubscribeAssets();
    }, [user?.uid]); // Depend only on user.uid

    useEffect(() => {
        if (!user) return; // Only start listening for transactions when the user is available

        const unsubscribeTransactions = controllers.transactionsController.ListenForTransactionUpdates(
            user.uid,
            (updatedTransactions) => {
                console.log("Updated transactions")
                setTransactions(updatedTransactions);
                setTransactionsProcessing(false);
            }
        );

        // Cleanup transactions listener
        return () => unsubscribeTransactions();
    }, [user?.uid]); // Depend only on user.uid

    useEffect(() => {
        if (!user) return;
        if (!assets) return; // Only start listening for assets when the user is available
        var updatedTotalBalance = 0;
        if (assets.length > 0) {
            const contributingAssets = assets.filter(asset => !asset.hiddenFromTotal);
            if (contributingAssets.length > 0) {
                updatedTotalBalance = contributingAssets.reduce((accumulator, asset) => accumulator + asset.balance, 0);
            }
        }
        if (updatedTotalBalance !== user.totalBalance) {
            console.log("Updated total balance");
             controllers.userController.UpdateTotalBalance(updatedTotalBalance);
        }

    }, [assets]);


    const changePageHandler = (target: string) => {
        //setPage(target);
        navigate("../" + target.toLowerCase());
    }

    const handleHiddenBalance = () => {
        controllers.userController.UpdateHiddenBalance(!user.hiddenBalance);
    }

    return (
        <>
            <SkeletonTheme
                baseColor={(theme === 'light') ? '#ebebeb' : '#383838'}
                highlightColor={(theme === 'light') ? '#f5f5f5' : '#444444'}
            >
                <div className='personal-area page'>
                    {(userProcessing || assetsProcessing || transactionsProcessing)
                        ? (
                            <>
                                <TopRightButtons type="skeleton" dimension={35} />
                                <div style={{ height: 'calc(100% - 90px)', overflow: 'hidden' }}>
                                    <Skeleton width={150} style={{ marginTop: 3, height: 27 }} />
                                    <Skeleton width={'100%'} style={{ marginTop: '1.5rem', height: 75 }} />
                                    <Skeleton width={100} style={{ marginTop: 25, height: 20 }} />
                                    <div className="d-flex gap-3 w-100">
                                        <Skeleton containerClassName="w-50" style={{ marginTop: 15, height: 120 }} />
                                        <Skeleton containerClassName="w-50" style={{ marginTop: 15, height: 120 }} />
                                    </div>
                                    <Skeleton width={100} style={{ marginTop: 25, marginBottom: 12, height: 20 }} />
                                    <div className="d-flex flex-column gap-1 w-100">
                                        <Skeleton containerClassName="w-100" style={{ height: 60 }} />
                                        <Skeleton containerClassName="w-100" style={{ height: 60 }} />
                                        <Skeleton containerClassName="w-100" style={{ height: 60 }} />
                                        <Skeleton containerClassName="w-100" style={{ height: 60 }} />
                                        <Skeleton containerClassName="w-100" style={{ height: 60 }} />
                                    </div>
                                </div>
                            </>
                        )
                        : (
                            <>
                                <TopRightButtons
                                    page={page}
                                    user={user}
                                    dimension={35}
                                    hiddenBalance={user.hiddenBalance}
                                    firstAccess={user.firstAccess}
                                    handleHiddenBalance={handleHiddenBalance}
                                />
                                <PersonalAreaContext.Provider value={{ data, controllers } as PersonalAreaContextInterface} >
                                    <Outlet />
                                </PersonalAreaContext.Provider>
                            </>
                        )}
                    <NavigationBar active={page} handler={changePageHandler} />
                </div>
            </SkeletonTheme>
        </>
    );
}