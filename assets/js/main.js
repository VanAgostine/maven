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
           quote never flashes in unmasked. Duration is strictly proportional to
           line length with no clamp, so every quote reveals at the identical
           speed -- the same letters per second -- however long or short it is.
           A short line simply finishes sooner; a long one takes longer. Paired
           with linear timing in the CSS, the pace is even within each line too. */
        if (!reduce) {
            const MS_PER_CHAR = 65;
            const chars = [...revealEl.textContent].length;
            revealEl.style.setProperty('--reveal-dur', chars * MS_PER_CHAR + 'ms');
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
