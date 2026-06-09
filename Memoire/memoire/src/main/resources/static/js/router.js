import { state } from './state.js';
import { api } from './api.js';
import { renderNavbar } from './views/navbar.js';
import { renderLogin } from './views/login.js';
import { renderDashboard } from './views/dashboard.js';
import { renderEmployees } from './views/employees.js';
import { renderPayslips } from './views/payslips.js';
import { renderSimulator } from './views/simulator.js';
import { renderSettings } from './views/settings.js';

// --- Router ---
export function navigateTo(route) {
    window.location.hash = route;
}

export async function handleRoute() {
    const hash = window.location.hash.replace('#', '') || 'login';
    const container = document.getElementById('view-container');
    
    if (!state.user && hash !== 'login') {
        return navigateTo('login');
    }
    if (state.user && hash === 'login') {
        return navigateTo('dashboard');
    }

    renderNavbar();
    await api.fetchAll();

    switch(hash) {
        case 'login': renderLogin(container); break;
        case 'dashboard': renderDashboard(container); break;
        case 'employees': renderEmployees(container); break;
        case 'payslips': renderPayslips(container); break;
        case 'simulator': renderSimulator(container); break;
        case 'settings': renderSettings(container); break;
        default: navigateTo('dashboard');
    }
}
