import CurrencyInput from "react-currency-input-field";
import { BackButton } from "../../../assets/components/Utils";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useState } from "react";
import Asset from "../../../assets/model/Asset";
import InputField from "../../../assets/components/InputField";
import { capitalize } from "../../../assets/libraries/Utils";
import { CreateAsset } from "../../../assets/controllers/Assets";
import Loader from "../../../assets/components/Loader";
import { PersonalAreaContext } from "../../PersonalArea";
import User from "../../../assets/model/User";

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
export default function AddAsset() {
    const { data, controllers } = useOutletContext<PersonalAreaContext>();

    const user: User = data.user;
    const [processing, setProcessing] = useState(false);
    //const [char, setChar] = useState<any>(null);
    const [formData, setFormData] = useState({
        "new-asset-name": '',
        "new-asset-description": '',
        "new-asset-balance": ''
    });
    const navigate = useNavigate();

    const backHandler = () => {
        navigate(-1);
    }

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        if (formData.hasOwnProperty(name)) {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }

        //if (value && name == "new-asset-balance") console.log(parseFloat(value.replace(',', '.')));
        
    }

    const handleSubmit = async (e: any) => {
        setProcessing(true);

        // Prevent the browser from reloading the page
        e.preventDefault();

        // Set the name data field
        setFormData(prevState => ({
            ...prevState,
            "new-asset-name": capitalize(formData["new-asset-name"].trim())
        }));

        // Check if any of the required field is empty
        if (!formData["new-asset-name"] || !formData["new-asset-balance"]) {
            setProcessing(false);
            console.error("Empty required fields");
            return;
        }

        const asset = new Asset(user.uid, formData["new-asset-name"], formData["new-asset-description"], (parseFloat(formData["new-asset-balance"].replace(',', '.'))));

        // Add the new asset to Firestore
        var result = await CreateAsset(asset);
        if (result) {
            data.setAssets((prevAsset) => [...prevAsset, asset]);
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
        //setChar(event.key + " - " + event.code + " | " + event.altKey + " - " + event.ctrlKey + " - " + event.metaKey + " | " + event.which);
        if (event.key === '.' || event.key == "Unidentified") {
            if (formData["new-asset-balance"] && !formData["new-asset-balance"].includes(",")) {
                setFormData(prevState => ({
                    ...prevState,
                    "new-asset-balance": formData["new-asset-balance"] + ","
                }));
            }
        }
    };

    const handleOnBlur = (event: React.FocusEvent) => {
        if (formData["new-asset-balance"] && formData["new-asset-balance"].charAt(formData["new-asset-balance"].length - 1) === ",") {
            setFormData(prevState => ({
                ...prevState,
                "new-asset-balance": formData["new-asset-balance"] + "00"
            }));
        }

    };


    return (
        <>
            <div id="AddAsset" className="callout page">
                <form onSubmit={handleSubmit} className="h-100 d-flex flex-column justify-content-between">
                    <div>
                        <div className="d-flex gap-3 mb-5">
                            <BackButton handler={backHandler} />
                            <div className="page-title" style={{ marginTop: -.5 }}>New asset</div>
                        </div>
                        {/*<div>Here: {char}</div>*/}
                        <CurrencyInput
                            className="currency-input"
                            id="new-asset-balance"
                            autoComplete="off"
                            name="new-asset-balance"
                            placeholder="€ 0,00"
                            prefix="€ "
                            required
                            value={formData["new-asset-balance"]}
                            decimalsLimit={2}
                            decimalSeparator=","
                            groupSeparator="."
                            allowNegativeValue={false}
                            disableAbbreviations={true}
                            onKeyDown={(e) => handleKeyDown(e)} // Intercept keypress events
                            onBlur={(e) => handleOnBlur(e)}
                            onValueChange={(value) => { handleChange({ target: { value: (value as unknown) as string, name: "new-asset-balance" } }) }}
                        />
                    </div>
                    <div>
                        <div className="mb-3">
                            <label className="form-label">Asset name</label>
                            <InputField type="text" placeholder='e.g. "Revolut"' name="new-asset-name" handleChange={handleChange} isRegistering='false' value={formData["new-asset-name"]} />
                            {/*<input type="text" className="form-control" name="new-asset-name" placeholder={'e.g. "Revolut"'} autoComplete="off" required />*/}
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <textarea className="form-control" name="new-asset-description" rows={3} placeholder="Optional" onChange={handleChange} autoComplete="off" style={{ resize: "none" }} value={formData["new-asset-description"]}></textarea>
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