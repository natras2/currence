import { useEffect, useState } from "react";
import User from "../../assets/model/User";
import { GetUserAssets } from "../../assets/controllers/Assets";

function SplashFirstAccess() {
    return (
        <>
            <h1>It seems this it your first time up here! Welcome :)</h1>
        </>
    );
}

export default function Dashboard(props: any) {
    const user: User = props.user;
    const [firstAccess, setFirstAccess] = useState(false);

    useEffect(() => {
        async function initialize() {
            const retrievedAssets = await GetUserAssets(user.uid);
            if (!retrievedAssets) {
                setFirstAccess(true);
            }
            else {

            }
        }
        initialize();
    }, [user]);

    return (
        <>
            <div id='dashboard'>
                <h3>Hi, {user.fullName.split(" ")[0]}</h3>
                {(firstAccess)
                    ? <SplashFirstAccess />
                    : (
                        <>

                        </>
                    )
                }
            </div>
        </>
    );
}