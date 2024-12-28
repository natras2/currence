import { useContext, useEffect, useRef, useState } from 'react'; 
import logo from '../assets/images/logo/logo-b-ng.svg'
import whiteLogo from '../assets/images/logo/logo-w-ng.svg'
import illustration from '../assets/images/illustrations/home.svg'
import darkIllustration from '../assets/images/illustrations/home_dark.svg'
import { Typewriter } from 'react-simple-typewriter'
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import { BsAt } from "react-icons/bs";
import { CheckRedirectSignIn, SignInWithGoogleAuth } from '../assets/controllers/Auth';
import Loader from '../assets/components/Loader';
import { getAuth } from 'firebase/auth';
import { app } from '../firebase/firebaseConfig';
import { ThemeContext } from '../App';

function LandingPage() {
    const refTitle = useRef(null);
    const refDevice = useRef(null);
    const theme = useContext(ThemeContext);

    const [titleWidth, setTitleWidth] = useState(0);
    const [deviceWidth, setDeviceWidth] = useState(0);

    const [processing, setProcessing] = useState(true);

    const navigate = useNavigate();
    const auth = getAuth(app);

    useEffect(() => {
        async function initialize() {

            //Check whether I'm getting redirected from a Sign In with Google request
            if (sessionStorage.getItem("signingInWithGoogle")) 
                sessionStorage.removeItem("signingInWithGoogle");
                

            setTitleWidth((refTitle.current as any).offsetWidth);
            setDeviceWidth((refDevice.current as any).offsetWidth);

            async function checkLoggedUser() {
                // Wrap `onAuthStateChanged` in a Promise
                var userLoggedIn: boolean;
                userLoggedIn = await CheckRedirectSignIn();
                console.log("Redirect:", userLoggedIn);

                if (!userLoggedIn) {
                    userLoggedIn = await new Promise<boolean>((resolve) => {
                        auth.onAuthStateChanged((user) => {
                            if (user) {
                                resolve(true); // Resolve with `true` if the user is logged in
                            } else {
                                resolve(false); // Resolve with `false` if no user is logged in
                            }
                        });
                    });
                }

                return userLoggedIn;
            }


            const result = await checkLoggedUser();

            if (result) {
                navigate("../dashboard");
            }
            else {
                setProcessing(false);
            }
        }

        initialize();
    }, [navigate, auth]);



    const width = (deviceWidth - titleWidth) / 2;

    return (
        <>
            <div id="home" className="page justify-content-between">
                <div className='top-content'>
                    <div ref={refDevice} className="logo-wrapper">
                        <img
                            src={(theme === "dark") ? whiteLogo : logo}
                            alt='currence logo'
                            className='logo'
                        />
                    </div>
                    <h1 className='header-title' style={{ marginLeft: width }}>
                        <span ref={refTitle}>Your finance,<br /></span>
                        made&nbsp;
                        <span className='typewriter-wrapper'>
                            <Typewriter
                                words={['easy', 'fast', 'cool']}
                                loop={0}
                                cursor
                                cursorStyle='_'
                                typeSpeed={100}
                                deleteSpeed={100}
                                delaySpeed={3000}
                            />
                        </span>
                    </h1>
                </div>
                <div className='illustration-wrapper middle-content'>
                    <img
                        src={(theme === "dark") ? darkIllustration : illustration}
                        className='illustration'
                        alt='home illustration'
                    />
                </div>
                <div className='bottom-content buttons d-flex flex-column'>
                    <div className='google-button mb-2'>
                        <button className={`btn w-100 rounded-2 shadow-sm btn-lg d-flex gap-3 align-items-center px-3 py-3 ${(theme === "dark") ? "btn-dark" : "border btn-light"}`} onClick={SignInWithGoogleAuth}>
                            <FcGoogle style={{ fontSize: 'larger' }} />
                            <div className='text small'>Sign in with Google</div>
                        </button>
                    </div>
                    <div className='login-button'>
                        <Link to='login' type="button" className={`btn btn-primary rounded-2 shadow-sm btn-lg d-flex gap-3 align-items-center px-3 py-3 ${theme === "light" && "border"}`}>
                            <BsAt style={{ fontSize: 'larger' }} />
                            <div className='text small'>Sign in with your email</div>
                        </Link>
                    </div>
                    <div className="divider my-3"></div>
                    <Link to="signup" className='signin-link mx-auto '>
                        You don't have an account? Sign up!
                    </Link>
                </div>
            </div>
            {processing &&
                <Loader theme={theme} selector='app' />
            }
        </>
    );
}

export default LandingPage;
