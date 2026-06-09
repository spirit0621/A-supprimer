import { state } from '../state.js';

export function renderPayslips(container) {
    const isRH = state.user.role === 'RH';
    container.innerHTML = `
        <div class="page-header" style="align-items: flex-start;">
            <div>
                <h1 class="text-3xl font-bold">Bulletins de Paie</h1>
                <p class="text-slate-500 mt-1">Gérez et génerez les bulletins officiels par période.</p>
            </div>
            <div class="flex gap-2">
                ${isRH ? `<button class="btn btn-primary" onclick="ui.openGenerateModal()"><i class="fa-solid fa-wand-magic-sparkles"></i> Générer Paie</button>` : ''}
                ${isRH ? `<button class="btn-success" onclick="ui.downloadBatch()"><i class="fa-solid fa-file-zipper"></i> Tout telecharger (ZIP)</button>` : ''}
            </div>
        </div>
        
        <div class="table-wrapper animate-fade-in" style="margin-top: 1.5rem;">
            <table class="table">
                <thead>
                    <tr>
                        <th style="width: 250px;">
                            <div class="flex flex-col gap-1">
                                <span>Salarié</span>
                                <input type="text" id="pay-filter-name" class="form-control form-control-sm" placeholder="Filtrer..." value="${state.filters.paySearch}">
                            </div>
                        </th>
                        <th style="width: 180px;">
                            <div class="flex flex-col gap-1">
                                <span>Établissement</span>
                                <select id="pay-filter-est" class="form-control form-control-sm" style="height: 31px;">
                                    <option value="all">Tous</option>
                                    ${[...new Set(state.employees.map(e => e.establishment))].map(x => `<option value="${x}" ${state.filters.payEst === x ? 'selected' : ''}>${x}</option>`).join('')}
                                </select>
                            </div>
                        </th>
                        <th style="width: 150px;">
                            <div class="flex flex-col gap-1">
                                <span>Période</span>
                                <input type="text" id="pay-filter-period" class="form-control form-control-sm" placeholder="Ex: Janvier..." value="${state.filters.payPeriod}">
                            </div>
                        </th>
                        <th style="width: 140px;">
                            <div class="flex flex-col gap-1 text-right">
                                <span>Net à Payer</span>
                                <input type="text" id="pay-filter-net" class="form-control form-control-sm text-right" placeholder="Montant..." value="${state.filters.payNet}">
                            </div>
                        </th>
                        <th style="width: 160px;">
                            <div class="flex flex-col gap-1">
                                <span>Généré le</span>
                                <input type="text" id="pay-filter-gendate" class="form-control form-control-sm" placeholder="Date..." value="${state.filters.payGenDate}">
                            </div>
                        </th>
                        <th class="text-center" style="width: 150px;">Actions</th>
                    </tr>
                </thead>
                <tbody id="pay-table-body"></tbody>
            </table>
        </div>
        
        <div class="payslip-stats-row mt-4">
            <div id="pay-count-info">Chargement...</div>
            <div class="italic text-slate-400 text-sm">Tableau mis à jour en temps réel selon les critères de filtrage.</div>
        </div>
    `;

    const update = () => {
        const filtered = state.payslips.filter(p => {
            const emp = state.employees.find(e => e.id === p.employeeId);
            if(!emp) return false;

            const nameMatch = `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(state.filters.paySearch.toLowerCase());
            const estMatch = state.filters.payEst === 'all' || emp.establishment === state.filters.payEst;
            
            const date = new Date(p.period);
            const periodStr = date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }).toLowerCase();
            const periodMatch = periodStr.includes(state.filters.payPeriod.toLowerCase());
            
            const netStr = p.netSalary.toString();
            const netMatch = netStr.includes(state.filters.payNet);

            const genDateStr = p.generationDate ? new Date(p.generationDate).toLocaleDateString('fr-FR') : '';
            const genDateMatch = genDateStr.includes(state.filters.payGenDate);

            return nameMatch && estMatch && periodMatch && netMatch && genDateMatch;
        });

        document.getElementById('pay-count-info').innerText = `${filtered.length} bulletin(s) affiché(s)`;

        document.getElementById('pay-table-body').innerHTML = filtered.map(p => {
            const emp = state.employees.find(e => e.id === p.employeeId);
            const date = new Date(p.period);
            const periodStr = date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
            const capitalizedPeriod = periodStr.charAt(0).toUpperCase() + periodStr.slice(1);
            const genDateStr = p.generationDate ? new Date(p.generationDate).toLocaleDateString('fr-FR') : 'N/A';

            return `
                <tr>
                    <td>
                        <div class="flex items-center gap-3">
                            <img src="${emp.avatar}" class="avatar avatar-xs">
                            <div>
                                <div class="font-bold text-slate-800">${emp.firstName} ${emp.lastName}</div>
                                <div class="text-[10px] text-slate-400 font-medium">${emp.nir || 'NIR Inconnu'}</div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <span class="badge badge-blue" style="font-size: 0.7rem;">${emp.establishment}</span>
                    </td>
                    <td>
                        <span class="font-medium text-slate-700">${capitalizedPeriod}</span>
                    </td>
                    <td class="text-right">
                        <span class="font-black text-blue-600">${p.netSalary.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</span>
                    </td>
                    <td>
                        <div class="text-slate-500 text-sm flex items-center gap-1">
                            <i class="fa-regular fa-calendar-check text-xs"></i>
                            ${genDateStr}
                        </div>
                    </td>
                    <td>
                        <div class="flex gap-1 justify-center">
                            <button class="btn btn-ghost btn-xs" onclick="ui.openPreviewModal(${p.employeeId}, '${capitalizedPeriod}')" title="Voir les détails">
                                <i class="fa-solid fa-eye text-blue-500"></i>
                            </button>
                            <button class="btn btn-ghost btn-xs" onclick="ui.downloadPDF(${p.id})" title="Télécharger PDF">
                                <i class="fa-solid fa-file-pdf text-red-500"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    };

    // Event Listeners
    document.getElementById('pay-filter-name').oninput = (e) => { state.filters.paySearch = e.target.value; update(); };
    document.getElementById('pay-filter-est').onchange = (e) => { state.filters.payEst = e.target.value; update(); };
    document.getElementById('pay-filter-period').oninput = (e) => { state.filters.payPeriod = e.target.value; update(); };
    document.getElementById('pay-filter-net').oninput = (e) => { state.filters.payNet = e.target.value; update(); };
    document.getElementById('pay-filter-gendate').oninput = (e) => { state.filters.payGenDate = e.target.value; update(); };

    update();
}
