import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { SplashFirstAccess } from "../../assets/components/SplashFirstScreen";
import User from "../../assets/model/User";
import { ControllersContext, DataContext, PersonalAreaContext, PersonalAreaContextInterface } from "../PersonalArea";
import Transaction, { TransactionType } from "../../assets/model/Transaction";
import { ThemeContext, TranslationContext } from "../../App";

import { LuPlus } from "react-icons/lu";
import { capitalize, capitalizeFirst, currencyFormat, getCurrentLocale, groupAndSort, GroupedStructure } from "../../assets/libraries/Utils";
import { defaultCategoryIconBase } from "../../assets/components/Utils";

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

export function TransactionsRender({ data, controllers }: {
    data: DataContext,
    controllers: ControllersContext
}) {
    const [visibleExpence, setVisibleExpence] = useState(true);
    const [visibleIncome, setVisibleIncome] = useState(true);
    const [visibleTransfer, setVisibleTransfer] = useState(true);
    
    const transactionGroups: GroupedStructure<Transaction> = groupAndSort(data.transactions, "date", false)

    const Render = Object.entries(transactionGroups).map(
        ([groupName, items]) => (
            <React.Fragment key={groupName}>
                <TransactionsListLabel dateString={groupName} />
                <div className="items">
                    {items.map((transaction, i) => (
                        <div key={i} className="item d-flex">
                            <TransactionItem data={data} transaction={transaction} />
                        </div>
                    ))}
                </div>
            </React.Fragment>
        )
    );

    return <>{Render}</>;

}

function TransactionsList(data: DataContext, controllers: ControllersContext) {
    const transactions: Transaction[] = data.transactions;

    return (
        <>
            <h3 className="page-title">Transactions</h3>
            <div className="body">
                <div id="transactions-list">
                    {<TransactionsRender data={data} controllers={controllers} />}
                </div>
            </div>
        </>
    )
}

function EmptyTransactionsList({ theme }: any) {
    return (
        <>
            <h3 className="page-title">Transactions</h3>
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