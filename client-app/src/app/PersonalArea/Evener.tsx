import { useContext } from "react";
import { SplashFirstAccess } from "../../assets/components/SplashFirstScreen";
import User from "../../assets/model/User";
import { PersonalAreaContext, PersonalAreaContextInterface } from "../PersonalArea";

export default function Evener() {
    const { data, controllers } = useContext<PersonalAreaContextInterface>(PersonalAreaContext);

    const user: User = data.user;

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