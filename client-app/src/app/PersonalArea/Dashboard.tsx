import { useContext } from "react";
import { SplashFirstAccess } from "../../assets/components/SplashFirstScreen";
import { currencyFormat } from "../../assets/libraries/Utils";
import { PersonalAreaContext, PersonalAreaContextInterface } from "../PersonalArea";

import { BsCashCoin } from "react-icons/bs";
import { BalanceTrend } from "../../assets/components/charts/BalanceTrend";
import { Link } from "react-router-dom";
import { CreateTransactionButton, TransactionsRender } from "./Transactions";
import { ThemeContext, TranslationContext } from "../../App";
import { LuPlus } from "react-icons/lu";

export default function Dashboard() {
    const { data, controllers } = useContext<PersonalAreaContextInterface>(PersonalAreaContext);

    const user = data.user;
    const theme = useContext(ThemeContext);

    const i18n = useContext(TranslationContext);

    return (
        <>
            <div id='dashboard'>
                {(user.firstAccess)
                    ? <SplashFirstAccess userName={user.fullName.split(" ")[0]} />
                    : <>
                        {/*<h3 className="page-title" style={{ fontWeight: 300 }}>Hi, {user.fullName.split(" ")[0]}</h3>*/}
                        <div className="total-balance">
                            <div>
                                <div className="label">{i18n.t("pages.dashboard.totalbalance")}</div>
                                <div className="balance">{(user.hiddenBalance) ? <span style={{ filter: "blur(6px)" }}>{currencyFormat(919)}</span> : currencyFormat(user.totalBalance)}</div>
                            </div>
                            {/*<div className="icon"><BsCashCoin /></div>*/}
                        </div>
                        <Link to="/stats/balance-trend" className="balance-trend"><BalanceTrend /></Link>
                        <div className="recent-transactions">
                            <div className="label">{i18n.t("pages.dashboard.recenttransactions")}</div>
                            {(data.transactions.length > 0)
                                ? (
                                    <>
                                        <div id="transactions-list">
                                            <TransactionsRender data={data} controllers={controllers} maxResult={3} />
                                        </div>
                                        <CreateTransactionButton />
                                    </>
                                )
                                : (
                                    <div className="empty-content mt-4">
                                        <div className={`title fs-1 fw-bolder ${(theme === "dark") ? "text-white-50" : "text-black-50"}`}>Hey! It seems like there's nothing to show here</div>
                                        <Link to={"../transactions/create"} className="btn border btn-primary rounded-4 shadow-sm btn-lg px-3 py-3 w-100 d-flex gap-3 justify-content-center mt-3">
                                            <LuPlus style={{ marginTop: 3 }} />
                                            <div className='small text-center'>Add your first transaction</div>
                                        </Link>
                                    </div>
                                )
                            }
                        </div>
                    </>
                }
            </div>
        </>
    );
}