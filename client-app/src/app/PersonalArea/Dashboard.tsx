import { useEffect, useState } from "react";
import User from "../../assets/model/User";
import { SplashFirstAccess } from "../../assets/components/SplashFirstScreen";
import { currencyFormat } from "../../assets/libraries/Utils";
import { BsCashCoin } from "react-icons/bs";
import { PersonalAreaContext } from "../PersonalArea";
import { useOutletContext } from "react-router-dom";
import Asset from "../../assets/model/Asset";

export default function Dashboard() {
    const { data, controllers } = useOutletContext<PersonalAreaContext>();

    const user: User = data.user;
    const assets: Asset[] = data.assets;
    const [totalBalance, setTotalBalance] = useState(user.totalBalance);

    useEffect(() => {
        async function initialize() {
            if (assets.length > 0) {
                const contributingAssets = assets.filter(asset => !asset.hiddenFromTotal);
                var updatedTotalBalance = 0;
                if (contributingAssets.length > 0) {
                    updatedTotalBalance = contributingAssets.reduce((accumulator, asset) => accumulator + asset.balance, 0);
                }
                setTotalBalance(updatedTotalBalance);

                // if total balance doesn't correspond updates it.
                if (updatedTotalBalance !== totalBalance) {
                    console.log("Updated total balance");
                    controllers.userController.UpdateTotalBalance(updatedTotalBalance);
                }
            }
        }
        initialize();
    }, [assets, totalBalance]);

    return (
        <>
            <div id='dashboard'>
                {(user.firstAccess)
                    ? <SplashFirstAccess userName={user.fullName.split(" ")[0]} />
                    : <>
                        <h3 className="page-title" style={{ fontWeight: 300 }}>Hi, {user.fullName.split(" ")[0]}</h3>
                        <div className="total-balance">
                            <div>
                                <div className="label">Total balance</div>
                                <div className="balance">{(user.hiddenBalance) ? <span style={{ filter: "blur(4px)" }}>{currencyFormat(919)}</span> : currencyFormat(totalBalance)}</div>
                            </div>
                            <div className="icon"><BsCashCoin /></div>
                        </div>
                    </>
                }
            </div>
        </>
    );
}