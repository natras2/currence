import { useOutletContext } from "react-router-dom";
import { SplashFirstAccess } from "../../assets/components/SplashFirstScreen";
import User from "../../assets/model/User";
import { PersonalAreaContext } from "../PersonalArea";

export default function Transactions() {
    const { data, controllers } = useOutletContext<PersonalAreaContext>();

    const user: User = data.user;

    return (
        <>
            <div id="transactions">
                {(user.firstAccess)
                    ? <SplashFirstAccess userName={user.fullName.split(" ")[0]} />
                    : (<>
                        <h3 className="page-title">Transactions</h3>
                    </>)
                }
            </div>
        </>
    );
}