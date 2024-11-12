import { useEffect, useRef, useState } from 'react'; import logo from './assets/images/logo/logo-b-ng.svg'
import illustration from './assets/images/illustrations/home.svg'
import { Typewriter } from 'react-simple-typewriter'
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import { BsAt } from "react-icons/bs";
import { CheckRedirectSignIn, SignInWithGoogleAuth } from './assets/components/Auth';
import Loader from './assets/components/Loader';

function App() {
    const refTitle = useRef(null);
    const refDevice = useRef(null);

    const [titleWidth, setTitleWidth] = useState(0);
    const [deviceWidth, setDeviceWidth] = useState(0);

    const [processing, setProcessing] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        async function initialize() {
            if (sessionStorage.getItem("signingInWithGoogle")) {
                setProcessing(true);
            }

            setTitleWidth(refTitle.current.offsetWidth);
            setDeviceWidth(refDevice.current.offsetWidth);

            async function checkLoggedUser() {
                if (sessionStorage.getItem("token")
                    && sessionStorage.getItem("fullName")
                    && sessionStorage.getItem("token")) 
                    return true;
                
                return await CheckRedirectSignIn();
            }

            sessionStorage.removeItem("signingInWithGoogle");
            const result = await checkLoggedUser();
            
            if (result) {
                navigate("./home");
            }
            else {
                setProcessing(false);
            }
        }

        initialize();
    }, [navigate]);



    const width = (deviceWidth - titleWidth) / 2;

    return (
        <>
            <div id="home" className="page justify-content-between">
                <div className='top-content'>
                    <div ref={refDevice} className="logo-wrapper">
                        <img
                            src={logo}
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
                        src={illustration}
                        className='illustration'
                        alt='home illustration'
                    />
                </div>
                <div className='bottom-content buttons d-flex flex-column'>
                    <div className='google-button mb-2'>
                        <button className="btn border w-100 btn-light rounded-2 shadow-sm btn-lg d-flex gap-3 align-items-center px-3 py-3" onClick={SignInWithGoogleAuth}>
                            <FcGoogle style={{ fontSize: 'larger' }} />
                            <div className='text small'>Sign in with Google</div>
                        </button>
                    </div>
                    <div className='login-button'>
                        <Link to='login' type="button" className="btn border btn-primary rounded-2 shadow-sm btn-lg d-flex gap-3 align-items-center px-3 py-3">
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
            <Loader selector='app'/>
            }
        </>
    );
}

export default App;
