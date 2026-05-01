(function () {
    'use strict';
    if (!window.Birchmont || !window.Birchmont.bindLeadForm) return;

    window.Birchmont.bindLeadForm({
        formId: 'consultingLeadForm',
        statusId: 'consultingLeadFormStatus',
        submitBtnId: 'consultingLeadSubmitBtn',
        division: 'consulting',
        successMessage: 'We’ve received your information and will be in touch within one business day to schedule your consultation.'
    });
})();
