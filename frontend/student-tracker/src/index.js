import React from 'react';
import { createRoot } from 'react-dom/client'; // Updated import
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles.css';

// Get the root element
const container = document.getElementById('root');
// Create a root
const root = createRoot(container);
// Render the app
root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);