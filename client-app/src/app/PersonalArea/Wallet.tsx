import { useEffect, useState } from "react";
import User from "../../assets/model/User";
import { GetUserAssets } from "../../assets/controllers/Assets";
import { FaPlus } from "react-icons/fa";
import { SplashFirstAccess } from "../../assets/components/SplashFirstScreen";

export default function Wallet(props: any) {
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
            <div id="wallet">
                {(user.firstAccess)
                    ? <SplashFirstAccess userName={user.fullName.split(" ")[0]}/>
                    : (noAssets)
                        ? (
                            <>
                                <h3 className="page-title">Wallet</h3>
                                <div className="empty-content mt-5">
                                    <div className="title fs-1 fw-bolder text-black-50">Hey! It seems like there's nothing to show here</div>
                                    <button onClick={() => { }} className="btn border btn-primary rounded-4 shadow-sm btn-lg px-3 py-3 w-100 d-flex gap-3 justify-content-center">
                                        <FaPlus style={{ marginTop: 3 }} />
                                        <div className='small text-center'>Add your first asset</div>
                                    </button>
                                </div>
                            </>

                        )
                        : (
                            <>
                                <h3 className="page-title">Wallet</h3>
                            </>
                        )
                }
            </div>
        </>
    );
}