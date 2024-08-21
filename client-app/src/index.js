import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/css/style.css';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';

import App from './App';
import Error from './Error';

import { PasswordForgotten, default as Login } from './app/Login';
import Signup from './app/Signup';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Router>
            <Routes>
                {/* Customer routes */}
                <Route index element={<App />} />
                <Route path='login'>
                    <Route index element={<Login />} />
                    <Route path='recover' element={<PasswordForgotten />} />
                </Route>
                <Route path='signup' element={<Signup />} />

                {/* Fallback error route */}
                <Route path='*' element={<Error />} />
            </Routes>
        </Router>
    </React.StrictMode>
);
