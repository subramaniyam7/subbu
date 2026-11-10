/* =============================================
   SUBRAMANIYAM M — PORTFOLIO SCRIPTS
   ============================================= */

// ===== NAVBAR SCROLL =====
const header = document.getElementById('siteHeader');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section[id], footer[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveLink() {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
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

window.addEventListener('scroll', updateActiveLink);
updateActiveLink();

// ===== MOBILE NAV =====
const hamburger = document.getElementById('navHamburger');
const overlay = document.getElementById('mobileOverlay');
const mobileClose = document.getElementById('mobileClose');
const mLinks = document.querySelectorAll('.m-link');

function openMobileNav() {
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMobileNav() {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', openMobileNav);
mobileClose.addEventListener('click', closeMobileNav);
overlay.addEventListener('click', (e) => {
  if (e.target === overlay) closeMobileNav();
});

mLinks.forEach(link => {
  link.addEventListener('click', closeMobileNav);
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.offsetTop - (document.querySelector('.site-header').offsetHeight || 70);
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===== REVEAL ON SCROLL =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});

// ===== MARQUEE PAUSE ON HOVER =====
const marqueeTrack = document.querySelector('.marquee-track');
if (marqueeTrack) {
  marqueeTrack.addEventListener('mouseenter', () => {
    marqueeTrack.style.animationPlayState = 'paused';
  });
  marqueeTrack.addEventListener('mouseleave', () => {
    marqueeTrack.style.animationPlayState = 'running';
  });
}

// ===== WORK CARD TILT =====
document.querySelectorAll('.work-card, .testi-card, .edu-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-6px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'all .5s ease';
    setTimeout(() => { card.style.transition = ''; }, 500);
  });
});

// ===== CURSOR GLOW =====
const cursorGlow = document.createElement('div');
cursorGlow.style.cssText = `
  position: fixed;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(249,115,22,.06) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
  transition: opacity .3s;
  transform: translate(-50%, -50%);
  will-change: left, top;
`;
document.body.appendChild(cursorGlow);

let mouseX = 0, mouseY = 0;
let glowX = 0, glowY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateCursor() {
  glowX += (mouseX - glowX) * 0.08;
  glowY += (mouseY - glowY) * 0.08;
  cursorGlow.style.left = glowX + 'px';
  cursorGlow.style.top = glowY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// ===== SKILL PILLS HOVER SOUND EFFECT (visual) =====
document.querySelectorAll('.skill-pill').forEach(pill => {
  pill.addEventListener('mouseenter', () => {
    pill.style.transform = `scale(1.08) rotate(${(Math.random() - 0.5) * 3}deg)`;
    pill.style.transition = 'all .2s cubic-bezier(.34,1.56,.64,1)';
  });
  pill.addEventListener('mouseleave', () => {
    pill.style.transform = '';
  });
});

// ===== FOOTER NAME TYPING EFFECT =====
const footerName = document.querySelector('.footer-name-big span');
if (footerName) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        footerName.style.transition = 'color 1.5s ease';
        footerName.style.color = 'rgba(255,255,255,0.1)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  observer.observe(footerName);
}

console.log('%c👋 Hey there! Built with care by Subramaniyam M.', 'color:#f97316; font-weight:700; font-size:14px;');

// ===== PROJECTS CAROUSEL =====
(function () {
  const carousel  = document.getElementById('projCarousel');
  const prevBtn   = document.getElementById('pcarPrev');
  const nextBtn   = document.getElementById('pcarNext');
  const dots      = document.querySelectorAll('.pcar-dot');
  if (!carousel || !prevBtn) return;

  let current = 0;
  const total = dots.length;

  function goTo(idx) {
    current = (idx + total) % total;
    carousel.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));
  dots.forEach(dot => {
    dot.addEventListener('click', () => goTo(parseInt(dot.dataset.slide)));
  });

  // Keyboard arrows
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  });

  // Touch/swipe support
  let startX = 0;
  carousel.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  carousel.addEventListener('touchend', (e) => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
  });
})();

// ===== EXPERIENCE AUTO-SCROLL — triggers on mouse enter =====
(function () {
  const expSection = document.getElementById('experience');
  const scrollTrack = document.getElementById('expScrollTrack');
  const scrollOuter = document.getElementById('expScrollOuter');
  if (!expSection || !scrollTrack) return;

  function startScroll() {
    expSection.classList.add('is-scrolling');
  }

  function stopScroll() {
    expSection.classList.remove('is-scrolling');
  }

  // Scroll from right to left when mouse enters into section
  expSection.addEventListener('mouseenter', startScroll);
  expSection.addEventListener('mousemove', startScroll);
  expSection.addEventListener('mouseleave', stopScroll);

  // Mobile / touch devices: auto-scroll when in view and handle touch
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  if (isTouch) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startScroll();
        } else {
          stopScroll();
        }
      });
    }, { threshold: 0.15 });

    observer.observe(expSection);

    let touchStartX = 0;
    if (scrollOuter) {
      scrollOuter.addEventListener('touchstart', () => {
        stopScroll();
      }, { passive: true });

      scrollOuter.addEventListener('touchend', () => {
        startScroll();
      }, { passive: true });
    }
  }
})();


// ===== BAG DROP ANIMATION =====
(function () {
  const bagScene = document.getElementById('bagScene');
  const toolWraps = document.querySelectorAll('.tool-icon-wrap');
  if (!bagScene || !toolWraps.length) return;

  let hasAnimated = false;

  function triggerDropAnimation() {
    if (hasAnimated) return;
    hasAnimated = true;

    // Shake the bag first
    const bagWrap = document.getElementById('bagWrap');
    if (bagWrap) {
      bagWrap.style.animation = 'none';
      bagWrap.style.transition = 'transform 0.1s ease';
      let shakeCount = 0;
      const shakeSeq = [
        { x: -8, y: -4, r: -5 },
        { x: 8,  y: -6, r: 5 },
        { x: -10,y: -8, r: -6 },
        { x: 10, y: -10,r: 7 },
        { x: -6, y: -12,r: -4 },
        { x: 6,  y: -14,r: 3 },
        { x: 0,  y: 0,  r: 0 }
      ];
      const shakeInterval = setInterval(() => {
        if (shakeCount >= shakeSeq.length) {
          clearInterval(shakeInterval);
          bagWrap.style.animation = 'bagFloat 4s ease-in-out infinite';
          return;
        }
        const s = shakeSeq[shakeCount];
        bagWrap.style.transform = `translate(${s.x}px, ${s.y}px) rotate(${s.r}deg)`;
        shakeCount++;
      }, 80);
    }

    // After the shake, drop each tool with its delay
    setTimeout(() => {
      toolWraps.forEach((wrap) => {
        const delay = parseInt(wrap.dataset.delay || 0);
        setTimeout(() => {
          wrap.classList.add('dropped');
        }, delay);
      });
    }, 500);
  }

  // Trigger when section enters viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        triggerDropAnimation();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.35 });

  observer.observe(bagScene);
})();


// ===== EDUCATION SLIDER (3 Tabs + Left/Right Navigation Buttons) =====
(function () {
  const track = document.getElementById('eduSliderTrack');
  const prevBtn = document.getElementById('eduPrevBtn');
  const nextBtn = document.getElementById('eduNextBtn');
  const tabs = document.querySelectorAll('.edu-tab');
  const dots = document.querySelectorAll('.edu-dot');
  if (!track || !prevBtn || !nextBtn) return;

  const slides = track.querySelectorAll('.edu-slide');
  const totalSlides = slides.length;

  function getSlideStep() {
    const firstSlide = track.querySelector('.edu-slide');
    if (!firstSlide) return track.offsetWidth;
    const style = window.getComputedStyle(track);
    const gap = parseFloat(style.gap) || 28;
    return firstSlide.offsetWidth + gap;
  }

  function updateActiveUI(index) {
    // Update dots
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });

    // Update tabs (when not in show-all mode)
    if (!track.classList.contains('show-all')) {
      tabs.forEach((tab) => {
        const tabTarget = tab.dataset.index;
        if (tabTarget === 'all') {
          tab.classList.remove('active');
        } else {
          tab.classList.toggle('active', parseInt(tabTarget) === index);
        }
      });
    }
  }

  function goToSlide(index) {
    track.classList.remove('show-all');
    const step = getSlideStep();
    track.scrollTo({
      left: index * step,
      behavior: 'smooth'
    });
    updateActiveUI(index);
  }

  // Left (Previous) button
  prevBtn.addEventListener('click', () => {
    track.classList.remove('show-all');
    const step = getSlideStep();
    const currentIndex = Math.round(track.scrollLeft / step);
    const prevIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    goToSlide(prevIndex);
  });

  // Right (Next) button
  nextBtn.addEventListener('click', () => {
    track.classList.remove('show-all');
    const step = getSlideStep();
    const currentIndex = Math.round(track.scrollLeft / step);
    const nextIndex = (currentIndex + 1) % totalSlides;
    goToSlide(nextIndex);
  });

  // 3 Tabs click handling
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.index;
      if (target === 'all') {
        track.classList.add('show-all');
        tabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        const targetIndex = parseInt(target, 10);
        goToSlide(targetIndex);
      }
    });
  });

  // Pagination dots click
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const targetIndex = parseInt(dot.dataset.index, 10);
      goToSlide(targetIndex);
    });
  });

  // Sync active states on manual scroll / swipe
  let scrollTimer = null;
  track.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      if (!track.classList.contains('show-all')) {
        const step = getSlideStep();
        const activeIdx = Math.round(track.scrollLeft / step);
        const clamped = Math.max(0, Math.min(totalSlides - 1, activeIdx));
        updateActiveUI(clamped);
      }
    }, 50);
  }, { passive: true });
})();
