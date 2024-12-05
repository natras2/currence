import { useEffect, useState } from "react";
import User from "../../assets/model/User";
import { GetUserAssets } from "../../assets/controllers/Assets";
import illustration from '../../assets/images/illustrations/splash-first-access.svg'

export function SplashFirstAccess() {
    return (
        <>
            <div id="splash-first-access-illustration">
                    <img
                        src={illustration}
                        className='illustration'
                        alt='welcome on currence'
                        width='100%'
                    />
            </div>
            <div id="splash-first-access">
                <div>
                    <div className="title">Welcome aboard!</div>
                    <div className="subtitle">It seems this it your first time up here! Welcome :)</div>
                </div>
                <div className="button">
                    <button onClick={() => {}} className="btn border btn-primary rounded-4 shadow-sm btn-lg px-3 py-3 w-100">
                        <div className='small text-center fw-bold'>Add your first Asset</div>
                    </button>
                </div>
            </div>
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
                <h3 className="page-title" style={{ fontWeight: 300 }}>Hi, {user.fullName.split(" ")[0]}</h3>
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