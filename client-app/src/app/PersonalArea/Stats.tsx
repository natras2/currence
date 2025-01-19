import { Link, useOutletContext } from "react-router-dom";
import { SplashFirstAccess } from "../../assets/components/SplashFirstScreen";
import User from "../../assets/model/User";
import { PersonalAreaContext } from "../PersonalArea";

export interface ChartData {
    id: number,
    value: number,
    label: string
}

export default function Stats() {
    const { data, controllers } = useOutletContext<PersonalAreaContext>();

    const user: User = data.user;
    
    return (
        <>
            <div id="stats">
                {(user.firstAccess)
                    ? <SplashFirstAccess userName={user.fullName.split(" ")[0]} />
                    : (<>
                        <h3 className="page-title">Stats</h3>
                        <div style={{marginTop: 30}}><Link to="./wallet-composition" className="btn btn-secondary">Wallet composition chart</Link></div>
                    </>)
                }
            </div>
        </>
    );
}