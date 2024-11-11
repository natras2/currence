import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/css/style.css';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';

import App from './App';
import Error from './Error';

import { PasswordForgotten, Logout, default as Login } from './app/Login';
import Signup from './app/Signup';
import Home from './app/Home';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Router>
        <Routes>
            {/* Customer routes */}
            <Route index element={<App />} />
            <Route path='auth'/>
                <Route index element={<Error />} />
                <Route path='signup' element={<Signup />} />
                <Route path='logout' element={<Logout />} />
                <Route path='login'>
                    <Route index element={<Login />} />
                    <Route path='recover' element={<PasswordForgotten />} />
                </Route>
            
            <Route path='home' element={<Home />} />

            {/* Fallback error route */}
            <Route path='*' element={<Error />} />
        </Routes>
    </Router>
);
