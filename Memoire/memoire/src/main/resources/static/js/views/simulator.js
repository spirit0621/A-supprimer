export function renderSimulator(container) {
    container.innerHTML = `
        <div class="page-header animate-fade-in-up">
            <h1 class="text-2xl font-bold">Simulateur de Paie</h1>
            <p class="text-slate-500">Calculez instantanément le passage du Brut au Net.</p>
        </div>
        
        <div class="grid grid-cols-2 gap-8 mt-8">
            <div class="simulator-card p-8 rounded-2xl animate-fade-in-up" style="animation-delay: 0.1s">
                <h3 class="font-bold text-slate-800 mb-6">Paramètres de calcul</h3>
                
                <div class="sim-input-group mb-6">
                    <label class="form-label text-xs uppercase tracking-wider text-slate-400 mb-2">Salaire Brut Annuel</label>
                    <div class="flex items-center gap-4">
                        <input type="number" id="sim-brut-annuel" class="text-3xl font-bold text-slate-800 w-full outline-none" value="35000">
                        <span class="text-2xl text-slate-300">€</span>
                    </div>
                </div>
                
                <div class="sim-input-group mb-8">
                    <label class="form-label text-xs uppercase tracking-wider text-slate-400 mb-2">Temps de travail</label>
                    <select id="sim-temps" class="w-full text-lg font-semibold text-slate-700 outline-none bg-transparent">
                        <option value="1">Temps plein (100%)</option>
                        <option value="0.8">Temps partiel (80%)</option>
                        <option value="0.5">Mi-temps (50%)</option>
                    </select>
                </div>
                
                <div class="alert alert-warning text-xs">
                    <i class="fa-solid fa-circle-info mr-2"></i> Estimation basée sur un profil cadre moyen. Les taux réels peuvent varier selon la convention collective.
                </div>
            </div>
            
            <div class="flex flex-col gap-6 animate-fade-in-up" style="animation-delay: 0.2s">
                <div class="sim-result-badge">
                    <p class="opacity-80 text-sm font-bold uppercase tracking-widest mb-1">Estimation Net Mensuel</p>
                    <h2 class="text-5xl font-black" id="sim-result-net">2 245 €</h2>
                </div>
                
                <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h4 class="font-bold text-slate-800 mb-4">Détails des retenues</h4>
                    <div class="space-y-3">
                        <div class="flex justify-between text-sm">
                            <span class="text-slate-500">Cotisations sociales (env. 22%)</span>
                            <span class="font-bold text-red-500" id="sim-deduct">- 670 €</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-slate-500">Impôt sur le revenu (estimé)</span>
                            <span class="font-bold text-red-400" id="sim-tax">- 120 €</span>
                        </div>
                        <div class="border-t border-slate-100 mt-4 pt-4 flex justify-between font-bold text-lg">
                            <span>Net après impôts</span>
                            <span class="text-green-600" id="sim-final">2 125 €</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const updateSim = () => {
        const brutAnnuel = parseFloat(document.getElementById('sim-brut-annuel').value) || 0;
        const ratio = parseFloat(document.getElementById('sim-temps').value);
        
        const brutMensuel = (brutAnnuel / 12) * ratio;
        const cotisations = brutMensuel * 0.22;
        const netMensuel = brutMensuel - cotisations;
        const tax = netMensuel * 0.05; // Simplified tax estimation
        
        document.getElementById('sim-result-net').innerText = `${Math.round(netMensuel).toLocaleString()} €`;
        document.getElementById('sim-deduct').innerText = `- ${Math.round(cotisations).toLocaleString()} €`;
        document.getElementById('sim-tax').innerText = `- ${Math.round(tax).toLocaleString()} €`;
        document.getElementById('sim-final').innerText = `${Math.round(netMensuel - tax).toLocaleString()} €`;
    };

    document.getElementById('sim-brut-annuel').oninput = updateSim;
    document.getElementById('sim-temps').onchange = updateSim;
    updateSim();
}
