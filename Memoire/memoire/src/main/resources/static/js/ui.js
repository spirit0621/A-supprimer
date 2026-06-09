import { state } from './state.js';
import { api } from './api.js';
import { handleRoute } from './router.js';

export const ui = {
    showToast(msg, type='info') {
        const t = document.createElement('div');
        t.className = `toast toast-${type}`;
        t.innerHTML = `<span>${msg}</span>`;
        document.getElementById('toast-container').appendChild(t);
        setTimeout(() => { t.classList.add('toast-hiding'); setTimeout(()=>t.remove(), 300); }, 3000);
    },
    closeModal() { document.getElementById('modal-root').innerHTML = ''; },
    openEmployeeModal(id = null) {
        const emp = id ? state.employees.find(e => e.id === id) : null;
        const body = `
            <div class="modal-section-title">Informations Personnelles</div>
            <div class="grid grid-cols-2 gap-4 mb-4">
                <div class="form-group">
                    <label class="form-label">Prénom <span class="text-red-500">*</span></label>
                    <input type="text" id="m-fn" class="form-control" placeholder="Prénom" value="${emp ? emp.firstName : ''}" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Nom <span class="text-red-500">*</span></label>
                    <input type="text" id="m-ln" class="form-control" placeholder="Nom" value="${emp ? emp.lastName : ''}" required>
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Établissement <span class="text-red-500">*</span></label>
                <input type="text" id="m-est" class="form-control" placeholder="Saisissez un nouveau nom ou choisissez..." list="est-list" value="${emp ? emp.establishment : ''}">
                <datalist id="est-list">${[...new Set(state.employees.map(e => e.establishment))].map(x => `<option value="${x}">`).join('')}</datalist>
                <p class="text-xs text-slate-400 mt-1"><i class="fa-solid fa-circle-info"></i> Tapez un nouveau nom pour créer un établissement.</p>
            </div>
            <div class="form-group">
                <label class="form-label">Groupe / Département <span class="text-red-500">*</span></label>
                <select id="m-dept" class="form-control" required>
                    <option value="">Sélectionner...</option>
                    ${state.departments.map(d => `<option value="${d.name}" ${emp && emp.department === d.name ? 'selected' : ''}>${d.name}</option>`).join('')}
                </select>
            </div>

            <div class="modal-section-title">Rémunération de Base</div>
            <div class="form-group">
                <label class="form-label">Salaire de Base (€) <span class="text-red-500">*</span></label>
                <input type="number" id="m-sal" class="form-control" placeholder="0.00" value="${emp ? emp.baseSalary : '2500'}">
            </div>

            <div class="modal-section-title">Variables et Primes (Montants fixes)</div>
            <div id="employee-vars-container" class="var-card-list" style="max-height: 240px; overflow-y: auto; padding-right: 4px; margin-bottom: 1rem;">
                ${state.variables.filter(v => v.type === 'fixed' && (emp && emp.customValues && emp.customValues[v.code] !== undefined)).map(v => `
                    <div class="var-card animate-fade-in" data-code="${v.code}">
                        <div class="var-card-info">
                            <div class="var-card-code">CODE: ${v.code}</div>
                            <div class="var-card-title">${v.label}</div>
                            <div class="var-card-desc line-clamp-1">${v.description || 'Pas de description'}</div>
                        </div>
                        <input type="number" class="form-control var-card-input m-var" data-code="${v.code}" 
                            value="${emp.customValues[v.code]}" placeholder="0">
                        <div class="var-delete-btn" onclick="this.closest('.var-card').remove(); ui.checkVarEmpty('fixed')">
                            <i class="fa-solid fa-trash-can"></i>
                        </div>
                    </div>
                `).join('')}
                ${(!emp || !emp.customValues || !Object.keys(emp.customValues).some(k => state.variables.find(v => v.code === k && v.type === 'fixed'))) ? 
                    '<p id="no-var-msg" class="text-xs text-slate-400 italic p-4 text-center">Aucune variable assignée.</p>' : ''}
            </div>

            <div class="relative mb-8">
                <button type="button" class="btn-add-var" id="add-var-trigger">
                    <i class="fa-solid fa-plus"></i> Ajouter une prime
                </button>
                <div id="var-selection-menu" class="hidden card p-0 absolute bottom-full left-0 w-full mb-2 shadow-2xl border-blue-200 z-[100] overflow-hidden">
                    <div class="p-3 bg-slate-50 border-b border-slate-100">
                        <div class="relative">
                            <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                            <input type="text" id="var-menu-search" class="form-control pl-9 text-xs py-2 h-auto" placeholder="Rechercher une prime...">
                        </div>
                    </div>
                    <div id="var-menu-items" class="max-h-[220px] overflow-y-auto p-1">
                        <!-- Populated by JS -->
                    </div>
                </div>
            </div>

            <div class="modal-section-title">Règles & Cotisations (Formules automatiques)</div>
            <div id="employee-rules-container" class="var-card-list" style="max-height: 240px; overflow-y: auto; padding-right: 4px; margin-bottom: 1rem;">
                ${state.variables.filter(v => v.type === 'formula' && (emp && emp.customValues && emp.customValues[v.code] === 1.0)).map(v => `
                    <div class="var-card animate-fade-in" data-code="${v.code}">
                        <div class="var-card-info">
                            <div class="var-card-code">FORMULE</div>
                            <div class="var-card-title">${v.label}</div>
                            <div class="var-card-desc font-mono text-blue-500">${v.expression}</div>
                        </div>
                        <div class="px-3">
                            <label class="switch">
                                <input type="checkbox" class="m-var-check" data-code="${v.code}" checked>
                                <span class="slider round"></span>
                            </label>
                        </div>
                        <div class="var-delete-btn" onclick="this.closest('.var-card').remove(); ui.checkVarEmpty('formula')">
                            <i class="fa-solid fa-trash-can"></i>
                        </div>
                    </div>
                `).join('')}
                ${(!emp || !emp.customValues || !Object.keys(emp.customValues).some(k => state.variables.find(v => v.code === k && v.type === 'formula' && emp.customValues[k] === 1.0))) ? 
                    '<p id="no-rule-msg" class="text-xs text-slate-400 italic p-4 text-center">Aucune règle assignée.</p>' : ''}
            </div>

            <div class="relative mb-6">
                <button type="button" class="btn-add-var" id="add-rule-trigger">
                    <i class="fa-solid fa-plus"></i> Ajouter une règle
                </button>
                <div id="rule-selection-menu" class="hidden card p-0 absolute bottom-full left-0 w-full mb-2 shadow-2xl border-blue-200 z-[100] overflow-hidden">
                    <div class="p-3 bg-slate-50 border-b border-slate-100">
                        <div class="relative">
                            <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                            <input type="text" id="rule-menu-search" class="form-control pl-9 text-xs py-2 h-auto" placeholder="Rechercher une règle...">
                        </div>
                    </div>
                    <div id="rule-menu-items" class="max-h-[220px] overflow-y-auto p-1">
                        <!-- Populated by JS -->
                    </div>
                </div>
            </div>
        `;
        const foot = `
            <button class="btn btn-secondary" onclick="ui.closeModal()">Annuler</button>
            <button class="btn btn-primary" id="m-sub" style="padding: 0.5rem 2rem;">${id ? 'Modifier' : 'Enregistrer'}</button>
        `;
        this.renderModal(id ? 'Modifier le salarié' : 'Ajouter un salarié', body, foot);
        
        // Modal Logic - Selection Menus
        const setupMenu = (triggerId, menuId, searchId, itemsId, type) => {
            const trigger = document.getElementById(triggerId);
            const menu = document.getElementById(menuId);
            const search = document.getElementById(searchId);
            const items = document.getElementById(itemsId);

            if (trigger) trigger.onclick = () => {
                menu.classList.toggle('hidden');
                if (!menu.classList.contains('hidden')) search.focus();
                renderItems();
            };

            const renderItems = (filter = '') => {
                const available = state.variables.filter(v => 
                    v.type === type && 
                    (v.label.toLowerCase().includes(filter.toLowerCase()) || v.code.toLowerCase().includes(filter.toLowerCase()))
                );

                items.innerHTML = available.map(v => `
                    <div class="p-3 hover:bg-blue-50 cursor-pointer rounded-lg flex justify-between items-center transition-colors group" 
                        onclick="ui.addVarRow('${v.code}', '${v.label.replace(/'/g, "\\'")}', '${(v.type === 'fixed' ? (v.description || '') : v.expression).replace(/'/g, "\\'")}', '${v.type}')">
                        <div class="flex flex-col">
                            <span class="text-sm font-bold text-slate-700 group-hover:text-blue-600">${v.label}</span>
                            <span class="text-[10px] text-slate-400">${v.type === 'fixed' ? (v.description || 'Montant fixe') : 'Calcul automatique'}</span>
                        </div>
                        <span class="text-[10px] font-mono bg-slate-100 group-hover:bg-blue-100 group-hover:text-blue-600 px-2 py-1 rounded text-slate-500">${v.code}</span>
                    </div>
                `).join('');
                if (available.length === 0) items.innerHTML = '<div class="p-4 text-center text-xs text-slate-400">Aucun résultat</div>';
            };

            search.oninput = (e) => renderItems(e.target.value);
        };

        setupMenu('add-var-trigger', 'var-selection-menu', 'var-menu-search', 'var-menu-items', 'fixed');
        setupMenu('add-rule-trigger', 'rule-selection-menu', 'rule-menu-search', 'rule-menu-items', 'formula');

        this.addVarRow = (code, label, desc, type) => {
            const containerId = type === 'fixed' ? 'employee-vars-container' : 'employee-rules-container';
            const menuId = type === 'fixed' ? 'var-selection-menu' : 'rule-selection-menu';
            const noMsgId = type === 'fixed' ? 'no-var-msg' : 'no-rule-msg';
            
            const container = document.getElementById(containerId);
            const noMsg = document.getElementById(noMsgId);
            
            if (container.querySelector(`[data-code="${code}"]`)) {
                this.showToast('Déjà ajouté', 'info');
                document.getElementById(menuId).classList.add('hidden');
                return;
            }

            if (noMsg) noMsg.remove();
            
            const div = document.createElement('div');
            div.className = 'var-card animate-fade-in';
            div.setAttribute('data-code', code);
            
            if (type === 'fixed') {
                div.innerHTML = `
                    <div class="var-card-info">
                        <div class="var-card-code">CODE: ${code}</div>
                        <div class="var-card-title">${label}</div>
                        <div class="var-card-desc line-clamp-1">${desc || 'Pas de description'}</div>
                    </div>
                    <input type="number" class="form-control var-card-input m-var" data-code="${code}" placeholder="0">
                    <div class="var-delete-btn" onclick="this.closest('.var-card').remove(); ui.checkVarEmpty('fixed')">
                        <i class="fa-solid fa-trash-can"></i>
                    </div>
                `;
            } else {
                div.innerHTML = `
                    <div class="var-card-info">
                        <div class="var-card-code">FORMULE</div>
                        <div class="var-card-title">${label}</div>
                        <div class="var-card-desc font-mono text-blue-500">${desc}</div>
                    </div>
                    <div class="px-3">
                        <label class="switch">
                            <input type="checkbox" class="m-var-check" data-code="${code}" checked>
                            <span class="slider round"></span>
                        </label>
                    </div>
                    <div class="var-delete-btn" onclick="this.closest('.var-card').remove(); ui.checkVarEmpty('formula')">
                        <i class="fa-solid fa-trash-can"></i>
                    </div>
                `;
            }
            container.appendChild(div);
            document.getElementById(menuId).classList.add('hidden');
        };

        this.checkVarEmpty = (type) => {
            const containerId = type === 'fixed' ? 'employee-vars-container' : 'employee-rules-container';
            const noMsgId = type === 'fixed' ? 'no-var-msg' : 'no-rule-msg';
            const container = document.getElementById(containerId);
            if (container.children.length === 0) {
                container.innerHTML = `<p id="${noMsgId}" class="text-xs text-slate-400 italic p-4 text-center">Aucune ${type === 'fixed' ? 'variable' : 'règle'} assignée.</p>`;
            }
        };

        document.getElementById('m-sub').onclick = async () => {
            const customValues = {};
            document.querySelectorAll('.m-var').forEach(input => {
                customValues[input.dataset.code] = parseFloat(input.value) || 0;
            });
            document.querySelectorAll('.m-var-check').forEach(input => {
                customValues[input.dataset.code] = input.checked ? 1.0 : 0.0;
            });
            const e = { 
                firstName: document.getElementById('m-fn').value, 
                lastName: document.getElementById('m-ln').value, 
                establishment: document.getElementById('m-est').value, 
                department: document.getElementById('m-dept').value, 
                baseSalary: parseFloat(document.getElementById('m-sal').value), 
                avatar: emp ? emp.avatar : `https://ui-avatars.com/api/?name=${document.getElementById('m-fn').value}+${document.getElementById('m-ln').value}`,
                customValues: customValues
            };
            if (id) await api.updateEmployee(id, e);
            else await api.addEmployee(e);
            
            await api.fetchAll(); // Re-fetch to get newly generated payslips
            
            this.showToast(id ? 'Salarié modifié' : 'Salarié ajouté');
            this.closeModal();
            handleRoute();
        };
    },
    openVariableModal(id = null) {
        const v = id ? state.variables.find(x => x.id === id) : null;
        const body = `
            <div class="grid grid-cols-2 gap-4 mb-4">
                <div class="form-group">
                    <label class="form-label">Libellé <span class="text-red-500">*</span></label>
                    <input type="text" id="v-lab" class="form-control" placeholder="Ex: Prime Panier" value="${v ? v.label : ''}">
                </div>
                <div class="form-group">
                    <label class="form-label">Code <span class="text-red-500">*</span></label>
                    <input type="text" id="v-code" class="form-control" placeholder="EX: PANIER_JM" value="${v ? v.code : ''}" ${id ? 'disabled' : ''}>
                </div>
            </div>
            <div class="form-group"><label class="form-label">Description</label><textarea id="v-desc" class="form-control" rows="2">${v ? v.description : ''}</textarea></div>
            
            <div class="formula-helper">
                <label class="form-label mb-3">Type de calcul</label>
                <div class="radio-group">
                    <label class="radio-item"><input type="radio" name="v-calc-type" value="fixed" ${(!v || v.type === 'fixed') ? 'checked' : ''}> Montant Fixe</label>
                    <label class="radio-item"><input type="radio" name="v-calc-type" value="formula" ${(v && v.type === 'formula') ? 'checked' : ''}> Formule Mathématique</label>
                </div>
                
                <div id="v-expression-container" class="mt-4 ${(!v || v.type === 'fixed') ? 'hidden' : ''}">
                    <label class="form-label">Expression / Formule <span class="text-red-500">*</span></label>
                    <input type="text" id="v-exp" class="form-control expression-input" placeholder="baseSalary * 0.10" value="${v ? v.expression : ''}">
                    <div class="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <div class="flex items-center justify-between mb-3">
                            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Variables disponibles</label>
                            <div class="relative">
                                <i class="fa-solid fa-magnifying-glass absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400"></i>
                                <input type="text" id="v-helper-search" class="form-control text-[10px] pl-6 py-1 h-auto w-32" placeholder="Filtrer...">
                            </div>
                        </div>
                        <div id="v-helper-list" class="formula-helper-list max-h-[160px] overflow-y-auto custom-scrollbar pr-1">
                            <!-- Populated by JS -->
                        </div>
                        <p class="text-[10px] text-slate-400 mt-3 italic"><i class="fa-solid fa-circle-info mr-1"></i> Cliquez sur une variable pour l'insérer dans la formule.</p>
                    </div>
                </div>
                
                <div id="v-fixed-container" class="mt-4 ${(v && v.type === 'formula') ? 'hidden' : ''}">
                    <label class="form-label">Montant (€) <span class="text-red-500">*</span></label>
                    <input type="number" id="v-fixed-val" class="form-control" placeholder="€ 0.00" value="${(v && v.type === 'fixed') ? v.expression : ''}">
                </div>
            </div>
        `;
        const foot = `<button class="btn btn-secondary" onclick="ui.closeModal()">Annuler</button><button class="btn btn-primary" id="v-sub">${id ? 'Modifier' : 'Enregistrer'}</button>`;
        this.renderModal(id ? 'Modifier variable' : 'Nouvelle variable', body, foot);
        
        // Helper List Population & Search
        const helperList = document.getElementById('v-helper-list');
        const helperSearch = document.getElementById('v-helper-search');
        
        const systemVars = [
            { code: 'baseSalary', label: 'Salaire de base' },
            { code: 'hourlyRate', label: 'Taux horaire' },
            { code: 'totalHours', label: 'Total heures' }
        ];

        const renderHelper = (filter = '') => {
            const allVars = [...systemVars, ...state.variables.filter(x => x.type === 'fixed')];
            const filtered = allVars.filter(x => x.code.toLowerCase().includes(filter.toLowerCase()) || x.label.toLowerCase().includes(filter.toLowerCase()));
            
            helperList.innerHTML = filtered.map(x => `
                <div class="v-helper-item animate-fade-in" onclick="ui.insertVar('${x.code}')">
                    <span>${x.code}</span>
                    <span>${x.label}</span>
                </div>
            `).join('');
            
            if(filtered.length === 0) helperList.innerHTML = '<div class="text-center p-4 text-[10px] text-slate-400">Aucun résultat</div>';
        };

        this.insertVar = (code) => {
            const input = document.getElementById('v-exp');
            const start = input.selectionStart;
            const end = input.selectionEnd;
            const text = input.value;
            input.value = text.substring(0, start) + code + text.substring(end);
            input.focus();
            input.setSelectionRange(start + code.length, start + code.length);
        };

        renderHelper();
        if(helperSearch) helperSearch.oninput = (e) => renderHelper(e.target.value);

        // Toggle logic
        const radios = document.querySelectorAll('input[name="v-calc-type"]');
        radios.forEach(r => r.onchange = (e) => {
            if(e.target.value === 'fixed') {
                document.getElementById('v-fixed-container').classList.remove('hidden');
                document.getElementById('v-expression-container').classList.add('hidden');
            } else {
                document.getElementById('v-fixed-container').classList.add('hidden');
                document.getElementById('v-expression-container').classList.remove('hidden');
            }
        });

        document.getElementById('v-sub').onclick = async () => {
            const type = document.querySelector('input[name="v-calc-type"]:checked').value;
            const expression = type === 'fixed' ? document.getElementById('v-fixed-val').value : document.getElementById('v-exp').value;
            const data = { 
                code: document.getElementById('v-code').value, 
                label: document.getElementById('v-lab').value, 
                description: document.getElementById('v-desc').value, 
                type: type, 
                expression: expression 
            };
            if (id) await api.updateVariable(id, data);
            else await api.addVariable(data);
            
            this.showToast('Variable enregistrée');
            this.closeModal();
            handleRoute();
        };
    },
    renderModal(title, body, foot) {
        document.getElementById('modal-root').innerHTML = `<div class="modal-overlay active"><div class="modal-container"><div class="modal-header"><h3 class="modal-title">${title}</h3><button onclick="ui.closeModal()">×</button></div><div class="modal-body">${body}</div><div class="modal-footer">${foot}</div></div></div>`;
    },
    async deleteEmployee(id) { if(confirm('Sûr ?')) { await api.deleteEmployee(id); this.showToast('Supprimé'); handleRoute(); } },
    async deleteVariable(id) { if(confirm('Sûr ?')) { await api.deleteVariable(id); this.showToast('Supprimé'); handleRoute(); } },
    downloadPDF(id) {
        const p = state.payslips.find(x => x.id === id);
        const e = state.employees.find(x => x.id === p.employeeId);
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // --- Header Configuration ---
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.setTextColor(30, 41, 59); // Slate 800
        doc.text("BULLETIN DE PAIE", 105, 20, { align: 'center' });
        
        // Boxes
        doc.setLineWidth(0.5);
        doc.setDrawColor(30, 41, 59);
        
        // Entreprise Box (Left)
        doc.roundedRect(10, 30, 90, 35, 3, 3);
        doc.setFontSize(10);
        doc.text("ENTREPRISE", 15, 37);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text(e?.establishment || "Société Anonyme", 15, 45);
        doc.text("N° Siret : 123 456 789 00012", 15, 50);
        doc.text("Code APE : 6201Z", 15, 55);
        doc.text("Convention : Métallurgie cadres", 15, 60);

        // Employee Info (Right Side)
        doc.setFont("helvetica", "bold");
        doc.text(`Période : ${p.period}`, 120, 37);
        doc.setFont("helvetica", "normal");
        doc.text(`Date de paiement : 31/${p.period.split(' ')[0]}/${p.period.split(' ')[1]}`, 120, 42);
        doc.text(`N° Salarié : ${e?.id.toString().padStart(6, '0')}`, 120, 47);
        doc.text(`N° Sécu : 1 85 12 75 123 456 78`, 120, 52);

        // Employee Box (Right)
        doc.roundedRect(115, 60, 85, 25, 3, 3);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text(`${e?.firstName} ${e?.lastName}`, 120, 68);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text("4 rue de l'église", 120, 74);
        doc.text("75000 Paris", 120, 79);

        // Employee Details Table Header
        doc.setFont("helvetica", "bold");
        doc.roundedRect(10, 90, 190, 15, 2, 2);
        doc.setFontSize(8);
        doc.text("Emploi : Ingénieur", 15, 96);
        doc.text(`Dépt : ${e?.department}`, 15, 101);
        doc.text("Classification : Cadre - Coeff 135", 70, 96);
        doc.text("Forfait : 218 Jrs", 130, 96);

        // --- Main Table ---
        const tableBody = [
            [{ content: 'Salaire de Base', styles: { fontStyle: 'bold' } }, p.baseSalary.toFixed(2), '', p.baseSalary.toFixed(2), ''],
        ];

        // Add variables/primes
        const totalPrimes = p.grossSalary - p.baseSalary;
        if (totalPrimes > 0) {
            tableBody.push(['Primes et variables', '', '', totalPrimes.toFixed(2), '']);
        }

        // Section Separator: COTISATIONS
        tableBody.push([{ content: 'COTISATIONS ET CONTRIBUTIONS SOCIALES', colSpan: 5, styles: { fillColor: [241, 245, 249], fontStyle: 'bold' } }]);
        
        // Simulated Charges (matching the ADP standard)
        const charges = [
            ['Santé - Sécurité Sociale Maladie', p.grossSalary.toFixed(2), '7.00%', (p.grossSalary * 0.07).toFixed(2), (p.grossSalary * 0.13).toFixed(2)],
            ['Accidents du Travail', p.grossSalary.toFixed(2), '', '', (p.grossSalary * 0.02).toFixed(2)],
            ['Retraite - Sécurité Sociale Plafonnée', p.grossSalary.toFixed(2), '6.90%', (p.grossSalary * 0.069).toFixed(2), (p.grossSalary * 0.08).toFixed(2)],
            ['Famille - Sécurité Sociale', p.grossSalary.toFixed(2), '', '', (p.grossSalary * 0.0345).toFixed(2)],
            ['Assurance Chômage', p.grossSalary.toFixed(2), '0.00%', '0.00', (p.grossSalary * 0.0405).toFixed(2)],
            ['CSG déductible de l\'impôt sur le revenu', p.grossSalary.toFixed(2), '6.80%', (p.grossSalary * 0.068).toFixed(2), '']
        ];
        tableBody.push(...charges);

        // Total Line
        tableBody.push([{ content: 'TOTAL DES COTISATIONS', colSpan: 3, styles: { fontStyle: 'bold' } }, (p.grossSalary - p.netSalary).toFixed(2), '']);

        doc.autoTable({
            startY: 110,
            head: [['DÉSIGNATION', 'BASE', 'TAUX', 'PART SALARIÉ', 'PART EMPLOYEUR']],
            body: tableBody,
            theme: 'grid',
            headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontSize: 8, halign: 'center' },
            columnStyles: {
                0: { cellWidth: 80 },
                1: { cellWidth: 25, halign: 'right' },
                2: { cellWidth: 20, halign: 'right' },
                3: { cellWidth: 32, halign: 'right' },
                4: { cellWidth: 32, halign: 'right' }
            },
            styles: { fontSize: 8, cellPadding: 2 },
            margin: { left: 10, right: 10 }
        });

        // --- Bottom Summary ---
        const finalY = doc.lastAutoTable.finalY + 10;
        
        doc.setFillColor(248, 250, 252);
        doc.rect(130, finalY, 70, 30, 'F');
        doc.rect(130, finalY, 70, 30, 'S');
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.text("SALAIRE BRUT", 135, finalY + 7);
        doc.text(p.grossSalary.toFixed(2) + " €", 195, finalY + 7, { align: 'right' });
        
        doc.text("TOTAL RETENUES", 135, finalY + 14);
        doc.text((p.grossSalary - p.netSalary).toFixed(2) + " €", 195, finalY + 14, { align: 'right' });
        
        doc.setFontSize(12);
        doc.setTextColor(37, 99, 235);
        doc.text("NET À PAYER", 135, finalY + 25);
        doc.text(p.netSalary.toFixed(2) + " €", 195, finalY + 25, { align: 'right' });

        doc.save(`BS_${e?.lastName}_${p.period.replace(' ', '_')}.pdf`);
    },
    downloadBatch() {
        const filtered = state.payslips.filter(p => {
            const emp = state.employees.find(e => e.id === p.employeeId);
            const matchesSearch = emp ? `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(state.filters.search.toLowerCase()) : true;
            const matchesEst = state.filters.establishment === 'all' || (emp && emp.establishment === state.filters.establishment);
            const matchesDept = state.filters.department === 'all' || (emp && emp.department === state.filters.department);
            return matchesSearch && matchesEst && matchesDept;
        });
        if(filtered.length === 0) return this.showToast('Aucun résultat', 'error');
        this.showToast('Lancement du téléchargement groupé...');
        filtered.forEach((p, i) => setTimeout(() => this.downloadPDF(p.id), i * 500));
    },
    openGenerateModal() {
        const body = `
            <div class="form-group">
                <label class="form-label">Salarié <span class="text-red-500">*</span></label>
                <select id="g-emp" class="form-control">
                    ${state.employees.map(e => `<option value="${e.id}">${e.firstName} ${e.lastName}</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Période <span class="text-red-500">*</span></label>
                <input type="text" id="g-per" class="form-control" placeholder="Ex: Mai 2024" value="Mai 2024">
            </div>
        `;
        const foot = `
            <button class="btn btn-secondary" onclick="ui.closeModal()">Annuler</button>
            <button class="btn btn-primary" id="g-sub">Prévisualiser</button>
        `;
        this.renderModal('Générer un bulletin', body, foot);
        
        document.getElementById('g-sub').onclick = () => {
            const empId = parseInt(document.getElementById('g-emp').value);
            const period = document.getElementById('g-per').value;
            this.openPreviewModal(empId, period);
        };
    },
    async openPreviewModal(empId, period) {
        const emp = state.employees.find(e => e.id === empId);
        if (!emp) return;

        const base = emp.baseSalary || 0;
        const calcData = {
            base: base,
            variables: [],
            gross: base,
            cotisations: 0,
            net: 0
        };

        state.variables.forEach(v => {
            const userVal = (emp.customValues && emp.customValues[v.code]) ? emp.customValues[v.code] : 0;
            if (userVal !== 0) {
                let amount = 0;
                let detail = '';
                if (v.type === 'fixed') {
                    amount = userVal;
                    detail = `Fixe`;
                } else if (v.type === 'formula' && userVal >= 1.0) {
                    try {
                        let expr = v.expression
                            .replace(/baseSalary/g, base)
                            .replace(/hourlyRate/g, (base / 151.67).toFixed(4))
                            .replace(/totalHours/g, "151.67");
                        amount = eval(expr);
                        detail = `Formule`;
                    } catch(e) { amount = 0; }
                }
                if (amount !== 0) {
                    calcData.variables.push({ label: v.label, amount, detail });
                    calcData.gross += amount;
                }
            }
        });

        // Detailed Social Charges Simulation
        const rows = [
            { label: "Salaire de base", base: base.toFixed(2), rate: "100%", s: base.toFixed(2), e: "0.00" }
        ];

        calcData.variables.forEach(v => {
            rows.push({ label: v.label, base: v.amount.toFixed(2), rate: v.detail, s: v.amount.toFixed(2), e: "0.00" });
        });

        // Add some realistic French social charges
        const cotis = [
            { label: "SANTÉ - Sécurité sociale", rate: 0.07, empRate: 0.13 },
            { label: "RETRAITE - Tranche 1", rate: 0.069, empRate: 0.1045 },
            { label: "CHÔMAGE", rate: 0.00, empRate: 0.0405 },
            { label: "CSG / CRDS (Base 98.25%)", rate: 0.097, empRate: 0.00, baseOverride: 0.9825 }
        ];

        let totalS = 0;
        let totalE = 0;

        cotis.forEach(c => {
            const b = c.baseOverride ? calcData.gross * c.baseOverride : calcData.gross;
            const sVal = b * c.rate;
            const eVal = b * c.empRate;
            totalS += sVal;
            totalE += eVal;
            rows.push({ 
                label: c.label, 
                base: b.toFixed(2), 
                rate: (c.rate * 100).toFixed(2) + "%", 
                s: sVal.toFixed(2), 
                e: eVal.toFixed(2) 
            });
        });

        calcData.net = calcData.gross - totalS;

        const body = `
            <div class="preview-modal-content">
                <div class="preview-watermark">SIMULATION</div>
                
                <div class="preview-header">
                    <div class="preview-box" style="margin-right: 1rem;">
                        <h5>Employeur</h5>
                        <div class="font-bold">PAYMASTER PRO SERVICES</div>
                        <div>12 Rue de la Paie, 75001 Paris</div>
                        <div>SIRET: 123 456 789 00012</div>
                        <div>APE: 6202A</div>
                    </div>
                    <div class="preview-box">
                        <h5>Salarié</h5>
                        <div class="font-bold">${emp.firstName} ${emp.lastName}</div>
                        <div>Matricule: EMP-${emp.id.toString().padStart(4, '0')}</div>
                        <div>Emploi: ${emp.position || 'Collaborateur'}</div>
                        <div>Entrée le: 01/01/2023</div>
                    </div>
                </div>

                <div class="text-[10px] text-slate-400 mb-2 uppercase font-bold tracking-widest">Période : ${period}</div>

                <table class="preview-table">
                    <thead>
                        <tr>
                            <th style="text-align: left;">Désignation</th>
                            <th>Base</th>
                            <th>Taux</th>
                            <th>Montant Salarié</th>
                            <th>Montant Employeur</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows.map((r, i) => `
                            <tr class="${i % 2 === 0 ? 'bg-slate' : ''}">
                                <td class="font-bold">${r.label}</td>
                                <td class="text-right">${r.base}</td>
                                <td class="text-right">${r.rate}</td>
                                <td class="text-right font-bold">${r.s}</td>
                                <td class="text-right text-slate-500">${r.e}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <div class="preview-summary">
                    <div class="preview-summary-box">
                        <div class="preview-summary-item">
                            <span>Total Brut</span>
                            <span class="font-bold">${calcData.gross.toFixed(2)} €</span>
                        </div>
                        <div class="preview-summary-item">
                            <span>Total Retenues</span>
                            <span class="text-red-500">- ${totalS.toFixed(2)} €</span>
                        </div>
                        <div class="preview-summary-total">
                            <span>NET À PAYER</span>
                            <span>${calcData.net.toFixed(2)} €</span>
                        </div>
                    </div>
                </div>

                <div class="alert alert-info mt-6 text-[10px] leading-tight">
                    <i class="fa-solid fa-circle-info mr-1"></i> 
                    Cette prévisualisation utilise les taux de cotisation standards pour un profil salarié non-cadre.
                </div>
            </div>
        `;

        const foot = `
            <button class="btn btn-secondary" onclick="ui.closeModal()">Modifier</button>
            <button class="btn btn-primary" id="confirm-gen" style="padding: 0.5rem 2rem;">Confirmer et Générer</button>
        `;
        this.renderModal('Prévisualisation Live', body, foot);
        
        document.getElementById('confirm-gen').onclick = async () => {
            const ps = await api.generatePayslip(empId, period);
            if (ps) {
                this.showToast('Bulletin généré et archivé !');
                await api.fetchAll();
                this.closeModal();
                handleRoute();
            }
        };
    }
};
