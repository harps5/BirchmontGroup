(function () {
    'use strict';
    var root = document.querySelector('[data-scorecard]');
    if (!root) return;

    // type: 'opp' (opportunity: higher = more value AI can unlock)
    //       'ready' (readiness: higher = better prepared)
    var Q = [
        { type: 'opp', cat: 'Time', q: 'Roughly how much of your team&rsquo;s week goes to repetitive admin: data entry, copying between systems, chasing follow-ups?',
          o: ['Less than 10%', '10&ndash;20%', '20&ndash;35%', 'More than a third'],
          tip: ['Admin is eating real capacity', 'At this level, automating intake, data entry and follow-ups is usually the fastest payback in the business.'] },
        { type: 'opp', cat: 'Customers', q: 'When a new lead or customer enquiry comes in, how quickly does someone respond?',
          o: ['Within minutes', 'Same day', 'Within 1&ndash;2 days', 'It varies, and some slip through'],
          tip: ['Speed-to-lead is costing you sales', 'An AI assistant can acknowledge, qualify and route every enquiry in minutes, day or night.'] },
        { type: 'opp', cat: 'Systems', q: 'How many different systems does your team type the same information into?',
          o: ['Just one', 'Two', 'Three or four', 'Five or more'],
          tip: ['Double entry is a quick win', 'Connecting the systems you already own removes re-keying and the errors that come with it.'] },
        { type: 'opp', cat: 'Reporting', q: 'How do you get the numbers you use to make decisions?',
          o: ['Live dashboards, automatically', 'Someone compiles them weekly', 'Manually, monthly or less', 'Mostly gut feel'],
          tip: ['Reporting can run itself', 'A weekly business pulse pulled automatically from your systems saves hours and surfaces problems sooner.'] },
        { type: 'ready', cat: 'Adoption', q: 'How is your team using AI tools like ChatGPT, Copilot or Gemini today?',
          o: ['Not at all', 'A few people, informally', 'Several people, regularly', 'Company-wide, with guidelines'],
          tip: ['Build skills before systems', 'A hands-on workshop gets everyone using AI safely in their daily work, and surfaces where the bigger wins are.'] },
        { type: 'ready', cat: 'Data', q: 'Where does most of your business information live?',
          o: ['Paper and people&rsquo;s heads', 'Scattered across files and email', 'Mostly in a few core systems', 'Well-organized cloud systems'],
          tip: ['Get your information in one place', 'AI is only as good as what it can reach. Consolidating key data is often step one of a good roadmap.'] },
        { type: 'ready', cat: 'Process', q: 'Are your key workflows written down?',
          o: ['Not really', 'A few of them', 'Most of them', 'Documented and followed'],
          tip: ['Document before you automate', 'Mapping how work actually flows is the foundation for automation, and it&rsquo;s built into our assessment.'] },
        { type: 'ready', cat: 'Risk', q: 'Do you have rules for what staff can put into AI tools?',
          o: ['Haven&rsquo;t thought about it', 'Concerned, but nothing in place', 'Informal rules', 'A written policy'],
          tip: ['Close the data-risk gap', 'Staff are likely already pasting client data into free AI tools. A simple acceptable-use policy fixes that quickly.'] },
        { type: 'ready', cat: 'Leadership', q: 'How committed is leadership to adopting AI this year?',
          o: ['Curious', 'Interested, but no budget', 'Budget set aside', 'It&rsquo;s a strategic priority'],
          tip: ['Start with a clear business case', 'A costed roadmap turns curiosity into a decision you can budget for with confidence.'] }
    ];

    var answers = new Array(Q.length);
    var i = 0;
    var BOOK = 'https://cal.com/birchmont-discovery';
    var ARROW = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    var startBtn = root.querySelector('[data-sc-start]');
    var intro = root.querySelector('[data-sc-intro]');
    var stage = root.querySelector('[data-sc-stage]');
    startBtn.addEventListener('click', function () { intro.hidden = true; stage.hidden = false; render(); });

    function strip(html) { var d = document.createElement('div'); d.innerHTML = html; return d.textContent; }

    function render() {
        var q = Q[i];
        var opts = q.o.map(function (txt, v) {
            return '<label class="sc__opt"><input type="radio" name="sc" value="' + v + '"' + (answers[i] === v ? ' checked' : '') + '><i></i><span>' + txt + '</span></label>';
        }).join('');
        stage.innerHTML =
            '<div class="sc__card">' +
                '<div class="sc__progress"><span>Question ' + (i + 1) + ' of ' + Q.length + '</span><div class="sc__bar"><i style="width:' + (i / Q.length * 100) + '%"></i></div></div>' +
                '<div class="sc__cat">' + q.cat + '</div>' +
                '<fieldset class="sc__opts"><legend class="sc__q" id="sc-q">' + q.q + '</legend>' + opts + '</fieldset>' +
                '<div class="sc__nav"><button type="button" class="sc__back"' + (i === 0 ? ' hidden' : '') + '>&larr; Back</button>' +
                '<span class="note">Pick the closest answer</span></div>' +
            '</div>';
        stage.querySelectorAll('input').forEach(function (inp) {
            inp.addEventListener('change', function () {
                answers[i] = parseInt(inp.value, 10);
                setTimeout(next, 220);
            });
        });
        stage.querySelector('.sc__back').addEventListener('click', function () { if (i > 0) { i--; render(); } });
        var first = stage.querySelector('input:checked') || stage.querySelector('input');
        if (first) first.focus({ preventScroll: true });
        stage.scrollIntoView({ block: 'nearest' });
    }

    function next() {
        if (i < Q.length - 1) { i++; render(); } else { results(); }
    }

    function pct(type) {
        var sum = 0, max = 0;
        Q.forEach(function (q, k) { if (q.type === type) { sum += answers[k]; max += 3; } });
        return Math.round(sum / max * 100);
    }

    function results() {
        var opp = pct('opp'), ready = pct('ready');
        var v;
        if (opp >= 50 && ready >= 50) {
            v = { t: 'Ready to build. Your first AI win is close.', d: 'There&rsquo;s significant time to recover and your foundations are solid. An Automation Sprint can put your highest-value workflow live in 4&ndash;6 weeks. If you&rsquo;re not sure which workflow to start with, the Assessment will rank them for you.', pkg: 'Automation Sprint', key: 'sprint' };
        } else if (opp >= 50) {
            v = { t: 'Big upside. Get the foundations right first.', d: 'Your business has clear opportunities to save time, but a few gaps in data, process or policy could slow things down. An AI Opportunity Assessment maps both, so you invest in the right order.', pkg: 'AI Opportunity Assessment', key: 'assessment' };
        } else if (ready >= 50) {
            v = { t: 'Well set up. Time to find the next edge.', d: 'Your operations are already in good shape. The gains will come from targeted use cases rather than broad automation. An Assessment will find the handful that are worth doing.', pkg: 'AI Opportunity Assessment', key: 'assessment' };
        } else {
            v = { t: 'Start with your people.', d: 'The fastest, lowest-risk step is getting your team confident with AI in their daily work, with clear guardrails. A Kickstart Workshop does exactly that in half a day.', pkg: 'AI Kickstart Workshop', key: 'workshop' };
        }

        // Tips: biggest opportunities (high opp answers) + biggest readiness gaps (low ready answers)
        var ranked = Q.map(function (q, k) {
            var weight = q.type === 'opp' ? answers[k] : 3 - answers[k];
            return { k: k, w: weight };
        }).filter(function (x) { return x.w >= 2; }).sort(function (a, b) { return b.w - a.w; }).slice(0, 3);
        if (!ranked.length) ranked = [{ k: 4 }];
        var tips = ranked.map(function (x) { var t = Q[x.k].tip; return '<li><b>' + t[0] + '</b><span>' + t[1] + '</span></li>'; }).join('');

        var summary = 'Opportunity: ' + opp + '/100 | Readiness: ' + ready + '/100\nRecommendation: ' + v.pkg + '\n\n' +
            Q.map(function (q, k) { return '- ' + strip(q.q) + ' → ' + strip(q.o[answers[k]]); }).join('\n');

        stage.innerHTML =
            '<div class="sc__card">' +
                '<div class="sc__cat">Your results</div>' +
                '<h2 class="h-md">Your AI readiness snapshot</h2>' +
                '<div class="sc-result__head">' +
                    gauge('Opportunity', opp, 'How much time and value AI could unlock in your business.') +
                    gauge('Readiness', ready, 'How prepared your data, processes and team are today.') +
                '</div>' +
                '<div class="sc-verdict"><h3>' + v.t + '</h3><p>' + v.d + '</p>' +
                    '<div class="btn-row"><a class="btn btn--primary" href="' + BOOK + '" target="_blank" rel="noopener">Book a free call ' + ARROW + '</a>' +
                    '<a class="btn btn--ghost" href="/packages/#' + v.key + '">See the ' + v.pkg + '</a></div></div>' +
                '<h3 style="font-size:18px;margin-bottom:14px;">Where to focus first</h3>' +
                '<ul class="sc-tips">' + tips + '</ul>' +
                '<div class="sc-capture"><h3>Want this in your inbox, plus a free 15-minute debrief?</h3>' +
                    '<p>We&rsquo;ll review your answers and send two or three specific ideas for your business.</p>' +
                    '<div data-sc-form></div></div>' +
                '<div class="sc__nav"><button type="button" class="sc__back" data-sc-restart>&larr; Retake the scorecard</button></div>' +
            '</div>';
        requestAnimationFrame(function () {
            stage.querySelectorAll('.gauge__bar i').forEach(function (b) { b.style.width = b.dataset.w + '%'; });
        });
        stage.querySelector('[data-sc-restart]').addEventListener('click', function () { answers = new Array(Q.length); i = 0; render(); });
        if (window.BirchmontLead) window.BirchmontLead.renderScorecard(stage.querySelector('[data-sc-form]'), function () { return summary; });
        stage.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function gauge(label, val, desc) {
        return '<div class="gauge"><div class="gauge__top"><span>' + label + '</span><b>' + val + '<small style="font-size:15px;color:var(--muted);">/100</small></b></div>' +
            '<div class="gauge__bar"><i style="width:0" data-w="' + val + '"></i></div><p>' + desc + '</p></div>';
    }
})();
