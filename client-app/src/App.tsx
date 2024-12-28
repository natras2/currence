import { HashRouter as Router, Route, Routes } from 'react-router-dom';

import Error from './Error';

import { PasswordForgotten, Logout, default as Login } from './app/Login';
import LandingPage from './app/LandingPage';
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
import { createContext, useEffect, useState } from 'react';
import AddTransaction from './app/PersonalArea/Transactions/AddTransaction';

export const ThemeContext = createContext('light');

function App() {
    const [theme, setTheme] = useState<string>('light');
    const [toggleTheme, setToggleTheme] = useState(false);

    useEffect(() => {
        const cachedThemePreference = localStorage.getItem("preferredTheme");
        if (!cachedThemePreference) {
            // Add listener to update styles
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => onSelectMode(e.matches ? 'dark' : 'light'));

            // Setup dark/light mode for the first time
            onSelectMode(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        }
        else {
            onSelectMode(cachedThemePreference);

            console.log("Setup from theme preference:", localStorage.getItem("preferredTheme"));
        }

        // Remove listener
        return () => {
            window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', () => {
            });
        }
    }, []);

    useEffect(() => {
        if (!toggleTheme) return;// Setup dark/light mode for the first time

        const targetTheme = (theme === "light") ? "dark" : "light";

        onSelectMode(targetTheme);
        localStorage.setItem("preferredTheme", targetTheme);
        console.log("Saved theme preference:", localStorage.getItem("preferredTheme"));

        setToggleTheme(false);

    }, [toggleTheme]);

    const onSelectMode = (theme: string) => {
        setTheme(theme);
        if (theme === 'dark') {
            document.documentElement.classList.add('dark-mode');
            document.documentElement.setAttribute("data-bs-theme", "dark");
            document.querySelector('meta[name="theme-color"]')!.setAttribute("content", "#333333");
            document.querySelector('meta[name="msapplication-TileColor"]')!.setAttribute("content", "#333333");
            document.body.classList.add('dark-mode');
        }
        else {
            document.documentElement.classList.remove('dark-mode');
            document.documentElement.removeAttribute("data-bs-theme");
            document.querySelector('meta[name="theme-color"]')!.setAttribute("content", "#fdfdfd");
            document.querySelector('meta[name="msapplication-TileColor"]')!.setAttribute("content", "#fdfdfd");
            document.body.classList.remove('dark-mode');
        }
    }

    return (
        <ThemeContext.Provider value={theme}>
            <Router>
                <Routes>
                    {/* Customer routes */}
                    <Route index element={<LandingPage />} />
                    <Route path='signup' element={<Signup />} />
                    <Route path='logout' element={<Logout />} />
                    <Route path='login'>
                        <Route index element={<Login />} />
                        <Route path='recover' element={<PasswordForgotten />} />
                    </Route>

                    <Route element={<PersonalArea />} >
                        <Route path='dashboard' element={<Dashboard />} />
                        <Route path='transactions'>
                            <Route index element={<Transactions />} />
                            <Route path='create' element={<AddTransaction />} />
                        </Route> 
                        <Route path='wallet'>
                            <Route index element={<Wallet />} />
                            <Route path='create' element={<AddAsset />} />
                            <Route path=':id' element={<AssetDetail />} />
                        </Route>
                        <Route path='evener' element={<Evener />} />
                        <Route path='stats' element={<Stats />} />
                        <Route path='settings' element={<Settings changeTheme={setToggleTheme}/>} />
                    </Route>

                    {/* Fallback error route */}
                    <Route path='*' element={<Error />} />
                </Routes>
            </Router>
        </ThemeContext.Provider>
    );
}

export default App;