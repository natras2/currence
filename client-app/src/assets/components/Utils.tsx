import { TiArrowLeft } from "react-icons/ti";
import { Link } from "react-router-dom";

export function BackButton(props: any) {
    return (
        <Link to={props.link} id="back-arrow" onClick={(props.handler) ? props.handler : ""} style={{textDecoration: "none", color: "#000080", position: "relative", top: "-1rem"}}>
            <span style={{fontSize: "40px", marginLeft: -9}}>
                <TiArrowLeft />
            </span>
        </Link>
    );
}