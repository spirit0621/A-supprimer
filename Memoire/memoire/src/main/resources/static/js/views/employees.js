import { state } from '../state.js';

export function renderEmployees(container) {
    container.innerHTML = `
        <div class="page-header">
            <h1 class="text-2xl font-bold">Salariés</h1>
            <button class="btn btn-primary" onclick="ui.openEmployeeModal()"><i class="fa-solid fa-user-plus"></i> Nouveau</button>
        </div>
        <div class="filter-bar">
            <div class="flex items-center gap-2" style="flex:1; border: 1px solid var(--slate-200); border-radius: var(--radius-md); padding-left: 1rem; background:white;">
                <i class="fa-solid fa-search text-slate-400"></i>
                <input type="text" id="emp-search" class="form-control" style="border:none; padding-left: 0.5rem;" placeholder="Rechercher par Nom..." value="${state.filters.search}">
            </div>
            <div style="position:relative">
                <i class="fa-solid fa-building text-slate-400" style="position:absolute; left: 1rem; top: 50%; transform: translateY(-50%);"></i>
                <select id="emp-filter-est" class="form-control" style="width:240px; padding-left: 2.5rem;">
                    <option value="all">Tous les établissements</option>
                    ${[...new Set(state.employees.map(e => e.establishment))].map(x => `<option value="${x}" ${state.filters.establishment === x ? 'selected' : ''}>${x}</option>`).join('')}
                </select>
            </div>
        </div>
        <div class="table-wrapper">
            <table class="table">
                <thead>
                    <tr>
                        <th>Salarié</th>
                        <th>Établissement</th>
                        <th>Salaire Base</th>
                        <th>Congés (Pris/Total)</th>
                        <th class="text-right">Actions</th>
                    </tr>
                </thead>
                <tbody id="emp-list"></tbody>
            </table>
        </div>
    `;
    
    const update = () => {
        const filtered = state.employees.filter(e => {
            const fullName = `${e.firstName} ${e.lastName}`.toLowerCase();
            const matchesSearch = fullName.includes(state.filters.search.toLowerCase());
            const matchesEst = state.filters.establishment === 'all' || e.establishment === state.filters.establishment;
            const matchesDept = state.filters.department === 'all' || e.department === state.filters.department;
            return matchesSearch && matchesEst && matchesDept;
        });
        
        const deptFilter = document.getElementById('emp-filter-dept');
        if (deptFilter) {
            const currentVal = deptFilter.value;
            deptFilter.innerHTML = `<option value="all">Tous les départements</option>` + 
                state.departments.map(d => `<option value="${d.name}" ${currentVal === d.name ? 'selected' : ''}>${d.name}</option>`).join('');
        }

        document.getElementById('emp-list').innerHTML = filtered.map(e => {
            const vacationTaken = e.vacationTaken || 0;
            const vacationTotal = e.vacationTotal || 25;
            const vacationPct = Math.min((vacationTaken / vacationTotal) * 100, 100);

            return `
                <tr class="animate-fade-in-up">
                    <td>
                        <div class="flex items-center gap-3">
                            <img src="${e.avatar}" class="avatar avatar-sm">
                             <div>
                                <div class="font-bold text-slate-800">${e.firstName} ${e.lastName}</div>
                                <div class="flex items-center gap-2 mt-1">
                                    <span class="badge badge-indigo" style="font-size: 10px; padding: 1px 6px;">${e.position || 'Collaborateur'}</span>
                                    <span class="text-[10px] text-slate-400 font-medium uppercase tracking-tight">${e.department}</span>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div class="flex items-center gap-2">
                            <div class="w-2 h-2 rounded-full bg-blue-500"></div>
                            <span class="text-sm font-semibold text-slate-600">${e.establishment}</span>
                        </div>
                    </td>
                    <td><span class="font-bold text-slate-700">${e.baseSalary.toLocaleString('fr-FR')} €</span></td>
                    <td style="min-width: 150px;">
                        <div class="leave-tracker">
                            <div class="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                                <span>${vacationTaken} pris</span>
                                <span>${vacationTotal}j</span>
                            </div>
                            <div class="progress-container">
                                <div class="progress-bar" style="width: ${vacationPct}%"></div>
                            </div>
                        </div>
                    </td>
                    <td class="text-right">
                        <div class="flex justify-end gap-1">
                            <button class="btn btn-ghost btn-sm text-blue-600" title="Éditer" onclick="ui.openEmployeeModal(${e.id})"><i class="fa-solid fa-pen-to-square"></i></button>
                            <button class="btn btn-ghost btn-sm text-red-600" title="Supprimer" onclick="api.deleteEmployee(${e.id})"><i class="fa-solid fa-trash-can"></i></button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    };

    update();
    
    document.getElementById('emp-search').oninput = (e) => { state.filters.search = e.target.value; update(); };
    document.getElementById('emp-filter-est').onchange = (e) => { state.filters.establishment = e.target.value; update(); };
    
    const deptFilter = document.getElementById('emp-filter-dept');
    if (deptFilter) {
        deptFilter.onchange = (e) => { state.filters.department = e.target.value; update(); };
    }
}
