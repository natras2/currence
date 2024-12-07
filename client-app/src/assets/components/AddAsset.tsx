import CurrencyInput from "react-currency-input-field";
import { BackButton } from "./Utils";
import { useLocation } from "react-router-dom";

export default function AddAsset(props: any) {
    return (
        <div id="AddAsset" className="callout page">
            <div>
                <BackButton handler={props.backHandler}/>
                <div className="Title">Hi there</div>
                <CurrencyInput
                    id="new-asset-balance"
                    name="new-asset-balance"
                    placeholder="€ 0,00"
                    prefix="€ "
                    decimalsLimit={2}
                    onValueChange={(value, name, values) => console.log(value, name, values)}
                />
            </div>
        </div>
    );
}