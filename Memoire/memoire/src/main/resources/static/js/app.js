import { state } from './state.js';
import { api } from './api.js';
import { ui } from './ui.js';
import { navigateTo, handleRoute } from './router.js';

// Expose variables globally so that inline onclick attributes in HTML templates can resolve them
window.state = state;
window.api = api;
window.ui = ui;
window.navigateTo = navigateTo;

window.addEventListener('hashchange', handleRoute);

// Handle initial routing based on current URL hash
handleRoute();

// Restore user session if stored in localStorage
async function init() {
    const saved = localStorage.getItem('paymaster_user');
    if (saved) {
        state.user = JSON.parse(saved);
        await api.fetchAll();
        handleRoute();
    }
}
init();
