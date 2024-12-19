import ReactDOM from 'react-dom/client';
import './assets/css/style.css';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';

import App from './App';
import Error from './Error';

import { PasswordForgotten, Logout, default as Login } from './app/Login';
import Signup from './app/Signup';
import PersonalArea from './app/PersonalArea';
import Settings from './app/Settings';
import AddAsset from './app/PersonalArea/Wallet/AddAsset';
import AssetDetail from './app/PersonalArea/Wallet/AssetDetail';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <Router>
        <Routes>
            {/* Customer routes */}
            <Route index element={<App />} />
            <Route path='signup' element={<Signup />} />
            <Route path='logout' element={<Logout />} />
            <Route path='login'>
                <Route index element={<Login />} />
                <Route path='recover' element={<PasswordForgotten />} />
            </Route>

            <Route path='dashboard' element={<PersonalArea page="Dashboard" />} />
            <Route path='transactions' element={<PersonalArea page="Transactions" />} />
            <Route path='wallet'>
                <Route index element={<PersonalArea page="Wallet" />} />
                <Route path='create' element={<AddAsset />} />
                <Route path=':id' element={<AssetDetail />} />
            </Route>
            <Route path='evener' element={<PersonalArea page="Evener" />} />
            <Route path='stats' element={<PersonalArea page="Stats" />} />
            <Route path='settings' element={<Settings />} />

            {/* Fallback error route */}
            <Route path='*' element={<Error />} />
        </Routes>
    </Router>
);
