import CurrencyInput from "react-currency-input-field";
import { DynamicIcon, BackButton} from "../../../assets/components/Utils";
import { Outlet, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { ChangeEvent, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import Asset, { AssetAttributes, AssetType } from "../../../assets/model/Asset";
import { capitalize } from "../../../assets/libraries/Utils";
import Loader from "../../../assets/components/Loader";
import { PersonalAreaContext } from "../../PersonalArea";
import User from "../../../assets/model/User";
import { ThemeContext, TranslationContext, TranslationContextType } from "../../../App";
import { Highlighter, Typeahead } from "react-bootstrap-typeahead";
import italianBanks from "../../../assets/libraries/italianBanks.json"
import { FilterByCallback } from "react-bootstrap-typeahead/types/types";

import { IoClose } from "react-icons/io5";
import { HiMiniBanknotes } from "react-icons/hi2";
import { GrMoney } from "react-icons/gr";
import { BsCashCoin } from "react-icons/bs";
import { MdOutlinePayments } from "react-icons/md";
import { RiSecurePaymentFill } from "react-icons/ri";

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

interface Option {
    name: string;
    fullname?: string;
    country?: string;
    abi?: string;
    logo?: string;
    type: string;
}
interface AddAssetContext {
    setAssetType: Dispatch<SetStateAction<Option | undefined>>;
    setDisplayAssetTypeSelector: Dispatch<SetStateAction<boolean>>;
}

export function AssetTypeSelector() {
    const [selectedType, setSelectedType] = useState<Option>();
    const i18n: TranslationContextType = useContext(TranslationContext);

    const navigate = useNavigate();

    const { setAssetType, setDisplayAssetTypeSelector } = useOutletContext() as AddAssetContext;

    const types = [
        {
            id: 0,
            selector: AssetType.BANKACCOUNT,
            icon: { 
                jsx: <RiSecurePaymentFill />,
                name: "RiSecurePaymentFill",
                lib: "ri"
            }
        },
        {
            id: 1,
            selector: AssetType.CASH,
            icon: { 
                jsx: <BsCashCoin />,
                name: "BsCashCoin",
                lib: "bs"
            }
        },
        {
            id: 2,
            selector: AssetType.EWALLET,
            icon: { 
                jsx: <MdOutlinePayments />,
                name: "MdOutlinePayments",
                lib: "md"
            }
        },
        {
            id: 3,
            selector: AssetType.OTHER,
            icon: { 
                jsx: <GrMoney />,
                name: "GrMoney",
                lib: "gr"
            }
        }
    ]

    const handleSelectType = (selector: AssetType, icon: any) => {
        setSelectedType({
            name: "",
            type: selector,
            logo: JSON.stringify({name: icon.name, lib: icon.lib})
        } as Option)
    }

    const handleConfirmType = (event: any) => {
        if (selectedType) {
            setAssetType(selectedType)
            setDisplayAssetTypeSelector(false);
            navigate("..")
        }
    }

    return (
        <>
            <div id="select-asset-type" className="callout page sub">
                <div className="h-100 d-flex flex-column">
                    <div className="d-flex justify-content-between">
                        <BackButton close link=".." />
                        <div className="page-title" style={{ marginTop: 1 }}>Select asset type</div>
                        <div style={{ width: "31px" }}></div>
                    </div>
                    <div className="body">
                        <div className={`asset-type-list ${(selectedType) ? "selected" : ""}`}>
                            {(types.map(type => {
                                return <div key={type.id} onClick={() => handleSelectType(type.selector, type.icon)} className={`asset-type ${(selectedType?.type === type.selector) ? "active" : ""}`}>
                                    <div className="asset-type-icon">{type.icon.jsx}</div>
                                    <div className="asset-type-name">{i18n.t(type.selector)}</div>
                                </div>
                            }))}
                        </div>
                    </div>
                </div>
                <button className={`btn w-100 fw-bold text-center rounded-pill btn-outline-warning shadow-sm align-items-center ${(!selectedType) ? " disabled": ""}`} onClick={handleConfirmType} style={{ padding: "1rem 0" }}>
                    Confirm
                </button>
            </div>
        </>
    );
}

/* eslint-disable */
export default function AddAsset(props: any) {
    const location = useLocation();

    const { data, controllers } = useOutletContext<PersonalAreaContext>();
    const i18n: TranslationContextType = useContext(TranslationContext);

    const user: User = data.user;
    const [processing, setProcessing] = useState(false);
    const [formData, setFormData] = useState({
        "new-asset-name": '',
        "new-asset-description": '',
        "new-asset-balance": ''
    });
    const [assetType, setAssetType] = useState<Option>();
    const [assetFocus, setAssetFocus] = useState(false);
    const [displayAssetTypeSelector, setDisplayAssetTypeSelector] = useState(true);
    const theme = useContext(ThemeContext);
    const [isSelectingAssetType, setIsSelectingAssetType] = useState((!!location.pathname.split("/")[3] && location.pathname.split("/")[3] === "select-type"));

    //const [char, setChar] = useState<any>(null);

    const options: Option[] = italianBanks.filter((opt) => !!opt.fullname);

    const navigate = useNavigate();

    const context = {
        setAssetType: setAssetType,
        setDisplayAssetTypeSelector: setDisplayAssetTypeSelector
    } as AddAssetContext;


    useEffect(() => {
        setIsSelectingAssetType((!!location.pathname.split("/")[3] && location.pathname.split("/")[3] === "select-type"));
    }, [location]);

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

    const handleAssetNameChange = (text: string, event: ChangeEvent<HTMLInputElement>) => {
        handleChange({ target: { name: "new-asset-name", value: text } })
    }

    const handleAssetNameSelection = (selected: Option[]) => {
        if (selected.length !== 0) {
            setAssetType(selected[0]);
            setDisplayAssetTypeSelector(false);
        }
    }

    function handleAssetNameBlur(event: any): void {
        setAssetFocus(false);
        setDisplayAssetTypeSelector((!assetType));
    }

    useEffect(() => {
        if (!assetType)
            setDisplayAssetTypeSelector(true);
    }, [assetType])

    useEffect(() => {
        if (assetFocus) {
            const assetTypeSelectorRef = document.getElementById("asset-type-selector");
            const assetTypeSelectorTitleRef = document.getElementById("asset-type-selector-title");
            setTimeout(() => {
                if (assetTypeSelectorRef && assetTypeSelectorTitleRef) {
                    assetTypeSelectorRef.style.width = "32px"
                    assetTypeSelectorTitleRef.style.opacity = "0"
                    setTimeout(() => {
                        assetTypeSelectorTitleRef.style.display = "none"
                    }, 800)
                }
            }, 500);
        }

    }, [assetFocus])

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
        if (!assetType || !assetType.logo || !formData["new-asset-name"] || !formData["new-asset-balance"]) {
            setProcessing(false);
            console.error("Empty required fields");
            return;
        }

        //Set the attributes of the asset
        const attributes = {
            sourceName: assetType.name,
            type: assetType.type,
            logo: assetType.logo
        } as AssetAttributes;

        const asset = new Asset(user.uid, formData["new-asset-name"], attributes, formData["new-asset-description"], (parseFloat(formData["new-asset-balance"].replace(',', '.'))));

        // Add the new asset to Firestore
        var result = await controllers.assetsController.CreateAsset(asset);
        if (result) {
            navigate("..")
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
            <div id="add-asset" className="callout page">
                <form onSubmit={handleSubmit} className="h-100 d-flex flex-column justify-content-between">
                    <div>
                        <div className="d-flex gap-3 mb-5">
                            <BackButton link={".."} />
                            <div className="page-title" style={{ marginTop: 1 }}>New asset</div>
                            <div style={{ width: "31px" }}></div>
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
                            {/*<InputField type="text" placeholder='e.g. "Revolut"' name="new-asset-name" handleChange={handleChange} isRegistering='false' value={formData["new-asset-name"]} />*/}
                            <div className="asset-type-detail">
                                <Typeahead
                                    id="asset-name-autocomplete"
                                    labelKey={((option: Option) => `${option.name}`) as any}
                                    defaultInputValue={formData["new-asset-name"]}
                                    options={options}
                                    placeholder='e.g. "Revolut"'
                                    minLength={3}
                                    maxResults={2}
                                    maxHeight="220px"
                                    align={"left"}
                                    open={(!assetType) && assetFocus}
                                    onInputChange={handleAssetNameChange}
                                    onBlur={handleAssetNameBlur}
                                    onFocus={() => setAssetFocus(true)}
                                    renderMenuItemChildren={((option: Option, props: any) => (
                                        <div className="d-flex align-items-center">
                                            {option.logo && <img
                                                alt={option.name}
                                                src={option.logo}
                                                className="asset-name-autocomplete-image"
                                            />
                                            }
                                            <div>
                                                <Highlighter search={props.text}>{option.name}</Highlighter>
                                                <div style={{ fontSize: 13, marginTop: -3, fontWeight: 300 }}>{i18n.t(option.type)}</div>
                                            </div>
                                        </div>
                                    )) as any}
                                    filterBy={((option: Option, props: any) => {
                                        const text: string[] = (props.text as string).split(" ");

                                        let value = option.name;
                                        let result = false;

                                        let i = 0;
                                        while (!result && i < text.length) {
                                            if (text[i].length >= 3) {
                                                result = (value.toLowerCase().indexOf(text[i].toLowerCase()) !== -1)
                                            }
                                            i++;
                                        }

                                        return result;
                                    }) as FilterByCallback}
                                    renderInput={({ inputRef, referenceElementRef, ...inputProps }) => (
                                        <>
                                            <input
                                                {...inputProps}
                                                className="form-control"
                                                ref={(node) => {
                                                    inputRef(node);
                                                    referenceElementRef(node);
                                                }}
                                                value={formData["new-asset-name"]}
                                            />
                                            {(assetType && assetType.name.length > 0 && assetType.logo) && <img
                                                alt={assetType.name}
                                                src={assetType.logo}
                                                className="asset-name-autocomplete-image selected"
                                            />
                                            }
                                            {(assetType && assetType.name.length === 0 && assetType.logo) && <div id="asset-type-selector" className="selected">
                                                <div id="asset-type-selector-icon">{<DynamicIcon lib={JSON.parse(assetType.logo).lib} name={JSON.parse(assetType.logo).name} />}</div>
                                            </div>}
                                        </>
                                    )}
                                    onChange={(handleAssetNameSelection as any)}
                                />
                                {assetType && <div className="py-1 px-3 d-flex justify-content-between align-items-center">
                                    <div>
                                        {(assetType.name && assetType.name.length > 0) && <div className="pe-3" style={{ fontWeight: 700, marginBottom: -3 }}>{assetType.name}</div>}
                                        <div className="small">{i18n.t(assetType.type)}</div>
                                    </div>
                                    <IoClose style={{ fontSize: 22, background: "#534b00", padding: 2, borderRadius: "50%", cursor: "pointer" }} onClick={() => setAssetType(undefined)} />
                                </div>}
                                {displayAssetTypeSelector && <div id="asset-type-selector" onClick={() => navigate("./select-type")}>
                                    <div id="asset-type-selector-title"><div style={{ textOverflow: "ellipsis" }}>Select asset type</div></div>
                                    <div id="asset-type-selector-icon"><HiMiniBanknotes /></div>
                                </div>}
                            </div>
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
                {isSelectingAssetType && <Outlet context={context}/>}
            </div>
            {processing && <Loader theme={theme} selector="login" />}
        </>
    );
}