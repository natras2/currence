import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { SplashFirstAccess } from "../../assets/components/SplashFirstScreen";
import User from "../../assets/model/User";
import { ControllersContext, DataContext, PersonalAreaContext, PersonalAreaContextInterface } from "../PersonalArea";
import Transaction, { AssetAllocation, TransactionType } from "../../assets/model/Transaction";
import { ThemeContext, TranslationContext } from "../../App";

import { LuPlus, LuSettings2 } from "react-icons/lu";
import { capitalizeFirst, currencyFormat, getCurrentLocale, groupAndSort, GroupedStructure } from "../../assets/libraries/Utils";
import { defaultAssetTypeIconBase, defaultCategoryIconBase } from "../../assets/components/Utils";
import Asset from "../../assets/model/Asset";
import { FaArrowRight } from "react-icons/fa6";
import { Timestamp } from "firebase/firestore";

export interface FilterContext {
    activeExpence: boolean,
    activeIncome: boolean,
    activeTransfer: boolean
}

function TransactionsListLabel({ dateString }: {
    dateString: string
}) {

    const i18n = useContext(TranslationContext);

    const date = new Date(dateString);
    const currentLocale = getCurrentLocale(i18n.i18n.language)

    var formatted = date.toLocaleDateString(currentLocale, {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    formatted = capitalizeFirst(formatted);

    if (date.toLocaleDateString(currentLocale) === new Date().toLocaleDateString(currentLocale))
        formatted = i18n.t("default.date.today")

    if (date.toLocaleDateString(currentLocale) === new Date(new Date().setDate(new Date().getDate() - 1)).toLocaleDateString(currentLocale))
        formatted = i18n.t("default.date.yesterday")

    return (<>
        <div className="label">{formatted}</div>
    </>);
}

function TransactionItem({ data, transaction }: {
    data: DataContext,
    transaction: Transaction
}) {

    const i18n = useContext(TranslationContext);
    const theme = useContext(ThemeContext);


    const amountWidget = useRef<any>(null)

    const isExpence = transaction.type === TransactionType.EXPENCE
    const isIncome = transaction.type === TransactionType.INCOME
    const isTransfer = transaction.type === TransactionType.TRANSFER

    interface InvolvedAsset {
        dir: string,
        asset: Asset
    }
    interface ItemAssetAllocations {
        num: number,
        assets: InvolvedAsset[]
    }

    const itemAllocations = (maxItems?: number) => {
        const assets: InvolvedAsset[] = []
        var num = 0;
        if ((isExpence || isTransfer) && !!transaction.fromAssets) {
            transaction.fromAssets.forEach((allocation) => {
                var asset = data.assets.find(asset => asset.id === allocation.assetId)
                if (asset) {
                    if (!maxItems || assets.length < maxItems) assets.push({ dir: "from", asset })
                    num++;
                }
            })
        }
        if ((isIncome || isTransfer) && !!transaction.toAssets) {
            transaction.toAssets.forEach((allocation) => {
                var asset = data.assets.find(asset => asset.id === allocation.assetId)
                if (asset) {
                    if (!maxItems || assets.length < maxItems) assets.push({ dir: "to", asset })
                    num++;
                }
            })
        }
        return {
            num: num,
            assets: assets
        } as ItemAssetAllocations;
    }

    const itemAssetAllocations = React.useMemo(() => itemAllocations(), [isExpence, transaction, data])

    const ExpenceIncomeTransactionContent = () => {
        return (
            <>
                <div className="transaction-icon-wrapper">
                    <div
                        className={`transaction-icon prog-${transaction.category.progressive}`}
                        style={
                            {
                                backgroundColor: "var(--" + (theme === "dark" ? "darker-" : "") + "category-color)",
                                color: "var(--" + (theme === "light" ? "darker-" : "") + "category-color)"
                            }
                        }>
                        {((!transaction.category.parent)
                            ? (defaultCategoryIconBase[JSON.parse(transaction.category.icon!).name as keyof typeof defaultCategoryIconBase])
                            : (defaultCategoryIconBase[JSON.parse(transaction.category.parent.icon!).name as keyof typeof defaultCategoryIconBase]))}
                    </div>
                    <div className="transaction-asset-badges">
                        {
                            itemAssetAllocations.assets.map((asset, i) => {
                                if (i < 2 || (i == 2 && itemAssetAllocations.num == 3)) return (
                                    <React.Fragment key={asset.asset.id}>
                                        {!!asset.asset.attributes && <div className="asset-logo">
                                            {(asset.asset.attributes.sourceName !== "")
                                                ? <img src={asset.asset.attributes.logo} alt={asset.asset.attributes.sourceName} className="source-logo" />
                                                : <div className="type-icon">{defaultAssetTypeIconBase[JSON.parse(asset.asset.attributes.logo).name as keyof typeof defaultAssetTypeIconBase]}</div>
                                            }
                                        </div>}
                                    </React.Fragment>
                                )
                            })
                        }
                        {
                            itemAssetAllocations.num > 3
                                ? <div className="asset-logo allocation-number"><div className="type-icon">+{itemAssetAllocations.num - 2}</div></div>
                                : <></>
                        }
                    </div>
                </div>
                <div>
                    <div className="transaction-description">{transaction.description}</div>
                    <div className="transaction-details">
                        <div className="transaction-category">
                            {(!transaction.category.i18n_selector || transaction.category.isUpdated) ? transaction.category.name : (transaction.category.i18n_selector.endsWith("other.name") ? i18n.t(transaction.category.i18n_selector.replace("other.name", "other.fullname")) : i18n.t(transaction.category.i18n_selector))}
                            {/* Uncomment the following to list the assets involved ("allocated") in the transaction */}
                            {/*<span style={{ fontSize: "inherit", padding: "0 4px" }}>&middot;</span>
                            </div>
                            <div className="transaction-asset-list">
                                {
                                    itemAssetAllocations.assets.map((asset, i) => {
                                        return (<div><div key={i} className="asset-name">{asset.asset.name}</div></div>)
                                    })
                                }*/}
                        </div>
                    </div>
                </div>
            </>
        );
    }
    const TransferTransactionContent = () => {
        const fromAssetAllocations = {
            ...itemAssetAllocations,
            assets: itemAssetAllocations.assets.filter(asset => asset.dir === "from")
        };
        fromAssetAllocations.num = fromAssetAllocations.assets.length

        const toAssetAllocations = {
            ...itemAssetAllocations,
            assets: itemAssetAllocations.assets.filter(asset => asset.dir === "to")
        };
        toAssetAllocations.num = toAssetAllocations.assets.length

        return (
            <>
                <div className="transaction-asset-badges">
                    {fromAssetAllocations.assets.map((a) => (
                        <React.Fragment key={a.asset.id}>
                            {!!a.asset.attributes && (
                                <div className="asset-logo from-allocation">
                                    {a.asset.attributes.sourceName !== "" ? (
                                        <img src={a.asset.attributes.logo} alt={a.asset.attributes.sourceName} className="source-logo" />
                                    ) : (
                                        <div className="type-icon">
                                            {defaultAssetTypeIconBase[JSON.parse(a.asset.attributes.logo).name as keyof typeof defaultAssetTypeIconBase]}
                                        </div>
                                    )}
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                    {toAssetAllocations.assets.map((a) => (
                        <React.Fragment key={a.asset.id}>
                            {!!a.asset.attributes && (
                                <div className="asset-logo to-allocation">
                                    {a.asset.attributes.sourceName !== "" ? (
                                        <img src={a.asset.attributes.logo} alt={a.asset.attributes.sourceName} className="source-logo" />
                                    ) : (
                                        <div className="type-icon">
                                            {defaultAssetTypeIconBase[JSON.parse(a.asset.attributes.logo).name as keyof typeof defaultAssetTypeIconBase]}
                                        </div>
                                    )}
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
                <div className="transaction-info">
                    <div className="transaction-description">{i18n.t(TransactionType.TRANSFER)}</div>
                    <div className="transaction-details">
                        <div className="from transaction-asset-list">
                            {fromAssetAllocations.assets.map((a, i) => (
                                <div key={i} className="asset-name">{a.asset.name}</div>
                            ))}
                        </div>
                        <FaArrowRight className="arrow-icon" />
                        <div className="to transaction-asset-list">
                            {toAssetAllocations.assets.map((a, i) => (
                                <div key={i} className="asset-name">{a.asset.name}</div>
                            ))}
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="transaction-body">
                <div className="transaction-body-content">
                    {(isExpence || isIncome) && <ExpenceIncomeTransactionContent />}
                    {isTransfer && <TransferTransactionContent />}
                </div>
                <div className="transaction-amount-wrapper" ref={amountWidget}>
                    <div className="transaction-amount">{(data.user.hiddenBalance) ? <span style={{ filter: "blur(6px)" }}>{currencyFormat(919)}</span> : `${isExpence ? "- " : ""}${currencyFormat(transaction.amount)}`}</div>
                </div>
            </div>
        </>
    );
}

export function TransactionsRender({ data, showAll = true, filters, maxResult }: {
    data: DataContext,
    showAll?: boolean,
    filters?: FilterContext,
    maxResult?: number
}) {

    const filteredTransactions = data.transactions.filter(transaction => {
        if (!showAll && filters) {
            if (filters.activeExpence && transaction.type === TransactionType.EXPENCE) return true;
            if (filters.activeIncome && transaction.type === TransactionType.INCOME) return true;
            if (filters.activeTransfer && transaction.type === TransactionType.TRANSFER) return true;
            return false;
        }
        return true;
    })
    const transactionGroups: GroupedStructure<Transaction> = groupAndSort(filteredTransactions, "date", false)

    var cont = 0
    const Render = Object.entries(transactionGroups).map(
        ([groupName, items]) => {
            if (maxResult && cont === maxResult) return;
            return (
                <React.Fragment key={groupName}>
                    <TransactionsListLabel dateString={groupName} />
                    <div className="items">
                        {items.map((transaction) => {
                            if (maxResult && cont === maxResult) return;
                            cont++;
                            return (
                                <div key={transaction.id} className={`item ${transaction.type === TransactionType.TRANSFER ? "transfer" : transaction.type === TransactionType.INCOME ? "income" : transaction.type === TransactionType.EXPENCE ? "expence" : transaction.type === TransactionType.MANAGEASSETS ? "manageassets" : ""}`}>
                                    <TransactionItem data={data} transaction={transaction} />
                                </div>
                            )
                        })}
                    </div>
                </React.Fragment>
            )
        }
    );

    return <>{Render}</>;

}

function TransactionsList({ data, controllers }: { data: DataContext, controllers: ControllersContext }) {
    const i18n = useContext(TranslationContext);

    const [filtering, setFiltering] = useState(false);

    const [allUnselected, setAllUnselected] = useState(true);
    const [activeExpence, setActiveExpence] = useState(false);
    const [activeIncome, setActiveIncome] = useState(false);
    const [activeTransfer, setActiveTransfer] = useState(false);

    // State for loading older transactions
    const [olderTransactions, setOlderTransactions] = useState<Transaction[]>([]);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [allTransactions, setAllTransactions] = useState<Transaction[]>([...data.transactions])

    const filters: FilterContext = {
        activeExpence, activeIncome, activeTransfer
    }

    useEffect(() => {
        if (activeExpence || activeIncome || activeTransfer) {
            setAllUnselected(false);
            setFiltering(true);
        }
        else {
            setAllUnselected(true);
            setFiltering(false);
        }
    }, [activeExpence, activeIncome, activeTransfer])

    useEffect(() => {
        setAllTransactions([...data.transactions, ...olderTransactions])
        data.setTransactions([...data.transactions, ...olderTransactions])
    }, [olderTransactions])

    // Load older transactions function
    const loadOlderTransactions = async () => {
        if (loadingMore || !hasMore || allTransactions.length === 0) return;

        setLoadingMore(true);

        // Get the oldest transaction date from current list
        const oldestTransaction = allTransactions[allTransactions.length - 1];
        const oldestDate = (oldestTransaction.date as unknown as Timestamp).toDate();

        const olderTransactionLimit = 50

        // Load more transactions before that date
        const older = await controllers.transactionsController.GetOlderTransactions(
            data.user.uid,
            oldestDate,
            olderTransactionLimit
        );

        if (older.length < olderTransactionLimit) {
            setHasMore(false);

            if (older.length > 0)
                setOlderTransactions([...olderTransactions, ...older]);
            console.log("length:", older.length)
            console.log("older:", older)
            console.log("all:", allTransactions)
        }

        setLoadingMore(false);
    };

    return (
        <>
            <h3 className="page-title">Transactions</h3>
            <div className="body">
                <div className="filter-wrapper">
                    <ul className="filter-type">
                        <li className={`${!allUnselected && activeExpence ? "active" : ""}`} onClick={() => setActiveExpence(!activeExpence)}>{i18n.t(TransactionType.EXPENCE)}</li>
                        <li className={`${!allUnselected && activeIncome ? "active" : ""}`} onClick={() => setActiveIncome(!activeIncome)}>{i18n.t(TransactionType.INCOME)}</li>
                        <li className={`${!allUnselected && activeTransfer ? "active" : ""}`} onClick={() => setActiveTransfer(!activeTransfer)}>{i18n.t(TransactionType.TRANSFER)}</li>
                    </ul>
                    <div className="filter-icon">
                        <LuSettings2 />
                        {filtering && <div className="filter-icon-badge"></div>}
                    </div>
                </div>
                <div id="transactions-list">
                    {<TransactionsRender data={data} showAll={allUnselected} filters={filters} />}
                    {hasMore && allTransactions.length > 0 && (
                        <div style={{ padding: '1rem', textAlign: 'center' }}>
                            <button
                                onClick={loadOlderTransactions}
                                disabled={loadingMore}
                                className="btn btn-outline-secondary w-100"
                                style={{ marginBottom: '80px' }}
                            >
                                {loadingMore ? i18n.t("default.loading") || 'Loading...' : i18n.t("default.buttons.loadmore") || 'Load Older Transactions'}
                            </button>
                        </div>
                    )}
                </div>
                <CreateTransactionButton />
            </div>
        </>
    )
}

function EmptyTransactionsList({ theme }: any) {
    const i18n = useContext(TranslationContext);

    return (
        <>
            <h3 className="page-title">{i18n.t("pages.transactions.title")}</h3>
            <div className="empty-content mt-5">
                <div className={`title fs-1 fw-bolder ${(theme === "dark") ? "text-white-50" : "text-black-50"}`}>Hey! It seems like there's nothing to show here</div>
                <Link to={"./create"} className="btn border btn-primary rounded-4 shadow-sm btn-lg px-3 py-3 w-100 d-flex gap-3 justify-content-center mt-4">
                    <LuPlus style={{ marginTop: 3 }} />
                    <div className='small text-center'>Add your first transaction</div>
                </Link>
            </div>
        </>
    )
}

export function CreateTransactionButton() {
    const i18n = useContext(TranslationContext);

    return (
        <Link to={"/transactions/create"} id="create-transaction-button">
            <div className="icon"><LuPlus /></div>
            <div className="text">{i18n.t("default.buttons.newtransaction")}</div>
        </Link>
    );
}

export default function Transactions() {
    const { data, controllers } = useContext<PersonalAreaContextInterface>(PersonalAreaContext);

    const user: User = data.user;
    const transactions: Transaction[] = data.transactions;

    const theme = useContext(ThemeContext);
    //const [processing, setProcessing] = useState(false);

    return (
        <>
            <div id="transactions">
                {(user.firstAccess)
                    ? <SplashFirstAccess userName={user.fullName.split(" ")[0]} />
                    : (transactions.length > 0)
                        ? <TransactionsList data={data} controllers={controllers} />
                        : <EmptyTransactionsList theme={theme} />
                }
            </div>
        </>
    );
}