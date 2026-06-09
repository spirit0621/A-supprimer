import { state } from '../state.js';

export function renderNavbar() {
    const nav = document.getElementById('navbar');
    if (!state.user) {
        nav.classList.add('hidden');
        return;
    }
    nav.classList.remove('hidden');

    const isRH = state.user.role === 'RH';
    
    // Pour l'avatar aux initiales (Image 2: AR)
    const initials = state.user.fullName.split(' ').map(n=>n[0]).join('').toUpperCase();

    nav.innerHTML = `
        <div class="navbar-inner">
            <a href="#dashboard" class="nav-brand">
                <div class="nav-brand-icon"><i class="fa-solid fa-calculator"></i></div>
                <span>PayMaster <span style="color:#60a5fa">Pro</span></span>
            </a>
            <div class="nav-links">
                <a href="#dashboard" class="nav-link ${window.location.hash === '#dashboard' ? 'active' : ''}">
                    <i class="fa-solid fa-chart-pie"></i> <span>Accueil</span>
                </a>
                ${isRH ? `
                    <a href="#employees" class="nav-link ${window.location.hash === '#employees' ? 'active' : ''}">
                        <i class="fa-solid fa-users"></i> <span>Salariés</span>
                    </a>
                    <a href="#payslips" class="nav-link ${window.location.hash === '#payslips' ? 'active' : ''}">
                        <i class="fa-solid fa-file-invoice-dollar"></i> <span>Bulletins</span>
                    </a>
                    <a href="#simulator" class="nav-link ${window.location.hash === '#simulator' ? 'active' : ''}">
                        <i class="fa-solid fa-calculator"></i> <span>Simulateur</span>
                    </a>
                    <a href="#settings" class="nav-link ${window.location.hash === '#settings' ? 'active' : ''}">
                        <i class="fa-solid fa-sliders"></i> <span>Param.</span>
                    </a>
                ` : `
                    <a href="#payslips" class="nav-link ${window.location.hash === '#payslips' ? 'active' : ''}">
                        <i class="fa-solid fa-file-pdf"></i> <span>Mes Bulletins</span>
                    </a>
                `}
            </div>
            <div class="nav-profile">
                <div class="profile-avatar">${initials}</div>
                <span class="text-sm font-semibold text-white tracking-wide">${state.user.fullName}</span>
                <button class="logout-btn" onclick="api.logout()"><i class="fa-solid fa-power-off"></i></button>
            </div>
        </div>
    `;
}
