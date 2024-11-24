import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";

export function BackButton(props: any) {
    return (
        <Link to={props.link} id="back-arrow" style={{textDecoration: "none"}}>
            <span style={{fontSize: "23px", marginTop: "-4px"}}>
                <IoIosArrowBack />
            </span> Back
        </Link>
    );
}