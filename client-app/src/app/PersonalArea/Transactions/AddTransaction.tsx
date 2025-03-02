import { Link, Outlet, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { DataContext, PersonalAreaContextInterface, PersonalAreaContext } from "../../PersonalArea";
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { ThemeContext, TranslationContext, TranslationContextType } from "../../../App";
import { capitalize, currencyFormat } from "../../../assets/libraries/Utils";
import Transaction, { AssetAllocation, Category, defaultExpenseCategories, defaultIncomeCategories, TransactionType } from "../../../assets/model/Transaction";
import User from "../../../assets/model/User";
import CurrencyInput from "react-currency-input-field";
import { BackButton, DynamicIcon } from "../../../assets/components/Utils";
import InputField from "../../../assets/components/InputField";
import Loader from "../../../assets/components/Loader";
import Asset, { AssetAttributes } from "../../../assets/model/Asset";
import { motion } from "framer-motion";

import { BiCalendar, BiPlus } from "react-icons/bi";
import { PiNotePencilFill } from "react-icons/pi";
import { MdArrowForward, MdClose, MdDone } from "react-icons/md";


interface AddTransactionContext {
    data: any,
    handleChange: (e: any) => void,
    isSingularSelect: boolean,
    isAllocated: boolean,
    setIsAllocated: Dispatch<SetStateAction<boolean>>,
    assetsAllocations: AssetAllocation[],
    setAssetsAllocations: Dispatch<SetStateAction<AssetAllocation[]>>
}
interface AssetItemType {
    data: DataContext,
    asset: Asset,
    searchString?: string,
    active?: boolean,
    clickHandler: any
}
interface AssetPickerType {
    data: DataContext,
    isAllocated: boolean,
    assetsAllocations: AssetAllocation[],
    setAssetsAllocations: Dispatch<SetStateAction<AssetAllocation[]>>
}
interface CategoryPickerType {
    data: DataContext,
    formData: any,
    setFormData: Dispatch<SetStateAction<any>>
}
interface SelectedCategoryType {
    name: string,
    icon?: string,
    i18n_selector?: string,
    parent: SelectedCategoryType | null
}

function AssetListItem({ data, asset, searchString, active = false, clickHandler }: AssetItemType) {

    const onSearchAssetName = () => {
        const searchStringPosInit = asset.name.toLowerCase().indexOf(searchString!.toLowerCase())
        const searchStringPosEnd = searchStringPosInit + searchString!.length;

        return (searchStringPosInit !== 0)
            ? <>{asset.name.substring(0, searchStringPosInit)}<strong className="fw-700">{asset.name.substring(searchStringPosInit, searchStringPosEnd)}</strong>{asset.name.substring(searchStringPosEnd)}</>
            : <><strong className="fw-800">{asset.name.substring(searchStringPosInit, searchStringPosEnd)}</strong>{asset.name.substring(searchStringPosEnd)}</>
    }

    return (
        <span className="asset-wrapper">
            <div className={`asset ${active ? "active" : ""}`} onClick={clickHandler}>
                <div className="d-flex align-items-center">
                    {!!asset.attributes && <div className="asset-logo">
                        {(asset.attributes.sourceName !== "")
                            ? <img src={asset.attributes.logo} alt={asset.attributes.sourceName} className="source-logo" />
                            : <div className="type-icon">{<DynamicIcon lib={JSON.parse(asset.attributes.logo).lib} name={JSON.parse(asset.attributes.logo).name} />}</div>
                        }
                    </div>}
                    <div className="asset-name" style={(!!searchString) ? {fontWeight: 400} : {}}>{
                        (!!searchString)
                            ? onSearchAssetName()
                            : asset.name
                    }
                    </div>
                </div>
                <div className="d-flex gap-2">
                    {/*<div className="asset-balance">{(data.user.hiddenBalance) ? <span style={{ filter: "blur(4px)" }}>{currencyFormat(919)}</span> : currencyFormat(asset.balance)}</div>*/}
                </div>
            </div>
        </span>
    );
}

function CategoryPicker({ data, formData, setFormData}: CategoryPickerType) {
    const location = useLocation();

    const category: Category = {name:'', subcategories: null};//formData["new-transaction-category"];
    const emptyCategory = !category.name; 

    return (
        <>
            <Link to={"./select-category"} className={`category-picker ${emptyCategory ? "empty" : ""}`}>
                <div className="d-flex align-items-center gap-2">
                    <div className="circle">{emptyCategory ? <BiPlus /> : <DynamicIcon lib={JSON.parse(category.icon!).lib} name={JSON.parse(category.icon!).name} />}</div>
                    <div className="category-name">{emptyCategory ? "Select the category" : category.name}</div>
                </div>
            </Link>
        </>
    );
}

function AssetPicker({ data: dataContext, isAllocated, assetsAllocations, setAssetsAllocations }: AssetPickerType) {
    const data: DataContext = dataContext;
    const location = useLocation();

    /*  This script empties assets allocation collection whether we navigate to the add transaction main page 
        with more than 1 asset, unless they've been correctly allocated
    */
    useEffect(() => {
        if (location.pathname !== "/transactions/create") return;

        if (!isAllocated && assetsAllocations.length > 1) {
            setAssetsAllocations([])
        }
    }, [location])

    const PlusButton = () => <Link to={"./select-asset"} className="plus-btn"><BiPlus /></Link>;

    const NoAllocations = () => {
        return (
            <Link to={"./select-asset"} state={{ isSingularSelect: true }} className="asset-picker list-0">
                <div style={{ marginTop: -3, transform: "scale(1.2)" }}><BiPlus /></div>
                <div>Select an asset</div>
            </Link>
        );
    }

    const AssetsAllocations = () => {
        return (
            <>
                {(assetsAllocations.length === 1)
                    ? <OneAllocation />
                    : <MultipleAllocations />
                }
                {/*<PlusButton />*/}
            </>
        );
    }

    const OneAllocation = () => {
        const asset = data.assets.find(a => a.id === assetsAllocations[0].assetId)!
        return (
            <>
                <Link to={"./select-asset"} state={{ isSingularSelect: true }} className="asset-picker">
                    <div className="d-flex align-items-center">
                        {!!asset.attributes && <div className="asset-logo">
                            {(asset.attributes.sourceName !== "")
                                ? <img src={asset.attributes.logo} alt={asset.attributes.sourceName} className="source-logo" />
                                : <div className="type-icon">{<DynamicIcon lib={JSON.parse(asset.attributes.logo).lib} name={JSON.parse(asset.attributes.logo).name} />}</div>
                            }
                        </div>}
                        <div className="asset-name">{asset.name}</div>
                    </div>
                </Link>
            </>
        );
    }

    const MultipleAllocations = () => {
        const firstThreeLogos: AssetAttributes[] = []
        assetsAllocations.map((allocation, i) => {
            if (i < 3)
                firstThreeLogos.push(data.assets.find(a => a.id === allocation.assetId)!.attributes);
            return;
        })
        const firstAssetName = data.assets.find(a => a.id === assetsAllocations[0].assetId)!.name
        return (
            <>
                <Link to={"./select-asset/assets-allocation"} state={{ fromRoot: true }} className="asset-picker">
                    <div className="d-flex align-items-center">
                        <div className="multiple asset-logo">
                            {firstThreeLogos.map((a, i) => {
                                return (a.sourceName !== "")
                                    ? <img key={i} src={a.logo} alt={a.sourceName} className="source-logo" />
                                    : <div key={i} className="type-icon">{<DynamicIcon lib={JSON.parse(a.logo).lib} name={JSON.parse(a.logo).name} />}</div>
                            })}
                        </div>
                        <div className="asset-name">{firstAssetName} +{assetsAllocations.length - 1}</div>
                    </div>
                </Link>
            </>
        );
    }

    return (
        <>
            {(assetsAllocations.length === 0) && <NoAllocations />}
            {(assetsAllocations.length > 0) && <div className="d-flex position-relative align-items-center"><AssetsAllocations /></div>}
        </>
    )
}

export function TransactionCategorySelector() {
    const { data } = useOutletContext<AddTransactionContext>();
    const i18n: TranslationContextType = useContext(TranslationContext);

    const isExpense = (data["new-transaction-type"] as TransactionType) === TransactionType.EXPENCE;
    const categoryList = isExpense ? defaultExpenseCategories : defaultIncomeCategories;

    const [selectedCategory, setSelectedCategory] = useState<SelectedCategoryType>();
    const [openSubcategoryOf, setOpenSubcategoryOf] = useState("");

    const onClickParent = (parentName: string, isLogo = false) => { 
        console.log("triggered")
        setOpenSubcategoryOf((isLogo && openSubcategoryOf === parentName) ? "" : parentName);
    }

    return (
        <div id="select-transaction-category" className="callout page sub">
            <div className="h-100 d-flex flex-column">
                <div className="d-flex justify-content-between">
                    <BackButton close link=".." replace />
                    <div className="page-title" style={{ marginTop: 1 }}>Categories</div>
                    <div style={{ width: "31px" }}></div>
                </div>
                <div className="body">
                    <div className="category-parent-list">
                        {categoryList.map((category, i) => {
                            const subcategories = (category.subcategories === null) 
                                ? <></> 
                                : category.subcategories.map((sub, i) => {
                                    return (
                                        <div key={i} className="child">
                                            <div className="branch"></div>
                                            <div className="circle"></div>
                                            <div className="name">{!sub.i18n_selector ? sub.name : i18n.t(sub.i18n_selector)}</div>
                                        </div>
                                    );
                                });
                            return (
                                <div key={i} className={`category ${openSubcategoryOf ? (openSubcategoryOf === category.name ? "active" : "blurred") : ""}`}>
                                    <div className="parent">
                                        <div className="logo" onClick={() => onClickParent(category.name, true)}>{openSubcategoryOf === category.name ? <MdClose /> : <DynamicIcon lib={JSON.parse(category.icon!).lib} name={JSON.parse(category.icon!).name} />}</div>
                                        <div className="name" onClick={() => onClickParent(category.name)}>{!category.i18n_selector ? category.name : i18n.t(category.i18n_selector)}</div>
                                    </div>
                                    <motion.div 
                                        className="category-children-list"
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: (openSubcategoryOf === category.name) ? "auto" : 0, opacity: (openSubcategoryOf === category.name) ? 1 : 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                    >
                                        {subcategories}
                                        <div key={i} className="child no-sub">
                                            <div className="branch"></div>
                                            <div className="circle"></div>
                                            <div className="name">{i18n.t("default.glossary.general")}</div>
                                        </div>
                                        <div className="child add-button">
                                            <div className="branch"></div>
                                            <div className="button btn btn-outline-secondary rounded-pill">Add sub-category</div>
                                        </div>
                                    </motion.div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export function AddTransactionCategory() {
    return (
        <div id="create-transaction-category" className="callout page sub subsub">
            <div className="h-100 d-flex flex-column">
                <div className="d-flex justify-content-between">
                    <BackButton link=".." replace />
                    <div className="page-title" style={{ marginTop: 1 }}>New category</div>
                    <div style={{ width: "31px" }}></div>
                </div>
                <div className="body"></div>
            </div>
        </div>
    );
}

export function AssetsAllocationSetter() {
    const { data: formData, isAllocated, setIsAllocated, assetsAllocations, setAssetsAllocations } = useOutletContext<AddTransactionContext>();
    const location = useLocation();

    return (
        <div id="set-asset-allocations" className="callout page sub">
            <div className="h-100 d-flex flex-column">
                <div className="d-flex justify-content-between">
                    <BackButton link={(location.state && location.state.fromRoot) ? "../.." : ".."} replace close={location.state && location.state.fromRoot} />
                    <div className="page-title" style={{ marginTop: 1 }}>Split the balance</div>
                    <div style={{ width: "31px" }}></div>
                </div>
                <div className="body h-100 d-flex flex-column justify-content-between">
                    <div></div>
                    <div className="d-flex justify-content-between align-items-center bottom-container" style={{}}>
                        <div className="allocation">Allocated {currencyFormat(assetsAllocations.reduce((n, { amount }) => n + amount, 0))} of {currencyFormat(parseFloat(formData["new-transaction-amount"].replace(",", ".")))}</div>
                        <div className={`d-flex justify-content-center align-items-center btn border fw-bold text-center btn-primary rounded-pill shadow-sm ${(true) ? "disabled" : ""}`} style={{ height: 60, width: 170, padding: "0" }}>Confirm</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function InvolvedAssetsSelector() {
    const { data } = useContext<PersonalAreaContextInterface>(PersonalAreaContext);
    const { data: formData, isAllocated, setIsAllocated, assetsAllocations, setAssetsAllocations } = useOutletContext<AddTransactionContext>();
    const [searchString, setSearchString] = useState("");

    const initialSelectionLength = assetsAllocations.length;

    const navigate = useNavigate();
    const location = useLocation();

    const isSingularSelect: boolean = (location.state && location.state.isSingularSelect);

    const handleAddSelectedAsset = (assetId: string, onAdd?: boolean) => {
        if (onAdd === undefined) {
            onAdd = !(assetsAllocations.find(aa => aa.assetId === assetId)) ? true : false;
        }
        // checks if the asset is added of removed
        if (onAdd) {
            if (isSingularSelect) {
                setAssetsAllocations([{ assetId: assetId, amount: 0 }]);
                navigate("..", { replace: true });
            }
            else {
                setAssetsAllocations(oldArray => [...oldArray, { assetId: assetId, amount: 0 }]);
            }
        }
        else {
            const array = assetsAllocations.filter(allocation => allocation.assetId !== assetId)
            setAssetsAllocations(array);
        }
    }

    const sortAssetsByName = (a: Asset, b: Asset) => {
        const nameA = a.name.toUpperCase(); // ignore upper and lowercase
        const nameB = b.name.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    }

    const SelectedAssets = () => {
        if (assetsAllocations.length === 0)
            return <></>;

        return (
            <div className="asset-list selected mb-3">
                {assetsAllocations.map((allocation, i) => {
                    return <AssetListItem key={i} data={data} asset={data.assets.filter((a) => a.id === allocation.assetId)[0]} clickHandler={() => handleAddSelectedAsset(data.assets.filter((a) => a.id === allocation.assetId)[0].id!, false)} />;
                })}
            </div>
        )
    }

    const UnselectedAssets = () => {
        if (data.assets.length === 0)
            return <div className="title fs-1 fw-bolder text-white-50">Hey! It seems like there's nothing to show here</div>;

        var unselectedAssets = data.assets.sort(sortAssetsByName);

        if (assetsAllocations.length > 0)
            unselectedAssets = unselectedAssets.filter((a) => assetsAllocations.map(alloc => alloc.assetId).indexOf(a.id!) === -1)

        if (searchString.length > 0)
            unselectedAssets = unselectedAssets.filter((a) => a.name.toLowerCase().includes(searchString.toLowerCase()))

        return (
            <>
                {unselectedAssets.length > 0 && <div className="mb-2 mt-4">Select one or more assets</div>}
                <div className="asset-list">
                    {unselectedAssets.map((asset, i) => {
                        return <AssetListItem key={i} data={data} asset={asset} searchString={searchString} clickHandler={() => handleAddSelectedAsset(asset.id!, true)} />;
                    })}
                </div>
            </>
        )
    }

    const AssetsList = () => {
        if (data.assets.length === 0)
            return <div className="title fs-1 fw-bolder text-white-50">Hey! It seems like there's nothing to show here</div>;

        var assets = data.assets.sort(sortAssetsByName);

        if (searchString.length > 0)
            assets = assets.filter((a) => a.name.toLowerCase().includes(searchString.toLowerCase()))

        return (
            <>
                {(assets.length > 0) && <div className="mb-2 mt-4">Select an asset</div>}
                <div className="asset-list">
                    {assets.map((asset, i) => {
                        return <AssetListItem key={i} data={data} asset={asset} searchString={searchString} active={(assetsAllocations.find(aa => aa.assetId === asset.id)) ? true : false} clickHandler={() => handleAddSelectedAsset(asset.id!)} />;
                    })}
                </div>
            </>
        )
    }

    return (
        <div id="select-involved-assets" className="callout page sub">
            <div className="h-100 d-flex flex-column">
                <div className="d-flex justify-content-between">
                    <BackButton close link=".." replace />
                    <div className="page-title" style={{ marginTop: 1 }}>Assets</div>
                    <div style={{ width: "31px" }}></div>
                </div>
                <div className="body h-100 d-flex flex-column justify-content-between">
                    <div>
                        <InputField
                            type="search"
                            placeholder={"Search your asset"}
                            name="search"
                            handleChange={(e: any) => setSearchString(e.target.value)}
                            isRegistering='false'
                            value={searchString}
                        />
                        {!isSingularSelect && <>
                            <SelectedAssets />
                            <UnselectedAssets />
                        </>}
                        {isSingularSelect && <>
                            <AssetsList />
                        </>}
                        <Link to="./create" className="add-asset-button"><BiPlus /> Add a new asset</Link>
                    </div>
                    {assetsAllocations.length > 0 && <div className={`confirm-button btn border fw-bold text-center btn-primary rounded-pill shadow-sm p-0 pop-in ${(initialSelectionLength === 0) ? "pop-in" : ""}`} style={{ width: "fit-content", marginLeft: "auto" }}>
                        {assetsAllocations.length === 1 && <div className="d-flex align-items-center justify-content-center gap-1" style={{ height: 60, width: 140, paddingLeft: 10 }} onClick={() => navigate("..", { replace: true })}>Confirm <MdDone style={{ fontSize: 25 }} /></div>}
                        {assetsAllocations.length > 1 && <div className="d-flex align-items-center justify-content-center gap-1" style={{ height: 60, width: 140, paddingLeft: 10 }} onClick={() => navigate("./assets-allocation")}>Continue <MdArrowForward style={{ fontSize: 30 }} /></div>}
                    </div>}
                </div>
            </div>
        </div>
    );
}

export function TransactionDateTimeSelector() {
    return (
        <div id="select-transaction-datetime" className="callout page sub">
            <div className="h-100 d-flex flex-column">
                <div className="d-flex justify-content-between">
                    <BackButton close link=".." replace />
                    <div className="page-title" style={{ marginTop: 1 }}>Date and time</div>
                    <div style={{ width: "31px" }}></div>
                </div>
                <div className="body"></div>
            </div>
        </div>
    );
}

export function TransactionNotesInput() {
    const { handleChange, data } = useOutletContext<AddTransactionContext>();

    return (
        <div id="select-transaction-datetime" className="callout page sub">
            <div className="h-100 d-flex flex-column">
                <div className="d-flex justify-content-between">
                    <BackButton close link=".." replace />
                    <div className="page-title" style={{ marginTop: 1 }}>Notes</div>
                    <div style={{ width: "31px" }}></div>
                </div>
                <div className="body">
                    <div className="">
                        <label className="form-label">Notes</label>
                        <textarea className="form-control" name="new-transaction-notes" rows={3} placeholder="Optional" onChange={handleChange} autoComplete="off" style={{ resize: "none" }} value={data["new-transaction-notes"]}></textarea>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AddTransaction() {
    const { data, controllers } = useContext<PersonalAreaContextInterface>(PersonalAreaContext);
    const theme = useContext(ThemeContext);
    const i18n = useContext(TranslationContext);

    const [processing, setProcessing] = useState(false);

    const [formData, setFormData] = useState({
        "new-transaction-type": TransactionType.EXPENCE,
        "new-transaction-category": { name: '' } as Category,
        "new-transaction-description": '',
        "new-transaction-amount": '0.00',
        "new-transaction-date": new Date(),
        "new-transaction-notes": ''
    });
    const [isAllocated, setIsAllocated] = useState(false);
    const [assetsAllocations, setAssetsAllocations] = useState<AssetAllocation[]>([]);

    const user: User = data.user;
    const navigate = useNavigate();

    /*
    useEffect (() => {
        if(formData["new-transaction-type"] === TransactionType.TRANSFER) {
            if(!formData["new-transaction-description"] || formData["new-transaction-description"] === "") {
                setFormData(prevState => ({
                    ...prevState,
                    "new-transaction-description": "Transfer"
                }));
            }
        }
        else {
            setFormData(prevState => ({
                ...prevState,
                "new-transaction-description": ""
            }));
        }
    }, [formData["new-transaction-type"]])
    */

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        if (formData.hasOwnProperty(name)) {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    }

    const context = {
        data: formData,
        handleChange: handleChange,
        isAllocated: isAllocated,
        setIsAllocated: setIsAllocated,
        assetsAllocations: assetsAllocations,
        setAssetsAllocations: setAssetsAllocations
    } as AddTransactionContext;

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

    const handleOnFocus = (event: any) => {
        if (event.target.value === "€ 0,00") {
            setFormData(prevState => ({
                ...prevState,
                "new-transaction-amount": ""
            }));
        }

    };

    const handleOnBlur = (event: any) => {
        if (!event.target.value || event.target.value === "") {
            setFormData(prevState => ({
                ...prevState,
                "new-transaction-amount": "0,00"
            }));
        }
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
                            <BackButton link={".."} />
                            <div className="page-title" style={{ marginTop: -.5 }}>New transaction</div>
                            <div style={{ width: "31px" }}></div>
                        </div>
                        <div className="type-selector" style={{ marginBottom: "1.5rem" }}>
                            <div className={`selector ${(formData["new-transaction-type"] === TransactionType.EXPENCE) ? "active" : ""}`} onClick={() => handleChange({ target: { name: "new-transaction-type", value: TransactionType.EXPENCE } })}>{i18n.t(TransactionType.EXPENCE)}</div>
                            <div className={`selector ${(formData["new-transaction-type"] === TransactionType.INCOME) ? "active" : ""}`} onClick={() => handleChange({ target: { name: "new-transaction-type", value: TransactionType.INCOME } })}>{i18n.t(TransactionType.INCOME)}</div>
                            <div className={`selector ${(formData["new-transaction-type"] === TransactionType.TRANSFER) ? "active" : ""}`} onClick={() => handleChange({ target: { name: "new-transaction-type", value: TransactionType.TRANSFER } })}>{i18n.t(TransactionType.TRANSFER)}</div>
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
                            onFocus={(e) => handleOnFocus(e)}
                            onValueChange={(value) => { handleChange({ target: { value: (value as unknown) as string, name: "new-transaction-amount" } }) }}
                        />
                    </div>
                    <div>
                        <div className="category-picker-wrapper mb-2">
                            {/*<label className="form-label">Category</label>*/}
                            <CategoryPicker data={data} formData={formData} setFormData={setFormData} />
                        </div>
                        <div className="">
                            {/*<label className="form-label">Description</label>*/}
                            <InputField
                                type="text"
                                placeholder={`Description (e.g. "${(formData["new-transaction-type"] === TransactionType.EXPENCE) ? "Monthly rent" : ((formData["new-transaction-type"] === TransactionType.INCOME) ? "Salary" : ((formData["new-transaction-type"] === TransactionType.TRANSFER) ? "Transfer" : ""))}")`}
                                name="new-transaction-description"
                                handleChange={handleChange}
                                isRegistering='false'
                                value={formData["new-transaction-description"]}
                            />
                        </div>
                        <div className="asset-picker-wrapper">
                            {/*<label className="form-label">Asset</label>*/}
                            <AssetPicker data={data} isAllocated={isAllocated} assetsAllocations={assetsAllocations} setAssetsAllocations={setAssetsAllocations} />
                        </div>
                        <div className="d-flex mt-4 gap-1">
                            <Link to={"./select-date"} className="near-create-button"><BiCalendar /></Link>
                            <Link to={"./add-notes"} className="near-create-button"><PiNotePencilFill /></Link>
                            <button type='submit' className="btn w-100 border fw-bold text-center btn-primary rounded-pill shadow-sm" style={{ height: 50 }}>
                                Create
                            </button>
                        </div>
                    </div>
                </form>
                <Outlet context={context} />
            </div>
            {processing && <Loader theme={theme} selector="login" />}
        </>
    );
}