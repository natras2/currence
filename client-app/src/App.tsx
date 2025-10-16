import { HashRouter as Router, Route, Routes } from 'react-router-dom';

import Error from './Error';

import { PasswordForgotten, Logout, default as Login } from './app/Login';
import LandingPage from './app/LandingPage';
import Signup from './app/Signup';
import PersonalArea from './app/PersonalArea';
import Settings from './app/Settings';
import AddAsset, { AssetTypeSelector } from './app/PersonalArea/Wallet/AddAsset';
import AssetDetail from './app/PersonalArea/Wallet/AssetDetail';
import Dashboard from './app/PersonalArea/Dashboard';
import Transactions from './app/PersonalArea/Transactions';
import Wallet from './app/PersonalArea/Wallet';
import Evener from './app/PersonalArea/Evener';
import Stats from './app/PersonalArea/Stats';
import { createContext, useEffect, useState } from 'react';
import AddTransaction, { AddTransactionCategory, AssetsAllocationSetter, InvolvedAssetsSelector, TransactionCategorySelector, TransactionDateTimeSelector, TransactionNotesInput } from './app/PersonalArea/Transactions/AddTransaction';
import { useTranslation } from 'react-i18next';
import BalanceTrendPage from './app/PersonalArea/Stats/BalanceTrendPage';
import ServiceWorkerUpdate from './components/ServiceWorkerUpdate';

export const ThemeContext = createContext('light');
export const TranslationContext = createContext({} as any);

export interface TranslationContextType {
    t: any,
    i18n: any
}

function App() {
    const [theme, setTheme] = useState<string>('light');
    const [translationContext, setTranslationContext] = useState<TranslationContextType>();
    const [toggleTheme, setToggleTheme] = useState(false);

    const { t, i18n } = useTranslation();

    useEffect(() => {
        setTranslationContext({ t, i18n });
    }, [])


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
        <TranslationContext.Provider value={translationContext}>
            <ThemeContext.Provider value={theme}>
                <ServiceWorkerUpdate />
                <Router>
                    <Routes>
                        {/* App routes */}
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
                                <Route path='create' element={<AddTransaction />} >
                                    <Route path='select-category' >
                                        <Route index element={<TransactionCategorySelector />} />
                                        <Route path='create' element={<AddTransactionCategory />} />
                                    </Route>
                                    <Route path='select-asset' >
                                        <Route index element={<InvolvedAssetsSelector />} />
                                        <Route path='create' element={<AddAsset />}>
                                            <Route path='select-type' element={<AssetTypeSelector />} />
                                        </Route>
                                        <Route path='assets-allocation' element={<AssetsAllocationSetter/>} />
                                    </Route>
                                    <Route path='select-date' element={<TransactionDateTimeSelector />} />
                                    <Route path='add-notes' element={<TransactionNotesInput />} />
                                </Route>
                            </Route>
                            <Route path='wallet'>
                                <Route index element={<Wallet />} />
                                <Route path='create' element={<AddAsset />}>
                                    <Route path='select-type' element={<AssetTypeSelector />} />
                                </Route>
                                <Route path=':id' element={<AssetDetail />} />
                            </Route>
                            <Route path='evener' element={<Evener />} />
                            <Route path='stats' >
                                <Route index element={<Stats />} />
                                <Route path='balance-trend' element={<BalanceTrendPage />} />
                            </Route>
                            <Route path='settings' element={<Settings changeTheme={setToggleTheme} />} />
                        </Route>

                        {/* Fallback error route */}
                        <Route path='*' element={<Error />} />
                    </Routes>
                </Router>
            </ThemeContext.Provider>
        </TranslationContext.Provider>
    );
}

export default App;