// Audio & Envelope Logic
const bgMusic = document.getElementById('bg-music');
const muteBtn = document.getElementById('mute-btn');
const envScreen = document.getElementById('env-screen');
const mainInv = document.getElementById('main-inv');
const waxSeal = document.getElementById('wax-seal');

let isMusicPlaying = false;
let envelopeOpened = false;

// Audio toggle
muteBtn.addEventListener('click', () => {
    if (isMusicPlaying) {
        bgMusic.pause();
        muteBtn.classList.add('paused');
    } else {
        bgMusic.play().catch(e => console.log("Play prevented"));
        muteBtn.classList.remove('paused');
    }
    isMusicPlaying = !isMusicPlaying;
});

// Create CSS confetti
function fireConfetti() {
    const colors = ['#c9a84c', '#e8d5a0', '#ffffff'];
    for (let i = 0; i < 40; i++) {
        const particle = document.createElement('div');
        particle.classList.add('confetti-particle');
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
        particle.style.animationDelay = Math.random() * 0.5 + 's';
        document.body.appendChild(particle);
        
        setTimeout(() => particle.remove(), 5000);
    }
}

// Open Envelope
waxSeal.addEventListener('click', () => {
    if (envelopeOpened) return;
    envelopeOpened = true;

    // Start music
    bgMusic.volume = 0.5;
    bgMusic.currentTime = 0;
    bgMusic.play().then(() => {
        isMusicPlaying = true;
        muteBtn.classList.remove('paused');
    }).catch(e => console.log("Audio play blocked"));

    // Step 1: Flap opens
    envScreen.classList.add('opening');

    // Step 2: Envelope slides away, Invitation emerges
    setTimeout(() => {
        envScreen.classList.add('slide-away');
        mainInv.style.display = 'block';
        muteBtn.classList.add('visible');
        
        // Trigger the cinematic 'emerge' animation
        setTimeout(() => {
            mainInv.classList.add('emerge');
            fireConfetti();
            initScratchCard(); // Init scratch card when visible
        }, 50);
    }, 900);

    // Clean up
    setTimeout(() => {
        envScreen.style.display = 'none';
    }, 2500);
});

// Scroll Animations
const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal-section').forEach(el => {
    observer.observe(el);
});

// Background Particles
const pContainer = document.getElementById('particles');
for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    const size = Math.random() * 10 + 8; // 8px to 18px for visible heart shapes
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    p.style.left = Math.random() * 100 + 'vw';
    p.style.animationDuration = Math.random() * 10 + 10 + 's';
    p.style.animationDelay = Math.random() * 5 + 's';
    p.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor" style="width: 100%; height: 100%; display: block;"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.27 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.77-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
    pContainer.appendChild(p);
}

// Scratch to Reveal Logic
let scratched = false;
function initScratchCard() {
    const canvas = document.getElementById('scratch-canvas');
    const ctx = canvas.getContext('2d');
    const wrap = document.getElementById('scratch-wrap');
    
    // High-DPI Canvas Setup for Crystal Clear Rendering
    const dpr = window.devicePixelRatio || 1;
    const cssWidth = 250;
    const cssHeight = 60;

    canvas.width = cssWidth * dpr;
    canvas.height = cssHeight * dpr;
    canvas.style.width = cssWidth + 'px';
    canvas.style.height = cssHeight + 'px';
    ctx.scale(dpr, dpr);

    // Draw terracotta foil base
    const gradient = ctx.createLinearGradient(0, 0, cssWidth, cssHeight);
    gradient.addColorStop(0, '#E09252');
    gradient.addColorStop(0.5, '#F2B98A');
    gradient.addColorStop(1, '#BD7031');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, cssWidth, cssHeight);

    // Add elegant diagonal foil lines
    ctx.lineWidth = 1;
    for (let i = -cssWidth; i < cssWidth; i += 8) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + cssHeight, cssHeight);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.stroke();
    }

    // Add a classy inner border
    ctx.strokeStyle = 'rgba(74, 55, 40, 0.2)';
    ctx.lineWidth = 1;
    ctx.strokeRect(4, 4, cssWidth - 8, cssHeight - 8);

    // Draw stylized text with a subtle shadow
    ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.fillStyle = '#4C2D13';
    ctx.font = 'bold 13px "Cinzel", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✨ SCRATCH TO REVEAL ✨', cssWidth / 2, cssHeight / 2);
    ctx.shadowColor = 'transparent'; // reset shadow

    let isDrawing = false;

    // Mini Popper Effect Function
    function spawnMiniPopper(globalX, globalY) {
        const colors = ['#c9a84c', '#e8d5a0', '#ffffff'];
        for (let i = 0; i < 3; i++) {
            const particle = document.createElement('div');
            particle.classList.add('mini-popper');
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            particle.style.left = globalX + 'px';
            particle.style.top = globalY + 'px';
            
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 40 + 10;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity - 20; 
            
            particle.style.setProperty('--tx', `${tx}px`);
            particle.style.setProperty('--ty', `${ty}px`);
            
            document.body.appendChild(particle);
            setTimeout(() => particle.remove(), 600);
        }
    }

    function getPos(e) {
        const rect = canvas.getBoundingClientRect();
        let clientX = e.clientX;
        let clientY = e.clientY;
        
        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        }
        
        return {
            x: ((clientX - rect.left) / (rect.right - rect.left)) * cssWidth,
            y: ((clientY - rect.top) / (rect.bottom - rect.top)) * cssHeight,
            globalX: clientX,
            globalY: clientY
        };
    }

    function startDraw(e) {
        if (scratched) return;
        isDrawing = true;
        scratch(e);
    }

    function stopDraw() {
        isDrawing = false;
    }

    function scratch(e) {
        if (!isDrawing || scratched) return;
        
        if (e.cancelable) {
            e.preventDefault();
        }

        const pos = getPos(e);
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 18, 0, Math.PI * 2);
        ctx.fill();
        
        // Spawn mini party poppers occasionally while scratching
        if (Math.random() > 0.6) {
            spawnMiniPopper(pos.globalX, pos.globalY);
        }

        checkReveal();
    }

    function checkReveal() {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        let transparentCount = 0;

        for (let i = 3; i < pixels.length; i += 4) {
            if (pixels[i] === 0) transparentCount++;
        }

        const percentage = (transparentCount / (pixels.length / 4)) * 100;
        
        if (percentage > 45 && !scratched) {
            scratched = true;
            wrap.classList.add('revealed');
            document.getElementById('event-details').classList.remove('blurred');
            fireConfetti();
            canvas.style.transition = "opacity 0.5s ease";
            canvas.style.opacity = "0";
            setTimeout(() => { canvas.style.pointerEvents = "none"; }, 500);
        }
    }

    // Touch events (passive: false is REQUIRED for iOS/Android to prevent scrolling)
    canvas.addEventListener('touchstart', startDraw, { passive: false });
    canvas.addEventListener('touchmove', scratch, { passive: false });
    window.addEventListener('touchend', stopDraw);
    canvas.addEventListener('touchcancel', stopDraw);

    // Mouse events
    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', scratch);
    window.addEventListener('mouseup', stopDraw);

    // Initially blur the details below it
    document.getElementById('event-details').classList.add('blurred');
}

// Countdown Timer
// Use ISO 8601 format for Safari cross-browser compatibility
const targetDate = new Date('2026-08-05T11:00:00').getTime();
const daysEl = document.getElementById('cd-days');
const hoursEl = document.getElementById('cd-hours');
const minsEl = document.getElementById('cd-mins');
const secsEl = document.getElementById('cd-secs');

function updateTimer() {
    const now = new Date().getTime();
    const distance = targetDate - now;
    
    if (distance < 0 || !daysEl) return;

    daysEl.textContent = Math.floor(distance / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
    hoursEl.textContent = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
    minsEl.textContent = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
    secsEl.textContent = Math.floor((distance % (1000 * 60)) / 1000).toString().padStart(2, '0');
}

if (daysEl) {
    setInterval(updateTimer, 1000);
    updateTimer();
}

// RSVP Flow
const btnYes = document.getElementById('rsvp-yes-btn');
const btnNo = document.getElementById('rsvp-no-btn');
const step1 = document.getElementById('rsvp-step1');
const successStep = document.getElementById('rsvp-success');
const declineStep = document.getElementById('rsvp-decline');

btnYes.addEventListener('click', () => {
    step1.classList.add('hidden-step');
    setTimeout(() => {
        successStep.classList.remove('hidden-step');
        fireConfetti();
    }, 100);
});

btnNo.addEventListener('click', () => {
    step1.classList.add('hidden-step');
    setTimeout(() => {
        declineStep.classList.remove('hidden-step');
    }, 100);
});

// Slideshow Logic
const slides = document.querySelectorAll('#arch-slideshow .slide');
let currentSlide = 0;
if (slides.length > 0) {
    setInterval(() => {
        slides[currentSlide].classList.remove('slide-active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('slide-active');
    }, 4000); // Change image every 4 seconds
}
