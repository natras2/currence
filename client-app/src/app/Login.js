import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { makeAPIRequest, encryptPassword } from "../assets/components/Utils";

export function PasswordForgotten() {
    function handleSubmit(e) {

    }
    return ;
}

export default function Login() {
    const [data, setData] = useState({
        email: '',
        password: '',
    });
    const [processing, setProcessing] = useState(false);
    
    useEffect(() => {
    }, []);

    const navigate = useNavigate();

    async function handleSubmit(e) {
        setProcessing(true);

        // Prevent the browser from reloading the page
        e.preventDefault();

        if (data.email === "" || data.password === "") 
            return;

        // generate data to fetch
        const form = { 
            email_address: data.email,
            password: encryptPassword(data.password),
        };

        const response = await makeAPIRequest('Login', form, { type: 'Customer' }, false);

        if (response.code === 200) {
        } 
        else {
        }
    }

    function handleChange(e) {
        const { name, value } = e.target;
        if (data.hasOwnProperty(name)) {
            setData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    }

    return (
        <div id="login" className="page">
            
        </div>
    );;
}