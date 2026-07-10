/* ============================================
   MAVEN TRAVEL — Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ----- Nav Panel Toggle ----- */

    const menuBtn  = document.querySelector('.header__menu-btn');
    const overlay  = document.querySelector('.nav-overlay');
    const closeBtn = document.querySelector('.nav-overlay__close');

    function openNav()  {
        if (!overlay) return;
        overlay.classList.add('nav-overlay--open');
        document.body.style.overflow = 'hidden';
    }

    function closeNav() {
        if (!overlay) return;
        overlay.classList.remove('nav-overlay--open');
        document.body.style.overflow = '';
    }

    if (menuBtn)  menuBtn.addEventListener('click', openNav);
    if (closeBtn) closeBtn.addEventListener('click', closeNav);

    /* Close when clicking the dimmed backdrop (outside the panel) */
    if (overlay) {
        overlay.addEventListener('click', e => {
            if (e.target === overlay) closeNav();
        });

        overlay.querySelectorAll('.nav-overlay__link').forEach(link => {
            link.addEventListener('click', closeNav);
        });
    }

    /* ----- Scroll Reveal (fast & smooth) ----- */

    const reveals = document.querySelectorAll('.reveal');

    if (reveals.length && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal--visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

        reveals.forEach(el => observer.observe(el));
    } else {
        reveals.forEach(el => el.classList.add('reveal--visible'));
    }

    /* ----- Marquee Duplication ----- */

    document.querySelectorAll('.marquee, .dest-marquee__track').forEach(m => {
        m.innerHTML += m.innerHTML;
    });

    /* ----- Typewriter (hero quote) ----- */

    const typeEl = document.querySelector('[data-typewriter]');
    if (typeEl) {
        const fullText = typeEl.textContent;
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const startDelay = parseInt(typeEl.dataset.typewriterDelay || '500', 10);
        if (!reduce) {
            const stagger = 42;

            /* Every glyph is laid out up front, so the line never reflows as it
               reveals — only opacity and blur change. Spread, not split(''),
               keeps the em dashes from being torn into surrogate halves. */
            const frag = document.createDocumentFragment();
            const chars = [...fullText].map(ch => {
                const span = document.createElement('span');
                span.className = 'tw-char';
                span.textContent = ch;
                frag.appendChild(span);
                return span;
            });
            typeEl.textContent = '';
            typeEl.appendChild(frag);

            /* Driven off the frame clock rather than chained timeouts, so the
               cadence can't drift as the tab throttles. */
            let lit = 0;
            let startedAt = null;
            const frame = now => {
                if (startedAt === null) startedAt = now;
                const target = Math.min(Math.floor((now - startedAt) / stagger) + 1, chars.length);
                while (lit < target) chars[lit++].classList.add('is-lit');
                if (lit < chars.length) requestAnimationFrame(frame);
            };
            setTimeout(() => requestAnimationFrame(frame), startDelay);
        }
    }

    /* ----- Smooth Scroll ----- */

    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const t = document.querySelector(a.getAttribute('href'));
            if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
        });
    });

    /* ----- Contact Form Handler ----- */

    const form = document.querySelector('.form');
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const btn = form.querySelector('.btn');
            if (btn) {
                const orig = btn.textContent;
                btn.textContent = 'Sending...';
                btn.style.pointerEvents = 'none';
                setTimeout(() => {
                    btn.textContent = 'Message Sent';
                    form.reset();
                    setTimeout(() => {
                        btn.textContent = orig;
                        btn.style.pointerEvents = '';
                    }, 3000);
                }, 1200);
            }
        });
    }

});
