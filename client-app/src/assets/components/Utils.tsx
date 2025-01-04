import { TiArrowLeft } from "react-icons/ti";
import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";

export function BackButton(props: any) {
    return (
        <Link to={props.link} id="back-arrow" onClick={(props.handler) ? props.handler : ""} style={{textDecoration: "none", position: "relative", top: "-1rem"}}>
            <span style={{fontSize: "40px", marginLeft: -9}}>
                {(props.close)
                    ? <IoClose style={{fontSize: 30, marginRight: 10}}/>
                    : <TiArrowLeft />
                }
            </span>
        </Link>
    );
}