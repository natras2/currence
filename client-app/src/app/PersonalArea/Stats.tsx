import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SplashFirstAccess } from "../../assets/components/SplashFirstScreen";
import User from "../../assets/model/User";
import { PersonalAreaContext, PersonalAreaContextInterface } from "../PersonalArea";
import i18n from "../../i18nConfig";
import { FaChevronRight, FaFilter } from "react-icons/fa6";
import { GrClose } from "react-icons/gr";

export interface ChartData {
    id: number,
    value: number,
    label: string
}

function PeriodSelector({period, setPeriod}: {
    period: 0 | 7 | 30 | 90 | 365 | 0,
    setPeriod: Dispatch<SetStateAction<0 | 7 | 30 | 90 | 365 | 0>>
}) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <div className={`period-selector-wrapper ${isOpen ? "open" : "close"}`} onClick={isOpen ? undefined : () => {setIsOpen(!isOpen)}}>
                <div className={`period-selector ${period === 0 ? "active" : ""}`}>
                    <div className={`selector ${period === 0 ? "active" : ""} ${period === 7 || period === 30 || period === 90 || period === 365 ? "grey" : ""}`} onClick={() => setPeriod(0)}>{i18n.t("default.glossary.overview")}</div>
                </div>
                <div className={`period-selector ${period === 7 || period === 30 || period === 90 ? "active" : ""}`}>
                    <div className={`selector ${period === 7 ? "active" : ""}`} onClick={() => setPeriod(7)}>7 {period === 7 ? i18n.t("default.date.day.p") : ""}</div>
                    <div className={`selector ${period === 30 ? "active" : ""} ${period === 365 || period === 0 ? "grey" : ""}`} onClick={() => setPeriod(30)}>30 {period === 30 || period === 365 || period === 0 ? i18n.t("default.date.day.p") : ""}</div>
                    <div className={`selector ${period === 90 ? "active" : ""}`} onClick={() => setPeriod(90)}>90 {period === 90 ? i18n.t("default.date.day.p") : ""}</div>
                </div>
                <div className={`period-selector ${period === 365 ? "active" : ""}`}>
                    <div className={`selector ${period === 365 ? "active" : ""} ${period === 7 || period === 30 || period === 90 || period === 0 ? "grey" : ""}`} onClick={() => setPeriod(365)}>1 {i18n.t("default.date.year.s")}</div>
                </div>
                <div className="period-selector">
                    <div className={`selector p-0`} onClick={() => { }}><FaFilter style={{ width: 35 }} /></div>
                </div>
                <div className="close-button" onClick={!isOpen ? undefined : () => {setIsOpen(!isOpen)}}>
                    {
                        isOpen ? <GrClose /> : <FaChevronRight />
                    }
                </div>
            </div>
        </>
    )
}
export default function Stats() {
    const { data, controllers } = useContext<PersonalAreaContextInterface>(PersonalAreaContext);

    const [period, setPeriod] = useState<7 | 30 | 90 | 365 | 0>(0)

    const user: User = data.user;

    return (
        <>
            <div id="stats">
                {(user.firstAccess)
                    ? <SplashFirstAccess userName={user.fullName.split(" ")[0]} />
                    : (<>
                        <h3 className="page-title">Stats</h3>
                        <PeriodSelector period={period} setPeriod={setPeriod} />
                        <div style={{ marginTop: 30 }}><Link to="./balance-trend" className="btn btn-secondary">Balance trend chart</Link></div>
                    </>)
                }
            </div>
        </>
    );
}