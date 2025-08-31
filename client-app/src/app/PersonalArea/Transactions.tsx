import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SplashFirstAccess } from "../../assets/components/SplashFirstScreen";
import User from "../../assets/model/User";
import { ControllersContext, DataContext, PersonalAreaContext, PersonalAreaContextInterface } from "../PersonalArea";
import Transaction, { TransactionType } from "../../assets/model/Transaction";
import { ThemeContext, TranslationContext } from "../../App";

import { LuPlus, LuSettings2 } from "react-icons/lu";
import { capitalizeFirst, currencyFormat, getCurrentLocale, groupAndSort, GroupedStructure } from "../../assets/libraries/Utils";
import { defaultCategoryIconBase } from "../../assets/components/Utils";

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

    if (dateString === new Date().toISOString().split("T")[0])
        formatted = i18n.t("default.date.today")

    if (dateString === new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split("T")[0])
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

    return (<>
        <>
            <div className="d-flex align-items-center">
                <div className="transaction-icon">
                    {((!transaction.category.parent)
                        ? (defaultCategoryIconBase[JSON.parse(transaction.category.icon!).name as keyof typeof defaultCategoryIconBase])
                        : (defaultCategoryIconBase[JSON.parse(transaction.category.parent.icon!).name as keyof typeof defaultCategoryIconBase]))}
                </div>
                <div>
                    <div className="transaction-description">{transaction.description}</div>
                    <div className="transaction-category">{/*(i18n.t(transaction.type) as string).toUpperCase()} &middot; {*/(!transaction.category.i18n_selector || transaction.category.isUpdated) ? transaction.category.name : (transaction.category.i18n_selector.endsWith("other.name") ? i18n.t(transaction.category.i18n_selector.replace("other.name", "other.fullname")) : i18n.t(transaction.category.i18n_selector))}</div>
                </div>
            </div>
            <div className={`transaction-amount ${transaction.type === TransactionType.TRANSFER ? "transfer" : transaction.type === TransactionType.INCOME ? "income" : transaction.type === TransactionType.EXPENCE ? "expence" : transaction.type === TransactionType.MANAGEASSETS ? "manageassets" : ""}`}>{(data.user.hiddenBalance) ? <span style={{ filter: "blur(6px)" }}>{currencyFormat(919)}</span> : `${transaction.type === TransactionType.EXPENCE ? "- " : ""}${currencyFormat(transaction.amount)}`}</div>
        </>
    </>);
}

export function TransactionsRender({ data, controllers, showAll = true, filters, maxResult }: {
    data: DataContext,
    controllers: ControllersContext,
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
                            return (
                                <div key={cont++} className="item d-flex">
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

function TransactionsList(data: DataContext, controllers: ControllersContext) {
    const i18n = useContext(TranslationContext);

    const [filtering, setFiltering] = useState(false);

    const [allUnselected, setAllUnselected] = useState(true);
    const [activeExpence, setActiveExpence] = useState(false);
    const [activeIncome, setActiveIncome] = useState(false);
    const [activeTransfer, setActiveTransfer] = useState(false);

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

    const filters: FilterContext = {
        activeExpence, activeIncome, activeTransfer
    }

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
                    {<TransactionsRender data={data} controllers={controllers} showAll={allUnselected} filters={filters} />}
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
                        ? <TransactionsList {...data} {...controllers} />
                        : <EmptyTransactionsList theme={theme} />
                }
            </div>
        </>
    );
}