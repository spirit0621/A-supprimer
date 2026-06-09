import { api } from '../api.js';
import { navigateTo } from '../router.js';
import { ui } from '../ui.js';

export function renderLogin(container) {
    container.innerHTML = `
        <div class="full-center">
            <div class="login-card">
                <div class="login-logo"><i class="fa-solid fa-calculator"></i></div>
                <h2 class="text-xl font-bold text-center mb-6">Connexion PayMaster Pro</h2>
                <form id="login-form">
                    <div class="form-group">
                        <label class="form-label">Identifiant</label>
                        <input type="text" id="username" class="form-control" placeholder="admin ou jean" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Mot de passe</label>
                        <input type="password" id="password" class="form-control" placeholder="••••••••" required>
                    </div>
                    <button type="submit" class="btn btn-primary w-full mt-4 p-6">Se connecter</button>
                </form>
            </div>
        </div>
    `;
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const success = await api.login(document.getElementById('username').value, document.getElementById('password').value);
        if (success) navigateTo('dashboard');
        else ui.showToast('Erreur de connexion', 'error');
    });
}
