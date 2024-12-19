import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import User from "../../../assets/model/User";
import Asset from "../../../assets/model/Asset";
import Loader from "../../../assets/components/Loader";
import { UpdateFavourite } from "../../../assets/controllers/Assets";
import { BackButton } from "../../../assets/components/Utils";
import { useNavigate } from "react-router-dom";

interface AssetDetailProps {
    user: User,
    asset: Asset
}

export default function AssetDetail(props: any) {
    const user: User = props.user;
    const asset: Asset = props.asset;
    const [processing, setProcessing] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        async function initialize() {


        }
        initialize();
    }, [user, asset]);

    const handlerFavourite = (asset: Asset) => {
        UpdateFavourite(asset.uid, (asset.id as unknown) as string, !asset.starred);
    }

    const backHandler = () => {
        navigate(-1);
    }

    return (
        <>
            <div id="AssetDetail">
                <div>
                    <div className="d-flex gap-3 mb-5">
                        <BackButton handler={backHandler} />
                        <div className="page-title" style={{ marginTop: -.5 }}>{asset.name}</div>
                    </div>
                </div>
                <div>
                    <div className="mb-3">
                        <label className="form-label">Asset name</label>
                        {/*<input type="text" className="form-control" name="new-asset-name" placeholder={'e.g. "Revolut"'} autoComplete="off" required />*/}
                    </div>
                    <button type='submit' className="btn w-100 border fw-bold text-center btn-primary rounded-pill shadow-sm align-items-center" style={{ padding: "1rem 0" }}>
                        Create
                    </button>
                </div>
            </div>
            {processing && <Loader selector="login" />}
        </>
    );
}