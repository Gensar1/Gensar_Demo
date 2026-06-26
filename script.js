// Navbar Icon

const btn = document.querySelector('.navbar-toggler');
const icon = document.getElementById('menuIcon');

btn.addEventListener('click', () => {

    if(icon.classList.contains('bi-list')){
        icon.classList.replace('bi-list','bi-x-lg');
    }else{
        icon.classList.replace('bi-x-lg','bi-list');
    }

});


// Counter Animation

const counters = document.querySelectorAll('.counter');

counters.forEach(counter => {

    const target = +counter.getAttribute('data-target');

    let count = 0;

    const updateCounter = () => {

        count += Math.ceil(target / 80);

        if(count < target){
            counter.innerText = count;
            requestAnimationFrame(updateCounter);
        }
        else{
            counter.innerText = target + '+';
        }

    };

    updateCounter();

});
// ==========================================================================
// SCROLL RUNTIME ANIMATION INTERSECTION ENGINE
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    const targetSections = document.querySelectorAll('.scroll-animate-section');

    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.15 // Triggers right when 15% of the section is visible
    };

    const globalObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active-visible');
                observer.unobserve(entry.target); // Runs cleanly once per page load
            }
        });
    }, observerOptions);

    targetSections.forEach(section => {
        globalObserver.observe(section);
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const bioRows = document.querySelectorAll(".bio-stream-row");
    const imageDeck = document.querySelector(".abstract-image-deck-wrapper");
    const imageFrames = document.querySelectorAll(".deck-image-frame");

    bioRows.forEach(row => {
        // Triggered when cursor enters the bio row text region
        row.addEventListener("mouseenter", function () {
            const targetLeader = this.getAttribute("data-leader");
            
            // Add global helper class to dim non-focused elements
            imageDeck.classList.add("has-active-focus");
            
            // Find matching card framework and pull it forward
            imageFrames.forEach(frame => {
                if (frame.getAttribute("data-frame") === targetLeader) {
                    frame.classList.add("focused-front");
                } else {
                    frame.classList.remove("focused-front");
                }
            });
        });

        // Restores regular geometric image layout when cursor leaves
        row.addEventListener("mouseleave", function () {
            imageDeck.classList.remove("has-active-focus");
            imageFrames.forEach(frame => {
                frame.classList.remove("focused-front");
            });
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const counterElements = document.querySelectorAll(".counter-value");
    
    const startCounting = (element) => {
        const target = parseInt(element.getAttribute("data-target"), 10);
        const duration = 2000; // Animation running duration in milliseconds
        const startTime = performance.now();
        
        const updateNumber = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out cubic formula for a smooth deceleration look
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            
            const currentValue = Math.floor(easeProgress * target);
            element.textContent = currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            } else {
                element.textContent = target; // Ensure perfect precise integer ending
            }
        };
        
        requestAnimationFrame(updateNumber);
    };

    // Observer options: fires when at least 20% of the grid section enters viewport
    const observerOptions = {
        threshold: 0.2,
        root: null
    };

    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                startCounting(element);
                observer.unobserve(element); // Stop observing once counting finishes
            }
        });
    }, observerOptions);

    counterElements.forEach(el => statsObserver.observe(el));
});
document.addEventListener("DOMContentLoaded", function () {
    const strips = document.querySelectorAll(".ecosystem-strip-row");

    strips.forEach(strip => {
        strip.addEventListener("mouseenter", function () {
            // Remove the active expansion class from all other horizontal elements
            strips.forEach(s => s.classList.remove("active-strip"));
            
            // Add focus expansion to the current hovered strip row
            this.classList.add("active-strip");
        });
    });
});

// ==========================================================================
// CUSTOM CURSOR (lavender dot + trailing ring)
// ==========================================================================

(function () {
    const cursor = document.getElementById('cursor');
    const ring = document.getElementById('cursorRing');
    if (!cursor || !ring) return;

    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
        cursor.classList.add('visible');
        ring.classList.add('visible');
    });

    document.addEventListener('mouseleave', () => {
        cursor.classList.remove('visible');
        ring.classList.remove('visible');
    });

    function animateRing() {
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;
        ring.style.left = ringX + 'px';
        ring.style.top = ringY + 'px';
        requestAnimationFrame(animateRing);
    }
    animateRing();
})();

// ==========================================================================
// SCROLL REVEAL ANIMATIONS (shared across all pages)
// ==========================================================================

document.addEventListener("DOMContentLoaded", function () {
    const animElements = document.querySelectorAll(".animate-on-scroll, .anim-fade");
    if (animElements.length === 0) return;

    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px"
    };

    const animObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("animated");
            }
        });
    }, observerOptions);

    animElements.forEach(el => {
        animObserver.observe(el);
    });
});

// ==========================================================================
// SCROLL PROGRESS CIRCLE
// ==========================================================================

document.addEventListener('DOMContentLoaded', function () {
    const progressEl = document.getElementById('scrollProgress');
    const fillCircle = document.getElementById('progressFill');
    if (!progressEl || !fillCircle) return;

    const circumference = 106.8;

    function updateProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight <= 0) return;

        const progress = Math.min(scrollTop / docHeight, 1);
        const offset = circumference * (1 - progress);
        fillCircle.style.strokeDashoffset = offset;

        progressEl.classList.toggle('visible', scrollTop > 100);
    }

    window.addEventListener('scroll', updateProgress);
    window.addEventListener('resize', updateProgress);
    updateProgress();

    progressEl.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});
