// ===== SMOOTH CURSOR (Bulb replaces arrow) =====
    const glow = document.getElementById('cursorGlow');
    const follower = document.getElementById('cursorFollower');

    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let followerX = mouseX, followerY = mouseY;
    let rafId;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (glow) { glow.style.left = mouseX + 'px'; glow.style.top = mouseY + 'px'; }
    });

    // Lag-follow the bulb cursor
    function lerpCursor() {
      followerX += (mouseX - followerX) * 0.18;
      followerY += (mouseY - followerY) * 0.18;
      if (follower) {
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';
      }
      rafId = requestAnimationFrame(lerpCursor);
    }
    lerpCursor();

    // Hide native cursor on the page
    document.body.style.cursor = 'none';
    document.querySelectorAll('a,button,input,select,textarea,[role="button"]').forEach(el => el.style.cursor = 'none');

    // ===== CARD HOVER GLOW EFFECT =====
    document.querySelectorAll('.glass-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
      });
    });

    // ===== FLOATING ICONS =====
    const icons = ['✦', '⬡', '◈', '✧', '⬟', '◇', '✦', '⌘', '❋', '◈', '✧', '⬡', '◎', '✦', '◆'];
    const container = document.getElementById('floatIcons');
    function spawnIcon() {
      if (!container) return;
      const el = document.createElement('div');
      el.className = 'fi';
      el.textContent = icons[Math.floor(Math.random() * icons.length)];
      const size = 12 + Math.random() * 18;
      el.style.cssText = `left:${Math.random() * 100}%;bottom:-40px;font-size:${size}px;color:rgba(${Math.random() > 0.5 ? '167,139,250' : '45,212,191'},${0.1 + Math.random() * 0.15});animation-duration:${9 + Math.random() * 14}s;animation-delay:${Math.random() * 4}s;`;
      container.appendChild(el);
      setTimeout(() => el.remove(), 23000);
    }
    setInterval(spawnIcon, 600);
    for (let i = 0; i < 10; i++) setTimeout(spawnIcon, i * 300);

    // ===== SCROLL REVEAL =====
    const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => observer.observe(el));

    // ===== NAV SCROLL STATE =====
    let skillsOffset = 0;
    const updateSkillsOffset = () => {
      const skillsSec = document.getElementById('skills');
      if (skillsSec) {
        skillsOffset = skillsSec.offsetTop;
      }
    };
    window.addEventListener('load', updateSkillsOffset);
    window.addEventListener('resize', updateSkillsOffset);
    updateSkillsOffset();

    window.addEventListener('scroll', () => {
      const nav = document.querySelector('nav');
      if (!nav) return;
      
      const triggerPoint = skillsOffset > 0 ? skillsOffset - 120 : 20;
      
      if (window.scrollY >= triggerPoint) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }, { passive: true });

    // ===== PROFILE IMAGE ZOOM-IN ON LOAD =====
    window.addEventListener('load', () => {
      const profileWrap = document.getElementById('heroProfileImg');
      setTimeout(() => {
        if (profileWrap) profileWrap.classList.add('img-visible');
      }, 300);
    });

    // ===== BULB SCROLL GLOW + BURST ANIMATION =====
    const canvas = document.getElementById('burstCanvas');
    let ctx = canvas ? canvas.getContext('2d') : null;
    let particles = [];

    function resizeCanvas() {
      if (canvas) { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class SparkParticle {
      constructor(x, y) {
        this.x = x; this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = 3 + Math.random() * 9;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed - (1 + Math.random() * 3);
        this.size = 1.5 + Math.random() * 4;
        this.alpha = 1;
        this.decay = 0.012 + Math.random() * 0.018;
        this.color = `hsla(${35 + Math.random() * 20}, 100%, ${55 + Math.random() * 15}%, `;
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        this.vy += 0.07; this.vx *= 0.98; this.vy *= 0.98;
        this.alpha -= this.decay;
      }
      draw(c) {
        c.save();
        c.globalAlpha = Math.max(0, this.alpha);
        c.shadowBlur = 12; c.shadowColor = '#fbbf24';
        c.fillStyle = this.color + Math.max(0, this.alpha) + ')';
        c.beginPath(); c.arc(this.x, this.y, this.size, 0, Math.PI * 2); c.fill();
        c.restore();
      }
    }

    function animateParticles() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles = particles.filter(p => p.alpha > 0);
      particles.forEach(p => { p.update(); p.draw(ctx); });
      if (particles.length > 0) requestAnimationFrame(animateParticles);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function triggerSparkBurst(x, y) {
      particles = [];
      for (let i = 0; i < 100; i++) particles.push(new SparkParticle(x, y));
      requestAnimationFrame(animateParticles);
    }

    // Bulb cursor SVG inner elements for live update
    const cursorBulbGlass = document.querySelector('#cursorFollower .bulb-glass');
    const cursorFilament = document.querySelector('#cursorFollower .cursor-filament');

    let burstTriggered = false;

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const bulb = document.getElementById('heroBulb');
      const bulbContainer = document.getElementById('heroBulbContainer');
      const glowBack = document.getElementById('bulbGlowBack');
      const flash = document.getElementById('burstFlash');
      const bulbSvg = bulb;
      const TRIGGER = 320;

      if (!bulb || !bulbContainer) return;

      if (scrollY < TRIGGER) {
        // --- PROGRESSIVE GLOW phase ---
        const t = scrollY / TRIGGER; // 0 → 1
        burstTriggered = false;

        // Bulb SVG: opacity 0.18 → 0.7, glow increases
        bulbSvg.style.opacity = 0.18 + t * 0.52;
        bulbSvg.style.filter = t > 0.1
          ? `drop-shadow(0 0 ${t * 60}px rgba(251,191,36,${t * 0.85})) drop-shadow(0 0 ${t * 20}px rgba(255,220,80,${t * 0.6}))`
          : 'none';
        bulbSvg.style.transform = `scale(${1 + t * 0.1})`;

        // Background radial glow orb
        if (glowBack) {
          glowBack.style.opacity = t * 0.8;
          glowBack.style.background = `radial-gradient(circle, rgba(251,191,36,${t * 0.5}) 0%, rgba(251,191,36,${t * 0.12}) 50%, transparent 75%)`;
          glowBack.style.transform = `scale(${1 + t * 0.3})`;
          glowBack.style.animation = t > 0.5 ? 'bulbGlowPulse 2s ease-in-out infinite alternate' : 'none';
        }

        // Cursor bulb: dim (pre-burst)
        if (follower) follower.classList.remove('burst-mode');
        if (glow) glow.classList.remove('yellow-glow');

        // Reset container if scrolled back up
        bulbContainer.style.opacity = '1';
        bulbContainer.style.transform = 'scale(1)';
        bulbContainer.style.pointerEvents = 'auto';

      } else {
        // --- BURST phase ---
        if (!burstTriggered) {
          burstTriggered = true;

          const rect = bulb.getBoundingClientRect();
          const startX = rect.left + rect.width / 2;
          const startY = rect.top + rect.height / 2;

          // Screen flash
          if (flash) {
            flash.style.transition = 'none';
            flash.style.opacity = '0.85';
            setTimeout(() => { flash.style.transition = 'opacity 0.7s ease-out'; flash.style.opacity = '0'; }, 30);
          }

          // Spark explosion
          triggerSparkBurst(startX, startY);

          // Fade out hero bulb
          bulbContainer.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          bulbContainer.style.opacity = '0';
          bulbContainer.style.transform = 'scale(1.3)';
          bulbContainer.style.pointerEvents = 'none';

          // Make cursor bulb glow (burst mode)
          if (follower) follower.classList.add('burst-mode');
          if (glow) glow.classList.add('yellow-glow');
        }
      }
    }, { passive: true });

    // ===== MOBILE MENU TOGGLE =====
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle && navLinks) {
      navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinks.classList.toggle('active');
        const icon = navToggle.querySelector('i');
        if (icon) {
          if (navLinks.classList.contains('active')) {
            icon.className = 'fa-solid fa-xmark';
          } else {
            icon.className = 'fa-solid fa-bars';
          }
        }
      });

      // Close menu when a link inside is clicked
      navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          navLinks.classList.remove('active');
          const icon = navToggle.querySelector('i');
          if (icon) icon.className = 'fa-solid fa-bars';
        });
      });

      // Close menu when clicking outside of it
      document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !navToggle.contains(e.target)) {
          navLinks.classList.remove('active');
          const icon = navToggle.querySelector('i');
          if (icon) icon.className = 'fa-solid fa-bars';
        }
      });
    }

    // ===== RESUME MODAL & POPUP FUNCTIONALITY =====
    const resumeModal = document.getElementById('resumeModal');
    const closeResumeBtn = document.getElementById('closeResumeBtn');
    const closeResumeBackdrop = document.getElementById('closeResumeBackdrop');
    const downloadResumeBtn = document.getElementById('downloadResumeBtn');
    const resumePrintBtn = document.getElementById('resumePrintBtn');
    const resumeZoomIn = document.getElementById('resumeZoomIn');
    const resumeZoomOut = document.getElementById('resumeZoomOut');
    const zoomLevelVal = document.getElementById('zoomLevelVal');
    const resumeDocumentWrapper = document.getElementById('resumeDocumentWrapper');

    let currentZoom = 1.0;

    function openResumeModal() {
      if (!resumeModal) return;
      resumeModal.classList.add('active');
      resumeModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      currentZoom = 1.0;
      updateZoom();
    }

    function closeResumeModal() {
      if (!resumeModal) return;
      resumeModal.classList.remove('active');
      resumeModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    function updateZoom() {
      if (resumeDocumentWrapper) {
        resumeDocumentWrapper.style.transform = `scale(${currentZoom})`;
      }
      if (zoomLevelVal) {
        zoomLevelVal.textContent = `${Math.round(currentZoom * 100)}%`;
      }
    }

    // Attach open triggers
    document.querySelectorAll('.open-resume-trigger').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openResumeModal();
      });
    });

    // Close listeners
    if (closeResumeBtn) closeResumeBtn.addEventListener('click', closeResumeModal);
    if (closeResumeBackdrop) closeResumeBackdrop.addEventListener('click', closeResumeModal);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && resumeModal && resumeModal.classList.contains('active')) {
        closeResumeModal();
      }
    });

    // Zoom handlers
    if (resumeZoomIn) {
      resumeZoomIn.addEventListener('click', () => {
        if (currentZoom < 1.5) {
          currentZoom += 0.1;
          updateZoom();
        }
      });
    }

    if (resumeZoomOut) {
      resumeZoomOut.addEventListener('click', () => {
        if (currentZoom > 0.7) {
          currentZoom -= 0.1;
          updateZoom();
        }
      });
    }

    // Print handler
    if (resumePrintBtn) {
      resumePrintBtn.addEventListener('click', () => {
        window.print();
      });
    }

    // Download PDF handler
    if (downloadResumeBtn) {
      downloadResumeBtn.addEventListener('click', () => {
        const originalText = downloadResumeBtn.innerHTML;
        downloadResumeBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-1"></i> Generating...';
        downloadResumeBtn.style.pointerEvents = 'none';

        const element = document.getElementById('resumeDocumentWrapper');
        const opt = {
          margin:       [0.2, 0.2, 0.2, 0.2],
          filename:     'Subramaniyam_M_Resume.pdf',
          image:        { type: 'jpeg', quality: 0.98 },
          html2canvas:  { scale: 2, useCORS: true, letterRendering: true, logging: false },
          jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        if (window.html2pdf) {
          html2pdf().set(opt).from(element).save().then(() => {
            downloadResumeBtn.innerHTML = '<i class="fa-solid fa-check me-1"></i> Downloaded!';
            setTimeout(() => {
              downloadResumeBtn.innerHTML = originalText;
              downloadResumeBtn.style.pointerEvents = 'auto';
            }, 2200);
          }).catch(err => {
            console.error('PDF generation error:', err);
            window.print();
            downloadResumeBtn.innerHTML = originalText;
            downloadResumeBtn.style.pointerEvents = 'auto';
          });
        } else {
          window.print();
          downloadResumeBtn.innerHTML = originalText;
          downloadResumeBtn.style.pointerEvents = 'auto';
        }
      });
    }

    // Re-apply cursor styles to newly created buttons
    document.querySelectorAll('a,button,input,select,textarea,[role="button"],.open-resume-trigger').forEach(el => el.style.cursor = 'none');