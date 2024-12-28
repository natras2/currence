import { useNavigate, useOutletContext } from "react-router-dom";
import { PersonalAreaContext } from "../../PersonalArea";
import { useContext, useState } from "react";
import { ThemeContext } from "../../../App";
import { capitalize } from "../../../assets/libraries/Utils";
import Transaction, { Category, TransactionType } from "../../../assets/model/Transaction";
import User from "../../../assets/model/User";
import CurrencyInput from "react-currency-input-field";
import { BackButton } from "../../../assets/components/Utils";
import InputField from "../../../assets/components/InputField";
import Loader from "../../../assets/components/Loader";

export default function AddTransaction() {
    const { data, controllers } = useOutletContext<PersonalAreaContext>();
    const theme = useContext(ThemeContext);
    const [processing, setProcessing] = useState(false);

    const [formData, setFormData] = useState({
        "new-transaction-type": TransactionType.EXPENCE,
        "new-transaction-category": {name: ''} as Category,
        "new-transaction-name": '',
        "new-transaction-description": '',
        "new-transaction-amount": '',
        "new-transaction-date": undefined,
    });

    const user: User = data.user;
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
    }

    const handleSubmit = async (e: any) => {
        setProcessing(true);

        // Prevent the browser from reloading the page
        e.preventDefault();

        // Set the name data field
        setFormData(prevState => ({
            ...prevState,
            "new-transaction-name": capitalize(formData["new-transaction-name"].trim())
        }));

        // Check if any of the required field is empty
        if (!formData["new-transaction-name"] || !formData["new-transaction-amount"]) {
            setProcessing(false);
            console.error("Empty required fields");
            return;
        }

        const transaction = new Transaction(
            user.uid, 
            formData["new-transaction-date"], 
            formData["new-transaction-description"], 
            formData["new-transaction-type"], 
            formData["new-transaction-category"], 
            (parseFloat(formData["new-transaction-amount"].replace(',', '.'))));

        // Add the new transaction to Firestore
        var result = await controllers.transactionsController.CreateTransaction(transaction);
        if (result) {
            navigate(-1)
        }
        else {
            setProcessing(false);
            console.error("Error while creating the transaction");
            return;
            //error handling
        }
    }

    const handleKeyDown = (event: React.KeyboardEvent) => {
        //setChar(event.key + " - " + event.code + " | " + event.altKey + " - " + event.ctrlKey + " - " + event.metaKey + " | " + event.which);
        if (event.key === '.' || event.key == "Unidentified") {
            if (formData["new-transaction-amount"] && !formData["new-transaction-amount"].includes(",")) {
                setFormData(prevState => ({
                    ...prevState,
                    "new-transaction-amount": formData["new-transaction-amount"] + ","
                }));
            }
        }
    };

    const handleOnBlur = (event: React.FocusEvent) => {
        if (formData["new-transaction-amount"] && formData["new-transaction-amount"].charAt(formData["new-transaction-amount"].length - 1) === ",") {
            setFormData(prevState => ({
                ...prevState,
                "new-transaction-amount": formData["new-transaction-amount"] + "00"
            }));
        }

    };


    return (
        <>
            <div id="add-transaction" className="callout page">
                <form onSubmit={handleSubmit} className="h-100 d-flex flex-column justify-content-between">
                    <div>
                        <div className="d-flex gap-3 mb-5">
                            <BackButton handler={backHandler} />
                            <div className="page-title" style={{ marginTop: -.5 }}>New transaction</div>
                        </div>
                        {/*<div>Here: {char}</div>*/}
                        <CurrencyInput
                            className="currency-input"
                            id="new-transaction-amount"
                            autoComplete="off"
                            name="new-transaction-amount"
                            placeholder="€ 0,00"
                            prefix="€ "
                            required
                            value={formData["new-transaction-amount"]}
                            decimalsLimit={2}
                            decimalSeparator=","
                            groupSeparator="."
                            allowNegativeValue={false}
                            disableAbbreviations={true}
                            onKeyDown={(e) => handleKeyDown(e)} // Intercept keypress events
                            onBlur={(e) => handleOnBlur(e)}
                            onValueChange={(value) => { handleChange({ target: { value: (value as unknown) as string, name: "new-transaction-amount" } }) }}
                        />
                    </div>
                    <div>
                        <div className="mb-3">
                            <label className="form-label">Asset name</label>
                            <InputField type="text" placeholder='e.g. "Revolut"' name="new-transaction-name" handleChange={handleChange} isRegistering='false' value={formData["new-transaction-name"]} />
                            {/*<input type="text" className="form-control" name="new-transaction-name" placeholder={'e.g. "Revolut"'} autoComplete="off" required />*/}
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <textarea className="form-control" name="new-transaction-description" rows={3} placeholder="Optional" onChange={handleChange} autoComplete="off" style={{ resize: "none" }} value={formData["new-transaction-description"]}></textarea>
                        </div>
                        <button type='submit' className="btn w-100 border fw-bold text-center btn-primary rounded-pill shadow-sm align-items-center" style={{ padding: "1rem 0" }}>
                            Create
                        </button>
                    </div>
                </form>
            </div>
            {processing && <Loader theme={theme} selector="login" />}
        </>
    );
}