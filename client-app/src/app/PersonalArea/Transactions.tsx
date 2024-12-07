import { SplashFirstAccess } from "../../assets/components/SplashFirstScreen";
import User from "../../assets/model/User";

export default function Transactions(props: any) {
    const user: User = props.user;

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