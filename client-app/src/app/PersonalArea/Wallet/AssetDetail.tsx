import Asset from "../../../assets/model/Asset";
import { BackButton } from "../../../assets/components/Utils";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { ControllersContext, DataContext, PersonalAreaContext } from "../../PersonalArea";
import ErrorPage from "../../../Error";
import { currencyFormat } from "../../../assets/libraries/Utils";
import { useContext, useState } from "react";
import Loader from "../../../assets/components/Loader";
import { ThemeContext } from "../../../App";

import { FaRegStar, FaStar } from "react-icons/fa6";
import { LuEye, LuEyeOff } from "react-icons/lu";

interface DisplayAssetDetailType {
    data: DataContext,
    controllers: ControllersContext,
    asset: Asset,
    setDeleteProcessing: React.Dispatch<React.SetStateAction<boolean>>
}

function DisplayAssetDetail({ data, controllers, asset, setDeleteProcessing }: DisplayAssetDetailType) {
    const navigate = useNavigate();

    const backHandler = () => {
        navigate(-1);
    }

    const handlerFavorite = async () => {
        await controllers.assetsController.UpdateFavorite(asset.id!, !asset.starred);
    }

    const handlerHiddenFromTotal = async () => {
        await controllers.assetsController.UpdateHiddenFromTotal(asset.id!, !asset.hiddenFromTotal);
    }

    const handlerDeleteAsset = async () => {
        setDeleteProcessing(true);
        const result = await controllers.assetsController.DeleteAsset(asset.id!);
        if (result) {
            navigate("/wallet");
        }
        else {
            setDeleteProcessing(false);
        }
    }

    return (
        <>
            <div>
                <div className="d-flex justify-content-between">
                    <BackButton handler={backHandler} />
                    <div className="page-title" style={{ marginTop: 0 }}>{asset.name}</div>
                    <div style={{ width: 31 }}></div>
                </div>
                <div className="asset-balance">
                    <div className="asset-balance-wrapper">
                        <div className="label">Balance</div>
                        <div className="balance">{(data.user.hiddenBalance) ? <span style={{ filter: "blur(4px)" }}>{currencyFormat(919)}</span> : currencyFormat(asset.balance)}</div>
                    </div>
                </div>
                <div className="asset-actions">
                    <div className={`set-starred ${(asset.starred) ? "is-starred" : "is-not-starred"}`} onClick={handlerFavorite}>
                        {(!asset.starred)
                            ? <>
                                <div className="icon"><FaRegStar /></div>
                                <div className="label">Add to favorites</div>
                            </>
                            : <>
                                <div className="icon"><FaStar /></div>
                                <div className="label">Favorite</div>
                            </>
                        }
                    </div>
                    <div className={`set-hidden-from-total ${(asset.hiddenFromTotal) ? "is-hidden" : "is-not-hidden"}`} onClick={handlerHiddenFromTotal}>
                        {(asset.hiddenFromTotal)
                            ? <>
                                <div className="icon"><LuEyeOff /></div>
                                <div className="label">Hidden from total</div>
                            </>
                            : <>
                                <div className="icon"><LuEye /></div>
                                <div className="label">Hide from total</div>
                            </>
                        }
                    </div>
                </div>
            </div>
            <div>
                <button onClick={handlerDeleteAsset} className="btn w-100 btn-lg btn-outline-danger"><small>Delete asset</small></button>
            </div>
        </>
    );
}

export default function AssetDetail() {
    const [deleteProcessing, setDeleteProcessing] = useState(false);
    const { data, controllers } = useOutletContext<PersonalAreaContext>();
    const { id } = useParams();

    const theme = useContext(ThemeContext);

    const assets = data.assets;
    var rendered;

    if (!id) {
        console.log("No Asset ID");
        rendered = <ErrorPage />;
    }
    const currentAsset = assets.find((asset) => (asset.id === id))
    if (!currentAsset) {
        if (!deleteProcessing) {
            console.log("No Asset instance");
            rendered = <ErrorPage />;
        }
        else {
            rendered = <Loader theme={theme} selector="home" />
        }
    }
    else {
        rendered = <DisplayAssetDetail data={data} controllers={controllers} asset={currentAsset} setDeleteProcessing={setDeleteProcessing} />
    }

    return (
        <>
            <div id="asset-detail" className="callout page">
                {rendered}
            </div>
        </>
    );

}