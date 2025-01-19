import { useContext, useEffect, useState } from "react";
import illustration from '../../assets/images/illustrations/favorite.svg'
import darkIllustration from '../../assets/images/illustrations/favorite_dark.svg'
import { SplashFirstAccess } from "../../assets/components/SplashFirstScreen";
import Asset from "../../assets/model/Asset";
import useLongPress, { currencyFormat } from "../../assets/libraries/Utils";
import Skeleton from "react-loading-skeleton";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { ControllersContext, DataContext, PersonalAreaContext } from "../PersonalArea";
import { ThemeContext, TranslationContext } from "../../App";
import { DynamicIcon } from "../../assets/components/Utils";

import { LuEyeOff } from "react-icons/lu";
import { LuPlus } from "react-icons/lu";

interface AssetItemType {
    data: DataContext,
    controllers: ControllersContext,
    asset: Asset
}

function AssetListItem({ data, controllers, asset }: AssetItemType) {
    const navigate = useNavigate();

    const onLongPressOnAsset = (assetId: string) => {
        alert(assetId);
    }
    const onClickOnAsset = (assetId: string) => {
        navigate("/wallet/" + assetId);
    }
    const longPressOnAsset = useLongPress(onLongPressOnAsset, onClickOnAsset, { delay: 500 }, asset.id);

    return (
        <span className="asset-wrapper">
            <div {...longPressOnAsset} className="asset">
                <div className="d-flex align-items-center">
                    {!!asset.attributes && <div className="asset-logo">
                        {(asset.attributes.sourceName !== "")
                            ? <img src={asset.attributes.logo} alt={asset.attributes.sourceName} className="source-logo" />
                            : <div className="type-icon">{<DynamicIcon lib={JSON.parse(asset.attributes.logo).lib} name={JSON.parse(asset.attributes.logo).name} />}</div>
                        }
                    </div>}
                    <div className="asset-name">{asset.name}</div>
                </div>
                <div className="d-flex gap-2">
                    <div className="asset-hidden-selector">{(asset.hiddenFromTotal) ? <LuEyeOff /> : ""}</div>
                    {/*<div className="asset-favorite-selector">{(asset.starred) ? <FaStar onClick={(e) => handlerFavourite(asset)} /> : <FaRegStar onClick={(e) => handlerFavourite(asset)} />}</div>*/}
                    <div className="asset-balance">{(data.user.hiddenBalance) ? <span style={{ filter: "blur(4px)" }}>{currencyFormat(919)}</span> : currencyFormat(asset.balance)}</div>
                </div>
            </div>
        </span>
    );
}

export default function Wallet() {
    const theme = useContext(ThemeContext);
    const { data, controllers } = useOutletContext<PersonalAreaContext>();

    const i18n = useContext(TranslationContext);

    const user = data.user;
    const assets = data.assets;
    const [starred, setStarred] = useState<Asset[]>([]);
    const [processing, setProcessing] = useState(true);

    useEffect(() => {
        async function initialize() {
            if (assets && assets.length > 0) {
                // Filter and set starred assets
                const starredAssets = assets.filter(asset => asset.starred);
                setStarred(starredAssets);
            }
            assets.sort((a, b) => b.balance - a.balance)
            setProcessing(false);
        }
        initialize();
    }, [assets]);

    return (
        <>
            <div id="wallet">
                {(user.firstAccess)
                    ? <SplashFirstAccess userName={user.fullName.split(" ")[0]} />
                    : (assets.length > 0)
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
                                                        <div className="no-favorites">
                                                            <img
                                                                src={(theme === "dark") ? darkIllustration : illustration}
                                                                alt='add favorite'
                                                                className='no-favorites-image'
                                                            />
                                                            <div className='no-favorites-label'>Add your favorites, they will appear here</div>
                                                        </div>
                                                    </span></>
                                                    : <>
                                                        {starred.map((asset, i) => {
                                                            return (
                                                                <span key={i}>
                                                                    <Link to={"./" + asset.id} style={{ textDecoration: 'none' }} className="favorite">
                                                                        <div className="d-flex align-items-center gap-2">
                                                                            {!!asset.attributes && <div className="asset-logo">
                                                                                {(asset.attributes.sourceName !== "")
                                                                                    ? <img src={asset.attributes.logo} alt={asset.attributes.sourceName} className="source-logo" />
                                                                                    : <div className="type-icon">{<DynamicIcon lib={JSON.parse(asset.attributes.logo).lib} name={JSON.parse(asset.attributes.logo).name}/>}</div>
                                                                                }
                                                                            </div>}
                                                                            <div>
                                                                                <div className="asset-name">{asset.name}</div>
                                                                                <div className="asset-type">{!!asset.attributes && i18n.t(asset.attributes.type + "short")}</div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="asset-balance">{currencyFormat(asset.balance)}</div>
                                                                    </Link>
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
                                            {assets.map((asset, i) => {
                                                return <AssetListItem key={i} data={data} controllers={controllers} asset={asset} />;
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )
                        : (
                            <>
                                <h3 className="page-title">Wallet</h3>
                                <div className="empty-content mt-5">
                                    <div className={`title fs-1 fw-bolder ${(theme === "dark") ? "text-white-50" : "text-black-50"}`}>Hey! It seems like there's nothing to show here</div>
                                    <Link to={"./create"} className="btn border btn-primary rounded-4 shadow-sm btn-lg px-3 py-3 w-100 d-flex gap-3 justify-content-center mt-4">
                                        <LuPlus style={{ marginTop: 3 }} />
                                        <div className='small text-center'>Add your first asset</div>
                                    </Link>
                                </div>
                            </>

                        )
                }
            </div>
        </>
    );
}