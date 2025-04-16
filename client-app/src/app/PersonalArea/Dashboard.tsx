import { useContext } from "react";
import { SplashFirstAccess } from "../../assets/components/SplashFirstScreen";
import { currencyFormat } from "../../assets/libraries/Utils";
import { PersonalAreaContext, PersonalAreaContextInterface } from "../PersonalArea";

import { BsCashCoin } from "react-icons/bs";
import { BalanceTrend } from "../../assets/components/charts/BalanceTrend";

export default function Dashboard() {
    const { data, controllers } = useContext<PersonalAreaContextInterface>(PersonalAreaContext);

    const user = data.user;

    return (
        <>
            <div id='dashboard'>
                {(user.firstAccess)
                    ? <SplashFirstAccess userName={user.fullName.split(" ")[0]} />
                    : <>
                        {/*<h3 className="page-title" style={{ fontWeight: 300 }}>Hi, {user.fullName.split(" ")[0]}</h3>*/}
                        <div className="total-balance">
                            <div>
                                <div className="label">Total balance</div>
                                <div className="balance">{(user.hiddenBalance) ? <span style={{ filter: "blur(6px)" }}>{currencyFormat(919)}</span> : currencyFormat(user.totalBalance)}</div>
                            </div>
                            {/*<div className="icon"><BsCashCoin /></div>*/}
                        </div>
                        <div className="balance-trend"><BalanceTrend /></div>
                    </>
                }
            </div>
        </>
    );
}