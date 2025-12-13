document.addEventListener('DOMContentLoaded', function() {
    const overlay = document.getElementById('overlay');
    const content = document.getElementById('content');
    const quoteElement = document.getElementById('quote');
    const mainTextElement = document.getElementById('main-text');
    const notification = document.getElementById('notification');
    const discordLink = document.getElementById('discord-link');
    const backgroundMusic = document.getElementById('background-music');
    const muteToggle = document.getElementById('mute-toggle');

    backgroundMusic.loop = true; // Make the song loop

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
        backgroundMusic.volume = 0.07;
        backgroundMusic.play();
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
            setTimeout(() => {
                notification.style.opacity = '1';
            }, 10);
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
