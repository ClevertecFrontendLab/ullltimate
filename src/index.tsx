import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './app';

import 'normalize.css';
import './index.css';
import 'antd/dist/antd.css';

const domNode = document.getElementById('root') as HTMLDivElement;
const root = createRoot(domNode);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
