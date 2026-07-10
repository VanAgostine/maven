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

    /* ----- Hero quote reveal ----- */

    const revealEl = document.querySelector('[data-reveal]');
    if (revealEl) {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const startDelay = parseInt(revealEl.dataset.revealDelay || '500', 10);

        /* The masked start state is already on screen via CSS (.has-js), so the
           quote never flashes in unmasked. All that's left is to pace the sweep
           by line length -- so a long quote and a short one reveal at the same
           calm speed, not the same duration -- and then trigger it. */
        if (!reduce) {
            const chars = [...revealEl.textContent].length;
            const dur = Math.min(4200, Math.max(2400, chars * 46));
            revealEl.style.setProperty('--reveal-dur', dur + 'ms');
            setTimeout(() => revealEl.classList.add('is-revealed'), startDelay);
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
