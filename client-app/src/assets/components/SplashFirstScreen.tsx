import illustration from '../../assets/images/illustrations/splash-first-access.svg'
import darkIllustration from '../../assets/images/illustrations/splash-first-access_dark.svg'
import { FaPlus } from "react-icons/fa6";
import Emoji from './Emoji';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { ThemeContext } from '../../App';

export function SplashFirstAccess(props: any) {
    const theme = useContext(ThemeContext);
    /*const [showAssetPage, setShowAssetPage] = useState(false);

    const showNewAssetPage = () => {
        setShowAssetPage(true); // Update state to show AddAsset
    };

    const hideNewAssetPage = () => {
        setShowAssetPage(false); // Update state to show AddAsset
    };

    if (showAssetPage) {
        // Render AddAsset if state is set to true
        return <AddAsset backHandler={hideNewAssetPage}/>;
    }*/
    return (
        <>
            <div id="splash-first-access-illustration">
                <img
                    src={(theme === "dark") ? darkIllustration : illustration}
                    className='illustration'
                    alt='welcome to currence'
                    width='100%'
                />
            </div>
            <div id="splash-first-access">
                <div>
                    <div className="title">Welcome aboard, {props.userName}!</div>
                    <div className="subtitle">We're thrilled to have you here! <Emoji symbol="🎉" />
                    </div>
                    <div className="body">
                        <p>This seems to be your first time setting things up, so let's get started on the right track.</p>
                        <p>To begin managing your finances, add your <strong>bank account</strong>, or <strong>payment card</strong>. This will be the first step toward gaining a clear view of your financial journey!</p>
                    </div>
                </div>
                <div>
                    <Link to={"/wallet/create"} className="btn border btn-primary rounded-4 shadow-sm btn-lg px-3 py-3 w-100 d-flex gap-3 justify-content-center border-0">
                        <FaPlus style={{ marginTop: 3 }} />
                        <div className='small text-center'>Add your first asset</div>
                    </Link>
                </div>
            </div>
        </>
    );
}