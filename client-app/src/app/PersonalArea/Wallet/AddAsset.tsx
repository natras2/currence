import CurrencyInput from "react-currency-input-field";
import { BackButton } from "../../../assets/components/Utils";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { GetUser } from "../../../assets/controllers/Users";
import { app } from "../../../firebase/firebaseConfig";
import Asset from "../../../assets/model/Asset";
import InputField from "../../../assets/components/InputField";
import { capitalize } from "../../../assets/libraries/Utils";
import { CreateAsset } from "../../../assets/controllers/Assets";
import Loader from "../../../assets/components/Loader";

/*
const NumericInputWithDotAsComma = () => {
    const [value, setValue] = useState('');

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === '.') {
            if (!value.includes(","))
                setValue(value + ",");
        }
    };

    return (
        <CurrencyInput
            className="currency-input"
            id="new-asset-balance"
            autoComplete="off"
            name="new-asset-balance"
            placeholder="€ 0,00"
            prefix="€ "
            required
            value={ }
            decimalsLimit={2}
            decimalSeparator=","
            groupSeparator="."
            allowNegativeValue={false}
            disableAbbreviations={true}
            onKeyDown={(e) => handleKeyDown(e)} // Intercept keypress events
            onValueChange={(value) => { setValue((value as unknown) as string) }}
        />
    );
};
*/


/* eslint-disable */
export default function AddAsset(props: any) {
    const [processing, setProcessing] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [char, setChar] = useState<any>(null);
    const [data, setData] = useState({
        "new-asset-name": '',
        "new-asset-description": '',
        "new-asset-balance": ''
    });

    const auth = getAuth(app);
    const navigate = useNavigate();

    useEffect(() => {
        async function initialize() {
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
                    setProcessing(false); // Stop processing after everything is done
                }
            });

            // Cleanup the auth listener on component unmount
            return () => unsubscribe();
        }
        initialize();
    }, [auth, navigate]);

    const backHandler = () => {
        navigate(-1);
    }

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        if (data.hasOwnProperty(name)) {
            setData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    }

    const handleSubmit = async (e: any) => {
        setProcessing(true);

        // Prevent the browser from reloading the page
        e.preventDefault();

        // Set the name data field
        setData(prevState => ({
            ...prevState,
            "new-asset-name": capitalize(data["new-asset-name"].trim())
        }));

        // Check if any of the required field is empty
        if (!data["new-asset-name"] || !data["new-asset-balance"]) {
            setProcessing(false);
            console.error("Empty required fields");
            return;
        }

        // Add the new asset to Firestore
        var result = await CreateAsset(new Asset(user.uid, data["new-asset-name"], data["new-asset-description"], (parseFloat(data["new-asset-balance"].replace(',','.')))));
        if (result) {
            navigate(-1)
        }
        else {
            setProcessing(false);
            console.error("Error while creating the asset");
            return;
            //error handling
        }
    }

    const handleKeyDown = (event: React.KeyboardEvent) => {
        setChar(event.code);
        if (event.key === '.') {
            if (!data["new-asset-balance"].includes(",")) {
                setData(prevState => ({
                    ...prevState,
                    "new-asset-balance": data["new-asset-balance"] + ","
                }));
            }
        }
    };

    return (
        <>
            <div id="AddAsset" className="personal-area page">
                <form onSubmit={handleSubmit} className="h-100 d-flex flex-column justify-content-between">
                    <div>
                        <div className="d-flex gap-3 mb-5">
                            <BackButton handler={backHandler} />
                            <div className="page-title" style={{ marginTop: -.5 }}>New asset</div>
                        </div>
                        <div>Here: {char}</div>
                        <CurrencyInput
                            className="currency-input"
                            id="new-asset-balance"
                            autoComplete="off"
                            name="new-asset-balance"
                            placeholder="€ 0,00"
                            prefix="€ "
                            required
                            value={data["new-asset-balance"]}
                            decimalsLimit={2}
                            decimalSeparator=","
                            groupSeparator="."
                            allowNegativeValue={false}
                            disableAbbreviations={true}
                            onKeyDown={(e) => handleKeyDown(e)} // Intercept keypress events
                            onValueChange={(value) => { handleChange({ target: { value: (value as unknown) as string, name: "new-asset-balance" } }) }}
                        />
                    </div>
                    <div>
                        <div className="mb-3">
                            <label className="form-label">Asset name</label>
                            <InputField type="text" placeholder='e.g. "Revolut"' name="new-asset-name" handleChange={handleChange} isRegistering='false' value={data["new-asset-name"]} />
                            {/*<input type="text" className="form-control" name="new-asset-name" placeholder={'e.g. "Revolut"'} autoComplete="off" required />*/}
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <textarea className="form-control" name="new-asset-description" rows={3} placeholder="Optional" onChange={handleChange} autoComplete="off" style={{ resize: "none" }} value={data["new-asset-description"]}></textarea>
                        </div>
                        <button type='submit' className="btn w-100 border fw-bold text-center btn-primary rounded-pill shadow-sm align-items-center" style={{ padding: "1rem 0" }}>
                            Create
                        </button>
                    </div>
                </form>
            </div>
            {processing && <Loader selector="login" />}
        </>
    );
}