// --- State Management ---
export const state = {
    user: null, 
    employees: [],
    payslips: [],
    variables: [],
    view: 'login',
    departments: [],
    auditLogs: [],
    filters: {
        search: '',
        varCode: '',
        varLabel: '',
        establishment: 'all',
        department: 'all',
        paySearch: '',
        payEst: 'all',
        payPeriod: '',
        payNet: '',
        payGenDate: ''
    }
};
