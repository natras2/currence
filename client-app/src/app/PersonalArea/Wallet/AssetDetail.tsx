import { useEffect, useState } from "react";
import Asset from "../../../assets/model/Asset";
import Loader from "../../../assets/components/Loader";
import { BackButton } from "../../../assets/components/Utils";
import { useLocation, useNavigate, useOutletContext, useParams, useSearchParams } from "react-router-dom";
import { PersonalAreaContext } from "../../PersonalArea";
import ErrorPage from "../../../Error";
import { currencyFormat } from "../../../assets/libraries/Utils";

interface DisplayAssetDetailType {
    asset: Asset
}

function DisplayAssetDetail({ asset }: DisplayAssetDetailType) {
    const navigate = useNavigate();
    const backHandler = () => {
        navigate(-1);
    }

    console.log(asset)

    return (
        <>
            <div>
                <div className="d-flex gap-3 mb-5">
                    <BackButton handler={backHandler} />
                    <div className="page-title" style={{ marginTop: -.5 }}>{asset.name}</div>
                </div>
            </div>
            <div>
                {currencyFormat(asset.balance)}
            </div>
        </>
    );
}

export default function AssetDetail() {
    const { data, controllers } = useOutletContext<PersonalAreaContext>();
    const { id } = useParams();

    const assets = data.assets;
    var rendered;

    if (!id) {
        console.log("No Asset ID");
        rendered = <ErrorPage />;
    }
    const currentAsset = assets.find((asset) => (asset.id === id))
    if (!currentAsset) {
        console.log("No Asset instance");
        rendered = <ErrorPage />;
    }
    else {
        rendered = <DisplayAssetDetail asset={currentAsset} />
    }


    const handlerFavourite = async (asset: Asset) => {
        await controllers.assetsController.UpdateFavourite((asset.id as unknown) as string, !asset.starred);
    }

    return (
        <>
            <div id="AssetDetail" className="callout page">
                {rendered}
            </div>
        </>
    );

}