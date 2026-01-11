/* ============================================
   SJ Electrical - Fun Effects
   Light Switch Dark Mode & Spark Cursor
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    initLightSwitch();
    initSparkCursor();
});

/* ============================================
   Light Switch Dark Mode Toggle
   ============================================ */
function initLightSwitch() {
    // Create the light switch element
    const lightSwitch = document.createElement('div');
    lightSwitch.className = 'light-switch';
    lightSwitch.setAttribute('role', 'button');
    lightSwitch.setAttribute('aria-label', 'Toggle dark mode');
    lightSwitch.innerHTML = `
        <div class="switch-plate">
            <div class="switch-toggle"></div>
        </div>
        <span class="switch-label">Click to switch!</span>
    `;
    document.body.appendChild(lightSwitch);

    const switchToggle = lightSwitch.querySelector('.switch-toggle');

    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        switchToggle.classList.add('off');
    }

    // Click handler
    lightSwitch.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        // Play click sound
        playClickSound();

        // Add flicker effect
        document.body.classList.add('theme-transitioning');

        // Toggle switch position
        switchToggle.classList.toggle('off');

        // Apply theme after a brief delay for the flicker effect
        setTimeout(() => {
            if (newTheme === 'dark') {
                document.documentElement.setAttribute('data-theme', 'dark');
            } else {
                document.documentElement.removeAttribute('data-theme');
            }
            localStorage.setItem('theme', newTheme);
        }, 150);

        // Remove flicker class
        setTimeout(() => {
            document.body.classList.remove('theme-transitioning');
        }, 500);

        // Create spark burst at switch location
        const rect = lightSwitch.getBoundingClientRect();
        createSparkBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
    });
}

// Simple click sound using Web Audio API
function playClickSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();

        // Create a short click/zap sound
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
        // Audio not supported, fail silently
    }
}

/* ============================================
   Spark Cursor Effect
   ============================================ */
function initSparkCursor() {
    let lastSparkTime = 0;
    const sparkInterval = 50; // Minimum ms between sparks
    let mouseX = 0;
    let mouseY = 0;
    let isMoving = false;
    let moveTimeout;

    // Track mouse position
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        isMoving = true;

        // Clear previous timeout
        clearTimeout(moveTimeout);

        // Set moving to false after mouse stops
        moveTimeout = setTimeout(() => {
            isMoving = false;
        }, 100);

        // Throttle spark creation
        const now = Date.now();
        if (now - lastSparkTime > sparkInterval && isMoving) {
            // Random chance to create spark (not every movement)
            if (Math.random() > 0.7) {
                createSpark(mouseX, mouseY);
                lastSparkTime = now;
            }
        }
    });

    // Create spark burst on click
    document.addEventListener('click', function(e) {
        createSparkBurst(e.clientX, e.clientY);
        createElectricArc(e.clientX, e.clientY);
    });
}

// Create a single spark with multiple particles
function createSpark(x, y) {
    const spark = document.createElement('div');
    spark.className = 'spark';
    spark.style.left = x + 'px';
    spark.style.top = y + 'px';

    // Create 3-5 particles per spark
    const particleCount = Math.floor(Math.random() * 3) + 3;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'spark-particle';

        // Randomize particle properties
        const size = Math.random() * 3 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';

        // Random direction
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 20 + 10;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;

        particle.style.setProperty('--tx', tx + 'px');
        particle.style.setProperty('--ty', ty + 'px');
        particle.style.animation = `sparkMoveRandom 0.4s ease-out forwards`;

        spark.appendChild(particle);
    }

    document.body.appendChild(spark);

    // Remove after animation
    setTimeout(() => {
        spark.remove();
    }, 600);
}

// Create a larger spark burst (for clicks and switch)
function createSparkBurst(x, y) {
    const burst = document.createElement('div');
    burst.className = 'spark';
    burst.style.left = x + 'px';
    burst.style.top = y + 'px';

    // Create more particles for burst
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.className = 'spark-particle';

        const size = Math.random() * 4 + 3;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';

        // Spread in all directions
        const angle = (i / 8) * Math.PI * 2;
        const distance = Math.random() * 30 + 20;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;

        particle.animate([
            { transform: 'translate(0, 0)', opacity: 1 },
            { transform: `translate(${tx}px, ${ty}px)`, opacity: 0 }
        ], {
            duration: 400,
            easing: 'ease-out',
            fill: 'forwards'
        });

        burst.appendChild(particle);
    }

    document.body.appendChild(burst);

    setTimeout(() => {
        burst.remove();
    }, 500);
}

// Create electric arc effect on click
function createElectricArc(x, y) {
    const arc = document.createElement('div');
    arc.className = 'electric-arc';
    arc.style.left = x + 'px';
    arc.style.top = y + 'px';

    // Create 6 arc lines radiating outward
    for (let i = 0; i < 6; i++) {
        const line = document.createElement('div');
        line.className = 'arc-line';
        line.style.transform = `rotate(${i * 60}deg)`;

        // Add some randomness to line length
        line.style.height = (Math.random() * 15 + 20) + 'px';

        arc.appendChild(line);
    }

    document.body.appendChild(arc);

    setTimeout(() => {
        arc.remove();
    }, 300);
}

// Add custom CSS for random spark movement
const sparkStyle = document.createElement('style');
sparkStyle.textContent = `
    @keyframes sparkMoveRandom {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(var(--tx, 10px), var(--ty, -10px)) scale(0.5);
            opacity: 0;
        }
    }
`;
document.head.appendChild(sparkStyle);
