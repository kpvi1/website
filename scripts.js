document.addEventListener('DOMContentLoaded', function () {
    const overlay = document.getElementById('overlay');
    const content = document.getElementById('content');
    const quoteElement = document.getElementById('quote');
    const titleElement = document.getElementById('title');
    const notification = document.getElementById('notification');
    const discordLink = document.getElementById('discord-link');
    const backgroundMusic = document.getElementById('background-music');
    const ipDisplay = document.getElementById('ip-display');
    const songCredit = document.getElementById('song-credit');
    const muteToggle = document.getElementById('mute-toggle');

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    backgroundMusic.loop = true;

    /* ----------------------------------------------------------
       Custom cursor (smooth trailing ring)
       ---------------------------------------------------------- */
    (function customCursor() {
        const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
        if (!finePointer) return;
        const dot = document.getElementById('cursor-dot');
        const ring = document.getElementById('cursor-ring');
        let mx = window.innerWidth / 2, my = window.innerHeight / 2;
        let rx = mx, ry = my;

        window.addEventListener('mousemove', (e) => {
            mx = e.clientX; my = e.clientY;
            dot.style.left = mx + 'px';
            dot.style.top = my + 'px';
        });
        window.addEventListener('mousedown', () => ring.classList.add('clicking'));
        window.addEventListener('mouseup', () => ring.classList.remove('clicking'));

        function loop() {
            rx += (mx - rx) * 0.18;
            ry += (my - ry) * 0.18;
            ring.style.left = rx + 'px';
            ring.style.top = ry + 'px';
            requestAnimationFrame(loop);
        }
        loop();

        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('a, button, .pointer-link')) ring.classList.add('hovering');
        });
        document.addEventListener('mouseout', (e) => {
            if (e.target.closest('a, button, .pointer-link')) ring.classList.remove('hovering');
        });
    })();

    /* ----------------------------------------------------------
       Particle field
       ---------------------------------------------------------- */
    (function particles() {
        if (prefersReduced) return;
        const canvas = document.getElementById('particles');
        const ctx = canvas.getContext('2d');
        let w, h, pts = [];

        function resize() {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
            const count = Math.min(90, Math.floor((w * h) / 16000));
            pts = Array.from({ length: count }, () => ({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                r: Math.random() * 1.8 + 0.4
            }));
        }
        resize();
        window.addEventListener('resize', resize);

        function draw() {
            ctx.clearRect(0, 0, w, h);
            for (let i = 0; i < pts.length; i++) {
                const p = pts[i];
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0 || p.x > w) p.vx *= -1;
                if (p.y < 0 || p.y > h) p.vy *= -1;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(180, 200, 255, 0.6)';
                ctx.fill();
                for (let j = i + 1; j < pts.length; j++) {
                    const q = pts[j];
                    const dx = p.x - q.x, dy = p.y - q.y;
                    const dist = dx * dx + dy * dy;
                    if (dist < 13000) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        ctx.strokeStyle = `rgba(124, 92, 255, ${0.14 * (1 - dist / 13000)})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(draw);
        }
        draw();
    })();

    /* ----------------------------------------------------------
       Typewriter helpers
       ---------------------------------------------------------- */
    function typeInto(el, text, speed = 90) {
        let i = 0;
        el.textContent = '';
        (function step() {
            if (i < text.length) {
                el.textContent += text.charAt(i++);
                setTimeout(step, speed);
            }
        })();
    }

    // IP display
    fetch('https://api.ipify.org?format=json')
        .then(r => r.json())
        .then(data => typeInto(ipDisplay, `ip: ${data.ip}`, 90))
        .catch(() => { ipDisplay.textContent = 'ip: unknown'; });

    /* ----------------------------------------------------------
       Rotating quotes
       ---------------------------------------------------------- */
    const quotes = [
        "And, when you want something, all the universe conspires in helping you to achieve it",
        "If you can dream it, you can do it",
        "Success is the sum of small efforts — repeated day in and day out",
        "If not us, who? If not now, when?",
        "Every accomplishment starts with the decision to try",
        "The only person you have to compare yourself with is you in the past",
        "If you want to succeed as bad as you want to breathe, then you'll be successful",
        "Life is what happens to you while you're busy making other plans",
    ];
    let quoteIndex = 0;

    function typeQuote() {
        const quote = '“ ' + quotes[quoteIndex] + ' ”';
        let i = 0;
        quoteElement.textContent = '';
        function typeChar() {
            if (i < quote.length) {
                quoteElement.textContent += quote.charAt(i++);
                setTimeout(typeChar, 55);
            } else {
                setTimeout(deleteQuote, 2200);
            }
        }
        function deleteQuote() {
            if (quoteElement.textContent.length > 0) {
                quoteElement.textContent = quoteElement.textContent.slice(0, -1);
                setTimeout(deleteQuote, 25);
            } else {
                quoteIndex = (quoteIndex + 1) % quotes.length;
                setTimeout(typeQuote, 700);
            }
        }
        typeChar();
    }
    typeQuote();

    /* ----------------------------------------------------------
       Title glitch flash (subtle, periodic)
       ---------------------------------------------------------- */
    (function titleGlitch() {
        if (prefersReduced) return;
        function flash() {
            titleElement.classList.add('glitch');
            setTimeout(() => titleElement.classList.remove('glitch'), 350);
            setTimeout(flash, 2600 + Math.random() * 3200);
        }
        setTimeout(flash, 2000);
    })();

    /* ----------------------------------------------------------
       Audio visualizer (Web Audio API)
       ---------------------------------------------------------- */
    const visualizer = document.getElementById('visualizer');
    const BAR_COUNT = 28;
    const bars = [];
    for (let i = 0; i < BAR_COUNT; i++) {
        const b = document.createElement('div');
        b.className = 'vbar';
        visualizer.appendChild(b);
        bars.push(b);
    }

    let audioCtx, analyser, freqData, audioReady = false;
    function setupAudioGraph() {
        if (audioReady || prefersReduced) return;
        try {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const src = audioCtx.createMediaElementSource(backgroundMusic);
            analyser = audioCtx.createAnalyser();
            analyser.fftSize = 64;
            src.connect(analyser);
            analyser.connect(audioCtx.destination);
            freqData = new Uint8Array(analyser.frequencyBinCount);
            audioReady = true;
            renderViz();
        } catch (e) {
            // graceful fallback: idle pulsing bars
            audioReady = false;
        }
    }
    function renderViz() {
        if (!audioReady) return;
        analyser.getByteFrequencyData(freqData);
        const step = Math.floor(freqData.length / BAR_COUNT) || 1;
        for (let i = 0; i < BAR_COUNT; i++) {
            const v = freqData[i * step] / 255;
            bars[i].style.height = (4 + v * 38) + 'px';
        }
        requestAnimationFrame(renderViz);
    }
    // Idle animation before audio graph exists
    (function idleViz() {
        if (audioReady) return;
        const t = Date.now() / 350;
        for (let i = 0; i < BAR_COUNT; i++) {
            const v = (Math.sin(t + i * 0.5) + 1) / 2;
            bars[i].style.height = (4 + v * 16) + 'px';
        }
        requestAnimationFrame(idleViz);
    })();

    /* ----------------------------------------------------------
       Mute toggle
       ---------------------------------------------------------- */
    muteToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        backgroundMusic.muted = !backgroundMusic.muted;
        muteToggle.classList.toggle('muted', backgroundMusic.muted);
    });

    /* ----------------------------------------------------------
       Enter the site
       ---------------------------------------------------------- */
    let entered = false;
    overlay.addEventListener('click', () => {
        if (entered) return;
        entered = true;

        backgroundMusic.volume = 0.2;
        const playPromise = backgroundMusic.play();
        if (playPromise) playPromise.catch(() => {});
        setupAudioGraph();
        if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();

        const el = document.documentElement;
        const req = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
        if (req) { try { req.call(el); } catch (e) {} }

        overlay.classList.add('hidden');
        content.classList.add('visible');
        setTimeout(() => {
            overlay.style.display = 'none';
            typeInto(songCredit, '♪ Gibbs — inny ft. SVMIR', 70);
        }, 600);
    });

    /* ----------------------------------------------------------
       Discord copy
       ---------------------------------------------------------- */
    discordLink.addEventListener('click', (e) => {
        e.preventDefault();
        navigator.clipboard.writeText('kpvi').then(() => {
            notification.classList.add('show');
            clearTimeout(notification._t);
            notification._t = setTimeout(() => notification.classList.remove('show'), 2600);
        });
    });
});

/* ============================================================
   Discord Presence via Lanyard
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {
    const DISCORD_ID = '672810353628938260';
    const presence = document.getElementById('presence');

    const STATUS_ICONS = {
        online: `<svg width="18" height="18" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8" cy="8" r="8" fill="#0c0e16"/>
            <circle cx="8" cy="8" r="5" fill="#3ba55c"/></svg>`,
        idle: `<svg width="18" height="18" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8" cy="8" r="8" fill="#0c0e16"/>
            <circle cx="8" cy="8" r="5" fill="#faa81a"/>
            <circle cx="10" cy="6" r="3.5" fill="#0c0e16"/></svg>`,
        dnd: `<svg width="18" height="18" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8" cy="8" r="8" fill="#0c0e16"/>
            <circle cx="8" cy="8" r="5" fill="#ed4245"/>
            <rect x="4" y="7" width="8" height="2" rx="1" fill="#0c0e16"/></svg>`,
        offline: `<svg width="18" height="18" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8" cy="8" r="8" fill="#0c0e16"/>
            <circle cx="8" cy="8" r="5" fill="none" stroke="#747f8d" stroke-width="2"/></svg>`
    };

    function buildPresence(data) {
        const { discord_user, discord_status, activities, spotify } = data;

        const avatarUrl = discord_user.avatar
            ? `https://cdn.discordapp.com/avatars/${discord_user.id}/${discord_user.avatar}.png?size=128`
            : `https://cdn.discordapp.com/embed/avatars/0.png`;

        let activityHtml = '';
        let artSrc = '';

        if (spotify) {
            activityHtml = `Listening to <span>Spotify</span><br><span>${spotify.song}</span> · ${spotify.artist}`;
            artSrc = spotify.album_art_url || '';
        } else {
            const act = (activities || []).find(a => a.type !== 4);
            if (act) {
                const labels = ['Playing', 'Streaming', 'Listening to', 'Watching', '', 'Competing in'];
                const label = labels[act.type] || 'Playing';
                activityHtml = `${label} <span>${act.name}</span>`;
                if (act.assets && act.assets.large_image) {
                    const img = act.assets.large_image;
                    artSrc = img.startsWith('mp:external/')
                        ? `https://media.discordapp.net/external/${img.replace('mp:external/', '')}`
                        : `https://cdn.discordapp.com/app-assets/${act.application_id}/${img}.png`;
                }
            } else {
                const statusText = { online: 'Online', idle: 'Idle', dnd: 'Do Not Disturb', offline: 'Offline' };
                activityHtml = statusText[discord_status] || 'Offline';
            }
        }

        const sc = ['online', 'idle', 'dnd'].includes(discord_status) ? discord_status : 'offline';
        presence.innerHTML = `
            <div id="presence-avatar-wrap">
                <img id="presence-avatar" src="${avatarUrl}" alt="avatar">
                <div id="presence-status-dot">${STATUS_ICONS[sc]}</div>
            </div>
            <div id="presence-info">
                <div id="presence-name">${discord_user.global_name || discord_user.username}</div>
                <div id="presence-activity">${activityHtml}</div>
            </div>
            ${artSrc ? `<img id="presence-art" src="${artSrc}" alt="art">` : ''}
        `;
        presence.classList.add('loaded');
        presence.classList.toggle('offline', !artSrc);
    }

    function fetchPresence() {
        fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`)
            .then(r => r.json())
            .then(json => { if (json.success) buildPresence(json.data); })
            .catch(() => {});
    }

    fetchPresence();
    setInterval(fetchPresence, 10000);
});
