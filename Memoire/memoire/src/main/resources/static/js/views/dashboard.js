import { state } from '../state.js';

export function renderDashboard(container) {
    const totalEmployees = state.employees.length;
    const totalPayroll = state.employees.reduce((acc, e) => acc + (e.baseSalary || 0), 0);
    const totalOvertime = state.employees.reduce((acc, e) => acc + (e.customValues ? (parseFloat(e.customValues['HEURES_SUP']) || 0) : 0), 0);
    
    container.innerHTML = `
        <div class="dashboard-hero">
            <div class="dashboard-hero-content">
                <h1 class="text-4xl font-bold mb-2">Bonjour, ${state.user.fullName.split(' ')[0]} 👋</h1>
                <p class="text-slate-300 text-lg">Prêt à gérer la paie de ce mois ? Voici un aperçu de votre activité.</p>
                <div class="mt-8 flex gap-4">
                    <button class="btn btn-primary" onclick="navigateTo('employees')" style="padding: 0.75rem 1.5rem;">Gérer les salariés</button>
                    <button class="btn" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color:white; padding: 0.75rem 1.5rem;" onclick="navigateTo('payslips')">Voir les bulletins</button>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-3 gap-6 mb-8">
            <div class="dashboard-stat-card">
                <div class="stat-icon users"><i class="fa-solid fa-user-group"></i></div>
                <div>
                    <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Effectif Total</p>
                    <h3 class="text-2xl font-bold text-slate-800">${totalEmployees} salariés</h3>
                </div>
            </div>
            <div class="dashboard-stat-card">
                <div class="stat-icon money"><i class="fa-solid fa-euro-sign"></i></div>
                <div>
                    <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Masse Salariale Base</p>
                    <h3 class="text-2xl font-bold text-slate-800">${totalPayroll.toLocaleString('fr-FR')} €</h3>
                </div>
            </div>
            <div class="dashboard-stat-card">
                <div class="stat-icon time"><i class="fa-solid fa-clock"></i></div>
                <div>
                    <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Heures Supplémentaires</p>
                    <h3 class="text-2xl font-bold text-slate-800">${totalOvertime} h</h3>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-8">
            <div class="alert alert-info" style="margin-bottom:0">
                <div class="flex gap-4">
                    <div class="text-2xl"><i class="fa-solid fa-bullhorn"></i></div>
                    <div>
                        <h4 class="font-bold mb-1">Note d'information (RH)</h4>
                        <p class="text-sm opacity-90">
                            La période de saisie des variables se termine le 25 du mois. 
                            Assurez-vous que toutes les primes exceptionnelles sont validées avant cette date pour l'export bancaire.
                        </p>
                        <button class="btn btn-ghost btn-sm mt-4 p-0 font-bold" style="text-decoration:underline">Consulter le calendrier →</button>
                    </div>
                </div>
            </div>
            
            <div class="recent-activity-card">
                <div class="activity-header">
                    <h4 class="font-bold text-slate-800">Actions Rapides</h4>
                </div>
                <div class="p-6 grid grid-cols-2 gap-4">
                    <button class="btn btn-ghost p-4 flex flex-col items-center gap-2 border border-slate-100 rounded-xl" onclick="ui.openEmployeeModal()">
                        <i class="fa-solid fa-user-plus text-blue-600 text-xl"></i>
                        <span class="text-xs font-bold text-slate-600">Ajouter Salarié</span>
                    </button>
                    <button class="btn btn-ghost p-4 flex flex-col items-center gap-2 border border-slate-100 rounded-xl" onclick="ui.openGenerateModal()">
                        <i class="fa-solid fa-wand-magic-sparkles text-purple-600 text-xl"></i>
                        <span class="text-xs font-bold text-slate-600">Générer Paie</span>
                    </button>
                    <button class="btn btn-ghost p-4 flex flex-col items-center gap-2 border border-slate-100 rounded-xl" onclick="navigateTo('simulator')">
                        <i class="fa-solid fa-calculator text-green-600 text-xl"></i>
                        <span class="text-xs font-bold text-slate-600">Simulateur</span>
                    </button>
                    <button class="btn btn-ghost p-4 flex flex-col items-center gap-2 border border-slate-100 rounded-xl" onclick="navigateTo('settings')">
                        <i class="fa-solid fa-sliders text-orange-600 text-xl"></i>
                        <span class="text-xs font-bold text-slate-600">Paramètres</span>
                    </button>
                </div>
            </div>
        </div>
    `;
}
