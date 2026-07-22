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

    /* ----- Custom click/drag scrollbar for horizontal card scrollers ----- */

    document.querySelectorAll('.expect-showcase').forEach(showcase => {
        const scroller = showcase.querySelector('.expect-showcase__scroller');
        const bar = showcase.querySelector('.expect-scrollbar');
        const thumb = bar && bar.querySelector('.expect-scrollbar__thumb');
        if (!scroller || !bar || !thumb) return;

        /* Size and position the thumb from the current scroll state. */
        const sync = () => {
            const max = scroller.scrollWidth - scroller.clientWidth;
            if (max <= 1) { bar.style.visibility = 'hidden'; return; }
            bar.style.visibility = 'visible';
            const widthPct = Math.max((scroller.clientWidth / scroller.scrollWidth) * 100, 10);
            thumb.style.width = widthPct + '%';
            thumb.style.left = (scroller.scrollLeft / max) * (100 - widthPct) + '%';
        };

        /* Map a pointer x on the track to a scroll position (thumb-centered). */
        const seek = (clientX, smooth) => {
            const rect = bar.getBoundingClientRect();
            const tw = thumb.offsetWidth;
            let p = (clientX - rect.left - tw / 2) / (rect.width - tw);
            p = Math.max(0, Math.min(1, p));
            const max = scroller.scrollWidth - scroller.clientWidth;
            scroller.scrollTo({ left: p * max, behavior: smooth ? 'smooth' : 'auto' });
        };

        scroller.addEventListener('scroll', sync, { passive: true });
        window.addEventListener('resize', sync);
        sync();

        /* Click the line to jump (smooth); drag the segment to scrub (instant). */
        let dragging = false, moved = false, downX = 0;
        bar.addEventListener('pointerdown', e => {
            dragging = true; moved = false; downX = e.clientX;
            bar.setPointerCapture(e.pointerId);
            e.preventDefault();
        });
        bar.addEventListener('pointermove', e => {
            if (!dragging) return;
            if (Math.abs(e.clientX - downX) > 3) moved = true;
            if (moved) seek(e.clientX, false);
        });
        const release = e => {
            if (!dragging) return;
            dragging = false;
            try { bar.releasePointerCapture(e.pointerId); } catch (_) {}
            if (!moved) seek(e.clientX, true);
        };
        bar.addEventListener('pointerup', release);
        bar.addEventListener('pointercancel', release);
    });

    /* ----- Hero quote reveal ----- */

    const revealEl = document.querySelector('[data-reveal]');
    if (revealEl) {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const startDelay = parseInt(revealEl.dataset.revealDelay || '0', 10);

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

            /* With no data-reveal-delay -- every page but home -- start on the
               next frame: the masked state has already painted, so the sweep
               still animates rather than jumping, and it begins the instant the
               page is up. Home passes a delay so its MAVEN wordmark leads. */
            const start = () => revealEl.classList.add('is-revealed');
            if (startDelay > 0) {
                setTimeout(start, startDelay);
            } else {
                requestAnimationFrame(() => requestAnimationFrame(start));
            }
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
    if (form && form.getAttribute('action')) {
        // Submit over AJAX so the visitor stays on the page and sees inline
        // feedback; the same endpoint also handles a no-JS POST as a fallback.
        const endpoint = form.getAttribute('action').replace('formsubmit.co/', 'formsubmit.co/ajax/');
        form.addEventListener('submit', e => {
            e.preventDefault();
            const btn = form.querySelector('.btn');
            if (!btn) return;
            const orig = btn.textContent;
            btn.textContent = 'Sending...';
            btn.style.pointerEvents = 'none';
            fetch(endpoint, {
                method: 'POST',
                headers: { 'Accept': 'application/json' },
                body: new FormData(form)
            })
                .then(res => res.json())
                .then(() => {
                    btn.textContent = 'Message Sent';
                    form.reset();
                })
                .catch(() => {
                    btn.textContent = 'Please email info@maventravelgroup.com';
                })
                .finally(() => {
                    setTimeout(() => {
                        btn.textContent = orig;
                        btn.style.pointerEvents = '';
                    }, 4000);
                });
        });
    }

});
