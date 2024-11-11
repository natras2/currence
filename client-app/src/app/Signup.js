import { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import InputField from '../assets/components/InputField';
import { capitalize, checkPassword, encryptPassword, makeAPIRequest } from '../assets/components/Utils';
import Loader from '../assets/components/Loader';
import { CreateUserWithEmail } from '../assets/components/Auth';

function Header(props) {
    return (
        <>
            <h1 className='title'>New account</h1>
            <h5 className='subtitle'>Step {props.progressive} of 2</h5>
            <div className="my-4">Let's get to know each other!</div>
        </>
    )
}

function Step1(props) {
    const options = [
        { value: 'M', label: 'Male' },
        { value: 'F', label: 'Female' },
        { value: 'NB', label: 'Non binary' },
        { value: 'O', label: 'Other' },
        { value: 'NA', label: 'I prefer not to say' }
    ]
    return (
        <div id='step1' className='h-100 d-flex flex-column justify-content-between'>
            <div className='top-content'>
                <Header progressive='1' />
                <InputField type="text" placeholder="Name" name="name" value={props.values.name} handleChange={props.handleChange} isRegistering='true'/>
                <InputField type="text" placeholder="Surname" name="surname" value={props.values.surname} handleChange={props.handleChange} isRegistering='true'/>
                <InputField type="email" placeholder="E-mail address" name="email" value={props.values.email} handleChange={props.handleChange} isRegistering='true'/>
            </div>
            <div className='bottom-container buttons text-center'>
                <button onClick={props.onContinue} className="btn w-100 border btn-primary rounded-2 shadow-sm btn-lg align-items-center px-3 py-3">
                    <div className='text small text-center'>Continue</div>
                </button>
                <div className="divider"></div>
                <Link to="../login">
                    Sign-in to your account
                </Link>   
            </div>
        </div>
    )
}

function Step2(props) {
    return (
        <div id='step2' className='h-100 d-flex flex-column justify-content-between'>
            <div className='top-content'>
                <Header progressive='2' />
                <InputField type="password" placeholder="Password" name="password" value={props.values.password} handleChange={props.handleChange} isRegistering='true'/>
            </div>
            <div className='bottom-content buttons text-center'>
                <button type='submit' className="btn w-100 border btn-primary rounded-2 shadow-sm btn-lg align-items-center px-3 py-3">
                    <div className='text small text-center'>Create a new account</div>
                </button>
                <div className="divider"></div>
                <Link to="." onClick={props.goBack}>
                    Go back
                </Link>   
            </div>
        </div>
    )
}

export default function Signup() {
    const [data, setData] = useState({
        name: '',
        surname: '',
        email: '',
        password: '',
    });
    const [step, setStep] = useState(1);
    const [processing, setProcessing] = useState(false);

    const navigate = useNavigate();
    
    useEffect(() => {
        sessionStorage.clear();
    }, []);

    async function handleSubmit(e) {
        setProcessing(true);

        // Prevent the browser from reloading the page
        e.preventDefault();
        
        // generate data to fetch
        const form = JSON.parse(JSON.stringify(data));
        delete form.email;

        form.name = capitalize(form.name.trim());
        form.surname = capitalize(form.surname.trim());
        form.email = data.email.trim().toLowerCase();
        form.password = encryptPassword(form.password);

        if (!form.name || !form.surname || !form.email || !form.password || !checkPassword(data.password)) {
            setProcessing(false);
            return;
        }

        var result = await CreateUserWithEmail(form.name, form.surname, form.email, form.password);
        if (result) {
            navigate("../")
        }
        else {
            setProcessing(false);
            return;
            //error handling
        }
        
        //const response = await makeAPIRequest('Signup', form, null, false);
    }

    function handleContinue() {
        if ((step === 1 && !!data.name && !!data.surname && !!data.email))
            setStep(step + 1);
    }

    function goBack() {
        setStep(step - 1);
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
        <>
            <div id='signup' className='page'>
                <form method="post" onSubmit={handleSubmit} className='h-100'>
                    {step === 1 &&
                        <Step1 handleChange={handleChange} onContinue={handleContinue} values={ 
                            {
                                name: data.name, 
                                surname: data.surname,
                                email: data.email,
                            } 
                        } />
                    }
                    {step === 2 &&
                        <Step2 goBack={goBack} handleChange={handleChange} values={ 
                            {
                                password: data.password
                            } 
                        } />
                    }
                </form>
            </div>
            {processing && <Loader selector="login" />}
        </>
    );
}