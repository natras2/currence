import { useEffect, useState } from "react";
import User from "../../assets/model/User";
import { GetUserAssets } from "../../assets/controllers/Assets";
import { SplashFirstAccess } from "../../assets/components/SplashFirstScreen";

export default function Dashboard(props: any) {
    const user: User = props.user;
    const [noAssets, setNoAssets] = useState(false);

    useEffect(() => {
        async function initialize() {
            const retrievedAssets = await GetUserAssets(user.uid);
            if (!retrievedAssets) {
                setNoAssets(true);
            }
            else {

            }
        }
        initialize();
    }, [user]);

    return (
        <>
            <div id='dashboard'>
                {(user.firstAccess)
                    ? <SplashFirstAccess userName={user.fullName.split(" ")[0]}/>
                    : (<>
                        <h3 className="page-title" style={{ fontWeight: 300 }}>Hi, {user.fullName.split(" ")[0]}</h3>
                    </>)
                }
            </div>
        </>
    );
}