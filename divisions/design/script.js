(function () {
    'use strict';
    if (!window.Birchmont || !window.Birchmont.bindLeadForm) return;

    window.Birchmont.bindLeadForm({
        formId: 'designLeadForm',
        statusId: 'leadFormStatus',
        submitBtnId: 'leadSubmitBtn',
        division: 'design',
        successMessage: 'We’ve received your information and will be in touch within one business day to schedule your discovery call.'
    });
})();
