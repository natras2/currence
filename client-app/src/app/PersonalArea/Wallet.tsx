import { useEffect, useState } from "react";
import User from "../../assets/model/User";
import { GetUserAssets, UpdateFavourite } from "../../assets/controllers/Assets";
import { FaPlus } from "react-icons/fa";
import { SplashFirstAccess } from "../../assets/components/SplashFirstScreen";
import Asset from "../../assets/model/Asset";
import { currencyFormat } from "../../assets/libraries/Utils";
import { FaRegStar } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import { LuEyeOff } from "react-icons/lu";

export default function Wallet(props: any) {
    const user: User = props.user;
    const [assets, setAssets] = useState<Asset[]>([]);
    const [starred, setStarred] = useState<Asset[]>([]);
    const [processing, setProcessing] = useState(true);

    useEffect(() => {
        async function initialize() {

            const retrievedAssets = await GetUserAssets(user.uid);
            if (retrievedAssets && retrievedAssets.length > 0) {
                setAssets(retrievedAssets);
                // Filter and set starred assets
                const starredAssets = retrievedAssets.filter(asset => asset.starred);
                setStarred(starredAssets);
            }
            setProcessing(false);
        }
        initialize();
    }, [user, assets]);

    const handlerFavourite = (asset: Asset) => {
        UpdateFavourite(asset.uid, (asset.id as unknown) as string, !asset.starred);
    }

    return (
        <>
            <div id="wallet">
                {(user.firstAccess)
                    ? <SplashFirstAccess userName={user.fullName.split(" ")[0]} />
                    : (user.totalBalance > 0)
                        ? (
                            <>
                                <h3 className="page-title">Wallet</h3>
                                <div className="body">
                                    <div className="starred">
                                        <div className="cards">
                                            {(processing)
                                                ? <><Skeleton /></>
                                                : <>{(starred && starred.length === 0)
                                                    ? <><span>
                                                        <div className="no-favourites">Add your favorites</div>
                                                    </span>
                                                    </>
                                                    : <>
                                                        {starred.map((asset, i) => {
                                                            return (
                                                                <span key={i}>
                                                                    <div className="favourite">{asset.name}</div>
                                                                </span>
                                                            )
                                                        })}
                                                    </>
                                                }</>
                                            }
                                        </div>
                                    </div>
                                    <div className="assets-list">
                                        <div className="label">My assets</div>
                                        <div className="items">
                                            {(processing)
                                                ? <><Skeleton /><Skeleton /></>
                                                : <>{
                                                    assets.map((asset, i) => {
                                                        return (
                                                            <span key={i}>
                                                                <div className="asset">
                                                                    <div className="asset-name">{asset.name}</div>
                                                                    <div className="d-flex gap-2">
                                                                        <div className="asset-hidden-selector">{(asset.hiddenFromTotal) ? <LuEyeOff /> : "" }</div>
                                                                        {<div className="asset-favourite-selector">{(asset.starred) ? <FaStar onClick={(e) => handlerFavourite(asset)} /> : <FaRegStar onClick={(e) => handlerFavourite(asset)} />}</div>}
                                                                        <div className="asset-balance">{(user.hiddenBalance) ? <span style={{filter: "blur(4px)"}}>{currencyFormat(919)}</span> : currencyFormat(asset.balance)}</div>
                                                                    </div>
                                                                </div>
                                                            </span>
                                                        )
                                                    })
                                                }</>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </>
                        )
                        : (
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
                }
            </div>
        </>
    );
}