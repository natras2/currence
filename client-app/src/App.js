import logo from './assets/images/logo/logo-b-ng.svg'
import illustration from './assets/images/illustrations/home.svg'
import { Typewriter } from 'react-simple-typewriter'
import { Link } from 'react-router-dom';
import { BsFacebook } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";

function App() {
    return (
        <div id="home" className="page justify-space-between">
            <div className='top-content'>
                <div className="logo-wrapper">
                    <img 
                        src={logo} 
                        className='logo'
                    />
                </div>
                <h1 className='header-title'>
                    Your finance, <br/>
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
                />
            </div>
            <div className='bottom-content buttons d-flex flex-column'>
                <div className='google-button mb-2'>
                    <Link to='.' type="button" className="btn border btn-light rounded-2 shadow-sm btn-lg btn-block d-flex gap-3 align-items-center px-3 py-3">
                        <FcGoogle />
                        <div className='text small'>Sign in with Google</div>
                    </Link>
                </div>
                <div className='facebook-button'>
                    <Link to='.'  type="button" className="btn btn-primary rounded-2 shadow-sm btn-lg btn-block d-flex gap-3 align-items-center px-3 py-3">
                        <BsFacebook />
                        <div className='text small'>Sign in with Facebook</div>
                    </Link>
                </div>
                <div className="divider my-3"></div>
                <Link to="login" className='signin-link mx-auto '>
                    Sign-in with your email
                </Link>   
            </div>
        </div>
    );
}

export default App;
