import { SplashFirstAccess } from "../../assets/components/SplashFirstScreen";
import User from "../../assets/model/User";

export default function Evener(props: any) {
    const user: User = props.user;

    return (
        <>
            <div id="evener">
                {(user.firstAccess)
                    ? <SplashFirstAccess userName={user.fullName.split(" ")[0]} />
                    : (<>
                        <h3 className="page-title">Evener</h3>
                     </>)
                }
            </div>
        </>
    );
}