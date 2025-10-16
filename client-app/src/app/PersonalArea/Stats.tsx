import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { SplashFirstAccess } from "../../assets/components/SplashFirstScreen";
import User from "../../assets/model/User";
import { PersonalAreaContext, PersonalAreaContextInterface } from "../PersonalArea";
import i18n from "../../i18nConfig";
import { FaFilter } from "react-icons/fa6";

export interface ChartData {
    id: number,
    value: number,
    label: string
}

export default function Stats() {
    const { data, controllers } = useContext<PersonalAreaContextInterface>(PersonalAreaContext);

    const [period, setPeriod] = useState<7 | 30 | 90 | 365 | 0>(30)

    const user: User = data.user;

    return (
        <>
            <div id="stats">
                {(user.firstAccess)
                    ? <SplashFirstAccess userName={user.fullName.split(" ")[0]} />
                    : (<>
                        <h3 className="page-title">Stats</h3>
                        <div className="period-selector-wrapper">
                            <div className="period-selector">
                                <div className={`selector ${period === 7 ? "active" : ""}`} onClick={() => setPeriod(7)}>7 {period === 7 ? i18n.t("default.date.day.p") : ""}</div>
                                <div className={`selector ${period === 30 ? "active" : ""} ${period === 365 || period === 0 ? "grey" : ""}`} onClick={() => setPeriod(30)}>30 {period === 30 || period === 365 || period === 0 ? i18n.t("default.date.day.p") : ""}</div>
                                <div className={`selector ${period === 90 ? "active" : ""}`} onClick={() => setPeriod(90)}>90 {period === 90 ? i18n.t("default.date.day.p") : ""}</div>
                            </div>
                            <div className="period-selector">
                                <div className={`selector ${period === 365 ? "active" : ""}`} onClick={() => setPeriod(365)}>1 {i18n.t("default.date.year.s")}</div>
                            </div>
                            <div className="period-selector">
                                <div className={`selector p-0`} onClick={() => {}}><FaFilter/></div>
                            </div>
                        </div>
                        <div style={{ marginTop: 30 }}><Link to="./balance-trend" className="btn btn-secondary">Balance trend chart</Link></div>
                    </>)
                }
            </div>
        </>
    );
}