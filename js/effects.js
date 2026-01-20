// Session detection - runs immediately before anything else
(function() {
    // sessionStorage is tab-specific AND clears on browser close
    // If no marker exists, this is a fresh browser session
    if (!sessionStorage.getItem('sj_session_active')) {
        // Fresh browser session - clear any previous animation flag
        localStorage.removeItem('sj_animation_shown');
        sessionStorage.setItem('sj_session_active', 'true');
    }
})();

/* ============================================
   SJ Electrical - Fun Effects
   Light Switch, Spark Cursor, Loading Animation & Voltage Meter
   ============================================ */

// Session-aware helper functions
function shouldShowAnimation() {
    // Skip if already shown this session (any tab)
    if (localStorage.getItem('sj_animation_shown') === 'true') {
        return false;
    }
    // Skip if page already loaded (cached/fast)
    if (document.readyState === 'complete') {
        return false;
    }
    return true;
}

function markAnimationShown() {
    localStorage.setItem('sj_animation_shown', 'true');

    // Notify other tabs via BroadcastChannel (with fallback)
    try {
        if (window.BroadcastChannel) {
            const channel = new BroadcastChannel('sj_electrical_session');
            channel.postMessage({ type: 'animation_complete' });
            channel.close();
        }
    } catch (e) {
        // BroadcastChannel not available (Safari private mode)
    }
}

function listenForOtherTabs() {
    try {
        if (window.BroadcastChannel) {
            const channel = new BroadcastChannel('sj_electrical_session');
            channel.onmessage = (event) => {
                if (event.data.type === 'animation_complete') {
                    // Another tab showed animation - hide ours immediately
                    const loader = document.getElementById('pageLoader');
                    if (loader) {
                        loader.classList.add('loaded');
                        setTimeout(() => loader.remove(), 300);
                    }
                }
            };
        }
    } catch (e) {
        // Fallback: listen for localStorage changes
        window.addEventListener('storage', (event) => {
            if (event.key === 'sj_animation_shown' && event.newValue === 'true') {
                const loader = document.getElementById('pageLoader');
                if (loader) {
                    loader.classList.add('loaded');
                    setTimeout(() => loader.remove(), 300);
                }
            }
        });
    }
}

// Initialize loading animation immediately (before DOMContentLoaded)
initPageLoader();

document.addEventListener('DOMContentLoaded', function() {
    initLightSwitch();
    initVoltageMeter();
});

/* ============================================
   Lightbulb Page Loading Animation
   ============================================ */
function initPageLoader() {
    // Check session - skip if animation already shown this session
    if (!shouldShowAnimation()) return;

    // Create the loader HTML
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.id = 'pageLoader';
    loader.innerHTML = `
        <div class="lightbulb-container">
            <div class="lightbulb" id="lightbulb">
                <div class="bulb-glass">
                    <div class="bulb-glow"></div>
                    <div class="bulb-filament">
                        <div class="filament-wire"></div>
                    </div>
                </div>
                <div class="bulb-base"></div>
                <div class="bulb-screw"></div>
            </div>
        </div>
        <div class="loader-text">
            <span>P</span><span>o</span><span>w</span><span>e</span><span>r</span><span>i</span><span>n</span><span>g</span><span> </span><span>u</span><span>p</span><span>.</span><span>.</span><span>.</span>
        </div>
    `;

    // Insert at the very beginning of body or create if body doesn't exist yet
    if (document.body) {
        document.body.insertBefore(loader, document.body.firstChild);
    } else {
        document.addEventListener('DOMContentLoaded', function() {
            document.body.insertBefore(loader, document.body.firstChild);
        });
    }

    // Listen for other tabs showing animation
    listenForOtherTabs();

    // Start the flicker animation (faster timing)
    setTimeout(() => {
        const bulb = document.getElementById('lightbulb');
        if (bulb) {
            bulb.classList.add('flickering');

            // After flicker animation (600ms), turn on the bulb
            setTimeout(() => {
                bulb.classList.remove('flickering');
                bulb.classList.add('on');

                // Hide the loader after 200ms "on" state
                setTimeout(() => {
                    const pageLoader = document.getElementById('pageLoader');
                    if (pageLoader) {
                        pageLoader.classList.add('loaded');
                        // Mark animation as shown for this session
                        markAnimationShown();

                        // Remove from DOM after 300ms fade transition
                        setTimeout(() => {
                            pageLoader.remove();
                        }, 300);
                    }
                }, 200);
            }, 600);
        }
    }, 100);
}

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

    // Check for saved theme preference - dark is now default
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        // Switch is "on" (up) for light mode
    } else {
        // Dark mode is default - switch is "off" (down position)
        switchToggle.classList.add('off');
    }

    // Click handler
    lightSwitch.addEventListener('click', function() {
        const isLightMode = document.documentElement.getAttribute('data-theme') === 'light';

        // Play click sound
        playClickSound();

        // Add flicker effect
        document.body.classList.add('theme-transitioning');

        // Toggle switch position
        switchToggle.classList.toggle('off');

        // Apply theme after a brief delay for the flicker effect
        setTimeout(() => {
            if (isLightMode) {
                // Switch to dark (default)
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'dark');
            } else {
                // Switch to light
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
            }
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

/* ============================================
   Voltage Meter for Quote Form
   ============================================ */
function initVoltageMeter() {
    const quoteForm = document.getElementById('quoteForm');
    if (!quoteForm) return; // Only run on quote page

    // Create the voltage meter
    const meter = document.createElement('div');
    meter.className = 'voltage-meter';
    meter.innerHTML = `
        <div class="meter-header">
            <div class="meter-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
                Quote Power Level
            </div>
            <div class="meter-percentage" id="meterPercentage">0%</div>
        </div>
        <div class="meter-gauge">
            <div class="meter-fill" id="meterFill"></div>
            <div class="meter-sparks" id="meterSparks"></div>
        </div>
        <div class="meter-markers">
            <span class="meter-marker">0V</span>
            <span class="meter-marker">60V</span>
            <span class="meter-marker">120V</span>
            <span class="meter-marker">180V</span>
            <span class="meter-marker">240V</span>
        </div>
        <div class="meter-status">
            <span class="status-text" id="meterStatus">Start filling the form to charge up!</span>
        </div>
    `;

    // Insert before the form
    const formCard = document.querySelector('.quote-form-card');
    if (formCard) {
        formCard.parentNode.insertBefore(meter, formCard);
    }

    // Track form fields
    const fields = {
        name: { weight: 15, filled: false },
        phone: { weight: 15, filled: false },
        email: { weight: 15, filled: false },
        postcode: { weight: 10, filled: false },
        address: { weight: 5, filled: false },
        service: { weight: 15, filled: false },
        description: { weight: 25, filled: false }
    };

    let currentPercentage = 0;
    let lastPercentage = 0;

    // Add event listeners to form fields
    Object.keys(fields).forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
            field.addEventListener('input', () => updateMeter());
            field.addEventListener('change', () => updateMeter());
        }
    });

    function updateMeter() {
        let totalWeight = 0;
        let filledWeight = 0;

        Object.keys(fields).forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field) {
                totalWeight += fields[fieldName].weight;
                if (field.value.trim() !== '') {
                    filledWeight += fields[fieldName].weight;
                    fields[fieldName].filled = true;
                } else {
                    fields[fieldName].filled = false;
                }
            }
        });

        currentPercentage = Math.round((filledWeight / totalWeight) * 100);

        // Animate the meter
        const meterFill = document.getElementById('meterFill');
        const meterPercentage = document.getElementById('meterPercentage');
        const meterStatus = document.getElementById('meterStatus');

        if (meterFill && meterPercentage && meterStatus) {
            meterFill.style.width = currentPercentage + '%';
            meterPercentage.textContent = currentPercentage + '%';

            // Update status text
            if (currentPercentage === 0) {
                meterStatus.textContent = 'Start filling the form to charge up!';
                meterStatus.className = 'status-text';
                meterFill.classList.remove('charging', 'full');
            } else if (currentPercentage < 50) {
                meterStatus.textContent = 'Low voltage... keep going!';
                meterStatus.className = 'status-text';
                meterFill.classList.add('charging');
                meterFill.classList.remove('full');
            } else if (currentPercentage < 80) {
                meterStatus.textContent = 'Good charge! Almost there...';
                meterStatus.className = 'status-text';
                meterFill.classList.add('charging');
                meterFill.classList.remove('full');
            } else if (currentPercentage < 100) {
                meterStatus.textContent = 'High voltage! Just a bit more...';
                meterStatus.className = 'status-text';
                meterFill.classList.add('charging');
                meterFill.classList.remove('full');
            } else {
                meterStatus.textContent = 'FULLY CHARGED! Ready to submit!';
                meterStatus.className = 'status-text charged';
                meterFill.classList.remove('charging');
                meterFill.classList.add('full');

                // Big spark burst when fully charged
                if (lastPercentage < 100) {
                    createMeterSparkBurst();
                    playChargeCompleteSound();
                }
            }

            // Create mini sparks when percentage increases
            if (currentPercentage > lastPercentage) {
                createMiniSparks();
            }

            lastPercentage = currentPercentage;
        }
    }

    function createMiniSparks() {
        const meterSparks = document.getElementById('meterSparks');
        const meterFill = document.getElementById('meterFill');
        if (!meterSparks || !meterFill) return;

        // Get the position of the fill bar edge
        const fillWidth = meterFill.offsetWidth;

        for (let i = 0; i < 3; i++) {
            const spark = document.createElement('div');
            spark.className = 'mini-spark';
            spark.style.left = (fillWidth - 10) + 'px';
            spark.style.setProperty('--tx', (Math.random() * 20 - 10) + 'px');
            spark.style.setProperty('--ty', (Math.random() * -30 - 10) + 'px');

            meterSparks.appendChild(spark);

            setTimeout(() => spark.remove(), 800);
        }
    }

    function createMeterSparkBurst() {
        const meter = document.querySelector('.voltage-meter');
        if (!meter) return;

        const rect = meter.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        // Create multiple spark bursts
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                createSparkBurst(
                    x + (Math.random() * 100 - 50),
                    y + (Math.random() * 40 - 20)
                );
            }, i * 100);
        }
    }

    function playChargeCompleteSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();

            // Rising tone for "charged" feeling
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.15);
            oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.3);

            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.4);
        } catch (e) {
            // Audio not supported
        }
    }
}
