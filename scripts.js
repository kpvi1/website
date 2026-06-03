document.addEventListener('DOMContentLoaded', function () {
    const overlay = document.getElementById('overlay');
    const content = document.getElementById('content');
    const quoteElement = document.getElementById('quote');
    const titleElement = document.getElementById('title');
    const notification = document.getElementById('notification');
    const discordLink = document.getElementById('discord-link');
    const navDiscord = document.getElementById('nav-discord');
    const backgroundMusic = document.getElementById('background-music');
    const ipDisplay = document.getElementById('ip-display');
    const songCredit = document.getElementById('song-credit');
    const muteToggle = document.getElementById('mute-toggle');
    const loaderFill = document.getElementById('loader-bar-fill');
    const clock = document.getElementById('clock');

    backgroundMusic.loop = true;

    /* ── Loader progress bar (decorative) ── */
    (function fillLoader() {
        let p = 0;
        const t = setInterval(() => {
            p = Math.min(100, p + Math.random() * 18);
            loaderFill.style.width = p + '%';
            if (p >= 100) clearInterval(t);
        }, 120);
    })();

    /* ── Clock ── */
    function tickClock() {
        if (!clock) return;
        const d = new Date();
        const pad = (n) => String(n).padStart(2, '0');
        clock.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    }
    tickClock();
    setInterval(tickClock, 1000);

    /* ── IP ── */
    fetch('https://api.ipify.org?format=json')
        .then(r => r.json())
        .then(data => typeIp(`ip: ${data.ip}`))
        .catch(() => { ipDisplay.textContent = 'ip: unknown'; });

    function typeIp(text) {
        let i = 0; ipDisplay.textContent = '';
        (function step() {
            if (i < text.length) { ipDisplay.textContent += text.charAt(i++); setTimeout(step, 90); }
        })();
    }

    function typeSongCredit(text) {
        let i = 0; songCredit.textContent = '';
        (function step() {
            if (i < text.length) { songCredit.textContent += text.charAt(i++); setTimeout(step, 80); }
        })();
    }

    /* ── Quotes ── */
    const quotes = [
        "And, when you want something, all the universe conspires in helping you to achieve it.",
        "If you can dream it, you can do it.",
        "Success is the sum of small efforts, repeated day in and day out.",
        "If not us, who? If not now, when?",
        "Every accomplishment starts with the decision to try.",
        "The only person you have to compare yourself to is you in the past.",
        "If you want to succeed as bad as you want to breathe, then you'll be successful.",
        "Life is what happens to you while you're busy making other plans."
    ];
    let quoteIndex = 0;
    function typeQuote() {
        const q = quotes[quoteIndex];
        let i = 0; quoteElement.textContent = '';
        function typeChar() {
            if (i < q.length) { quoteElement.textContent += q.charAt(i++); setTimeout(typeChar, 45); }
            else setTimeout(deleteQuote, 2400);
        }
        function deleteQuote() {
            if (quoteElement.textContent.length > 0) {
                quoteElement.textContent = quoteElement.textContent.slice(0, -1);
                setTimeout(deleteQuote, 18);
            } else {
                quoteIndex = (quoteIndex + 1) % quotes.length;
                setTimeout(typeQuote, 600);
            }
        }
        typeChar();
    }
    typeQuote();

    /* ── Title scramble (homage to the old glitch) ── */
    const TITLE = 'KVCPER';
    const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&/\\';
    function scrambleTitle() {
        let frame = 0;
        const total = 26;
        const timer = setInterval(() => {
            let out = '';
            const revealed = Math.floor((frame / total) * TITLE.length);
            for (let i = 0; i < TITLE.length; i++) {
                out += i < revealed ? TITLE[i] : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            }
            titleElement.textContent = out;
            titleElement.classList.toggle('scrambling', frame < total);
            if (frame >= total) { titleElement.textContent = TITLE; titleElement.classList.remove('scrambling'); clearInterval(timer); }
            frame++;
        }, 45);
    }

    /* ── Entry ── */
    function enter() {
        overlay.removeEventListener('click', enter);
        backgroundMusic.volume = 0.2;
        backgroundMusic.play().then(() => setMuteState(false)).catch(() => {});
        const el = document.documentElement;
        if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
        else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();

        overlay.classList.add('hide');
        content.style.display = 'block';
        requestAnimationFrame(() => {
            content.classList.add('entered');
            scrambleTitle();
            revealOnScroll();
        });
        setTimeout(() => { overlay.style.display = 'none'; }, 700);
        typeSongCredit('Gibbs — inny ft. SVM!R');
    }
    overlay.addEventListener('click', enter);

    /* ── Mute toggle ── */
    function setMuteState(muted) {
        backgroundMusic.muted = muted;
        muteToggle.classList.toggle('playing', !muted);
    }
    muteToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        setMuteState(!backgroundMusic.muted);
    });

    /* ── Discord copy ── */
    function copyDiscord(e) {
        if (e) e.preventDefault();
        navigator.clipboard.writeText('kpvi').catch(() => {});
        notification.style.display = 'block';
        requestAnimationFrame(() => { notification.style.opacity = '1'; notification.classList.add('show'); });
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.classList.remove('show');
            setTimeout(() => { notification.style.display = 'none'; }, 400);
        }, 2200);
    }
    if (discordLink) discordLink.addEventListener('click', copyDiscord);
    if (navDiscord) navDiscord.addEventListener('click', copyDiscord);

    /* ── Scroll reveal ── */
    function revealOnScroll() {
        const els = document.querySelectorAll('.reveal');
        if (!('IntersectionObserver' in window)) { els.forEach(el => el.classList.add('in')); return; }
        const io = new IntersectionObserver((entries) => {
            entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
        }, { threshold: 0.18 });
        els.forEach(el => io.observe(el));
    }
});

/* ============================================================
   Discord Presence via Lanyard
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {
    const DISCORD_ID = '672810353628938260';
    const presence = document.getElementById('presence');

    const STATUS_ICONS = {
        online: `<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="8" fill="#14160e"/><circle cx="8" cy="8" r="5" fill="#3ba55c"/></svg>`,
        idle: `<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="8" fill="#14160e"/><circle cx="8" cy="8" r="5" fill="#faa81a"/><circle cx="10" cy="6" r="3.5" fill="#14160e"/></svg>`,
        dnd: `<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="8" fill="#14160e"/><circle cx="8" cy="8" r="5" fill="#ed4245"/><rect x="4" y="7" width="8" height="2" rx="1" fill="#14160e"/></svg>`,
        offline: `<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="8" fill="#14160e"/><circle cx="8" cy="8" r="5" fill="none" stroke="#747f8d" stroke-width="2"/></svg>`
    };

    function buildPresence(data) {
        const { discord_user, discord_status, activities, spotify } = data;
        const avatarUrl = discord_user.avatar
            ? `https://cdn.discordapp.com/avatars/${discord_user.id}/${discord_user.avatar}.png?size=128`
            : `https://cdn.discordapp.com/embed/avatars/0.png`;

        let activityHtml = '';
        let artSrc = '';

        if (spotify) {
            activityHtml = `Listening to <span>Spotify</span><br>${spotify.song} · ${spotify.artist}`;
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

/* ============================================================
   Custom cursor
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!finePointer) return;

    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;

    window.addEventListener('mousemove', (e) => {
        mx = e.clientX; my = e.clientY;
        dot.style.left = mx + 'px';
        dot.style.top = my + 'px';
    });
    window.addEventListener('mousedown', () => ring.classList.add('clicking'));
    window.addEventListener('mouseup', () => ring.classList.remove('clicking'));
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest('a, button, .pointer-link')) ring.classList.add('hovering');
    });
    document.addEventListener('mouseout', (e) => {
        if (e.target.closest('a, button, .pointer-link')) ring.classList.remove('hovering');
    });

    (function loop() {
        rx += (mx - rx) * 0.2;
        ry += (my - ry) * 0.2;
        ring.style.left = rx + 'px';
        ring.style.top = ry + 'px';
        requestAnimationFrame(loop);
    })();
});
