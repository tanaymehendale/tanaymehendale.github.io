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
        this.data = data;
        this.currentIndex = 0;
        this.map = null;
        this._pathLayers = [];
        this._pinMarkers = [];
        this._planeMarker = null;
        this._planeRafId = null;
        this._revealRafId = null;
        this._isAnimating = false;
    }

    init() {
        mapboxgl.accessToken = MAPBOX_TOKEN;

        this.map = new mapboxgl.Map({
            container: this.containerId,
            style: 'mapbox://styles/mapbox/satellite-streets-v12',
            center: [72, 20],
            zoom: 2,
            projection: 'globe',
            attributionControl: true,
        });

        this.map.scrollZoom.disable();
        this.map.dragRotate.disable();

        this.map.once('style.load', () => {
            this.map.setFog({
                color: 'rgb(186, 210, 235)',
                'high-color': 'rgb(36, 92, 223)',
                'horizon-blend': 0.02,
                'space-color': 'rgb(11, 11, 25)',
                'star-intensity': 0.6,
            });

            this._buildDots();
            this._bindNav();

            setTimeout(() => this._flyToHome(), 600);
        });
    }

    _flyToHome() {
        const home = this.data[0];
        this.map.flyTo({
            center: home.coordinates,
            zoom: 12,
            pitch: 50,
            bearing: -15,
            duration: 4500,
            essential: true,
        });

        setTimeout(() => {
            this._addPin(home, 0);
            this._showInfoCard(home);
            this._updateNav();
        }, 4200);
    }

    goTo(index) {
        if (index < 0 || index >= this.data.length || this._isAnimating) return;
        this._isAnimating = true;

        const prev = this.data[this.currentIndex];
        const stop = this.data[index];
        const goingForward = index > this.currentIndex;
        this.currentIndex = index;

        document.querySelector('.jmap-info-card').classList.remove('visible');

        if (goingForward && stop.transitionType) {
            if (stop.transitionType === 'flight') {
                this._doFlightTransition(prev, stop);
            } else {
                this._doRoadTransition(prev, stop);
            }
        } else {
            // Backward navigation: fly without drawing a path
            this.map.flyTo({
                center: stop.coordinates,
                zoom: 12,
                pitch: 50,
                duration: 2500,
                essential: true,
            });
            setTimeout(() => {
                this._showInfoCard(stop);
                this._updateNav();
                this._updateDots();
                this._isAnimating = false;
            }, 2400);
        }
    }

    _doRoadTransition(prev, stop) {
        const coords = this._interpolate(prev.coordinates, stop.coordinates, 60);
        this._drawAnimatedPath(coords, 'road');

        this.map.flyTo({
            center: stop.coordinates,
            zoom: 13,
            pitch: 50,
            duration: 2800,
            essential: true,
        });

        setTimeout(() => {
            this._addPin(stop, this.currentIndex);
            this._showInfoCard(stop);
            this._updateNav();
            this._updateDots();
            this._isAnimating = false;
        }, 2600);
    }

    _doFlightTransition(prev, stop) {
        const arcFeature = turf.greatCircle(
            turf.point(prev.coordinates),
            turf.point(stop.coordinates),
            { npoints: 120 }
        );
        const arcCoords = arcFeature.geometry.coordinates;

        const midIdx = Math.floor(arcCoords.length / 2);
        const midPoint = arcCoords[midIdx];

        // Zoom out to see both endpoints
        this.map.flyTo({
            center: midPoint,
            zoom: 2.2,
            pitch: 20,
            duration: 1800,
            essential: true,
        });

        setTimeout(() => {
            this._drawAnimatedPath(arcCoords, 'flight');
            this._animatePlane(arcCoords, 5000);

            // Fly to destination while plane travels
            setTimeout(() => {
                this.map.flyTo({
                    center: stop.coordinates,
                    zoom: 11,
                    pitch: 50,
                    duration: 3500,
                    essential: true,
                });

                setTimeout(() => {
                    this._addPin(stop, this.currentIndex);
                    this._showInfoCard(stop);
                    this._updateNav();
                    this._updateDots();
                    this._isAnimating = false;
                }, 3300);
            }, 1500);
        }, 1900);
    }

    _drawAnimatedPath(coords, type) {
        const id = `path-${Date.now()}`;
        const sourceId = `${id}-src`;

        this.map.addSource(sourceId, {
            type: 'geojson',
            data: { type: 'Feature', geometry: { type: 'LineString', coordinates: coords.slice(0, 2) } },
        });

        this.map.addLayer({
            id,
            type: 'line',
            source: sourceId,
            layout: { 'line-cap': 'round', 'line-join': 'round' },
            paint: {
                'line-color': type === 'flight' ? '#ffe066' : '#ffffff',
                'line-width': type === 'flight' ? 2.5 : 2,
                'line-opacity': 0.9,
                'line-dasharray': type === 'flight' ? [3, 2] : [2, 2],
            },
        });

        this._pathLayers.push({ id, sourceId });

        // Progressive coordinate reveal for "drawing" effect
        const revealDuration = type === 'flight' ? 4200 : 2000;
        const startTime = performance.now();
        const total = coords.length;

        const reveal = (now) => {
            const t = Math.min((now - startTime) / revealDuration, 1);
            const eased = 1 - Math.pow(1 - t, 2);
            const count = Math.max(2, Math.floor(eased * total));
            const src = this.map.getSource(sourceId);
            if (src) {
                src.setData({
                    type: 'Feature',
                    geometry: { type: 'LineString', coordinates: coords.slice(0, count) },
                });
            }
            if (t < 1) this._revealRafId = requestAnimationFrame(reveal);
        };

        this._revealRafId = requestAnimationFrame(reveal);
    }

    _animatePlane(arcCoords, durationMs) {
        if (this._planeMarker) { this._planeMarker.remove(); this._planeMarker = null; }
        if (this._planeRafId) cancelAnimationFrame(this._planeRafId);

        const el = document.createElement('div');
        el.className = 'jmap-plane';
        el.textContent = '✈';

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
                // ✈ emoji faces east by default; bearing is clockwise from north; subtract 90 to align
                el.style.transform = `rotate(${bearing - 90}deg)`;
            }

            if (t < 1) {
                this._planeRafId = requestAnimationFrame(fly);
            } else {
                setTimeout(() => {
                    if (this._planeMarker) { this._planeMarker.remove(); this._planeMarker = null; }
                }, 500);
            }
        };

        this._planeRafId = requestAnimationFrame(fly);
    }

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

    _showInfoCard(stop) {
        const card = document.querySelector('.jmap-info-card');
        card.classList.remove('visible');

        setTimeout(() => {
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

            card.querySelector('.jmap-bullets').innerHTML = stop.bullets.map(b => `<li>${b}</li>`).join('');

            const photosEl = card.querySelector('.jmap-photos');
            if (stop.photos && stop.photos.length) {
                photosEl.innerHTML = stop.photos
                    .map(p => `<figure class="jmap-photo"><img src="${p.src}" alt="${p.caption || ''}"><figcaption>${p.caption || ''}</figcaption></figure>`)
                    .join('');
                photosEl.style.display = '';
            } else {
                photosEl.style.display = 'none';
            }

            card.classList.add('visible');
        }, 150);
    }

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
        if (next) next.disabled = this.currentIndex === this.data.length - 1;
        this._updateDots();
    }

    _bindNav() {
        const prev = document.querySelector('.jmap-prev');
        const next = document.querySelector('.jmap-next');
        if (prev) prev.addEventListener('click', () => this.goTo(this.currentIndex - 1));
        if (next) next.addEventListener('click', () => this.goTo(this.currentIndex + 1));

        document.addEventListener('keydown', e => {
            const section = document.getElementById('journey');
            if (!section) return;
            const rect = section.getBoundingClientRect();
            const inView = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
            if (!inView) return;
            if (e.key === 'ArrowRight') this.goTo(this.currentIndex + 1);
            if (e.key === 'ArrowLeft') this.goTo(this.currentIndex - 1);
        });
    }

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
