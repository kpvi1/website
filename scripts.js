document.addEventListener('DOMContentLoaded', function() {
    const overlay = document.getElementById('overlay');
    const content = document.getElementById('content');
    const quoteElement = document.getElementById('quote');
    const mainTextElement = document.getElementById('main-text');
    const titleText = document.getElementById('title-text');
    const backgroundMusic = document.getElementById('background-music');
    const ipDisplay = document.getElementById('ip-display');
    const songCredit = document.getElementById('song-credit');

    backgroundMusic.loop = true; // Make the song loop

    // Fetch and display user IP
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            const ipText = `ip: ${data.ip}`;
            typeIp(ipText);
        })
        .catch(error => {
            ipDisplay.textContent = 'ip: unknown';
            startIpGlitch('ip: unknown');
        });

    function typeIp(text) {
        let charIndex = 0;
        ipDisplay.textContent = '';

        function typeChar() {
            if (charIndex < text.length) {
                ipDisplay.textContent += text.charAt(charIndex);
                charIndex++;
                setTimeout(typeChar, 100);
            } else {
                startIpGlitch(text);
            }
        }

        typeChar();
    }

    const IP_GLITCH_CHARS = '░▒▓█<>/\\|{}[]#%&$@?';

    function startIpGlitch(text) {
        setInterval(() => {
            if (ipDisplay.textContent !== text) return;
            if (Math.random() > 0.3) return;

            // Glitch 1-2 characters at once for a blockier look
            const glitchCount = 1 + Math.floor(Math.random() * 2);
            const chars = text.split('');
            for (let i = 0; i < glitchCount; i++) {
                const glitchIndex = Math.floor(Math.random() * chars.length);
                chars[glitchIndex] = IP_GLITCH_CHARS[Math.floor(Math.random() * IP_GLITCH_CHARS.length)];
            }
            ipDisplay.textContent = chars.join('');

            setTimeout(() => {
                if (ipDisplay.textContent !== text) {
                    ipDisplay.textContent = text;
                }
            }, 60 + Math.random() * 100);
        }, 1400);
    }

    function typeSongCredit(text) {
        console.log('typeSongCredit called with text:', text);
        console.log('songCredit element:', songCredit);
        let charIndex = 0;
        songCredit.textContent = '';

        function typeChar() {
            if (charIndex < text.length) {
                songCredit.textContent += text.charAt(charIndex);
                charIndex++;
                setTimeout(typeChar, 100);
            } else {
                startSongCreditGlitch(text);
            }
        }

        typeChar();
    }

    const GLITCH_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=';

    function startSongCreditGlitch(text) {
        setInterval(() => {
            // Skip if the credit text isn't fully visible anymore
            if (songCredit.textContent !== text) return;
            if (Math.random() > 0.35) return;

            const glitchIndex = Math.floor(Math.random() * text.length);
            const originalChar = text.charAt(glitchIndex);
            songCredit.textContent = text.slice(0, glitchIndex) +
                GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)] +
                text.slice(glitchIndex + 1);

            setTimeout(() => {
                if (songCredit.textContent !== text) {
                    songCredit.textContent = text;
                }
            }, 80 + Math.random() * 120);
        }, 900);
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
        backgroundMusic.volume = 0.5;
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
            const songCreditElement = document.getElementById('song-credit');
            console.log('songCredit element after display block:', songCreditElement);
            if (songCreditElement) {
                typeSongCredit('ASSTER - CENTRAL feat. O.S.T.R.');
            }
            // Start title scramble effect after content is shown
            scrambleEffect(titleText, "K P V I", 2500, true);
        }, 500);
    });

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

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=';
    
    function scrambleEffect(textNode, finalString, durationMs = 1500, updateTitle = false) {
        let iterations = 0;
        const maxIterations = finalString.length * 3;
        const intervalTime = durationMs / maxIterations;
        
        clearInterval(textNode.scrambleInterval);
        textNode.scrambleInterval = setInterval(() => {
            const scrambled = finalString.split('').map((letter, index) => {
                if (index < iterations / 3) {
                    return finalString[index];
                }
                return chars[Math.floor(Math.random() * chars.length)];
            }).join('');
            
            textNode.textContent = scrambled;
            if (updateTitle) document.title = scrambled;

            if (iterations >= maxIterations) {
                clearInterval(textNode.scrambleInterval);
                textNode.textContent = finalString;
                if (updateTitle) document.title = finalString;
            }
            iterations++;
        }, intervalTime);
    }

    // Add scramble on hover for title
    titleText.addEventListener('mouseenter', () => {
        scrambleEffect(titleText, "K P V I", 800, true);
    });

    // Add scramble on hover for links
    const allLinks = document.querySelectorAll('#links a');
    allLinks.forEach(link => {
        const originalText = link.textContent;
        link.addEventListener('mouseenter', () => {
            // Need to scramble the link's text node, not the whole link to avoid losing structure if any
            scrambleEffect(link.firstChild, originalText, 500);
        });
    });

    // 3D Parallax Tilt Effect with smooth cursor movement
    const presenceEl = document.getElementById('presence');
    let smoothX = 0, smoothY = 0;
    let rafId = null;

    // Detect mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;

    if (isMobile) {
        // Mobile: Use deviceorientation for 3D parallax, behaves like cursor position
        let targetRotateX = 0, targetRotateY = 0;
        let baselineBeta = null, baselineGamma = null;

        window.addEventListener('deviceorientation', (event) => {
            if (event.beta !== null && event.gamma !== null) {
                // Capture the neutral holding position as baseline (like screen center for cursor)
                if (baselineBeta === null) {
                    baselineBeta = event.beta;
                    baselineGamma = event.gamma;
                }

                // Tilt away from baseline acts like moving the cursor away from center
                const tiltX = event.gamma - baselineGamma;   // left-right tilt
                const tiltY = event.beta - baselineBeta;     // front-back tilt

                targetRotateY = tiltX * 0.6;
                targetRotateX = -tiltY * 0.6;

                // Clamp rotation to avoid extreme angles
                targetRotateX = Math.max(-25, Math.min(25, targetRotateX));
                targetRotateY = Math.max(-25, Math.min(25, targetRotateY));

                if (!rafId) rafId = requestAnimationFrame(updateTiltMobile);
            }
        });

        function updateTiltMobile() {
            // Smooth the tilt movement with lerp
            smoothX += (targetRotateX - smoothX) * 0.08;
            smoothY += (targetRotateY - smoothY) * 0.08;

            mainTextElement.style.transform = `translate(-50%, -50%) perspective(1000px) rotateY(${smoothY}deg) rotateX(${smoothX}deg)`;

            if (presenceEl) {
                presenceEl.style.transform = `translateX(-50%) perspective(1000px) rotateY(${smoothY}deg) rotateX(${smoothX}deg)`;
            }

            // Keep animating while there is still movement to settle
            if (Math.abs(targetRotateX - smoothX) > 0.01 || Math.abs(targetRotateY - smoothY) > 0.01) {
                rafId = requestAnimationFrame(updateTiltMobile);
            } else {
                smoothX = targetRotateX;
                smoothY = targetRotateY;
                rafId = null;
            }
        }
    } else {
        // Desktop: Use mouse position for parallax
        let mouseX = 0, mouseY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.pageX;
            mouseY = e.pageY;
            if (!rafId) rafId = requestAnimationFrame(updateTilt);
        });

        function updateTilt() {
            // Push effect: side where the mouse is moves AWAY from the viewer
            const targetRotateY = (mouseX - window.innerWidth / 2) / 40;
            const targetRotateX = -(mouseY - window.innerHeight / 2) / 40;

            // Smooth the cursor movement with lerp
            smoothX += (targetRotateX - smoothX) * 0.08;
            smoothY += (targetRotateY - smoothY) * 0.08;

            mainTextElement.style.transform = `translate(-50%, -50%) perspective(1000px) rotateY(${smoothY}deg) rotateX(${smoothX}deg)`;

            if (presenceEl) {
                presenceEl.style.transform = `translateX(-50%) perspective(1000px) rotateY(${smoothY}deg) rotateX(${smoothX}deg)`;
            }

            // Keep animating while there is still movement to settle
            if (Math.abs(targetRotateX - smoothX) > 0.01 || Math.abs(targetRotateY - smoothY) > 0.01) {
                rafId = requestAnimationFrame(updateTilt);
            } else {
                smoothX = targetRotateX;
                smoothY = targetRotateY;
                rafId = null;
            }
        }

        document.addEventListener('mouseleave', () => {
            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
            // Smooth reset back to neutral position
            mouseX = window.innerWidth / 2;
            mouseY = window.innerHeight / 2;
            const reset = () => {
                smoothX += (0 - smoothX) * 0.1;
                smoothY += (0 - smoothY) * 0.1;
                mainTextElement.style.transform = `translate(-50%, -50%) perspective(1000px) rotateY(${smoothY}deg) rotateX(${smoothX}deg)`;
                if (presenceEl) {
                    presenceEl.style.transform = `translateX(-50%) perspective(1000px) rotateY(${smoothY}deg) rotateX(${smoothX}deg)`;
                }
                if (Math.abs(smoothX) > 0.01 || Math.abs(smoothY) > 0.01) {
                    rafId = requestAnimationFrame(reset);
                } else {
                    rafId = null;
                }
            };
            rafId = requestAnimationFrame(reset);
        });
    }
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

// ── Cursor star trail ──
document.addEventListener('DOMContentLoaded', function() {
    let lastX = 0, lastY = 0, lastSpawn = 0;

    document.addEventListener('mousemove', (e) => {
        const now = performance.now();
        const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);

        // Spawn a star only when the cursor actually moved and not too often
        if (dist > 18 && now - lastSpawn > 60) {
            lastSpawn = now;
            lastX = e.clientX;
            lastY = e.clientY;

            const star = document.createElement('span');
            star.className = 'cursor-star';
            star.textContent = '❄';
            star.style.left = e.clientX + 'px';
            star.style.top = e.clientY + 'px';
            star.style.fontSize = (8 + Math.random() * 8) + 'px';
            star.style.setProperty('--dx', (Math.random() * 60 - 30) + 'px');

            document.body.appendChild(star);
            star.addEventListener('animationend', () => star.remove());
        }
    });
});
