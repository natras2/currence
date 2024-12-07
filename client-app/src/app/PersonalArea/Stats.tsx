import { SplashFirstAccess } from "../../assets/components/SplashFirstScreen";
import User from "../../assets/model/User";

export default function Stats(props: any) {
    const user: User = props.user;

    return (
        <>
            <div id="stats">
                {(user.firstAccess)
                    ? <SplashFirstAccess userName={user.fullName.split(" ")[0]} />
                    : (<>
                        <h3 className="page-title">Stats</h3>
                    </>)
                }
            </div>
        </>
    );
}