import { useContext } from "react";
import { Link } from "react-router-dom";
import { SplashFirstAccess } from "../../assets/components/SplashFirstScreen";
import User from "../../assets/model/User";
import { PersonalAreaContext, PersonalAreaContextInterface } from "../PersonalArea";

export interface ChartData {
    id: number,
    value: number,
    label: string
}

export default function Stats() {
    const { data, controllers } = useContext<PersonalAreaContextInterface>(PersonalAreaContext);

    const user: User = data.user;
    
    return (
        <>
            <div id="stats">
                {(user.firstAccess)
                    ? <SplashFirstAccess userName={user.fullName.split(" ")[0]} />
                    : (<>
                        <h3 className="page-title">Stats</h3>
                        <div style={{marginTop: 30}}><Link to="./balance-trend" className="btn btn-secondary">Balance trend chart</Link></div>
                    </>)
                }
            </div>
        </>
    );
}