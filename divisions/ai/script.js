(function () {
    'use strict';
    if (!window.Birchmont || !window.Birchmont.bindLeadForm) return;

    window.Birchmont.bindLeadForm({
        formId: 'aiLeadForm',
        statusId: 'aiLeadFormStatus',
        submitBtnId: 'aiLeadSubmitBtn',
        division: 'ai',
        successMessage: 'We’ve received your information and will be in touch within one business day to schedule your AI readiness call.'
    });
})();
