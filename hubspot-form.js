(function () {
    'use strict';

    // --- Single source of truth for the site-wide HubSpot lead form ---
    // To change the form everywhere, update only these three values.
    var HUBSPOT = {
        portalId: '343241177',
        formId: 'e0449e72-d185-4528-9122-42eda0922160',
        region: 'na3'
    };

    var scriptLoaded = false;
    function loadEmbedScript() {
        if (scriptLoaded) return;
        scriptLoaded = true;
        var s = document.createElement('script');
        s.src = 'https://js-' + HUBSPOT.region + '.hsforms.net/forms/embed/' + HUBSPOT.portalId + '.js';
        s.defer = true;
        document.head.appendChild(s);
    }

    // Any element with [data-hubspot-form] becomes a rendered HubSpot form.
    var targets = document.querySelectorAll('[data-hubspot-form]');
    if (!targets.length) return;

    targets.forEach(function (el) {
        var frame = document.createElement('div');
        frame.className = 'hs-form-frame';
        frame.setAttribute('data-region', HUBSPOT.region);
        frame.setAttribute('data-form-id', HUBSPOT.formId);
        frame.setAttribute('data-portal-id', HUBSPOT.portalId);
        el.appendChild(frame);
    });

    loadEmbedScript();
})();
