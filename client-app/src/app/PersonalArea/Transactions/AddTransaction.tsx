import { useNavigate, useOutletContext } from "react-router-dom";
import { PersonalAreaContext } from "../../PersonalArea";
import { useContext, useState } from "react";
import { ThemeContext, TranslationContext } from "../../../App";
import { capitalize } from "../../../assets/libraries/Utils";
import Transaction, { Category, TransactionType } from "../../../assets/model/Transaction";
import User from "../../../assets/model/User";
import CurrencyInput from "react-currency-input-field";
import { BackButton } from "../../../assets/components/Utils";
import InputField from "../../../assets/components/InputField";
import Loader from "../../../assets/components/Loader";
import { BiCalendar } from "react-icons/bi";

export default function AddTransaction() {
    const { data, controllers } = useOutletContext<PersonalAreaContext>();
    const theme = useContext(ThemeContext);
    const i18n = useContext(TranslationContext);

    const [processing, setProcessing] = useState(false);

    const [formData, setFormData] = useState({
        "new-transaction-type": TransactionType.EXPENCE,
        "new-transaction-category": { name: '' } as Category,
        "new-transaction-description": '',
        "new-transaction-amount": '',
        "new-transaction-date": new Date(),
        "new-transaction-notes": ''
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
        // Prevent the browser from reloading the page
        e.preventDefault();

        setProcessing(true);

        // Set the name data field
        setFormData(prevState => ({
            ...prevState,
            "new-transaction-description": capitalize(formData["new-transaction-description"].trim())
        }));

        // Check if any of the required field is empty
        if (!formData["new-transaction-description"] || !formData["new-transaction-amount"]) {
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
            (parseFloat(formData["new-transaction-amount"].replace(',', '.')))
        );

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
                        <div className="d-flex justify-content-between">
                            <BackButton handler={backHandler} />
                            <div className="page-title" style={{ marginTop: -.5 }}>New transaction</div>
                            <div style={{width: "31px"}}></div>
                        </div>
                        <div className="type-selector" style={{marginBottom: "1.5rem"}}>
                            <div className={`selector ${(formData["new-transaction-type"] === TransactionType.EXPENCE) ? "active" : ""}`} onClick={() => handleChange({target: {name: "new-transaction-type", value: TransactionType.EXPENCE}})}>{i18n.t(TransactionType.EXPENCE)}</div>
                            <div className={`selector ${(formData["new-transaction-type"] === TransactionType.INCOME) ? "active" : ""}`} onClick={() => handleChange({target: {name: "new-transaction-type", value: TransactionType.INCOME}})}>{i18n.t(TransactionType.INCOME)}</div>
                            <div className={`selector ${(formData["new-transaction-type"] === TransactionType.TRANSFER) ? "active" : ""}`} onClick={() => handleChange({target: {name: "new-transaction-type", value: TransactionType.TRANSFER}})}>{i18n.t(TransactionType.TRANSFER)}</div>
                        </div>
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
                        <div className="">
                            <label className="form-label">Description</label>
                            <InputField type="text" placeholder='e.g. "Monthly rent"' name="new-transaction-description" handleChange={handleChange} isRegistering='false' value={formData["new-transaction-description"]} />
                            {/*<input type="text" className="form-control" name="new-transaction-name" placeholder={'e.g. "Revolut"'} autoComplete="off" required />*/}
                        </div>
                        <div className="">
                            <label className="form-label">Notes</label>
                            <textarea className="form-control" name="new-transaction-notes" rows={2} placeholder="Optional" onChange={handleChange} autoComplete="off" style={{ resize: "none" }} value={formData["new-transaction-notes"]}></textarea>
                        </div>
                        <div className="d-flex mt-4 gap-2">
                            <div className="date-picker-button"><BiCalendar /></div>
                            <button type='submit' className="btn w-100 border fw-bold text-center btn-primary rounded-pill shadow-sm" style={{ height: 50 }}>
                                Create
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            {processing && <Loader theme={theme} selector="login" />}
        </>
    );
}