document.addEventListener('contextmenu', e => {
    if (e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO') e.preventDefault();
});

document.addEventListener('DOMContentLoaded', function() {
    const backTop = document.querySelector('.back-to-top a');
    if (backTop) {
        backTop.addEventListener('click', function(e) {
            e.preventDefault();
            const lead = document.querySelector('#lead');
            if (lead) {
                lead.scrollIntoView({ behavior: 'smooth' });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    // Remove floating buttons on mobile
    if (window.innerWidth <= 768) {
        const floatingButtons = document.querySelector('.floating-buttons');
        if (floatingButtons) floatingButtons.remove();
    }
});

const scrollDown = document.getElementById('scroll-down');
if (scrollDown) {
    scrollDown.addEventListener('click', function(event) {
        event.preventDefault();
        window.scrollBy({
            top: window.innerHeight,
            behavior: 'smooth'
        });
    });
}



// Dark/Light theme toggle
const themeToggle = document.getElementById('theme-toggle');

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    document.body.classList.remove('dark-mode');
} else {
    document.body.classList.add('dark-mode');
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Header scroll state — frosted glass after hero + pill→full-width past hero
const siteHeader = document.querySelector('header');
function updateHeaderScroll() {
    siteHeader.classList.toggle('scrolled', window.scrollY > 40);
    const lead = document.querySelector('#lead');
    const heroHeight = lead ? lead.offsetHeight : window.innerHeight;
    siteHeader.classList.toggle('past-hero', window.scrollY > heroHeight * 0.65);
}
window.addEventListener('scroll', updateHeaderScroll, { passive: true });
updateHeaderScroll();


// Dynamic tab highlights in navbar (top + bottom)
// Active section highlighting in desktop nav
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('header nav a');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= (sectionTop - 80)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkSection = link.getAttribute('href').replace(/.*#/, '');
            if (linkSection === current) {
                link.classList.add('active');
            }
        });
    }, { passive: true });
});

// Full-screen mobile menu
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('nav-hamburger');
    const navOverlay = document.getElementById('nav-overlay');
    if (!hamburger || !navOverlay) return;

    function openMenu() {
        hamburger.classList.add('is-open');
        hamburger.setAttribute('aria-expanded', 'true');
        hamburger.setAttribute('aria-label', 'Close navigation menu');
        navOverlay.classList.add('is-open');
        navOverlay.removeAttribute('aria-hidden');
        document.body.classList.add('no-scroll');
    }

    function closeMenu() {
        hamburger.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Open navigation menu');
        navOverlay.classList.remove('is-open');
        navOverlay.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('no-scroll');
    }

    hamburger.addEventListener('click', () => {
        hamburger.classList.contains('is-open') ? closeMenu() : openMenu();
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navOverlay.classList.contains('is-open')) closeMenu();
    });

    // Close when a link is tapped
    navOverlay.querySelectorAll('.overlay-link').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
});

// Floating Back-to-top & Resume buttons
window.addEventListener('scroll', function() {
    const floatingButtons = document.querySelector('.floating-buttons');
    if (!floatingButtons) return;
    if (window.scrollY > 300) {
        floatingButtons.classList.add('visible');
    } else {
        floatingButtons.classList.remove('visible');
    }
});

const scrollTopBtn = document.querySelector('.scroll-top');
if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}


// Journey section: animated spine + strip active state + scroll-to
document.addEventListener('DOMContentLoaded', () => {
    const log = document.querySelector('.journey-log');
    if (!log) return;

    const chapters = [...log.querySelectorAll('.journey-chapter')];
    const stripBtns = [...document.querySelectorAll('.strip-year')];

    // Animate spine in when log enters viewport
    const spineObs = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) { log.classList.add('spine-active'); spineObs.disconnect(); }
    }, { threshold: 0.05 });
    spineObs.observe(log);

    // Fade-in chapters + sync active strip year
    const chapterObs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                stripBtns.forEach(b => {
                    const isActive = b.dataset.target === entry.target.id;
                    b.classList.toggle('active', isActive);
                    entry.target.classList.toggle('strip-active', isActive);
                });
            }
        });
    }, { threshold: 0.2, rootMargin: '-10% 0px -50% 0px' });
    chapters.forEach(c => chapterObs.observe(c));

    // Strip button click → smooth scroll to chapter
    stripBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = document.getElementById(btn.dataset.target);
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
});

// ── Journey Map ────────────────────────────────────────────────────────────────
// Token is loaded from mapbox_config.js (gitignored). See mapbox_config.example.js.

class JourneyMap {
    constructor(containerId, data) {
        this.containerId = containerId;
        // Split data by type: experience stops drive the tour, others are extras
        this.data         = data.filter(s => ['home','work','education'].includes(s.type));
        this.personalPins = data.filter(s => s.type === 'personal');
        this.wishlistPins = data.filter(s => s.type === 'wishlist');

        this.currentIndex = 0;
        this.map = null;
        this._pathLayers = [];
        this._pinMarkers = [];
        this._planeMarker = null;
        this._planeRafId = null;
        this._revealRafId = null;
        this._distRafId = null;
        this._isAnimating = false;
        this._journeyStarted = false;

        // Speed control: multiplies all animation durations
        this._speedMultiplier = 1;

        // Pause state
        this._paused = false;
        this._pendingResume = null;

        // Cumulative km to each stop (precomputed)
        this._cumDistances = [];
        this._totalDistanceSoFar = 0;

        // File-based audio — off by default; user opts in via the start gate or mute button
        this._audioEl = null;
        this._muted = true;

        // Free explore mode
        this._freeExploreActive = false;
        this._personalMarkers = [];
        this._wishlistMarkers = [];
    }

    // ── Initialisation ────────────────────────────────────────────────────────

    init() {
        mapboxgl.accessToken = MAPBOX_TOKEN;

        this.map = new mapboxgl.Map({
            container: this.containerId,
            // High-res v12 imagery; non-raster layers are hidden below after style.load
            style: 'mapbox://styles/mapbox/satellite-streets-v12',
            center: [20, 15],
            zoom: 1.8,
            projection: 'globe',
            attributionControl: true,
        });

        this.map.scrollZoom.disable();
        this.map.dragRotate.disable();
        this.map.dragPan.disable();

        this.map.once('style.load', () => {
            // Hide all vector layers (streets, labels, POIs) — keep only raster satellite imagery
            this.map.getStyle().layers.forEach(layer => {
                if (layer.type !== 'raster' && layer.type !== 'background') {
                    this.map.setLayoutProperty(layer.id, 'visibility', 'none');
                }
            });

            this.map.setFog({
                color: 'rgb(186, 210, 235)',
                'high-color': 'rgb(36, 92, 223)',
                'horizon-blend': 0.02,
                'space-color': 'rgb(11, 11, 25)',
                'star-intensity': 0.6,
            });

            this._precomputeDistances();
            this._buildDots();
            this._buildPersonalPins();
            this._buildWishlistPins();
            this._bindNav();

            // Show start gate; nav and controls stay hidden until journey begins
            this._setControlsVisible(false);
            const gate = document.getElementById('jmap-start-gate');
            if (gate) gate.classList.add('visible');

            const startBtn = document.getElementById('jmap-start-btn');
            if (startBtn) startBtn.addEventListener('click', () => this._startJourney(), { once: true });

            const gateMusicBtn = document.getElementById('jmap-gate-music-toggle');
            if (gateMusicBtn) gateMusicBtn.addEventListener('click', () => {
                this._muted = !this._muted;
                this._syncMuteUI();
            });
            this._syncMuteUI();
        });
    }

    _setControlsVisible(visible) {
        const nav = document.querySelector('.jmap-nav');
        const controls = document.getElementById('jmap-controls');
        const dist = document.getElementById('jmap-distance');
        [nav, controls, dist].forEach(el => {
            if (!el) return;
            el.classList.toggle('visible', visible);
        });
    }

    _startJourney() {
        const gate = document.getElementById('jmap-start-gate');
        if (gate) {
            gate.classList.remove('visible');
            // Gate fades out; disable pointer events immediately to prevent double-click
            gate.style.pointerEvents = 'none';
        }

        // Start audio on user gesture (required by browsers) — only if opted in via the gate toggle
        this._audioEl = document.getElementById('jmap-audio');
        if (this._audioEl && !this._muted) {
            this._audioEl.volume = 0;
            this._audioEl.play().catch(() => {});
            this._fadeAudio(0, 0.35, 1500);
        }
        this._syncMuteUI();

        this._journeyStarted = true;

        const d = ms => ms / this._speedMultiplier;
        setTimeout(() => {
            this._setControlsVisible(true);
            this._flyToHome();
            setTimeout(() => this._showHint(), 800);
        }, d(400));
    }

    // ── Distances ─────────────────────────────────────────────────────────────

    _precomputeDistances() {
        this._cumDistances = [0];
        for (let i = 1; i < this.data.length; i++) {
            const d = turf.distance(
                turf.point(this.data[i - 1].coordinates),
                turf.point(this.data[i].coordinates),
                { units: 'kilometers' }
            );
            this._cumDistances.push(this._cumDistances[i - 1] + Math.round(d));
        }
    }

    // ── Core navigation ───────────────────────────────────────────────────────

    _flyToHome() {
        const home = this.data[0];
        const d = ms => ms / this._speedMultiplier;

        this.map.flyTo({
            center: home.coordinates,
            zoom: 12,
            pitch: 50,
            bearing: -15,
            duration: d(4500),
            essential: true,
        });

        setTimeout(() => {
            this._addPin(home, 0);
            this._showInfoCard(home);
            this._updateNav();
        }, d(4200));
    }

    goTo(index) {
        if (this._isAnimating) return;

        // Advance past the last stop → trigger finale
        if (index >= this.data.length) {
            this._doFinale();
            return;
        }

        if (index < 0) return;

        this._isAnimating = true;

        const prev = this.data[this.currentIndex];
        const stop = this.data[index];
        const goingForward = index > this.currentIndex;
        this.currentIndex = index;

        this._hideInfoCard();

        // Update distance counter
        const targetKm = this._cumDistances[index] || 0;
        this._animateDistanceCounter(this._totalDistanceSoFar, targetKm);
        this._totalDistanceSoFar = targetKm;

        const proceed = () => {
            if (goingForward && stop.transitionType) {
                if (stop.transitionType === 'flight') {
                    this._doFlightTransition(prev, stop);
                } else {
                    this._doRoadTransition(prev, stop);
                }
            } else {
                // Backward or no transition: simple fly
                const d = ms => ms / this._speedMultiplier;
                this.map.flyTo({
                    center: stop.coordinates,
                    zoom: 12,
                    pitch: 50,
                    duration: d(2500),
                    essential: true,
                });
                setTimeout(() => this._completeStop(stop), d(2400));
            }
        };

        proceed();
    }

    _completeStop(stop) {
        const fn = () => {
            this._addPin(stop, this.currentIndex);
            this._showInfoCard(stop);
            this._updateNav();
            this._updateDots();
            this._isAnimating = false;
        };
        if (this._paused) {
            this._pendingResume = fn;
        } else {
            fn();
        }
    }

    // ── Transitions ───────────────────────────────────────────────────────────

    _doRoadTransition(prev, stop) {
        const d = ms => ms / this._speedMultiplier;
        const params = this._getFlightParams(
            turf.distance(turf.point(prev.coordinates), turf.point(stop.coordinates), { units: 'kilometers' })
        );

        const coords = this._interpolate(prev.coordinates, stop.coordinates, 60);
        this._drawAnimatedPath(coords, 'road');

        this.map.flyTo({
            center: stop.coordinates,
            zoom: params.zoom,
            pitch: params.pitch,
            speed: params.speed * this._speedMultiplier,
            curve: params.curve,
            essential: true,
        });

        setTimeout(() => this._completeStop(stop), d(2600));
    }

    _doFlightTransition(prev, stop) {
        const d = ms => ms / this._speedMultiplier;
        const distKm = turf.distance(
            turf.point(prev.coordinates),
            turf.point(stop.coordinates),
            { units: 'kilometers' }
        );
        const params = this._getFlightParams(distKm);

        const arcFeature = turf.greatCircle(
            turf.point(prev.coordinates),
            turf.point(stop.coordinates),
            { npoints: 120 }
        );
        const arcCoords = arcFeature.geometry.coordinates;

        const midIdx = Math.floor(arcCoords.length / 2);
        const midPoint = arcCoords[midIdx];

        // Zoom out to show arc
        this.map.flyTo({
            center: midPoint,
            zoom: params.arcZoom,
            pitch: params.arcPitch,
            duration: d(1800),
            essential: true,
        });

        setTimeout(() => {
            const planeDuration = d(3500);
            this._drawAnimatedPath(arcCoords, 'flight');
            this._animatePlane(arcCoords, planeDuration);

            // Wait for the plane to complete its full arc before moving the camera
            setTimeout(() => {
                this.map.flyTo({
                    center: stop.coordinates,
                    zoom: params.zoom,
                    pitch: params.pitch,
                    duration: d(2500),
                    essential: true,
                });

                setTimeout(() => this._completeStop(stop), d(2300));
            }, planeDuration + d(300));
        }, d(1900));
    }

    // Returns camera params tuned to the distance of the move
    _getFlightParams(distKm) {
        if (distKm < 50) {
            return { zoom: 13, pitch: 45, arcZoom: 10, arcPitch: 30, speed: 1.2, curve: 1.0 };
        } else if (distKm < 500) {
            return { zoom: 11, pitch: 50, arcZoom: 5,  arcPitch: 25, speed: 0.9, curve: 1.4 };
        } else {
            // International — high arc shows Earth curvature
            return { zoom: 10, pitch: 35, arcZoom: 2.2, arcPitch: 20, speed: 0.7, curve: 2.0 };
        }
    }

    // ── Path drawing ──────────────────────────────────────────────────────────

    _drawAnimatedPath(coords, type) {
        const base = `path-${Date.now()}`;
        const sourceId = `${base}-src`;
        const idBloom  = `${base}-bloom`;
        const idGlow   = `${base}-glow`;
        const idCore   = `${base}-core`;

        const isFlight = type === 'flight';
        const bloomColor = isFlight ? '#fff5cc' : '#e0e8ff';
        const glowColor  = isFlight ? '#ffe066' : '#c0ccff';
        const coreColor  = '#ffffff';

        this.map.addSource(sourceId, {
            type: 'geojson',
            data: { type: 'Feature', geometry: { type: 'LineString', coordinates: coords.slice(0, 2) } },
        });

        // Layer 1 — diffuse outer bloom
        this.map.addLayer({
            id: idBloom, type: 'line', source: sourceId,
            layout: { 'line-cap': 'round', 'line-join': 'round' },
            paint: { 'line-color': bloomColor, 'line-width': 18, 'line-blur': 14, 'line-opacity': 0.22 },
        });

        // Layer 2 — tight inner glow
        this.map.addLayer({
            id: idGlow, type: 'line', source: sourceId,
            layout: { 'line-cap': 'round', 'line-join': 'round' },
            paint: { 'line-color': glowColor, 'line-width': 7, 'line-blur': 5, 'line-opacity': 0.6 },
        });

        // Layer 3 — bright core (dashed to indicate direction)
        this.map.addLayer({
            id: idCore, type: 'line', source: sourceId,
            layout: { 'line-cap': 'round', 'line-join': 'round' },
            paint: {
                'line-color': coreColor,
                'line-width': isFlight ? 1.8 : 1.5,
                'line-blur': 0,
                'line-opacity': 1,
                'line-dasharray': isFlight ? [3, 2] : [2, 2],
            },
        });

        this._pathLayers.push(
            { id: idBloom, sourceId },
            { id: idGlow,  sourceId: null },
            { id: idCore,  sourceId: null },
        );

        const revealDuration = (isFlight ? 4200 : 2000) / this._speedMultiplier;
        const startTime = performance.now();
        const total = coords.length;

        const reveal = (now) => {
            const t = Math.min((now - startTime) / revealDuration, 1);
            const eased = 1 - Math.pow(1 - t, 2);
            const count = Math.max(2, Math.floor(eased * total));
            const src = this.map.getSource(sourceId);
            if (src) {
                src.setData({ type: 'Feature', geometry: { type: 'LineString', coordinates: coords.slice(0, count) } });
            }
            if (t < 1) this._revealRafId = requestAnimationFrame(reveal);
        };

        this._revealRafId = requestAnimationFrame(reveal);
    }

    // ── Plane animation ───────────────────────────────────────────────────────

    _animatePlane(arcCoords, durationMs) {
        if (this._planeMarker) { this._planeMarker.remove(); this._planeMarker = null; }
        if (this._planeRafId) cancelAnimationFrame(this._planeRafId);

        const el = document.createElement('div');
        el.className = 'jmap-plane';

        // Rotate child only — Mapbox owns translate() on the wrapper element
        const icon = document.createElement('div');
        icon.className = 'jmap-plane-icon';
        icon.textContent = '✈';
        el.appendChild(icon);

        this._planeMarker = new mapboxgl.Marker({ element: el, anchor: 'center' })
            .setLngLat(arcCoords[0])
            .addTo(this.map);

        const total = arcCoords.length;
        const startTime = performance.now();

        const fly = (now) => {
            const t = Math.min((now - startTime) / durationMs, 1);
            const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
            const idx = Math.min(Math.floor(eased * (total - 1)), total - 1);

            this._planeMarker.setLngLat(arcCoords[idx]);

            if (idx < total - 1) {
                const bearing = this._bearing(arcCoords[idx], arcCoords[Math.min(idx + 1, total - 1)]);
                icon.style.transform = `rotate(${bearing - 90}deg)`;
            }

            if (t < 1) {
                this._planeRafId = requestAnimationFrame(fly);
            } else {
                setTimeout(() => {
                    if (this._planeMarker) { this._planeMarker.remove(); this._planeMarker = null; }
                }, 500 / this._speedMultiplier);
            }
        };

        this._planeRafId = requestAnimationFrame(fly);
    }

    // ── Map pins ──────────────────────────────────────────────────────────────

    _addPin(stop, index) {
        const el = document.createElement('div');
        el.className = 'jmap-pin';
        el.dataset.type = stop.type;

        const inner = document.createElement('div');
        inner.className = 'jmap-pin-inner';

        if (stop.logo) {
            const img = document.createElement('img');
            img.src = stop.logo;
            img.alt = stop.org;
            inner.appendChild(img);
        } else {
            const span = document.createElement('span');
            span.textContent = '🏠';
            inner.appendChild(span);
        }

        el.appendChild(inner);
        el.addEventListener('click', () => this._showInfoCard(stop));

        const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
            .setLngLat(stop.coordinates)
            .addTo(this.map);

        this._pinMarkers.push(marker);
    }

    // ── Info card: staggered progressive reveal ───────────────────────────────

    _hideInfoCard() {
        const card = document.querySelector('.jmap-info-card');
        if (!card) return;
        card.classList.remove('visible');
        card.querySelectorAll('[data-reveal]').forEach(el => el.classList.remove('revealed'));
        card.querySelectorAll('.jmap-bullets li').forEach(li => li.classList.remove('revealed'));
        card.querySelectorAll('.jmap-skill-chip').forEach(c => c.remove());
    }

    _showInfoCard(stop) {
        const card = document.querySelector('.jmap-info-card');
        if (!card) return;

        // Populate content
        const logo = card.querySelector('.jmap-logo');
        if (stop.logo) {
            logo.src = stop.logo;
            logo.alt = stop.org;
            logo.style.display = '';
        } else {
            logo.src = '';
            logo.style.display = 'none';
        }

        const badge = card.querySelector('.jmap-type-badge');
        badge.textContent = { work: 'Work', education: 'Education', home: 'Home' }[stop.type] || stop.type;
        badge.dataset.type = stop.type;

        card.querySelector('.jmap-org').textContent = stop.org;
        card.querySelector('.jmap-role').textContent = stop.role;
        card.querySelector('.jmap-date').textContent = stop.dateRange;
        card.querySelector('.jmap-location').textContent = stop.location;

        // Each bullet gets data-reveal so it can be staggered
        card.querySelector('.jmap-bullets').innerHTML =
            (stop.bullets || []).map(b => `<li data-reveal>${b}</li>`).join('');

        // Skill chips inside the card
        const chipsEl = card.querySelector('.jmap-skill-chips');
        if (chipsEl) {
            chipsEl.innerHTML = (stop.skills || [])
                .map(s => `<span class="jmap-skill-chip">${s}</span>`).join('');
        }

        const quoteEl = card.querySelector('.jmap-quote');
        if (quoteEl) quoteEl.textContent = stop.quote || '';

        const storyBtn = card.querySelector('.jmap-story-btn');
        if (storyBtn) {
            const hasContent = (stop.story && stop.story.trim()) || (stop.photos && stop.photos.length);
            storyBtn.style.display = hasContent ? '' : 'none';
            storyBtn.onclick = () => this._showExpandedPanel(stop);
        }

        // Show card shell immediately (glassmorphic container)
        card.classList.add('visible');

        // Check reduced-motion preference: if so, reveal everything at once
        const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (noMotion) {
            card.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('revealed'));
            return;
        }

        // Staggered reveal
        const d = ms => ms / this._speedMultiplier;
        const bullets = Array.from(card.querySelectorAll('.jmap-bullets li[data-reveal]'));

        setTimeout(() => card.querySelector('.jmap-card-top[data-reveal]')?.classList.add('revealed'), d(60));
        bullets.forEach((li, i) => {
            setTimeout(() => li.classList.add('revealed'), d(200 + i * 140));
        });
        // Chips after bullets
        const chipsDelay = d(200 + bullets.length * 140 + 80);
        setTimeout(() => chipsEl?.classList.add('revealed'), chipsDelay);
        // Quote after chips
        const quoteDelay = chipsDelay + d(100);
        setTimeout(() => quoteEl?.classList.add('revealed'), quoteDelay);
    }

    // ── Distance counter ──────────────────────────────────────────────────────

    _animateDistanceCounter(fromKm, toKm) {
        if (this._distRafId) cancelAnimationFrame(this._distRafId);
        const valEl = document.getElementById('jmap-dist-val');
        if (!valEl) return;

        const duration = 2000 / this._speedMultiplier;
        const start = performance.now();

        const tick = (now) => {
            const t = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            valEl.textContent = Math.round(fromKm + (toKm - fromKm) * eased).toLocaleString();
            if (t < 1) {
                this._distRafId = requestAnimationFrame(tick);
            } else {
                this._distRafId = null;
            }
        };

        this._distRafId = requestAnimationFrame(tick);
    }

    // ── Pause / Explore mode ──────────────────────────────────────────────────

    _togglePause() {
        this._paused = !this._paused;
        const btn = document.getElementById('jmap-pause-btn');

        if (this._paused) {
            this.map.stop();
            this.map.dragPan.enable();
            this.map.scrollZoom.enable();
            this.map.dragRotate.enable();
            if (btn) { this._setCtrlBtn(btn, '▶', 'Resume'); btn.setAttribute('aria-label', 'Resume journey'); btn.classList.add('active'); }
        } else {
            this.map.dragPan.disable();
            this.map.scrollZoom.disable();
            this.map.dragRotate.disable();
            if (btn) { this._setCtrlBtn(btn, '⏸', 'Pause'); btn.setAttribute('aria-label', 'Pause journey'); btn.classList.remove('active'); }

            if (this._pendingResume) {
                const fn = this._pendingResume;
                this._pendingResume = null;
                fn();
            } else {
                // No pending step — re-show current stop
                this._showInfoCard(this.data[this.currentIndex]);
                this._isAnimating = false;
            }
        }
    }

    // ── Speed control ─────────────────────────────────────────────────────────

    _toggleSpeed() {
        this._speedMultiplier = this._speedMultiplier === 1 ? 2 : 1;
        const btn = document.getElementById('jmap-speed-btn');
        if (btn) {
            const fast = this._speedMultiplier === 2;
            this._setCtrlBtn(btn, fast ? '2×' : '1×', 'Speed');
            btn.classList.toggle('active', fast);
        }
    }

    // Set icon + label sub-elements on a mixer-style control button
    _setCtrlBtn(btn, icon, label) {
        const iconEl = btn.querySelector('.jmap-ctrl-icon');
        const labelEl = btn.querySelector('.jmap-ctrl-label');
        if (iconEl) iconEl.textContent = icon;
        if (labelEl) labelEl.textContent = label;
    }

    // ── Grand finale ──────────────────────────────────────────────────────────

    _doFinale() {
        if (this._isAnimating) return;
        this._isAnimating = true;

        this._hideInfoCard();

        const pauseBtn = document.getElementById('jmap-pause-btn');
        if (pauseBtn) pauseBtn.disabled = true;

        const d = ms => ms / this._speedMultiplier;
        const mapEl = document.getElementById('journey-map');

        // Pull back to arc vantage point — North Atlantic/Greenland view shows full India→US trail
        this.map.flyTo({
            center: [-20, 55],
            zoom: 1.7,
            pitch: 15,
            bearing: 0,
            duration: d(3500),
            essential: true,
        });

        setTimeout(() => {
            this._drawFinaleTrail();

            // Step 1: dim the map to near-black
            setTimeout(() => {
                if (mapEl) mapEl.classList.add('jmap-dim');

                // Step 2: fade in the quote over the darkness
                setTimeout(() => {
                    const overlay = document.getElementById('jmap-finale-overlay');
                    if (overlay) {
                        overlay.setAttribute('aria-hidden', 'false');
                        overlay.classList.add('visible');
                    }

                    // Step 3: after 3s on dark, brighten back to reveal globe + trail beneath
                    setTimeout(() => {
                        if (mapEl) {
                            mapEl.classList.remove('jmap-dim');
                            mapEl.classList.add('jmap-brighten');
                        }
                        // Wire finale action buttons (done here so they only activate after reveal)
                        const restartBtn = document.getElementById('jmap-restart-btn');
                        if (restartBtn) restartBtn.onclick = () => this._resetJourney();
                        const freeExploreFinaleBtn = document.getElementById('jmap-freeexplore-btn');
                        if (freeExploreFinaleBtn) freeExploreFinaleBtn.onclick = () => {
                            const overlay = document.getElementById('jmap-finale-overlay');
                            if (overlay) { overlay.classList.remove('visible'); overlay.setAttribute('aria-hidden','true'); }
                            this._enterFreeExplore();
                        };
                        this._isAnimating = false;
                    }, d(3000));
                }, d(1500));
            }, d(600));
        }, d(3000));
    }

    _drawFinaleTrail() {
        // Build one continuous great-circle path through all stops
        const allCoords = [];
        for (let i = 0; i < this.data.length - 1; i++) {
            const arc = turf.greatCircle(
                turf.point(this.data[i].coordinates),
                turf.point(this.data[i + 1].coordinates),
                { npoints: 60 }
            );
            const seg = arc.geometry.coordinates;
            // Skip first point on all segments after the first to avoid duplicates
            allCoords.push(...(i === 0 ? seg : seg.slice(1)));
        }

        const id = `finale-trail-${Date.now()}`;
        const sourceId = `${id}-src`;

        this.map.addSource(sourceId, {
            type: 'geojson',
            data: { type: 'Feature', geometry: { type: 'LineString', coordinates: allCoords.slice(0, 2) } },
        });

        // 3-layer neon glow: outer bloom → inner glow → bright core
        const idBloom = `${id}-bloom`;
        const idGlow  = `${id}-glow`;
        const idCore  = `${id}-core`;

        this.map.addLayer({
            id: idBloom, type: 'line', source: sourceId,
            layout: { 'line-cap': 'round', 'line-join': 'round' },
            paint: { 'line-color': '#fff5cc', 'line-width': 22, 'line-blur': 16, 'line-opacity': 0.28 },
        });

        this.map.addLayer({
            id: idGlow, type: 'line', source: sourceId,
            layout: { 'line-cap': 'round', 'line-join': 'round' },
            paint: { 'line-color': '#ffe066', 'line-width': 8, 'line-blur': 6, 'line-opacity': 0.75 },
        });

        this.map.addLayer({
            id: idCore, type: 'line', source: sourceId,
            layout: { 'line-cap': 'round', 'line-join': 'round' },
            paint: { 'line-color': '#ffffff', 'line-width': 2, 'line-blur': 0, 'line-opacity': 1 },
        });

        this._pathLayers.push(
            { id: idBloom, sourceId },
            { id: idGlow,  sourceId: null },
            { id: idCore,  sourceId: null },
        );

        const revealDuration = 2000 / this._speedMultiplier;
        const startTime = performance.now();
        const total = allCoords.length;

        const reveal = (now) => {
            const t = Math.min((now - startTime) / revealDuration, 1);
            const eased = 1 - Math.pow(1 - t, 2);
            const count = Math.max(2, Math.floor(eased * total));
            const src = this.map.getSource(sourceId);
            if (src) {
                src.setData({ type: 'Feature', geometry: { type: 'LineString', coordinates: allCoords.slice(0, count) } });
            }
            if (t < 1) requestAnimationFrame(reveal);
        };

        requestAnimationFrame(reveal);
    }

    // ── Ambient audio (file-based) ────────────────────────────────────────────

    _fadeAudio(fromVol, toVol, durationMs) {
        if (!this._audioEl) return;
        const steps = 30;
        const interval = durationMs / steps;
        const delta = (toVol - fromVol) / steps;
        let step = 0;
        const tick = () => {
            step++;
            if (!this._audioEl) return;
            this._audioEl.volume = Math.max(0, Math.min(1, fromVol + delta * step));
            if (step < steps) setTimeout(tick, interval);
        };
        setTimeout(tick, interval);
    }

    _toggleMute() {
        this._muted = !this._muted;

        if (this._muted) {
            if (this._audioEl) this._fadeAudio(this._audioEl.volume, 0, 400);
        } else {
            if (!this._audioEl) {
                this._audioEl = document.getElementById('jmap-audio');
            }
            if (this._audioEl) {
                this._audioEl.volume = 0;
                this._audioEl.play().catch(() => {});
                this._fadeAudio(0, 0.35, 1000);
            }
        }
        this._syncMuteUI();
    }

    // Keep the gate toggle and the in-journey mute button in lockstep
    _syncMuteUI() {
        const on = !this._muted;

        const gateBtn = document.getElementById('jmap-gate-music-toggle');
        if (gateBtn) {
            gateBtn.setAttribute('aria-pressed', String(on));
            gateBtn.classList.toggle('active', on);
            const icon = gateBtn.querySelector('.jmap-gate-music-icon');
            const label = gateBtn.querySelector('.jmap-gate-music-label');
            if (icon) icon.textContent = on ? '🔊' : '🔇';
            if (label) label.textContent = on ? 'Music: On' : 'Music: Off';
        }

        const ctrlBtn = document.getElementById('jmap-mute-btn');
        if (ctrlBtn) {
            this._setCtrlBtn(ctrlBtn, on ? '🔊' : '🔇', 'Sound');
            ctrlBtn.classList.toggle('active', on);
            ctrlBtn.setAttribute('aria-pressed', String(on));
            ctrlBtn.setAttribute('aria-label', on ? 'Mute ambient audio' : 'Unmute ambient audio');
        }
    }

    // ── Dots / nav ────────────────────────────────────────────────────────────

    _buildDots() {
        const container = document.querySelector('.jmap-progress');
        if (!container) return;
        container.innerHTML = this.data.map((stop, i) =>
            `<div class="jmap-dot${i === 0 ? ' active' : ''}" data-index="${i}" title="${stop.label}" role="tab" aria-label="${stop.label}" tabindex="0"></div>`
        ).join('');

        container.querySelectorAll('.jmap-dot').forEach(dot => {
            dot.addEventListener('click', () => this.goTo(parseInt(dot.dataset.index)));
            dot.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.goTo(parseInt(dot.dataset.index)); }
            });
        });
    }

    _updateDots() {
        document.querySelectorAll('.jmap-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === this.currentIndex);
        });
    }

    _updateNav() {
        const prev = document.querySelector('.jmap-prev');
        const next = document.querySelector('.jmap-next');
        if (prev) prev.disabled = this.currentIndex === 0;
        // Next is never disabled — at last stop it triggers the finale
        if (next) next.disabled = false;
        this._updateDots();
    }

    _bindNav() {
        const prev = document.querySelector('.jmap-prev');
        const next = document.querySelector('.jmap-next');

        if (prev) prev.addEventListener('click', () => {
            if (!this._journeyStarted) return;
            this._hideHint();
            this.goTo(this.currentIndex - 1);
        });
        if (next) next.addEventListener('click', () => {
            if (!this._journeyStarted) return;
            this._hideHint();
            this.goTo(this.currentIndex + 1);
        });

        const pauseBtn = document.getElementById('jmap-pause-btn');
        if (pauseBtn) pauseBtn.addEventListener('click', () => this._togglePause());

        const speedBtn = document.getElementById('jmap-speed-btn');
        if (speedBtn) speedBtn.addEventListener('click', () => this._toggleSpeed());

        const muteBtn = document.getElementById('jmap-mute-btn');
        if (muteBtn) muteBtn.addEventListener('click', () => this._toggleMute());

        const exploreBtn = document.getElementById('jmap-explore-btn');
        if (exploreBtn) exploreBtn.addEventListener('click', () => {
            this._freeExploreActive ? this._exitFreeExplore() : this._enterFreeExplore();
        });

        const panelClose = document.getElementById('jmap-panel-close');
        if (panelClose) panelClose.addEventListener('click', () => this._hideExpandedPanel());

        // Light-dismiss: click the backdrop (not the card itself) to close
        const panel = document.getElementById('jmap-expanded-panel');
        if (panel) panel.addEventListener('click', e => { if (e.target === panel) this._hideExpandedPanel(); });

        document.addEventListener('keydown', e => {
            // ESC closes the expanded panel
            if (e.key === 'Escape') { this._hideExpandedPanel(); return; }

            if (!this._journeyStarted) return;
            const section = document.getElementById('journey');
            if (!section) return;
            const rect = section.getBoundingClientRect();
            const inView = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
            if (!inView) return;
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') this._hideHint();
            if (!this._freeExploreActive) {
                if (e.key === 'ArrowRight') this.goTo(this.currentIndex + 1);
                if (e.key === 'ArrowLeft') this.goTo(this.currentIndex - 1);
            }
        });

        const hintDismiss = document.querySelector('.jmap-hint-dismiss');
        if (hintDismiss) hintDismiss.addEventListener('click', () => this._hideHint());
    }

    // ── Onboarding hint ───────────────────────────────────────────────────────

    _showHint() {
        if (localStorage.getItem('jmapHintDismissed')) return;
        const el = document.getElementById('jmap-hint');
        if (!el) return;
        el.setAttribute('aria-hidden', 'false');
        el.classList.add('visible');
    }

    _hideHint() {
        const el = document.getElementById('jmap-hint');
        if (!el) return;
        el.classList.remove('visible');
        el.setAttribute('aria-hidden', 'true');
        localStorage.setItem('jmapHintDismissed', '1');
    }

    // ── Free explore mode ─────────────────────────────────────────────────────

    _enterFreeExplore() {
        this._freeExploreActive = true;
        this.map.dragPan.enable();
        this.map.scrollZoom.enable();
        this.map.dragRotate.enable();
        this.map.touchZoomRotate.enable();

        // Remove any brightness filters left over from the finale
        const mapEl = document.getElementById('journey-map');
        if (mapEl) { mapEl.classList.remove('jmap-dim', 'jmap-brighten'); }

        // Show extra pins
        this._personalMarkers.forEach(m => m.getElement().classList.remove('jmap-pin-hidden'));
        this._wishlistMarkers.forEach(m => m.getElement().classList.remove('jmap-pin-hidden'));

        // Fly to a global overview that shows both hemispheres (India on right, Americas on left)
        this.map.flyTo({ center: [-20, 25], zoom: 1.3, pitch: 0, bearing: 0, duration: 1800, essential: true });

        // Update controls UI
        const controls = document.getElementById('jmap-controls');
        if (controls) controls.classList.add('explore-active');
        const btn = document.getElementById('jmap-explore-btn');
        if (btn) { this._setCtrlBtn(btn, '✕', 'Exit'); btn.classList.add('active'); btn.setAttribute('aria-label','Exit free explore mode'); }

        // Hide info card and expanded panel during explore
        const card = document.querySelector('.jmap-info-card');
        if (card) { card.classList.remove('visible'); }
        this._hideExpandedPanel();

        // Show legend — persists until the user exits explore mode
        const hint = document.getElementById('jmap-explore-hint');
        if (hint) {
            hint.classList.add('visible');
            hint.setAttribute('aria-hidden', 'false');
        }
    }

    _exitFreeExplore() {
        this._freeExploreActive = false;
        this.map.dragPan.disable();
        this.map.scrollZoom.disable();
        this.map.dragRotate.disable();
        this.map.touchZoomRotate.disable();

        // Hide extra pins
        this._personalMarkers.forEach(m => m.getElement().classList.add('jmap-pin-hidden'));
        this._wishlistMarkers.forEach(m => m.getElement().classList.add('jmap-pin-hidden'));

        // Reset controls UI
        const controls = document.getElementById('jmap-controls');
        if (controls) controls.classList.remove('explore-active');
        const btn = document.getElementById('jmap-explore-btn');
        if (btn) { this._setCtrlBtn(btn, '🗺', 'Explore'); btn.classList.remove('active'); btn.setAttribute('aria-label','Enter free explore mode'); }

        // Hide explore hint
        const hint = document.getElementById('jmap-explore-hint');
        if (hint) { hint.classList.remove('visible'); hint.setAttribute('aria-hidden', 'true'); }

        // Re-show info card for current stop
        if (this._journeyStarted && this.data[this.currentIndex]) {
            this._showInfoCard(this.data[this.currentIndex]);
        }
    }

    // ── Personal & wishlist pin builders ─────────────────────────────────────

    _buildPersonalPins() {
        this.personalPins.forEach(pin => {
            const el = document.createElement('div');
            el.className = 'jmap-pin jmap-pin-hidden';
            el.dataset.type = 'personal';

            const inner = document.createElement('div');
            inner.className = 'jmap-pin-inner';

            const icon = document.createElement('span');
            icon.textContent = pin.emoji || '★';
            inner.appendChild(icon);
            el.appendChild(inner);

            el.addEventListener('click', () => this._showExpandedPanel(pin));

            const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
                .setLngLat(pin.coordinates)
                .addTo(this.map);

            this._personalMarkers.push(marker);
        });
    }

    _buildWishlistPins() {
        this.wishlistPins.forEach(pin => {
            const el = document.createElement('div');
            el.className = 'jmap-pin jmap-pin-hidden';
            el.dataset.type = 'wishlist';

            const inner = document.createElement('div');
            inner.className = 'jmap-pin-inner';

            const icon = document.createElement('span');
            icon.textContent = '📍';
            inner.appendChild(icon);

            // Tooltip
            const tooltip = document.createElement('div');
            tooltip.className = 'jmap-wishlist-tooltip';
            tooltip.innerHTML = `<span class="jmap-wishlist-label">📍 ${pin.label}</span><span class="jmap-wishlist-note">${pin.note || pin.location}</span>`;

            el.appendChild(inner);
            el.appendChild(tooltip);

            el.addEventListener('mouseenter', () => tooltip.classList.add('visible'));
            el.addEventListener('mouseleave', () => tooltip.classList.remove('visible'));
            el.addEventListener('click',      () => tooltip.classList.toggle('visible'));

            const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
                .setLngLat(pin.coordinates)
                .addTo(this.map);

            this._wishlistMarkers.push(marker);
        });
    }

    // ── Expanded story panel ──────────────────────────────────────────────────

    _showExpandedPanel(stop) {
        const panel = document.getElementById('jmap-expanded-panel');
        if (!panel) return;

        // Populate header
        const badge = panel.querySelector('.jmap-panel-badge');
        if (badge) {
            const labels = { work: 'Work', education: 'Education', home: 'Home', personal: 'Personal' };
            badge.textContent = labels[stop.type] || stop.type;
            badge.dataset.type = stop.type;
        }
        const orgEl = panel.querySelector('.jmap-panel-org');
        if (orgEl) orgEl.textContent = stop.org || stop.label || '';

        const dateEl = panel.querySelector('.jmap-panel-date');
        if (dateEl) dateEl.textContent = stop.dateRange || stop.location || '';

        // Story — rendered as separate paragraphs, not one dense block
        const storyEl = panel.querySelector('.jmap-panel-story');
        const paragraphs = (stop.story || '').split(/\n\s*\n/).map(s => s.trim()).filter(Boolean);
        if (storyEl) {
            storyEl.innerHTML = '';
            paragraphs.forEach(text => {
                const p = document.createElement('p');
                p.textContent = text;
                storyEl.appendChild(p);
            });
        }

        // Photos / videos
        const photosEl = panel.querySelector('.jmap-panel-photos');
        const hasPhotos = !!(stop.photos && stop.photos.length);
        if (photosEl) {
            photosEl.innerHTML = hasPhotos ? stop.photos.map(p => {
                const isVideo = /\.(mp4|webm|mov)(\?.*)?$/i.test(p.src);
                const media = isVideo
                    ? `<video src="${p.src}" autoplay loop muted playsinline preload="metadata"></video>`
                    : `<img src="${p.src}" alt="${p.caption || ''}" loading="lazy">`;
                return `<figure class="jmap-panel-photo${isVideo ? ' jmap-panel-photo--video' : ''}">
                    ${media}
                    ${p.caption ? `<figcaption>${p.caption}</figcaption>` : ''}
                </figure>`;
            }).join('') : '';
        }

        // Single-column, centered reading width when there are no photos to rail alongside
        const bodyEl = panel.querySelector('.jmap-panel-body');
        if (bodyEl) bodyEl.classList.toggle('jmap-panel-body--no-photos', !hasPhotos);

        panel.setAttribute('aria-hidden', 'false');
        panel.classList.add('visible');
        this._setMapOverlaysInert(true);
    }

    _hideExpandedPanel() {
        const panel = document.getElementById('jmap-expanded-panel');
        if (!panel) return;
        panel.classList.remove('visible');
        panel.setAttribute('aria-hidden', 'true');
        this._setMapOverlaysInert(false);
    }

    // While the story takeover is open, keep focus from leaking into the map's other overlays
    _setMapOverlaysInert(inert) {
        document.querySelectorAll('.journey-map-desktop > *:not(#jmap-expanded-panel)').forEach(el => {
            if (inert) el.setAttribute('inert', ''); else el.removeAttribute('inert');
        });
    }

    // ── Reset journey ─────────────────────────────────────────────────────────

    _resetJourney() {
        // Hide finale overlay
        const overlay = document.getElementById('jmap-finale-overlay');
        if (overlay) { overlay.classList.remove('visible'); overlay.setAttribute('aria-hidden','true'); }

        // Brighten map back to normal
        const mapEl = document.getElementById('journey-map');
        if (mapEl) { mapEl.classList.remove('jmap-dim','jmap-brighten'); }

        // Reset pause button state
        const pauseBtn = document.getElementById('jmap-pause-btn');
        if (pauseBtn) { pauseBtn.disabled = false; this._setCtrlBtn(pauseBtn, '⏸', 'Pause'); pauseBtn.classList.remove('active'); }

        // Reset state
        this.currentIndex = 0;
        this._isAnimating = false;
        this._paused = false;
        this._pendingResume = null;
        this._totalDistanceSoFar = 0;
        this._hideInfoCard();
        this._hideExpandedPanel();

        // Remove existing path layers
        this._pathLayers.forEach(({ id, sourceId }) => {
            try { this.map.removeLayer(id); } catch(e) {}
            if (sourceId) { try { this.map.removeSource(sourceId); } catch(e) {} }
        });
        this._pathLayers = [];

        // Remove existing pins
        this._pinMarkers.forEach(m => m.remove());
        this._pinMarkers = [];

        // Re-show gate or start directly from home (skip gate on restart)
        this._setControlsVisible(true);
        this._flyToHome();
    }

    // ── Utilities ─────────────────────────────────────────────────────────────

    _interpolate(from, to, steps) {
        const coords = [];
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            coords.push([from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t]);
        }
        return coords;
    }

    _bearing(from, to) {
        const toRad = d => d * Math.PI / 180;
        const lat1 = toRad(from[1]), lat2 = toRad(to[1]);
        const dLng = toRad(to[0] - from[0]);
        const y = Math.sin(dLng) * Math.cos(lat2);
        const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
        return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
    }
}

// Lazy-init when the journey section scrolls into view (desktop only)
document.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth < 769 || typeof mapboxgl === 'undefined') return;
    const data = window.JOURNEY_DATA;
    if (!data || !data.length) return;

    const mapSection = document.getElementById('journey');
    if (!mapSection) return;

    let journeyMap = null;
    const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && !journeyMap) {
            obs.disconnect();
            journeyMap = new JourneyMap('journey-map', data);
            journeyMap.init();
        }
    }, { threshold: 0.05 });

    obs.observe(mapSection);
});
