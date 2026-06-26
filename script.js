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

    // Also watch for garchitects-style reveal classes
    const revealElements = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                }
            });
        }, { threshold: 0.12 });

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    }
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

/* Gallery Modal */
function openGallery(title, specsEncoded, galleryEncoded) {
  try {
    var specs = JSON.parse(decodeURIComponent(specsEncoded));
    var gallery = JSON.parse(decodeURIComponent(galleryEncoded));
    document.getElementById('modalTitle').textContent = title;
    var specLabels = {
      category: 'Category', status: 'Status', duration: 'Duration', mode: 'Mode',
      location: 'Location', experience: 'Experience', skills: 'Skills',
      description: 'Description'
    };
    var specHtml = '';
    Object.keys(specLabels).forEach(function(k) {
      if (specs[k]) {
        specHtml += '<div class="pm-spec"><span class="pm-spec-label">' + specLabels[k] + '</span><span class="pm-spec-val">' + specs[k] + '</span></div>';
      }
    });
    document.getElementById('modalSpecs').innerHTML = specHtml;
    var mediaHtml = '';
    gallery.forEach(function(item, idx) {
      var rawUrl = item.video || item.image || '';
      var ytMatch = rawUrl.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|live\/)|youtu\.be\/)([\w\-]{11})/i);
      var ytId = ytMatch ? ytMatch[1] : null;
      var inner = '';
      if (ytId) {
        var autoplay = idx === 0 ? '&autoplay=1&mute=1' : '';
        inner = '<iframe src="https://www.youtube.com/embed/' + ytId + '?rel=0&modestbranding=1' + autoplay + '" allow="autoplay; fullscreen" allowfullscreen loading="lazy"></iframe>';
      } else if (item.video && !item.image) {
        var autoplay = idx === 0 ? 'autoplay muted' : '';
        inner = '<video src="' + encodeURI(item.video) + '" controls loop playsinline ' + autoplay + '></video>';
      } else if (item.image) {
        inner = '<img src="' + encodeURI(item.image) + '" alt="" loading="lazy">';
      }
      if (inner) {
        var capHtml = item.caption ? '<div class="pm-caption">' + item.caption + '</div>' : '';
        mediaHtml += '<div class="pm-slide">' + inner + capHtml + '</div>';
      }
    });
    document.getElementById('modalMainMedia').innerHTML = mediaHtml;
    document.getElementById('projectModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
  } catch(e) { console.error('Gallery error:', e); }
}

function closeGallery() {
  document.getElementById('projectModal').style.display = 'none';
  document.body.style.overflow = '';
  document.getElementById('modalMainMedia').innerHTML = '';
}

document.getElementById('projectModal').addEventListener('click', function(e) {
  if (e.target === this || e.target.classList.contains('pm-wrap') || e.target.classList.contains('pm-left')) {
    closeGallery();
  }
});

document.addEventListener('keydown', function(e) {
  var m = document.getElementById('projectModal');
  if (m && m.style.display === 'block' && e.key === 'Escape') closeGallery();
});

document.addEventListener('DOMContentLoaded', function () {
    var forms = document.querySelectorAll('form[netlify]');
    forms.forEach(function (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var errors = form.querySelectorAll('.form-error');
            errors.forEach(function (el) { el.remove(); });
            var inputs = form.querySelectorAll('.input-error');
            inputs.forEach(function (el) { el.classList.remove('input-error'); });
            var valid = true;
            var requiredFields = form.querySelectorAll('[required]');
            requiredFields.forEach(function (field) {
                if (!field.value.trim()) {
                    valid = false;
                    showError(field, 'This field is required');
                }
            });
            var emailFields = form.querySelectorAll('input[type="email"]');
            emailFields.forEach(function (field) {
                if (field.value.trim() && !isValidEmail(field.value.trim())) {
                    valid = false;
                    showError(field, 'Please enter a valid email address');
                }
            });
            if (valid) {
                var submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.textContent = 'Submitting...';
                }
                var formData = new FormData(form);
                fetch('/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams(formData).toString()
                }).then(function () {
                    form.reset();
                    showSuccessOverlay();
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.textContent = 'Submit';
                    }
                }).catch(function () {
                    showSuccessOverlay();
                    form.reset();
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.textContent = 'Submit';
                    }
                });
            }
        });
    });
    function showError(field, msg) {
        field.classList.add('input-error');
        var error = document.createElement('span');
        error.className = 'form-error';
        error.textContent = msg;
        field.parentNode.appendChild(error);
    }
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
});

function showSuccessOverlay() {
    var overlay = document.getElementById('formSuccessOverlay');
    if (overlay) overlay.style.display = 'flex';
}

function closeSuccessOverlay() {
    var overlay = document.getElementById('formSuccessOverlay');
    if (overlay) overlay.style.display = 'none';
}

/* Page loader */
window.addEventListener('load', function() {
  setTimeout(function() {
    var l = document.getElementById('loader');
    if (l) l.classList.add('hide');
  }, 1800);
});

/* Glass navbar on scroll */
var navbar = document.querySelector('.custom-navbar');
if (navbar) {
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}
