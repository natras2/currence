import { useContext } from "react";
import { Link } from "react-router-dom";
import { SplashFirstAccess } from "../../assets/components/SplashFirstScreen";
import User from "../../assets/model/User";
import { PersonalAreaContext, PersonalAreaContextInterface } from "../PersonalArea";
import Transaction from "../../assets/model/Transaction";
import { ThemeContext } from "../../App";

import { LuPlus } from "react-icons/lu";

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
                        ? (
                            <>
                                <h3 className="page-title">Transactions</h3>
                                <div className="body">
                                    <div className="transactions-list">
                                        <div className="label">Today</div>
                                        <div className="items">
                                            {
                                                transactions.map((transaction, i) => {
                                                    return <div key={i}>{transaction.description}</div>;
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                            </>
                        )
                        : (
                            <>
                                <h3 className="page-title">Transactions</h3>
                                <div className="empty-content mt-5">
                                    <div className={`title fs-1 fw-bolder ${(theme === "dark") ? "text-white-50" : "text-black-50" }`}>Hey! It seems like there's nothing to show here</div>
                                    <Link to={"./create"} className="btn border btn-primary rounded-4 shadow-sm btn-lg px-3 py-3 w-100 d-flex gap-3 justify-content-center mt-4">
                                        <LuPlus style={{ marginTop: 3 }} />
                                        <div className='small text-center'>Add your first transaction</div>
                                    </Link>
                                </div>
                            </>

                        )
                }
            </div>
        </>
    );
}