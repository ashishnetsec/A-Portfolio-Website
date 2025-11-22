

function DateandTime() {
    var is24Hour = false;
    var dateEl = document.querySelector('.Date-Time .date');
    var timeEl = document.querySelector('.Date-Time .time');
    var ampmEl = document.querySelector('.Date-Time .ampm');
    var toggleBtn = document.querySelector('.Date-Time .toggle-format');

    if (dateEl && timeEl && ampmEl && toggleBtn) {
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        function formatDate(d) {
            var w = days[d.getDay()];
            var day = d.getDate();
            if (day < 10) day = '0' + day;
            var mon = months[d.getMonth()];
            var year = d.getFullYear();
            return w + ', ' + day + ' ' + mon + ' ' + year;
        }

        function formatTime(d) {
            var h = d.getHours();
            var m = d.getMinutes();
            var s = d.getSeconds();
            var ampm = '';

            if (!is24Hour) {
                ampm = (h >= 12) ? 'PM' : 'AM';
                h = h % 12;
                if (h === 0) h = 12;
            }

            var hh = (h < 10) ? '0' + h : '' + h;
            var mm = (m < 10) ? '0' + m : '' + m;
            var ss = (s < 10) ? '0' + s : '' + s;

            return { timeStr: hh + ':' + mm + ':' + ss, ampm: ampm };
        }

        function updateDateTime() {
            var now = new Date();
            dateEl.textContent = formatDate(now);
            var t = formatTime(now);
            timeEl.textContent = t.timeStr;
            ampmEl.textContent = t.ampm;
        }

        updateDateTime();
        var msToNextSecond = 1000 - (Date.now() % 1000);
        setTimeout(function () {
            updateDateTime();
            setInterval(updateDateTime, 1000);
        }, msToNextSecond);

        toggleBtn.addEventListener('click', function () {
            is24Hour = !is24Hour;
            toggleBtn.textContent = is24Hour ? '12H' : '24H';

            toggleBtn.style.transform = 'translateY(-2px)';
            setTimeout(function () { toggleBtn.style.transform = ''; }, 120);
            updateDateTime();
        });
    }

}


function heroSlider() {
    var slides = document.querySelectorAll('.hero-slider .slide');
    if (!slides || slides.length === 0) return;
    var idx = 0;
    var total = slides.length;
    function show(i) {
        idx = (i + total) % total;
        for (var j = 0; j < total; j++) {
            slides[j].classList.remove('active');
        }
        slides[idx].classList.add('active');
    }
    show(0);
    var t = setInterval(function () { show(idx + 1); }, 5000);
    var wrap = document.querySelector('.hero-slider');
}

DateandTime();
heroSlider();

// FAQ: tabs + accordion (no attributes, parent-scoped)
function initFAQ() {
    setupFAQTabs();
    setupFAQAccordion();
}

function setupFAQTabs() {
    var faqRoot = document.getElementById('faq');
    if (!faqRoot) return;

    var tabs = faqRoot.querySelectorAll('.faq-tab');
    var panels = faqRoot.querySelectorAll('.faq-panel');

    // click handler for tabs
    faqRoot.querySelector('.faq-tabs').addEventListener('click', function (e) {
        var btn = e.target;
        if (!btn.classList || !btn.classList.contains('faq-tab')) return;
        var target = btn.getAttribute('data-tab');
        if (!target) return;

        // deactivate all tabs & panels
        for (var i = 0; i < tabs.length; i++) tabs[i].classList.remove('active');
        for (var j = 0; j < panels.length; j++) panels[j].classList.remove('active');

        // activate clicked tab & matching panel
        btn.classList.add('active');
        var panel = faqRoot.querySelector('.faq-panel[data-panel="' + target + '"]');
        if (panel) panel.classList.add('active');
    });
}

function setupFAQAccordion() {
    var faqRoot = document.getElementById('faq');
    if (!faqRoot) return;

    // event delegation: open/close accordion items inside the active panel
    faqRoot.addEventListener('click', function (e) {
        var tgt = e.target;

        // find the nearest .accordion-q button
        while (tgt && tgt !== faqRoot && !tgt.classList.contains('accordion-q')) {
            tgt = tgt.parentNode;
        }
        if (!tgt || tgt === faqRoot) return;

        // parent .accordion-item
        var item = tgt.closest('.accordion-item');
        if (!item) return;

        // toggle open (allow multiple open items)
        item.classList.toggle('open');
    });
}

initFAQ();


function initContactForm() {
    var root = document.getElementById("contact");
    if (!root) return;

    var fName = root.querySelector(".cf-first");
    var lName = root.querySelector(".cf-last");
    var mobile = root.querySelector(".cf-mobile");
    var email = root.querySelector(".cf-email");
    var purpose = root.querySelector(".cf-purpose");
    var submit = root.querySelector(".cf-submit");
    var success = root.querySelector(".success-msg");

    submit.addEventListener("click", function () {
        var isValid = true;

        // Reset all error messages
        var errors = root.querySelectorAll(".error-msg");
        for (var i = 0; i < errors.length; i++) errors[i].style.display = "none";

        // First Name
        if (fName.value.trim().length < 2) {
            showError(fName, "First name must be at least 2 characters");
        }

        // Last Name
        if (lName.value.trim().length < 2) {
            showError(lName, "Last name must be at least 2 characters");
            isValid = false;
        }

        // Mobile: only digits, length 10
        if (!/^[0-9]{10}$/.test(mobile.value.trim())) {
            showError(mobile, "Enter a valid 10-digit mobile number");
            isValid = false;
        }

        // Email: basic regex
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
            showError(email, "Enter a valid email");
            isValid = false;
        }

        // Purpose: min 10 chars
        if (purpose.value.trim().length < 10) {
            showError(purpose, "Please describe your purpose (min 10 characters)");
            isValid = false;
        }

        // SUCCESS
        if (isValid) {
            success.textContent = "Form submitted successfully!";
            success.style.display = "block";

            // Clear fields
            fName.value = "";
            lName.value = "";
            mobile.value = "";
            email.value = "";
            purpose.value = "";

            // Hide after 4 sec
            setTimeout(function () {
                success.style.display = "none";
            }, 4000);
        }
    });

    function showError(el, msg) {
        var error = el.parentNode.querySelector(".error-msg");
        error.textContent = msg;
        error.style.display = "block";
    }
}



initContactForm();

// Side panel open / close logic (parent-scoped; safe)
function initSidePanel() {
    var root = document.documentElement; // we toggle a class on <html> or <body>
    var overlay = document.getElementById('overlay');
    var panel = document.getElementById('sidePanel');
    var openBtn = document.querySelector('.NavBar-Bar');
    var closeBtn = panel ? panel.querySelector('.side-close') : null;

    if (!overlay || !panel || !openBtn) return;

    function openPanel() {
        root.classList.add('panel-open'); // shows overlay + slide-in
        // lock scroll
        document.body.style.overflow = 'hidden';
    }

    function closePanel() {
        root.classList.remove('panel-open');
        document.body.style.overflow = '';
    }

    openBtn.addEventListener('click', function () { openPanel(); });

    closeBtn.addEventListener('click', function () { closePanel(); });

    // clicking overlay closes panel
    overlay.addEventListener('click', function () { closePanel(); });

    // close on Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' || e.key === 'Esc') {
            if (document.documentElement.classList.contains('panel-open')) closePanel();
        }
    });

    // optional: when a link inside the panel is clicked, close panel
    panel.addEventListener('click', function (e) {
        var t = e.target;
        // if the click is an anchor, close the panel (the link will navigate)
        if (t && t.tagName === 'A') {
            closePanel();
        }
    });
}



initSidePanel();