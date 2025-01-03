import ReactDOM from 'react-dom/client';
import './assets/css/style.css';

import './i18nConfig';

import App from './App';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(<App />);