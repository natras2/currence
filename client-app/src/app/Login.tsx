import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { encryptPassword } from "../assets/libraries/Utils";
import Loader from "../assets/components/Loader";
import InputField from "../assets/components/InputField";
import { SignInWithEmail, SignOut } from "../assets/controllers/Auth";

export function PasswordForgotten() {
    return <></>;
}

export function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        async function logoutUser() {
            await SignOut();
            navigate("/");
        }
        logoutUser();
    }, [navigate]);

    return <Loader selector='login'/>;
    
}

export default function Login() {
    const [data, setData] = useState({
        email: '',
        password: '',
    });
    const [processing, setProcessing] = useState(false);

    const navigate = useNavigate();

    async function handleSubmit(e: any) {
        setProcessing(true);

        // Prevent the browser from reloading the page
        e.preventDefault();

        if (data.email === "" || data.password === "") {
            setProcessing(false);
            return;
        }

        // generate data to fetch
        const form = { 
            email_address: data.email,
            password: encryptPassword(data.password),
        };

        try {
            const result = await SignInWithEmail(form.email_address, form.password);
            if (result) {
                navigate("../dashboard");
            } 
            else {
                console.error("Login failed");
                setProcessing(false);
            }
        } 
        catch (error) {
            console.error("Error during login:", error);
            setProcessing(false);
        }

    }

    function handleChange(e: any) {
        const { name, value } = e.target;
        if (data.hasOwnProperty(name)) {
            setData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    }

    return (
        <>
            <div id='login' className='page'>
                <form method="post" onSubmit={handleSubmit} className="d-flex flex-column justify-content-between h-100">
                    <div className='top-content'>
                        <h1 className="mb-4">Sign-in</h1>
                        <InputField type="email" placeholder="E-mail address" name="email" value={data.email} handleChange={handleChange} isRegistering='false' />
                        <InputField type="password" placeholder="Password" name="password" value={data.password} handleChange={handleChange} isRegistering='false' />
                        <Link to="recover" className="float-end">
                            Password forgotten?
                        </Link>
                    </div>
                    <div className='bottom-content buttons w-100 text-center'>
                        <button type='submit' onClick={handleSubmit} className="btn w-100 border btn-primary rounded-2 shadow-sm btn-lg align-items-center px-3 py-3">
                            <div className='text small text-center'>Sign in to your account</div>
                        </button>
                        <div className="divider"></div>
                        <Link to="../signup" className="mx-auto">
                            Create a new account
                        </Link>
                    </div>
                </form>
            </div>
            {processing && 
            <Loader selector='login'/>
            }
        </>
    );;
}