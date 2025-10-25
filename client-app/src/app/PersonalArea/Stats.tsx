import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SplashFirstAccess } from "../../assets/components/SplashFirstScreen";
import User from "../../assets/model/User";
import { PersonalAreaContext, PersonalAreaContextInterface } from "../PersonalArea";
import i18n from "../../i18nConfig";
import { FaChevronRight, FaFilter } from "react-icons/fa6";
import { GrClose } from "react-icons/gr";
import { AnimatePresence, motion } from "framer-motion";

export interface ChartData {
    id: number,
    value: number,
    label: string
}

function PeriodSelector({ period, setPeriod }: {
    period: 0 | 7 | 30 | 90 | 365,
    setPeriod: Dispatch<SetStateAction<0 | 7 | 30 | 90 | 365>>
}) {
    const [isOpen, setIsOpen] = useState(false)

    const periodText = (period: 0 | 7 | 30 | 90 | 365) => {
        switch (period) {
            case 0: return i18n.t("default.glossary.overview");
            case 7: return ("7 " + i18n.t("default.date.day.p"));
            case 30: return ("30 " + i18n.t("default.date.day.p"));
            case 90: return ("90 " + i18n.t("default.date.day.p"));
            case 365: return ("1 " + i18n.t("default.date.year.s"));

            default: return "";
        }

    }

    const SelectedPeriod = () => (
        <motion.div
            className="active-selector-item"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: .5 } }}
            exit={{ opacity: 0 }}
        >
            {periodText(period)}
        </motion.div>
    )

    return (
        <>
            <div className={`period-selector-wrapper ${isOpen ? "open" : "close"}`} onClick={isOpen ? undefined : () => { setIsOpen(!isOpen) }}>
                <div className="active-selector">
                    <AnimatePresence>
                        <SelectedPeriod />
                        <div className="dummy"></div>
                        <motion.div
                            className="close-button"
                            onClick={!isOpen ? undefined : () => { setIsOpen(!isOpen) }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, transition: { duration: .5 } }}
                            exit={{ opacity: 0 }}
                        >
                            {
                                isOpen ? <GrClose /> : <FaChevronRight />
                            }
                        </motion.div>
                    </AnimatePresence>
                </div>
                <div className="filters">
                    <div className={`period-filter wide ${period === 0 ? "active" : ""}`}>
                        <div className={`selector ${period === 0 ? "active" : ""} ${period === 7 || period === 30 || period === 90 || period === 365 ? "grey" : ""}`} onClick={() => setPeriod(0)}>{periodText(0)}</div>
                    </div>
                    <div className={`period-filter ${period === 7 || period === 30 || period === 90 ? "active" : ""}`}>
                        <div className={`selector ${period === 7 ? "active" : ""}`} onClick={() => setPeriod(7)}>{periodText(7)}</div>
                        <div className={`selector ${period === 30 ? "active" : ""} ${period === 365 || period === 0 ? "grey" : ""}`} onClick={() => setPeriod(30)}>{periodText(30)}</div>
                        <div className={`selector ${period === 90 ? "active" : ""}`} onClick={() => setPeriod(90)}>{periodText(90)}</div>
                    </div>
                    <div className={`period-filter wide ${period === 365 ? "active" : ""}`}>
                        <div className={`selector ${period === 365 ? "active" : ""} ${period === 7 || period === 30 || period === 90 || period === 0 ? "grey" : ""}`} onClick={() => setPeriod(365)}>{periodText(365)}</div>
                    </div>
                    <div className="period-filter wide">
                        <div className={`selector p-0`} onClick={() => { }}><FaFilter style={{ width: 35 }} /></div>
                    </div>
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