import { useEffect, useState } from "react";
import User from "../../assets/model/User";
import { GetUserAssets } from "../../assets/controllers/Assets";
import { SplashFirstAccess } from "../../assets/components/SplashFirstScreen";
import { currencyFormat } from "../../assets/libraries/Utils";
import { UpdateTotalBalance } from "../../assets/controllers/Users";
import { BsCashCoin } from "react-icons/bs";


export default function Dashboard(props: any) {
    const user: User = props.user;
    const [totalBalance, setTotalBalance] = useState(user.totalBalance);

    useEffect(() => {
        async function initialize() {
            const retrievedAssets = await GetUserAssets(user.uid);
            if (retrievedAssets) {
                const contributingAssets = retrievedAssets.filter(asset => !asset.hiddenFromTotal);
                const updatedTotalBalance = contributingAssets.reduce((accumulator, asset) => accumulator + asset.balance, 0);
                setTotalBalance(updatedTotalBalance);

                // if total balance doesn't correspond updates it.
                if (updatedTotalBalance !== totalBalance)
                    await UpdateTotalBalance(user.uid, updatedTotalBalance);

            }
        }
        initialize();
    }, [user, totalBalance]);

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