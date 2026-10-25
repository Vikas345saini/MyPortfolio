// ========================================
// ★ ANIMATED STARFIELD WITH CONSTELLATIONS ★
// ========================================
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let stars = [];
let mouseX = 0, mouseY = 0;
const STAR_COUNT = 200;
const CONNECTION_DISTANCE = 120;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Star {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.6 + 0.2;
        this.twinkleSpeed = Math.random() * 0.02 + 0.005;
        this.twinklePhase = Math.random() * Math.PI * 2;
        this.isGold = Math.random() < 0.3; // 30% gold stars
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Mouse parallax
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
            this.x -= dx * 0.002;
            this.y -= dy * 0.002;
        }

        // Twinkle
        this.twinklePhase += this.twinkleSpeed;
        const twinkle = Math.sin(this.twinklePhase) * 0.3 + 0.7;
        this.currentOpacity = this.opacity * twinkle;

        // Wrap around
        if (this.x < -10) this.x = canvas.width + 10;
        if (this.x > canvas.width + 10) this.x = -10;
        if (this.y < -10) this.y = canvas.height + 10;
        if (this.y > canvas.height + 10) this.y = -10;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        if (this.isGold) {
            ctx.fillStyle = `rgba(212, 168, 83, ${this.currentOpacity})`;
        } else {
            ctx.fillStyle = `rgba(240, 236, 228, ${this.currentOpacity * 0.6})`;
        }
        ctx.fill();

        // Add glow to gold stars
        if (this.isGold && this.size > 1.2) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(212, 168, 83, ${this.currentOpacity * 0.1})`;
            ctx.fill();
        }
    }
}

// Shooting star class
class ShootingStar {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = 0;
        this.length = Math.random() * 80 + 40;
        this.speed = Math.random() * 8 + 6;
        this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3;
        this.opacity = 1;
        this.active = false;
        this.timer = Math.random() * 500 + 200;
    }

    update() {
        if (!this.active) {
            this.timer--;
            if (this.timer <= 0) {
                this.active = true;
                this.x = Math.random() * canvas.width * 0.8;
                this.y = Math.random() * canvas.height * 0.3;
            }
            return;
        }

        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.opacity -= 0.008;

        if (this.opacity <= 0 || this.x > canvas.width || this.y > canvas.height) {
            this.reset();
        }
    }

    draw() {
        if (!this.active) return;

        const tailX = this.x - Math.cos(this.angle) * this.length;
        const tailY = this.y - Math.sin(this.angle) * this.length;

        const gradient = ctx.createLinearGradient(tailX, tailY, this.x, this.y);
        gradient.addColorStop(0, 'rgba(212, 168, 83, 0)');
        gradient.addColorStop(1, `rgba(240, 216, 140, ${this.opacity})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Head glow
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
    }
}

function initStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
        stars.push(new Star());
    }
}

const shootingStars = [new ShootingStar(), new ShootingStar(), new ShootingStar()];

function drawConnections() {
    for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
            const dx = stars[i].x - stars[j].x;
            const dy = stars[i].y - stars[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < CONNECTION_DISTANCE) {
                const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.12;
                ctx.beginPath();
                ctx.moveTo(stars[i].x, stars[i].y);
                ctx.lineTo(stars[j].x, stars[j].y);
                ctx.strokeStyle = `rgba(212, 168, 83, ${opacity})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
}

function animateStarfield() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawConnections();

    stars.forEach(star => {
        star.update();
        star.draw();
    });

    shootingStars.forEach(ss => {
        ss.update();
        ss.draw();
    });

    requestAnimationFrame(animateStarfield);
}

resizeCanvas();
initStars();
animateStarfield();

window.addEventListener('resize', () => {
    resizeCanvas();
    initStars();
});

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// ========================================
// ★ CUSTOM CURSOR ★
// ========================================
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

if (cursorDot && cursorRing) {
    let ringX = 0, ringY = 0, dotX = 0, dotY = 0;

    document.addEventListener('mousemove', (e) => {
        dotX = e.clientX;
        dotY = e.clientY;
        cursorDot.style.left = dotX - 3 + 'px';
        cursorDot.style.top = dotY - 3 + 'px';
    });

    function animateRing() {
        ringX += (dotX - ringX) * 0.15;
        ringY += (dotY - ringY) * 0.15;
        cursorRing.style.left = ringX - 17.5 + 'px';
        cursorRing.style.top = ringY - 17.5 + 'px';
        requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover effect on interactive elements
    const hoverTargets = document.querySelectorAll('a, button, .skill-pill, .nav-link, .project-card-modern, .social-icon');
    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
    });
}

// ========================================
// ★ TYPING EFFECT ★
// ========================================
const typedTextEl = document.getElementById('typed-text');
const phrases = [
    'web applications.',
    'ML pipelines.',
    'elegant UIs.',
    'secure software.',
    'creative solutions.'
];
let phraseIdx = 0;
let charIdx = 0;
let isDeleting = false;

function typeEffect() {
    const current = phrases[phraseIdx];

    if (isDeleting) {
        typedTextEl.textContent = current.substring(0, charIdx - 1);
        charIdx--;
    } else {
        typedTextEl.textContent = current.substring(0, charIdx + 1);
        charIdx++;
    }

    let speed = isDeleting ? 35 : 70;

    if (!isDeleting && charIdx === current.length) {
        speed = 2200;
        isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        speed = 500;
    }

    setTimeout(typeEffect, speed);
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(typeEffect, 1200);
});

// ========================================
// ★ NAVBAR SCROLL EFFECT ★
// ========================================
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ========================================
// ★ ACTIVE NAV LINK ON SCROLL ★
// ========================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveNav() {
    let current = '';
    sections.forEach(section => {
        const top = section.offsetTop - 120;
        if (window.scrollY >= top) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// ========================================
// ★ CLOSE MOBILE NAV ON CLICK ★
// ========================================
const navCollapse = document.getElementById('navMenu');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
        if (bsCollapse) bsCollapse.hide();
    });
});

// ========================================
// ★ SCROLL REVEAL ANIMATIONS (custom AOS) ★
// ========================================
function scrollReveal() {
    const elements = document.querySelectorAll('[data-aos]');
    elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const delay = parseInt(el.getAttribute('data-delay')) || 0;

        if (rect.top < window.innerHeight - 80) {
            setTimeout(() => {
                el.classList.add('aos-animate');
            }, delay);
        }
    });
}

window.addEventListener('scroll', scrollReveal);
window.addEventListener('load', scrollReveal);

// ========================================
// ★ SKILL PILL ANIMATION ON SCROLL ★
// ========================================
function animateSkillPills() {
    const pills = document.querySelectorAll('.skill-pill');
    const section = document.getElementById('skills');
    if (!section) return;

    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.75) {
        pills.forEach((pill, i) => {
            setTimeout(() => {
                pill.classList.add('animated');
            }, i * 80);
        });
    }
}

window.addEventListener('scroll', animateSkillPills);

// ========================================
// ★ CONTACT FORM ★
// ========================================
const contactForm = document.getElementById('contactForm');
const formAlert = document.getElementById('formAlert');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Basic validation
        const inputs = contactForm.querySelectorAll('input, textarea');
        let valid = true;
        inputs.forEach(input => {
            if (!input.value.trim()) {
                valid = false;
                input.style.borderColor = '#ff5f57';
                setTimeout(() => { input.style.borderColor = ''; }, 2000);
            }
        });

        if (!valid) return;

        // Simulate send
        const btn = contactForm.querySelector('.submit-btn');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<span class="btn-gold-text"><i class="bi bi-hourglass-split me-2"></i>Sending...</span>';
        btn.disabled = true;

        setTimeout(() => {
            formAlert.classList.remove('d-none');
            contactForm.reset();
            btn.innerHTML = originalHTML;
            btn.disabled = false;

            setTimeout(() => formAlert.classList.add('d-none'), 5000);
        }, 1800);
    });
}

// ========================================
// ★ BACK TO TOP ★
// ========================================
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        backToTopBtn.style.display = 'flex';
        backToTopBtn.style.alignItems = 'center';
        backToTopBtn.style.justifyContent = 'center';
    } else {
        backToTopBtn.style.display = 'none';
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ========================================
// ★ MAGNETIC EFFECT ON BUTTONS ★
// ========================================
const magneticBtns = document.querySelectorAll('.btn-gold, .btn-outline-gold, .social-icon');

magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
    });
});

// ========================================
// ★ PARALLAX ON HERO VISUAL ★
// ========================================
const heroVisual = document.querySelector('.hero-visual');
if (heroVisual) {
    document.addEventListener('mousemove', (e) => {
        const xRatio = (e.clientX / window.innerWidth - 0.5) * 2;
        const yRatio = (e.clientY / window.innerHeight - 0.5) * 2;
        heroVisual.style.transform = `translate(${xRatio * 15}px, ${yRatio * 15}px)`;
    });
}

// ========================================
// ★ SMOOTH SECTION SCROLL ★
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ========================================
// ★ TILT EFFECT ON PROJECT CARDS ★
// ========================================
const tiltCards = document.querySelectorAll('.project-card-modern, .id-card');
tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / centerY * -5;
        const rotateY = (x - centerX) / centerX * 5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// ========================================
// ★ INITIALIZE ★
// ========================================
window.addEventListener('load', () => {
    animateSkillPills();
    scrollReveal();
    updateActiveNav();
});
