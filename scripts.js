document.addEventListener('DOMContentLoaded', function() {
    const overlay = document.getElementById('overlay');
    const content = document.getElementById('content');
    const quoteElement = document.getElementById('quote');
    const mainTextElement = document.getElementById('main-text');
    const notification = document.getElementById('notification');
    const discordLink = document.getElementById('discord-link');
    const backgroundMusic = document.getElementById('background-music');
    const muteToggle = document.getElementById('mute-toggle');
    const ipDisplay = document.getElementById('ip-display');

    backgroundMusic.loop = true; // Make the song loop

    // Fetch and display user IP
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            const ipText = `ip: ${data.ip}`;
            typeIp(ipText);
        })
        .catch(error => {
            typeIp('ip: unknown');
        });

    function typeIp(text) {
        let charIndex = 0;
        ipDisplay.textContent = '';

        function typeChar() {
            if (charIndex < text.length) {
                ipDisplay.textContent += text.charAt(charIndex);
                charIndex++;
                setTimeout(typeChar, 100);
            }
        }

        typeChar();
    }

    const quotes = [
        "' And, when you want something, all the universe conspires un helping you to achieve it '",
        "' If you can dream it, you can do it '",
        "' Success is the sum of small efforts – repeated day in and day out '",
        "' If not us, who? If not now, when? '",
        "' Every accomplishment starts with the decision to try '",
        "' The only person with whom you have to compare ourselves, is that you in the past '",
        "' If you want to succeed as bad as you want to breathe, then you’ll be successful '",
        "' Life is what happens to you, While you’re busy making other plans '",
    ];
    let quoteIndex = 0;
    
    overlay.addEventListener('click', () => {
        backgroundMusic.volume = 0.2;
        backgroundMusic.play();
        // Request full screen
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.webkitRequestFullscreen) { // Safari
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
            document.documentElement.msRequestFullscreen();
        }
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.style.display = 'none';
            content.style.display = 'block';
        }, 500);
    });

    if (muteToggle) {
        muteToggle.addEventListener('click', () => {
            const isMuted = !backgroundMusic.muted;
            backgroundMusic.muted = isMuted;
            if (isMuted) {
                muteToggle.classList.add('muted');
            } else {
                muteToggle.classList.remove('muted');
            }
        });
    }

    function typeQuote() {
        const quote = quotes[quoteIndex];
        let charIndex = 1;  // Start with the second character since first is always shown
        quoteElement.innerHTML = quote.charAt(0); // Initialize with the first character

        function typeChar() {
            if (charIndex < quote.length) {
                quoteElement.innerHTML += quote.charAt(charIndex);
                charIndex++;
                setTimeout(typeChar, 70);
            } else {
                setTimeout(deleteQuote, 2000);
            }
        }

        function deleteQuote() {
            if (charIndex > 1) { // Ensure at least the first character is kept
                quoteElement.innerHTML = quoteElement.innerHTML.slice(0, -1);
                charIndex--;
                setTimeout(deleteQuote, 50);
            } else {
                quoteIndex = (quoteIndex + 1) % quotes.length;
                setTimeout(typeQuote, 1000);
            }
        }

        typeChar();
    }

    typeQuote();

    discordLink.addEventListener('click', (e) => {
        e.preventDefault();
        navigator.clipboard.writeText('kpvi').then(() => {
            notification.style.display = 'block';
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.style.opacity = '1';
            }, 50);
            setTimeout(() => {
                notification.style.opacity = '0';
                setTimeout(() => {
                    notification.style.display = 'none';
                }, 1000);
            }, 2000);
        });
    });

    function glitchText() {
        let originalText = "[ KVCPER ]";
        let glitchVariants = ["[ K ]", "[ KV ]", "[ KVC ]", "[ KVCP ]", "[ KVCPE ]", "[ KVCPER ]", "[ KVCPER ]", "[ KVCPE ]", "[ KVCP ]", "[ KVC ]", "[ KV ]", "[ K ]", "[ K ]", "[ KP ]", "[ KPV ]", "[ KPVI ]", "[ KPVI ]", "[ KPV ]", "[ KP ]", "[ K ]"];
        let glitchIndex = 0;

        function updateText() {
            const text = glitchVariants[glitchIndex];
            mainTextElement.firstChild.textContent = text;
            document.title = text; // Update the title with the glitched text
            glitchIndex = (glitchIndex + 1) % glitchVariants.length;
            setTimeout(updateText, 300); // Adjust the timing for the glitch effect
        }

        updateText();
    }

    glitchText();
});

// ── Discord Presence via Lanyard ──
document.addEventListener('DOMContentLoaded', function() {
    const DISCORD_ID = '672810353628938260';
    const presence = document.getElementById('presence');

    const STATUS_ICONS = {
        online: `<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8" cy="8" r="8" fill="#232428"/>
            <circle cx="8" cy="8" r="5" fill="#3ba55c"/>
        </svg>`,
        idle: `<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8" cy="8" r="8" fill="#232428"/>
            <circle cx="8" cy="8" r="5" fill="#faa81a"/>
            <circle cx="10" cy="6" r="3.5" fill="#232428"/>
        </svg>`,
        dnd: `<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8" cy="8" r="8" fill="#232428"/>
            <circle cx="8" cy="8" r="5" fill="#ed4245"/>
            <rect x="4" y="7" width="8" height="2" rx="1" fill="#232428"/>
        </svg>`,
        offline: `<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8" cy="8" r="8" fill="#232428"/>
            <circle cx="8" cy="8" r="5" fill="none" stroke="#747f8d" stroke-width="2"/>
        </svg>`
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
                const labels = ['Playing','Streaming','Listening to','Watching','','Competing in'];
                const label = labels[act.type] || 'Playing';
                activityHtml = `${label} <span>${act.name}</span>`;
                if (act.assets && act.assets.large_image) {
                    const img = act.assets.large_image;
                    artSrc = img.startsWith('mp:external/')
                        ? `https://media.discordapp.net/external/${img.replace('mp:external/','')}`
                        : `https://cdn.discordapp.com/app-assets/${act.application_id}/${img}.png`;
                }
            } else {
                const statusText = { online:'Online', idle:'Idle', dnd:'Do Not Disturb', offline:'Offline' };
                activityHtml = statusText[discord_status] || 'Offline';
            }
        }

        const sc = ['online','idle','dnd'].includes(discord_status) ? discord_status : 'offline';
        presence.innerHTML = `
            <div id="presence-avatar-wrap">
                <img id="presence-avatar" src="${avatarUrl}" alt="avatar">
                <div id="presence-status-dot">${STATUS_ICONS[sc]}</div>
            </div>
            <div id="presence-info">
                <div id="presence-name">${discord_user.global_name || discord_user.username}</div>
                <div id="presence-activity">${activityHtml}</div>
            </div>
            ${artSrc ? `<img id="presence-art" src="${artSrc}" alt="art" style="display:block">` : ''}
        `;
        presence.classList.add('loaded');
        if (!artSrc) {
            presence.classList.add('offline');
        } else {
            presence.classList.remove('offline');
        }
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
