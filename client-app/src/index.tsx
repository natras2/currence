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
import Dashboard from './app/PersonalArea/Dashboard';
import Transactions from './app/PersonalArea/Transactions';
import Wallet from './app/PersonalArea/Wallet';
import Evener from './app/PersonalArea/Evener';
import Stats from './app/PersonalArea/Stats';

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

            <Route element={<PersonalArea />} >
                <Route path='dashboard' element={<Dashboard />} />
                <Route path='transactions' element={<Transactions />} />
                <Route path='wallet'>
                    <Route index element={<Wallet />} />
                    <Route path='create' element={<AddAsset />} />
                    <Route path=':id' element={<AssetDetail />} />
                </Route>
                <Route path='evener' element={<Evener />} />
                <Route path='stats' element={<Stats />} />
                <Route path='settings' element={<Settings />} />
            </Route>

            {/* Fallback error route */}
            <Route path='*' element={<Error />} />
        </Routes>
    </Router>
);
