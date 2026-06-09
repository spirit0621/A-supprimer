import { state } from '../state.js';

export function renderSettings(container) {
    container.innerHTML = `
        <div class="page-header">
            <h1 class="text-2xl font-bold">Paramètres de Paie</h1>
            <button class="btn btn-primary" onclick="ui.openVariableModal()"><i class="fa-solid fa-plus"></i> Nouvelle Variable</button>
        </div>
        <div class="filter-bar grid grid-cols-3 gap-4">
            <div class="form-group mb-0">
                <label class="text-[10px] uppercase font-bold text-slate-400">Code</label>
                <div class="flex items-center gap-2 border border-slate-200 rounded-md px-3 bg-white">
                    <i class="fa-solid fa-hashtag text-slate-400"></i>
                    <input type="text" id="var-search-code" class="form-control" style="border:none" placeholder="Ex: PANIER..." value="${state.filters.varCode}">
                </div>
            </div>
            <div class="form-group mb-0">
                <label class="text-[10px] uppercase font-bold text-slate-400">Libellé</label>
                <div class="flex items-center gap-2 border border-slate-200 rounded-md px-3 bg-white">
                    <i class="fa-solid fa-font text-slate-400"></i>
                    <input type="text" id="var-search-label" class="form-control" style="border:none" placeholder="Ex: Prime..." value="${state.filters.varLabel}">
                </div>
            </div>
            <div class="form-group mb-0">
                <label class="text-[10px] uppercase font-bold text-slate-400">Type</label>
                <select id="var-filter-type" class="form-control">
                    <option value="all">Tous les types</option>
                    <option value="fixed">Montant Fixe</option>
                    <option value="formula">Formule</option>
                </select>
            </div>
        </div>
        <div class="table-wrapper">
            <table class="table">
                <thead><tr><th>Code</th><th>Libellé</th><th>Description</th><th>Type</th><th>Actions</th></tr></thead>
                <tbody id="var-list"></tbody>
            </table>
        </div>
    `;
    
    const update = () => {
        const codeFilter = state.filters.varCode.toLowerCase();
        const labelFilter = state.filters.varLabel.toLowerCase();
        const typeFilter = document.getElementById('var-filter-type')?.value || 'all';

        const filtered = state.variables.filter(v => {
            const matchesCode = v.code.toLowerCase().includes(codeFilter);
            const matchesLabel = v.label.toLowerCase().includes(labelFilter);
            const matchesType = typeFilter === 'all' || v.type === typeFilter;
            return matchesCode && matchesLabel && matchesType;
        });

        document.getElementById('var-list').innerHTML = filtered.map(v => `
            <tr>
                <td class="font-mono text-xs text-blue-600"><b>${v.code}</b></td>
                <td>${v.label}</td>
                <td class="text-xs text-slate-500">${v.description}</td>
                <td><span class="badge ${v.type === 'formula' ? 'badge-indigo' : 'badge-blue'}">${v.type === 'formula' ? 'Formule' : 'Fixe'}</span></td>
                <td>
                    <div class="flex gap-1">
                        <button class="btn btn-ghost btn-icon" onclick="ui.openVariableModal(${v.id})"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn btn-ghost btn-icon text-red-600" onclick="ui.deleteVariable(${v.id})"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');
    };

    update();

    document.getElementById('var-search-code').oninput = (e) => { state.filters.varCode = e.target.value; update(); };
    document.getElementById('var-search-label').oninput = (e) => { state.filters.varLabel = e.target.value; update(); };
    document.getElementById('var-filter-type').onchange = () => update();
}
