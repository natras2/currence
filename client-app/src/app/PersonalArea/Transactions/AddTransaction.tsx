import { Link, Outlet, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { DataContext, PersonalAreaContextInterface, PersonalAreaContext } from "../../PersonalArea";
import { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from "react";
import { ThemeContext, TranslationContext, TranslationContextType } from "../../../App";
import { capitalize, currencyFormat } from "../../../assets/libraries/Utils";
import Transaction, { AssetAllocation, Category, defaultExpenseCategories, defaultIncomeCategories, SelectedCategory, TransactionType } from "../../../assets/model/Transaction";
import User from "../../../assets/model/User";
import CurrencyInput from "react-currency-input-field";
import { BackButton, defaultAssetTypeIconBase, defaultCategoryIconBase } from "../../../assets/components/Utils";
import InputField from "../../../assets/components/InputField";
import Loader from "../../../assets/components/Loader";
import Asset, { AssetAttributes, AssetType } from "../../../assets/model/Asset";
import { AnimatePresence, delay, motion } from "framer-motion";
import useLongPress from "../../../assets/libraries/Utils";

import { BiCalendar, BiPencil, BiPlus, BiTrash } from "react-icons/bi";
import { PiNotePencilFill } from "react-icons/pi";
import { MdArrowForward, MdClose, MdDone } from "react-icons/md";
import { GiConsoleController } from "react-icons/gi";
import { RiLoopLeftLine } from "react-icons/ri";
import { LocalizationProvider, MobileDateTimePicker, StaticDateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";
import 'dayjs/locale/it';
import 'dayjs/locale/en';
import { createTheme, PaletteMode, ThemeProvider } from "@mui/material";

interface AddTransactionContext {
    data: any,
    handleChange: (e: any) => void,
    isSingularSelect: boolean,
    isAllocated: boolean,
    setIsAllocated: Dispatch<SetStateAction<boolean>>,
    fromAssetsAllocations: AssetAllocation[],
    setFromAssetsAllocations: Dispatch<SetStateAction<AssetAllocation[]>>,
    toAssetsAllocations: AssetAllocation[],
    setToAssetsAllocations: Dispatch<SetStateAction<AssetAllocation[]>>
}
interface AssetItemType {
    data: DataContext,
    asset: Asset,
    searchString?: string,
    active?: boolean,
    clickHandler: any,
    disabled: boolean
}
interface AssetPickerType {
    data: DataContext,
    isAllocated: boolean,
    assetsAllocations: AssetAllocation[],
    setAssetsAllocations: Dispatch<SetStateAction<AssetAllocation[]>>,
    isFrom: boolean
}
interface CategoryPickerType {
    data: DataContext,
    formData: any,
    setFormData: Dispatch<SetStateAction<any>>
}
interface CategorySelectionType {
    category: Category,
    subcategory: Category | null,
    progressive: number
}
interface SubcategoryItemType {
    selection: CategorySelectionType,
    selected: SelectedCategory,
    setSelected: Dispatch<SetStateAction<SelectedCategory>>,
    handleChange: any,
    longPressed?: SelectedCategory,
    setLongPressed: Dispatch<SetStateAction<SelectedCategory | undefined>>
}
interface LongPressedSubcategoryType extends SelectedCategory {
    type: TransactionType
}

function AssetListItem({ data, asset, searchString, active = false, clickHandler, disabled }: AssetItemType) {

    const onSearchAssetName = () => {
        const searchStringPosInit = asset.name.toLowerCase().indexOf(searchString!.toLowerCase())
        const searchStringPosEnd = searchStringPosInit + searchString!.length;

        return (searchStringPosInit !== 0)
            ? <>{asset.name.substring(0, searchStringPosInit)}<strong className="fw-700">{asset.name.substring(searchStringPosInit, searchStringPosEnd)}</strong>{asset.name.substring(searchStringPosEnd)}</>
            : <><strong className="fw-800">{asset.name.substring(searchStringPosInit, searchStringPosEnd)}</strong>{asset.name.substring(searchStringPosEnd)}</>
    }

    return (
        <span className="asset-wrapper">
            <div className={`asset ${active ? "active" : (disabled ? "disabled" : "")}`} onClick={!disabled ? clickHandler : null}>
                <div className="d-flex align-items-center">
                    {!!asset.attributes && <div className="asset-logo">
                        {(asset.attributes.sourceName !== "")
                            ? <img src={asset.attributes.logo} alt={asset.attributes.sourceName} className="source-logo" />
                            : <div className="type-icon">{defaultAssetTypeIconBase[JSON.parse(asset.attributes.logo).name as keyof typeof defaultAssetTypeIconBase]}</div>
                        }
                    </div>}
                    <div className="asset-name" style={(!!searchString) ? { fontWeight: 400 } : {}}>{
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

function CategoryPicker({ data, formData, setFormData }: CategoryPickerType) {
    const location = useLocation();
    const i18n: TranslationContextType = useContext(TranslationContext);

    const category: SelectedCategory = formData["new-transaction-category"];
    const emptyCategory = !category.name;

    const isExpence = (formData["new-transaction-type"] as TransactionType) === TransactionType.EXPENCE;
    const type = isExpence ? "expence" : "income"


    const icon = (emptyCategory)
        ? <BiPlus />
        : ((!category.parent)
            ? (defaultCategoryIconBase[JSON.parse(category.icon!).name as keyof typeof defaultCategoryIconBase])
            : (defaultCategoryIconBase[JSON.parse(category.parent.icon!).name as keyof typeof defaultCategoryIconBase]))

    var name = <></>
    if (emptyCategory)
        name = <>{i18n.t("pages.addtransaction.form.selectcategory")}</>
    else {
        /*if (category.parent) {
            name = <><span style={{ fontSize: 12 }}>{(!category.parent.i18n_selector || category.parent.isUpdated) ? category.parent.name : i18n.t(category.parent.i18n_selector)} </span><br /></>
        }*/
        name = <>{name}{(!category.i18n_selector || category.isUpdated) ? category.name : i18n.t(category.i18n_selector)}</>
    }

    return (
        <>
            <Link to={"./select-category"} className={`${type} category-picker ${emptyCategory ? "empty" : "category-" + category.progressive}`}>
                <div className="d-flex align-items-center">
                    <div className="circle ms-1" style={{ transform: "scale(1.1)", marginRight: 12 }}>{icon}</div>
                    <div className="category-name" style={{ lineHeight: 1.3, fontWeight: 600 }}>{name}</div>
                </div>
            </Link>
        </>
    );
}

function AssetPicker({ data: dataContext, isAllocated, assetsAllocations, setAssetsAllocations, isFrom }: AssetPickerType) {
    const data: DataContext = dataContext;
    const location = useLocation();

    const i18n: TranslationContextType = useContext(TranslationContext);

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
            <Link to={"./select-asset"} state={{ isSingularSelect: true, isFrom: isFrom }} className="asset-picker list-0">
                <div style={{ marginTop: -3, marginRight: 5, transform: "scale(1.4)" }}><BiPlus /></div>
                <div>{i18n.t("pages.addtransaction.form.selectasset")}</div>
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
                {/* If visible, it allows to select multiple assets: REMEMBER! The CSS must be adapted accordingly (width:95%)
                
                <PlusButton />*/}
            </>
        );
    }

    const OneAllocation = () => {
        const asset = data.assets.find(a => a.id === assetsAllocations[0].assetId)!
        return (
            <>
                <Link to={"./select-asset"} state={{ isSingularSelect: true, isFrom: isFrom }} className="asset-picker">
                    <div className="d-flex align-items-center">
                        {!!asset.attributes && <div className="asset-logo ms-2" style={{ transform: "scale(1.2)" }}>
                            {(asset.attributes.sourceName !== "")
                                ? <img src={asset.attributes.logo} alt={asset.attributes.sourceName} className="source-logo" />
                                : <div className="type-icon">{defaultAssetTypeIconBase[JSON.parse(asset.attributes.logo).name as keyof typeof defaultAssetTypeIconBase]}</div>
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
                        <div className="multiple asset-logo ms-2" style={{ transform: "scale(1.2)" }}>
                            {firstThreeLogos.map((a, i) => {
                                return (a.sourceName !== "")
                                    ? <img key={i} src={a.logo} alt={a.sourceName} className="source-logo" />
                                    : <div key={i} className="type-icon">{defaultAssetTypeIconBase[JSON.parse(a.logo).name as keyof typeof defaultAssetTypeIconBase]}</div>
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

function LongPressedSubcategory({ name, i18n_selector, progressive, isUpdated, parent, type }: LongPressedSubcategoryType) {
    const i18n: TranslationContextType = useContext(TranslationContext);
    const [tempSubcategoryName, setTempSubcategoryName] = useState<string>((!i18n_selector || isUpdated) ? name : i18n.t(i18n_selector))
    const parentName = (!(parent!).i18n_selector || (parent!).isUpdated) ? (parent!).name : i18n.t((parent!).i18n_selector)
    const [clicked, setClicked] = useState(false);

    const handleChangeName = (e: any) => {
        setTempSubcategoryName(e.target.value)
    }

    return (
        <div id="longpressed-subcategory-editor" className={(type === TransactionType.EXPENCE ? "expence" : (type === TransactionType.INCOME ? "income" : "")) + " category-" + progressive}>
            <div>
                <div className="elipse"></div>
                <div className="name mt-3 mb-4">
                    <textarea
                        rows={2}
                        name="subcategory-name"
                        className="subcategory-name"
                        placeholder="Subcategory name"
                        value={tempSubcategoryName}
                        autoComplete="off"
                        onChange={handleChangeName}
                        style={{ resize: "none" }}
                    ></textarea>
                </div>
                <div className="type mb-2">
                    <InputField
                        type="text"
                        name="category-type"
                        className="category-type"
                        value={i18n.t(type)}
                        label={i18n.t("pages.addtransaction.transactioncategoryselector.labels.type")}
                        disabled
                        wide
                    />
                </div>
                <div className="parent">
                    <InputField
                        type="text"
                        name="parent-category"
                        className="parent-category"
                        value={parentName}
                        label={i18n.t("pages.addtransaction.transactioncategoryselector.labels.parent")}
                        style={{ backgroundColor: "var(--bs-body-bg)" }}
                        disabled
                        wide
                    />
                    <div className="circle">
                        <div className="logo">{defaultCategoryIconBase[JSON.parse((parent!).icon!).name as keyof typeof defaultCategoryIconBase]}</div>
                    </div>
                </div>
            </div>
            <div style={{ position: "relative", width: "100%" }}>
                <div
                    className={`delete-button btn btn-danger ${clicked ? "clicked" : ""}`}
                >
                    <AnimatePresence initial={false}>
                        {(!clicked) &&
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: .5 } }} className="delete-button-closed" onClick={() => setClicked(!clicked)}>
                                <BiTrash />
                            </motion.div>}
                    </AnimatePresence>
                    <AnimatePresence>
                        {(clicked) &&
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: .5 } }} exit={{ opacity: 0, transition: { duration: 0 } }} className="delete-content d-flex flex-column gap-3">
                                <div className="delete-text">{i18n.t("pages.addtransaction.transactioncategoryselector.deletetext")}</div>
                                <div className="d-flex gap-1">
                                    <div className="delete-cancel-button w-100 btn btn-outline-light d-flex align-items-center justify-content-center rounded-pill" onClick={() => setClicked(!clicked)}>{i18n.t("static.buttons.cancel")}</div>
                                    <div className="delete-confirm-button w-100 btn btn-light d-flex align-items-center justify-content-center rounded-pill">{i18n.t("static.buttons.confirm")}</div>
                                </div>
                            </motion.div>
                        }
                    </AnimatePresence>
                </div>
                <div className="confirm-button btn btn-outline disabled rounded-pill">{i18n.t("static.buttons.confirm")}</div>
            </div>
        </div>
    );
}

function SubcategoryItem({ selection, selected, handleChange, setSelected, setLongPressed }: SubcategoryItemType) {
    const i18n: TranslationContextType = useContext(TranslationContext);
    const navigate = useNavigate();

    const { category, subcategory, progressive } = selection;

    const onLongPressOnCategory = ({ category, subcategory, progressive }: CategorySelectionType) => {
        setLongPressed({
            name: subcategory!.name,
            i18n_selector: subcategory!.i18n_selector,
            progressive: progressive,
            isUpdated: subcategory!.isUpdated,
            parent: {
                name: category.name,
                icon: category.icon,
                i18n_selector: category.i18n_selector,
                isUpdated: category.isUpdated,
                parent: null
            }
        });
    }
    const onClickOnCategory = ({ category, subcategory, progressive }: CategorySelectionType) => {
        const selectedCategory: SelectedCategory = (!subcategory)
            ? {
                name: category.name,
                icon: category.icon,
                i18n_selector: category.i18n_selector,
                progressive: progressive,
                isUpdated: category.isUpdated,
                parent: null
            }
            : {
                name: subcategory.name,
                i18n_selector: subcategory.i18n_selector,
                progressive: progressive,
                isUpdated: subcategory.isUpdated,
                parent: {
                    name: category.name,
                    icon: category.icon,
                    i18n_selector: category.i18n_selector,
                    isUpdated: category.isUpdated,
                    parent: null
                }
            }
        setSelected(selectedCategory);
        handleChange({ target: { name: "new-transaction-category", value: selectedCategory } })
        navigate(-1);
    }
    const longPressOnCategory = useLongPress(onLongPressOnCategory, onClickOnCategory, { delay: 500 }, { category: category, subcategory: subcategory, progressive: progressive });

    return (
        <div className={`child ${(!!selected && !!selected.parent && selected.parent.name === selection.category.name && selected.name === selection.subcategory!.name) ? "selected" : ""}`}>
            <div className="child-content-wrapper" {...longPressOnCategory}>
                <div className="branch"></div>
                <div className="circle"></div>
                <div className="button btn btn-dark">{(!(subcategory!).i18n_selector || (subcategory!).isUpdated) ? subcategory!.name : i18n.t(subcategory!.i18n_selector)}</div>
            </div>
        </div>
    );
}

export function TransactionCategorySelector() {
    const [longPressed, setLongPressed] = useState<SelectedCategory>();
    const { data, controllers } = useContext<PersonalAreaContextInterface>(PersonalAreaContext);
    const { data: formData, handleChange } = useOutletContext<AddTransactionContext>();
    const i18n: TranslationContextType = useContext(TranslationContext);
    const navigate = useNavigate();

    const isExpence = (formData["new-transaction-type"] as TransactionType) === TransactionType.EXPENCE;
    const categoryList = isExpence ? data.user.expenceCategories : data.user.incomeCategories;

    const [selected, setSelected] = useState<SelectedCategory>(formData["new-transaction-category"]);
    const [openSubcategoryOf, setOpenSubcategoryOf] = useState("");

    const type = isExpence ? "expence" : "income"

    useEffect(() => {
        if (!!selected)
            setOpenSubcategoryOf(!!selected.parent ? selected.parent.name : selected.name)
    }, []);

    const onClickParent = (parentName: string, isLogo = false) => {
        setOpenSubcategoryOf((isLogo && openSubcategoryOf === parentName) ? "" : parentName);
    }

    const selectCategory = ({ category, subcategory, progressive }: CategorySelectionType) => {
        const selectedCategory: SelectedCategory = (!subcategory)
            ? {
                name: category.name,
                icon: category.icon,
                i18n_selector: category.i18n_selector,
                progressive: progressive,
                isUpdated: category.isUpdated,
                parent: null
            }
            : {
                name: subcategory.name,
                i18n_selector: subcategory.i18n_selector,
                progressive: progressive,
                isUpdated: subcategory.isUpdated,
                parent: {
                    name: category.name,
                    icon: category.icon,
                    i18n_selector: category.i18n_selector,
                    isUpdated: category.isUpdated,
                    parent: null
                }
            }
        setSelected(selectedCategory);
        handleChange({ target: { name: "new-transaction-category", value: selectedCategory } })
        navigate(-1);
    }

    const longPressedData: LongPressedSubcategoryType = {
        ...longPressed!,
        type: formData["new-transaction-type"]
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
                                : category.subcategories.map((sub, j) => {
                                    return (
                                        <SubcategoryItem
                                            key={j}
                                            selection={{ category: category, subcategory: sub, progressive: i + 1 }}
                                            selected={selected}
                                            setSelected={setSelected}
                                            handleChange={handleChange}
                                            longPressed={longPressed}
                                            setLongPressed={setLongPressed}
                                        />
                                    );
                                });
                            return (
                                <div key={i} className={`${type} category ${openSubcategoryOf ? ((openSubcategoryOf === category.name) ? ((category.name === selected.name && selected.name === "Other") ? "other" : "active") : ((openSubcategoryOf === "Other" && selected.name === "Other") ? "" : "blurred")) : ""}`}>
                                    <div className="parent" onClick={(category.isOther) ? () => { selectCategory({ category: category, subcategory: null, progressive: i + 1 }) } : () => { }}>
                                        <div className="logo" onClick={() => onClickParent(category.name, true)}>{(openSubcategoryOf === category.name && !category.isOther) ? <MdClose /> : (defaultCategoryIconBase[JSON.parse(category.icon!).name as keyof typeof defaultCategoryIconBase])}</div>
                                        <div className={`name-wrapper ${(!!selected && !selected.parent && selected.name === category.name) ? "selected" : ""}`} onClick={(openSubcategoryOf === category.name) ? () => { selectCategory({ category: category, subcategory: null, progressive: i + 1 }) } : () => { }}>
                                            <div className="name" onClick={() => onClickParent(category.name)}>{(!category.i18n_selector || category.isUpdated) ? category.name : i18n.t(category.i18n_selector)}</div>
                                            {/*openSubcategoryOf === category.name && 
                                            <motion.div 
                                                className="no-sub" 
                                                initial={{ visibility: "hidden", height: 0, opacity: 0 }}
                                                animate={{ visibility: "visible",  height: "auto", opacity: 1 }}
                                                onClick={() => {selectCategory({category: category, subcategory: null, progressive: i+1})}}
                                                >Use this as category
                                            </motion.div>*/}
                                        </div>
                                    </div>
                                    {!category.isOther &&
                                        <motion.div
                                            className="category-children-list"
                                            initial={{ visibility: "hidden", height: 0, opacity: 0 }}
                                            animate={{ height: (openSubcategoryOf === category.name) ? "auto" : 0, opacity: (openSubcategoryOf === category.name) ? 1 : 0, visibility: (openSubcategoryOf === category.name) ? "visible" : "hidden" }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                        >
                                            {subcategories}
                                            <div className="child add-button">
                                                <div className="branch"></div>
                                                <div className="button btn btn-outline-dark rounded-pill" onClick={() => navigate("./create")}>Add sub-category</div>
                                            </div>
                                        </motion.div>
                                    }
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <AnimatePresence>
                {!!longPressed && (
                    <div className="category-modal-wrapper" >
                        <motion.div
                            className="category-modal-bg"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setLongPressed(undefined)}
                        />
                        <motion.div
                            key="modal"
                            className="category-modal-content"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                        ><LongPressedSubcategory {...longPressedData} /></motion.div>
                    </div>
                )}
            </AnimatePresence>
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
    const { data: formData, isAllocated, setIsAllocated, fromAssetsAllocations, setFromAssetsAllocations, toAssetsAllocations, setToAssetsAllocations } = useOutletContext<AddTransactionContext>();
    const location = useLocation();

    const assetsAllocations = (formData["new-transtaction-type"] === TransactionType.EXPENCE) ? fromAssetsAllocations : toAssetsAllocations;
    const setAssetsAllocations = (formData["new-transtaction-type"] === TransactionType.EXPENCE) ? setFromAssetsAllocations : setToAssetsAllocations;

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
    const { data: formData, isAllocated, setIsAllocated, fromAssetsAllocations, setFromAssetsAllocations, toAssetsAllocations, setToAssetsAllocations } = useOutletContext<AddTransactionContext>();
    const [searchString, setSearchString] = useState("");

    const navigate = useNavigate();
    const location = useLocation();

    const i18n: TranslationContextType = useContext(TranslationContext);

    const isFrom: boolean = (formData["new-transtaction-type"] === TransactionType.EXPENCE || (location.state && location.state.isFrom))

    //define the dataset to operate on
    const assetsAllocations = (isFrom) ? fromAssetsAllocations : toAssetsAllocations;
    const setAssetsAllocations = (isFrom) ? setFromAssetsAllocations : setToAssetsAllocations;

    const initialSelectionLength = assetsAllocations.length;
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
                    return <AssetListItem key={i} data={data} asset={data.assets.filter((a) => a.id === allocation.assetId)[0]} clickHandler={() => handleAddSelectedAsset(data.assets.filter((a) => a.id === allocation.assetId)[0].id!, false)} disabled={false} />;
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
                        const isDisabled = () => { return (isFrom) ? !!fromAssetsAllocations.find((allocation) => allocation.assetId === asset.id) : !!toAssetsAllocations.find((allocation) => allocation.assetId === asset.id) }
                        return <AssetListItem key={i} data={data} asset={asset} searchString={searchString} clickHandler={() => handleAddSelectedAsset(asset.id!, true)} disabled={isDisabled()} />;
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
                {(assets.length > 0) && <div className="mb-2 mt-4">{i18n.t("pages.addtransaction.selectasset.selectasset")}</div>}
                <div className="asset-list">
                    {assets.map((asset, i) => {
                        const isDisabled = () => { return (isFrom) ? !!toAssetsAllocations.find((allocation) => allocation.assetId === asset.id) : !!fromAssetsAllocations.find((allocation) => allocation.assetId === asset.id) }
                        return <AssetListItem key={i} data={data} asset={asset} searchString={searchString} active={(assetsAllocations.find(aa => aa.assetId === asset.id)) ? true : false} clickHandler={() => handleAddSelectedAsset(asset.id!)} disabled={isDisabled()} />;
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
                    <div className="page-title" style={{ marginTop: 1 }}>{i18n.t("pages.addtransaction.selectasset.title")}</div>
                    <div style={{ width: "31px" }}></div>
                </div>
                <div className="body h-100 d-flex flex-column justify-content-between">
                    <div>
                        <InputField
                            type="search"
                            placeholder={i18n.t("pages.addtransaction.selectasset.search")}
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
                        <Link to="./create" className="add-asset-button"><BiPlus /> {i18n.t("pages.addtransaction.selectasset.addasset")}</Link>
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
    const { handleChange, data } = useOutletContext<AddTransactionContext>();
    const i18n: TranslationContextType = useContext(TranslationContext);
    const theme = useContext(ThemeContext);

    const darkTheme = createTheme({
        palette: {
            mode: theme as PaletteMode,
        },
    });

    return (
        <div id="select-transaction-datetime" className="callout page sub">
            <div className="h-100 d-flex flex-column">
                <div className="d-flex justify-content-between">
                    <BackButton close link=".." replace />
                    <div className="page-title" style={{ marginTop: 1 }}>{i18n.t("pages.addtransaction.form.datetime")}</div>
                    <div style={{ width: "31px" }}></div>
                </div>
                <div className="body">
                    <ThemeProvider theme={darkTheme}>
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={i18n.i18n.language.split("-")[0]} >
                            <MobileDateTimePicker onChange={(value) => handleChange({ target: { name: "new-transaction-date", value: value?.toDate()} })} defaultValue={dayjs(data["new-transaction-date"])} maxDateTime={dayjs(new Date())} />
                        </LocalizationProvider>
                    </ThemeProvider>
                </div>
            </div>
        </div>
    );
}

export function TransactionNotesInput() {
    const { handleChange, data } = useOutletContext<AddTransactionContext>();
    const i18n: TranslationContextType = useContext(TranslationContext);

    return (
        <div id="select-transaction-datetime" className="callout page sub">
            <div className="h-100 d-flex flex-column">
                <div className="d-flex justify-content-between">
                    <BackButton close link=".." replace />
                    <div className="page-title" style={{ marginTop: 1 }}>{i18n.t("pages.addtransaction.form.notes")}</div>
                    <div style={{ width: "31px" }}></div>
                </div>
                <div className="body">
                    <div className="">
                        <label className="form-label">{i18n.t("pages.addtransaction.form.notes")}</label>
                        <textarea className="form-control" name="new-transaction-notes" rows={3} placeholder={i18n.t("default.glossary.optional")} onChange={handleChange} autoComplete="off" style={{ resize: "none" }} value={data["new-transaction-notes"]}></textarea>
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
    const [isAllocated, setIsAllocated] = useState(false);
    const [fromAssetsAllocations, setFromAssetsAllocations] = useState<AssetAllocation[]>([]);
    const [toAssetsAllocations, setToAssetsAllocations] = useState<AssetAllocation[]>([]);

    const loopButton = useRef<any>(null);
    const loopButtonClicks = useRef<number>(0)

    const user: User = data.user;
    const navigate = useNavigate();

    const clearTransaction = (type: TransactionType) => {
        return {
            "new-transaction-type": type,
            "new-transaction-category": { name: '' } as SelectedCategory,
            "new-transaction-description": '',
            "new-transaction-amount": '0.00',
            "new-transaction-date": new Date(),
            "new-transaction-notes": ''
        }
    }

    const [formData, setFormData] = useState(clearTransaction(TransactionType.EXPENCE));

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
            if (name === "new-transaction-type") {
                setFormData(clearTransaction(value));
                setFromAssetsAllocations([]);
                setToAssetsAllocations([]);
            }
        }
    }

    const context = {
        data: formData,
        handleChange: handleChange,
        isAllocated: isAllocated,
        setIsAllocated: setIsAllocated,
        fromAssetsAllocations: fromAssetsAllocations,
        setFromAssetsAllocations: setFromAssetsAllocations,
        toAssetsAllocations: toAssetsAllocations,
        setToAssetsAllocations: setToAssetsAllocations
    } as AddTransactionContext;

    const handleSubmit = async (e: any) => {
        // Prevent the browser from reloading the page
        e.preventDefault();

        setProcessing(true);

        // Set the description data field
        setFormData(prevState => ({
            ...prevState,
            "new-transaction-description": capitalize(formData["new-transaction-description"].trim())
        }));

        // Check if the transaction field is well formed
        if ((formData["new-transaction-type"] !== TransactionType.TRANSFER && !formData["new-transaction-description"])
            || !formData["new-transaction-amount"]) {
            setProcessing(false);
            console.error("Empty required fields");
            return;
        }

        const transaction = new Transaction(
            user.uid,
            (!!formData["new-transaction-date"]) ? formData["new-transaction-date"] : new Date(),
            formData["new-transaction-description"],
            formData["new-transaction-type"],
            formData["new-transaction-category"],
            (parseFloat(formData["new-transaction-amount"].replace(',', '.'))),
            (formData["new-transaction-type"] === TransactionType.INCOME) ? undefined : fromAssetsAllocations,
            (formData["new-transaction-type"] === TransactionType.EXPENCE) ? undefined : toAssetsAllocations,
            undefined,
            formData["new-transaction-notes"]
        );

        /* Add the new transaction to Firestore
        */

        const checkResult = controllers.transactionsController.CheckTransaction(transaction, (errorList) => {
            console.log(errorList)
        })

        if (checkResult) {
            //Add the new transaction to Firestore
            var result = await controllers.transactionsController.CreateTransaction(transaction);
            if (result) {
                navigate("..")
            }
            else {
                setProcessing(false);
                console.error("Error while creating the transaction");
                return;
                //error handling
            }
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

    const invertTransferAssets = (event: any) => {
        var temp = [...fromAssetsAllocations]
        setFromAssetsAllocations([...toAssetsAllocations])
        setToAssetsAllocations([...temp])

        if (loopButton.current)
            loopButton.current.style.transform = "rotate(-" + ++loopButtonClicks.current * 180 + "deg)"
    }


    return (
        <>
            <div id="add-transaction" className="callout page">
                <form onSubmit={handleSubmit} className="h-100 d-flex flex-column justify-content-between">
                    <div>
                        <div className="d-flex justify-content-between">
                            <BackButton handler={() => navigate(-1)} />
                            <div className="page-title" style={{ marginTop: -.5 }}>{i18n.t("default.buttons.newtransaction")}</div>
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
                        <div style={{ position: "relative" }}>
                            <AnimatePresence initial={false}>
                                {(formData["new-transaction-type"] === TransactionType.EXPENCE || formData["new-transaction-type"] === TransactionType.INCOME) &&
                                    <motion.div
                                        style={{ position: "absolute", bottom: 0, width: "100%" }}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <div className="category-picker-wrapper mb-3">
                                            {/*<label className="form-label">Category</label>*/}
                                            <CategoryPicker data={data} formData={formData} setFormData={setFormData} />
                                        </div>
                                        <div className="asset-picker-wrapper mb-2">
                                            {/*<label className="form-label">Asset</label>*/}
                                            <AssetPicker
                                                data={data}
                                                isAllocated={isAllocated}
                                                assetsAllocations={(formData["new-transaction-type"] === TransactionType.EXPENCE) ? fromAssetsAllocations : toAssetsAllocations}
                                                setAssetsAllocations={(formData["new-transaction-type"] === TransactionType.EXPENCE) ? setFromAssetsAllocations : setToAssetsAllocations}
                                                isFrom={(formData["new-transaction-type"] === TransactionType.EXPENCE)}
                                            />
                                        </div>
                                        <div className="">
                                            <InputField
                                                type="text"
                                                placeholder={""}//`E.g. "${(formData["new-transaction-type"] === TransactionType.EXPENCE) ? "Monthly rent" : ((formData["new-transaction-type"] === TransactionType.INCOME) ? "Salary" : ((formData["new-transaction-type"] === TransactionType.TRANSFER) ? "Transfer" : ""))}"`}
                                                name="new-transaction-description"
                                                handleChange={handleChange}
                                                isRegistering='false'
                                                value={formData["new-transaction-description"] || ""}
                                                label={i18n.t("pages.addtransaction.form.description")}
                                                wide
                                            />
                                        </div>
                                    </motion.div>
                                }
                            </AnimatePresence>
                            <AnimatePresence>
                                {(formData["new-transaction-type"] === TransactionType.TRANSFER) &&
                                    <motion.div
                                        style={{ position: "absolute", bottom: 0, width: "100%" }}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <div className="asset-picker-wrapper mb-2 position-relative">
                                            {/*<label className="form-label">Asset</label>*/}
                                            <AssetPicker
                                                data={data}
                                                isAllocated={isAllocated}
                                                assetsAllocations={fromAssetsAllocations}
                                                setAssetsAllocations={setFromAssetsAllocations}
                                                isFrom={true} />
                                            <div style={{ height: ".5rem" }}></div>
                                            <div className="transfer-asset-inverter" ref={loopButton} onClick={invertTransferAssets}><RiLoopLeftLine /></div>
                                            <AssetPicker
                                                data={data}
                                                isAllocated={isAllocated}
                                                assetsAllocations={toAssetsAllocations}
                                                setAssetsAllocations={setToAssetsAllocations}
                                                isFrom={false} />
                                        </div>
                                        {/*<div className="">
                                            <InputField
                                                type="text"
                                                placeholder={""}//`E.g. "${(formData["new-transaction-type"] === TransactionType.EXPENCE) ? "Monthly rent" : ((formData["new-transaction-type"] === TransactionType.INCOME) ? "Salary" : ((formData["new-transaction-type"] === TransactionType.TRANSFER) ? "Transfer" : ""))}"`}
                                                name="new-transaction-description"
                                                handleChange={handleChange}
                                                isRegistering='false'
                                                value={formData["new-transaction-description"] || ""}
                                                label={i18n.t("pages.addtransaction.form.description")}
                                                wide
                                            />
                                        </div>*/}
                                    </motion.div>
                                }
                            </AnimatePresence>
                        </div>
                        <div className="d-flex mt-3 gap-1">
                            <Link to={"./select-date"} className="near-create-button"><BiCalendar /></Link>
                            <Link to={"./add-notes"} className="near-create-button"><PiNotePencilFill /></Link>
                            <button type='submit' className="btn w-100 border fw-bold text-center btn-primary rounded-pill shadow-sm" style={{ height: 50 }}>
                                {i18n.t("pages.addtransaction.form.create")}
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