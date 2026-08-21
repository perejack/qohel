/**
 * QOHEL AFRICA GROUP — ENTERPRISE JAVASCRIPT SYSTEM
 * Core Application Engine, Modals, Forms, Audio FX & Interactive Components
 */

document.addEventListener('DOMContentLoaded', () => {
  initAudioSystem();
  initParticleCanvas();
  initTWC2026Countdown();
  initConsultationModal();
  initSLXSectorsGrid();
  initMobileNavigation();
  initGovernanceVault();
  initBooksModal();
  initTWCModals();
  initMobileDockScrollspy();
  initMethodologyMatrix();
});

/* ==========================================================================
   1. LUXURY AUDIO FEEDBACK SYSTEM (Web Audio API)
   ========================================================================== */
let audioCtx = null;
let audioEnabled = true;

function initAudioSystem() {
  const toggleBtn = document.getElementById('audio-toggle-btn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      audioEnabled = !audioEnabled;
      toggleBtn.classList.toggle('text-gold', audioEnabled);
      toggleBtn.classList.toggle('opacity-50', !audioEnabled);
      const icon = toggleBtn.querySelector('.audio-icon');
      if (icon) {
        icon.innerHTML = audioEnabled 
          ? `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M11 5L6 9H2v6h4l5 4V5z"/></svg>`
          : `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15zM17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"/></svg>`;
      }
      if (audioEnabled) playTone(587.33, 0.08, 'sine');
    });
  }
}

function playTone(freq = 440, duration = 0.08, type = 'sine') {
  if (!audioEnabled) return;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // AudioContext blocked or not supported
  }
}

function playSuccessChime() {
  if (!audioEnabled) return;
  playTone(523.25, 0.1, 'sine'); // C5
  setTimeout(() => playTone(659.25, 0.12, 'sine'), 100); // E5
  setTimeout(() => playTone(783.99, 0.16, 'sine'), 200); // G5
  setTimeout(() => playTone(1046.50, 0.25, 'triangle'), 300); // C6
}

/* ==========================================================================
   2. AMBIENT GOLD PARTICLES CANVAS
   ========================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 1.8 + 0.4;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3 - 0.15;
      this.alpha = Math.random() * 0.6 + 0.15;
      this.fadeSpeed = Math.random() * 0.005 + 0.002;
      this.increasing = Math.random() > 0.5;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.increasing) {
        this.alpha += this.fadeSpeed;
        if (this.alpha >= 0.7) this.increasing = false;
      } else {
        this.alpha -= this.fadeSpeed;
        if (this.alpha <= 0.1) this.increasing = true;
      }

      if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
        this.reset();
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212, 175, 55, ${this.alpha})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = "rgba(212, 175, 55, 0.4)";
      ctx.fill();
    }
  }

  const particleCount = Math.min(Math.floor(window.innerWidth / 20), 65);
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

/* ==========================================================================
   3. TWC 2026 COUNTDOWN TIMER (September 19, 2026)
   ========================================================================== */
function initTWC2026Countdown() {
  const targetDate = new Date('September 19, 2026 09:00:00 GMT+0300').getTime();

  function update() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    const daysElem = document.getElementById('twc-days');
    const hoursElem = document.getElementById('twc-hours');
    const minsElem = document.getElementById('twc-mins');
    const secsElem = document.getElementById('twc-secs');

    if (distance < 0) {
      if (daysElem) daysElem.innerText = '00';
      if (hoursElem) hoursElem.innerText = '00';
      if (minsElem) minsElem.innerText = '00';
      if (secsElem) secsElem.innerText = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysElem) daysElem.innerText = String(days).padStart(2, '0');
    if (hoursElem) hoursElem.innerText = String(hours).padStart(2, '0');
    if (minsElem) minsElem.innerText = String(minutes).padStart(2, '0');
    if (secsElem) secsElem.innerText = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   4. STRATEGIC CONSULTATION MODAL (Strict 4-Field Unpriced Form)
   ========================================================================== */
function initConsultationModal() {
  const modal = document.getElementById('consultation-modal');
  const openBtns = document.querySelectorAll('.trigger-consultation-modal');
  const closeBtn = document.getElementById('close-consultation-modal');
  const form = document.getElementById('strategic-consultation-form');
  const confirmationState = document.getElementById('consultation-confirmation');

  if (!modal) return;

  function openModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    playTone(520, 0.08, 'sine');
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    playTone(380, 0.08, 'sine');
  }

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Form submission handler with exact 4 fields verification
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const fullName = document.getElementById('consult-full-name').value.trim();
      const companyName = document.getElementById('consult-company-name').value.trim();
      const challenge = document.getElementById('consult-challenge').value.trim();
      const budget = document.getElementById('consult-budget').value.trim();

      if (!fullName || !companyName || !challenge || !budget) {
        alert('All 4 evaluation fields are strictly required for executive intake.');
        return;
      }

      // Populate confirmation docket
      const docketRef = 'QAG-STRAT-' + Math.floor(100000 + Math.random() * 900000);
      document.getElementById('docket-ref').innerText = docketRef;
      document.getElementById('docket-name').innerText = fullName;
      document.getElementById('docket-company').innerText = companyName;
      document.getElementById('docket-budget').innerText = budget;

      playSuccessChime();

      // Show confirmation view
      form.classList.add('hidden');
      confirmationState.classList.remove('hidden');
    });
  }

  const resetBtn = document.getElementById('consultation-reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (form) {
        form.reset();
        form.classList.remove('hidden');
      }
      if (confirmationState) confirmationState.classList.add('hidden');
      closeModal();
    });
  }
}

/* ==========================================================================
   5. STRATEGIC LIGHT EXCHANGE (SLX) 20-SECTOR INTERACTIVE GRID
   ========================================================================== */
function initSLXSectorsGrid() {
  const container = document.getElementById('slx-sectors-container');
  const searchInput = document.getElementById('slx-sector-search');
  const filterBtns = document.querySelectorAll('.slx-filter-btn');
  const invoiceModal = document.getElementById('slx-invoice-modal');
  const closeInvoiceBtn = document.getElementById('close-slx-invoice-modal');

  if (!container || typeof SLX_SECTORS === 'undefined') return;

  let currentFilter = 'all';
  let searchQuery = '';

  function renderSectors() {
    container.innerHTML = '';

    const filtered = SLX_SECTORS.filter(sector => {
      const matchesFilter = currentFilter === 'all' || sector.category === currentFilter;
      const matchesSearch = sector.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            sector.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-16 text-center glass-panel rounded-lg">
          <p class="text-gold font-serif text-xl mb-2">No Matching Entrepreneurial Sector Found</p>
          <p class="text-sm text-slate-400">Try adjusting your sector search keywords or category filters.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(sector => {
      const card = document.createElement('div');
      card.className = 'sector-card glass-panel rounded-lg p-6 flex flex-col justify-between transition-all duration-300 border border-gold/20 hover:border-gold/60';
      card.id = `sector-card-${sector.id}`;

      card.innerHTML = `
        <div>
          <div class="flex items-center justify-between mb-4">
            <span class="badge-gold">${sector.badge}</span>
            <span class="text-xs font-mono text-slate-400 font-bold">SECTOR #${String(sector.id).padStart(2, '0')}</span>
          </div>

          <div class="w-12 h-12 rounded bg-navy-deep border border-gold/30 flex items-center justify-center text-slate-400 mb-4 group-hover:text-gold transition-colors">
            ${sector.icon}
          </div>

          <h3 class="font-serif text-lg font-bold text-white mb-2 leading-snug">${sector.title}</h3>
          <p class="text-xs text-slate-300 mb-5 leading-relaxed">${sector.description}</p>
        </div>

        <div>
          <button type="button" class="unfold-trigger-btn btn-outline-gold w-full text-xs py-2.5 flex items-center justify-center gap-2" data-sector-id="${sector.id}">
            <span>Request to be Inducted</span>
            <svg class="w-3.5 h-3.5 transition-transform unfold-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
          </button>

          <!-- The Unfolded Induction Sequence -->
          <div class="unfold-container" id="unfold-${sector.id}">
            <form class="slx-induction-form space-y-3.5" data-sector-title="${sector.title}">
              <div class="p-3 bg-navy-deep/80 rounded border border-gold/20 mb-3">
                <p class="text-[11px] font-mono text-gold leading-tight">
                  <strong class="text-white">CHAPTER STATUS:</strong> 1 Exclusive Seat Remaining for Selected Sector.
                </p>
              </div>

              <div>
                <label class="luxury-label text-[11px]">Full Name of Founder *</label>
                <input type="text" class="luxury-input text-xs py-2 slx-name" placeholder="Executive Name" required>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label class="luxury-label text-[11px]">Active Mobile *</label>
                  <input type="tel" class="luxury-input text-xs py-2 slx-phone" placeholder="+254 7..." required>
                </div>
                <div>
                  <label class="luxury-label text-[11px]">Direct WhatsApp *</label>
                  <input type="tel" class="luxury-input text-xs py-2 slx-whatsapp" placeholder="+254 7..." required>
                </div>
              </div>

              <div>
                <label class="luxury-label text-[11px]">Secured Business Email Address *</label>
                <input type="email" class="luxury-input text-xs py-2 slx-email" placeholder="executive@company.com" required>
              </div>

              <div>
                <label class="luxury-label text-[11px]">Registered Business Name *</label>
                <input type="text" class="luxury-input text-xs py-2 slx-company" placeholder="Official Registered Entity Name" required>
              </div>

              <div>
                <label class="luxury-label text-[11px]">Comprehensive Business Description & Core Operational Focus *</label>
                <textarea rows="3" class="luxury-textarea text-xs py-2 slx-desc" placeholder="Detail your revenue model, core products, and current scaling friction..." required></textarea>
              </div>

              <!-- Final Action Gate -->
              <button type="submit" class="btn-gold w-full text-xs py-3 flex items-center justify-center gap-2 mt-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                <span>Request Payment</span>
              </button>
            </form>
          </div>
        </div>
      `;

      container.appendChild(card);
    });

    attachUnfoldListeners();
  }

  function attachUnfoldListeners() {
    const triggers = container.querySelectorAll('.unfold-trigger-btn');
    triggers.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const sectorId = btn.getAttribute('data-sector-id');
        const unfoldBox = document.getElementById(`unfold-${sectorId}`);
        const card = document.getElementById(`sector-card-${sectorId}`);
        const arrow = btn.querySelector('.unfold-arrow');

        playTone(480, 0.06, 'sine');

        if (unfoldBox.classList.contains('open')) {
          unfoldBox.classList.remove('open');
          card.classList.remove('active');
          if (arrow) arrow.style.transform = 'rotate(0deg)';
        } else {
          // Close other open unfold boxes for clean focus
          document.querySelectorAll('.unfold-container.open').forEach(el => el.classList.remove('open'));
          document.querySelectorAll('.sector-card.active').forEach(el => el.classList.remove('active'));
          document.querySelectorAll('.unfold-arrow').forEach(el => el.style.transform = 'rotate(0deg)');

          unfoldBox.classList.add('open');
          card.classList.add('active');
          if (arrow) arrow.style.transform = 'rotate(180deg)';
          
          // Smooth scroll to card
          setTimeout(() => {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 150);
        }
      });
    });

    // Handle SLX Form Submission and Gateway Trigger
    const forms = container.querySelectorAll('.slx-induction-form');
    forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const sectorTitle = form.getAttribute('data-sector-title');
        const founderName = form.querySelector('.slx-name').value.trim();
        const phone = form.querySelector('.slx-phone').value.trim();
        const whatsapp = form.querySelector('.slx-whatsapp').value.trim();
        const email = form.querySelector('.slx-email').value.trim();
        const company = form.querySelector('.slx-company').value.trim();
        const desc = form.querySelector('.slx-desc').value.trim();

        // Populate the Automated Email Routing Digest Preview
        document.getElementById('invoice-sector-name').innerText = sectorTitle;
        document.getElementById('invoice-email-subject').innerText = `New SLX Chapter Induction Request — ${sectorTitle}`;
        document.getElementById('invoice-founder').innerText = founderName;
        document.getElementById('invoice-phone').innerText = phone;
        document.getElementById('invoice-whatsapp').innerText = whatsapp;
        document.getElementById('invoice-email').innerText = email;
        document.getElementById('invoice-company').innerText = company;
        document.getElementById('invoice-desc').innerText = desc;
        document.getElementById('invoice-timestamp').innerText = new Date().toUTCString();

        playSuccessChime();

        // Open Invoice Gateway Modal
        if (invoiceModal) {
          invoiceModal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }

        // Freeze Card Configuration
        const card = form.closest('.sector-card');
        if (card) {
          card.classList.add('inducted');
          const triggerBtn = card.querySelector('.unfold-trigger-btn');
          if (triggerBtn) {
            triggerBtn.innerHTML = `
              <span class="text-emerald-400 font-bold flex items-center gap-1.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                Seat Claimed — Gateway Pending
              </span>
            `;
            triggerBtn.disabled = true;
          }
          const unfoldBox = card.querySelector('.unfold-container');
          if (unfoldBox) unfoldBox.classList.remove('open');
        }
      });
    });
  }

  // Search input handler
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderSectors();
    });
  }

  // Filter buttons handler
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active', 'border-gold', 'text-gold', 'bg-gold/10'));
      btn.classList.add('active', 'border-gold', 'text-gold', 'bg-gold/10');
      currentFilter = btn.getAttribute('data-filter');
      playTone(440, 0.05, 'sine');
      renderSectors();
    });
  });

  // Close Invoice Modal
  if (closeInvoiceBtn && invoiceModal) {
    closeInvoiceBtn.addEventListener('click', () => {
      invoiceModal.classList.remove('active');
      document.body.style.overflow = '';
      playTone(380, 0.08, 'sine');
    });
  }

  // Initial render
  renderSectors();
}

/* ==========================================================================
   6. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileNavigation() {
  const toggleBtn = document.getElementById('mobile-menu-btn');
  const drawer = document.getElementById('mobile-nav-drawer');
  const closeBtn = document.getElementById('close-mobile-drawer');
  const drawerLinks = drawer ? drawer.querySelectorAll('a') : [];

  if (!toggleBtn || !drawer) return;

  function openDrawer() {
    drawer.classList.remove('translate-x-full');
    document.body.style.overflow = 'hidden';
    playTone(500, 0.08, 'sine');
  }

  function closeDrawer() {
    drawer.classList.add('translate-x-full');
    document.body.style.overflow = '';
    playTone(350, 0.08, 'sine');
  }

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* ==========================================================================
   7. GOVERNANCE VAULT SYSTEM
   ========================================================================== */
const VAULT_DOCS = {
  'lln-cs-001': {
    id: "LLN-CS-001",
    title: "Sirwo Cafe & Bistro: The Kittonny Dynasty Asset",
    code: "MASTER CASE STUDY // ASSET ID: LLN-CS-001 // CLIENT ID: SIRWO-001",
    classification: "MASTER CASE STUDY",
    lead: "LEAD STRATEGIST: FAITH LAEL SILA, CHIEF EXECUTIVE OFFICER",
    startPage: 5,
    body: `
      <div class="space-y-4">
        <div>
          <h4 class="font-serif text-lg font-bold text-gold mb-1">Executive Background & Diagnostic</h4>
          <p class="text-xs text-slate-300 leading-relaxed">
            Sirwo Cafe & Bistro is a premium culinary, social, and remote-work ecosystem located in Lavington, Nairobi. Owned by the prominent Kittonny family, the establishment holds deep-rooted prestige within the region's premium hospitality sector. Following a strategic management transition, Legacy Lens Network was formally retained to audit, re-architect, and manage the brand's entire digital media infrastructure.
          </p>
        </div>

        <div>
          <h4 class="font-serif text-lg font-bold text-gold mb-1">Diagnosed Friction Points</h4>
          <ul class="list-disc list-inside text-xs text-slate-300 space-y-1">
            <li>Competing venues relied heavily on flat, superficial aesthetic B-roll with zero narrative retention.</li>
            <li>Organic algorithm distribution was choked due to non-optimized hook geometry and lack of human-centric storytelling.</li>
            <li>Mid-week table inventory suffered from underutilization outside traditional peak hours.</li>
          </ul>
        </div>

        <div>
          <h4 class="font-serif text-lg font-bold text-gold mb-1">Strategic Interventions & Campaign Re-Engineering</h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div class="p-3 bg-navy-deep rounded border border-gold/20">
              <strong class="text-white block mb-1">01. The Quiz Night Engine:</strong>
              <p class="text-slate-300 text-[11px]">Re-engineered mid-week casual trivia into a competitive social spectacle. Captured 100% table capacity on historically dead weeknights.</p>
            </div>
            <div class="p-3 bg-navy-deep rounded border border-gold/20">
              <strong class="text-white block mb-1">02. The Jazz Night Acoustic Flow:</strong>
              <p class="text-slate-300 text-[11px]">Fused atmospheric live music acoustics with fluid mixology transitions, targeting high-net-worth evening diner spend.</p>
            </div>
          </div>
        </div>

        <div>
          <h4 class="font-serif text-lg font-bold text-gold mb-1">Verified Audit Telemetry</h4>
          <ul class="space-y-1.5 font-mono text-xs">
            <li class="flex justify-between border-b border-white/10 pb-1"><span class="text-slate-400">Total Organic Impressions:</span> <strong class="text-gold">132,478+ Verified Views</strong></li>
            <li class="flex justify-between border-b border-white/10 pb-1"><span class="text-slate-400">Paid Media Spend:</span> <strong class="text-emerald-400">KSH 0.00 (100% Organic Growth)</strong></li>
            <li class="flex justify-between border-b border-white/10 pb-1"><span class="text-slate-400">Event Night Capacity:</span> <strong class="text-gold">100% Table Occupancy</strong></li>
            <li class="flex justify-between pb-1"><span class="text-slate-400">Algorithmic Synchronization:</span> <strong class="text-gold">Dopamine Window Triggering</strong></li>
          </ul>
        </div>
      </div>
    `
  },

  'lln-sb-002': {
    id: "LLN-SB-002",
    title: "Personal Brand Architecture & Executive Influence",
    code: "MASTER STRATEGIC BLUEPRINT // ASSET ID: LLN-SB-002 // PROSPECT ID: PB-002",
    classification: "MASTER STRATEGIC BLUEPRINT",
    lead: "LEAD STRATEGIST: FAITH LAEL SILA, CHIEF EXECUTIVE OFFICER",
    startPage: 20,
    body: `
      <div class="space-y-4">
        <div>
          <h4 class="font-serif text-lg font-bold text-gold mb-1">Strategic Objective & Profile Overview</h4>
          <p class="text-xs text-slate-300 leading-relaxed">
            Premium personal branding requires dismantling passive social media presence and replacing it with high-authority media ecosystems. This strategic directive maps out the complete digital evolution of a high-profile public figure pivoting from traditional civic structures into the luxury lifestyle and private investment sectors.
          </p>
        </div>

        <div>
          <h4 class="font-serif text-lg font-bold text-gold mb-1">The 3-Phase Monetization Framework</h4>
          <div class="space-y-2 text-xs text-slate-300">
            <div class="p-2.5 bg-navy-deep rounded border border-white/10">
              <strong class="text-gold">Phase 01 — Baseline Calibration & Aesthetic Deconstruction:</strong> Auditing historic public image, purging low-authority artifacts, and engineering executive wardrobe and spatial backdrops.
            </div>
            <div class="p-2.5 bg-navy-deep rounded border border-white/10">
              <strong class="text-gold">Phase 02 — Thought-Leadership & Content Syndication:</strong> High-density video keynote capture, executive audio essay syndication, and high-status editorial placements.
            </div>
            <div class="p-2.5 bg-navy-deep rounded border border-white/10">
              <strong class="text-gold">Phase 03 — High-Ticket Advisory Deal Flow:</strong> Converting personal authority into non-dilutive corporate board seats, sovereign advisory retainers, and private investor networks.
            </div>
          </div>
        </div>

        <div>
          <h4 class="font-serif text-lg font-bold text-gold mb-1">Executive Deliverables</h4>
          <ul class="space-y-1.5 font-mono text-xs">
            <li class="flex justify-between border-b border-white/10 pb-1"><span class="text-slate-400">Target Demographic:</span> <strong class="text-gold">HNW Investors & Founders</strong></li>
            <li class="flex justify-between border-b border-white/10 pb-1"><span class="text-slate-400">Reputation Armor:</span> <strong class="text-gold">Institutional Grade Authority</strong></li>
            <li class="flex justify-between pb-1"><span class="text-slate-400">Commercial Architecture:</span> <strong class="text-emerald-400">High-Ticket Capital Attractor</strong></li>
          </ul>
        </div>
      </div>
    `
  },

  'lln-sb-003': {
    id: "LLN-SB-003",
    title: "Volumetric Discovery & Fast-Casual Acquisition Engine",
    code: "MASTER STRATEGIC BLUEPRINT // ASSET ID: LLN-SB-003 // PROSPECT ID: QSR-003",
    classification: "MASTER STRATEGIC BLUEPRINT",
    lead: "LEAD STRATEGIST: FAITH LAEL SILA, CHIEF EXECUTIVE OFFICER",
    startPage: 29,
    body: `
      <div class="space-y-4">
        <div>
          <h4 class="font-serif text-lg font-bold text-gold mb-1">Primary Directive</h4>
          <p class="text-xs text-slate-300 leading-relaxed">
            The Quick-Service Restaurant (QSR) sector demands massive volumetric organic discovery and high-velocity consumer conversion. This strategic blueprint maps out the complete media overhaul for an established fast-casual restaurant franchise looking to translate its product appeal into localized digital dominance and accelerated multi-branch expansion.
          </p>
        </div>

        <div>
          <h4 class="font-serif text-lg font-bold text-gold mb-1">Core Operational Mechanisms</h4>
          <div class="space-y-2 text-xs text-slate-300">
            <div class="p-2.5 bg-navy-deep rounded border border-white/10">
              <strong class="text-gold">Psychological Sensory Hook Engineering:</strong> High-speed 4K macro capture focusing on sizzling textures, cheese pulls, and artisanal assembly designed to induce immediate impulse appetite responses.
            </div>
            <div class="p-2.5 bg-navy-deep rounded border border-white/10">
              <strong class="text-gold">Geo-Fenced Commuter Ad Sprints:</strong> Algorithmic distribution scheduled to deliver high-impact promotional offers directly during Nairobi's prime lunch ordering (11:30 AM - 1:30 PM) and evening commute (5:00 PM - 8:00 PM) windows.
            </div>
            <div class="p-2.5 bg-navy-deep rounded border border-white/10">
              <strong class="text-gold">Multi-Unit Franchise Replicability:</strong> Standardized visual playbooks and batch-production systems allowing multi-branch franchise rollouts with uniform brand fidelity.
            </div>
          </div>
        </div>

        <div>
          <h4 class="font-serif text-lg font-bold text-gold mb-1">Commercial Impact Scope</h4>
          <ul class="space-y-1.5 font-mono text-xs">
            <li class="flex justify-between border-b border-white/10 pb-1"><span class="text-slate-400">Acquisition Velocity:</span> <strong class="text-gold">High-Volume Walk-In Lift</strong></li>
            <li class="flex justify-between border-b border-white/10 pb-1"><span class="text-slate-400">Delivery Channel Growth:</span> <strong class="text-emerald-400">+180% Bio-Link Conversions</strong></li>
            <li class="flex justify-between pb-1"><span class="text-slate-400">Franchise Scalability:</span> <strong class="text-gold">Modular Media Architecture</strong></li>
          </ul>
        </div>
      </div>
    `
  },

  'lln-sb-004': {
    id: "LLN-SB-004",
    title: "Culinary Logistics & Lifestyle Experience Strategy",
    code: "MASTER STRATEGIC BLUEPRINT // ASSET ID: LLN-SB-004 // PROSPECT ID: CUL-004",
    classification: "MASTER STRATEGIC BLUEPRINT",
    lead: "LEAD STRATEGIST: FAITH LAEL SILA, CHIEF EXECUTIVE OFFICER",
    startPage: 38,
    body: `
      <div class="space-y-4">
        <div>
          <h4 class="font-serif text-lg font-bold text-gold mb-1">Primary Directive</h4>
          <p class="text-xs text-slate-300 leading-relaxed">
            The premium culinary and private catering sector thrives on taste sensory triggers, aesthetic hygiene, and community destination positioning. This master strategic blueprint deconstructs the digital evolution of an artisanal kitchen franchise into an elite local hub for high-disposable-income families, remote executives, and luxury private caterings.
          </p>
        </div>

        <div>
          <h4 class="font-serif text-lg font-bold text-gold mb-1">The 8-Part Content Matrix (Direct from Dossier)</h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
            <div class="p-2 bg-navy-deep rounded border border-white/5"><strong class="text-gold">01. "The Speed of Home":</strong> Cozy architecture & mental reset.</div>
            <div class="p-2 bg-navy-deep rounded border border-white/5"><strong class="text-gold">02. "Love Language":</strong> Human culinary discipline & precision.</div>
            <div class="p-2 bg-navy-deep rounded border border-white/5"><strong class="text-gold">03. "The Golden Hour Pour":</strong> Sunset seating & mixology.</div>
            <div class="p-2 bg-navy-deep rounded border border-white/5"><strong class="text-gold">04. "The Artisanal Glow":</strong> High-temp ovens & crust blistering.</div>
            <div class="p-2 bg-navy-deep rounded border border-white/5"><strong class="text-gold">05. "The Weekend Catalyst":</strong> Live acoustic vibrations & nightlife.</div>
            <div class="p-2 bg-navy-deep rounded border border-white/5"><strong class="text-gold">06. "The Remote Work Lunch":</strong> Corporate lunch productivity.</div>
            <div class="p-2 bg-navy-deep rounded border border-white/5"><strong class="text-gold">07. "The Macro Sensory Layer":</strong> High-contrast food cinematography.</div>
            <div class="p-2 bg-navy-deep rounded border border-white/5"><strong class="text-gold">08. "The Generational Link-Up":</strong> Vibrant Sunday brunch dynamics.</div>
          </div>
        </div>

        <div>
          <h4 class="font-serif text-lg font-bold text-gold mb-1">Operational SLA & Performance Guarantee</h4>
          <ul class="space-y-1.5 font-mono text-xs">
            <li class="flex justify-between border-b border-white/10 pb-1"><span class="text-slate-400">Post-Production Velocity:</span> <strong class="text-emerald-400">48-Hour Master Delivery SLA</strong></li>
            <li class="flex justify-between border-b border-white/10 pb-1"><span class="text-slate-400">Audience Targeting:</span> <strong class="text-gold">Affluent Weekend Families & Executives</strong></li>
            <li class="flex justify-between pb-1"><span class="text-slate-400">Retainer Architecture:</span> <strong class="text-gold">3-Month & 6-Month Category Dominance</strong></li>
          </ul>
        </div>
      </div>
    `
  }
};

let currentVaultDoc = VAULT_DOCS['lln-cs-001'];
let authorizedVaultUser = null;

function initGovernanceVault() {
  const modal = document.getElementById('vault-modal');
  const closeBtn = document.getElementById('close-vault-modal');
  const triggers = document.querySelectorAll('.trigger-vault-doc');

  const stepSynopsis = document.getElementById('vault-step-synopsis');
  const stepRequest = document.getElementById('vault-step-request');
  const stepPdf = document.getElementById('vault-step-pdf');

  const unlockBtn = document.getElementById('vault-unlock-dossier-btn');
  const backToSynopsisBtn = document.getElementById('vault-back-to-synopsis-btn');
  const backFromPdfBtn = document.getElementById('vault-back-from-pdf-btn');
  const clearanceForm = document.getElementById('vault-clearance-form');
  const pdfIframe = document.getElementById('vault-pdf-iframe');
  const pdfContainer = document.getElementById('vault-pdf-container');
  const jumpBtns = document.querySelectorAll('.vault-jump-page');

  if (!modal) return;

  function showVaultStep(stepToShow) {
    [stepSynopsis, stepRequest, stepPdf].forEach(s => {
      if (s) s.classList.add('hidden');
    });
    if (stepToShow) stepToShow.classList.remove('hidden');
  }

  function openVault(docKey) {
    const doc = VAULT_DOCS[docKey] || VAULT_DOCS['lln-cs-001'];
    currentVaultDoc = doc;

    const el = (id, text) => {
      const e = document.getElementById(id);
      if (e) e.innerText = text;
    };

    el('vault-doc-title', doc.title);
    el('vault-doc-code', doc.code);
    el('vault-doc-class', doc.classification);
    el('vault-doc-lead', doc.lead);

    const bodyEl = document.getElementById('vault-doc-body');
    if (bodyEl) bodyEl.innerHTML = doc.body;

    const targetTitle = document.getElementById('vault-request-target-title');
    if (targetTitle) targetTitle.innerText = `${doc.id} (${doc.title})`;

    showVaultStep(stepSynopsis);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    playTone(600, 0.08, 'sine');
  }

  // Hook trigger buttons on cards
  triggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const docKey = btn.getAttribute('data-doc-key');
      openVault(docKey);
    });
  });

  // Step 1 -> Step 2: Request Full Access Form
  if (unlockBtn) {
    unlockBtn.addEventListener('click', () => {
      const storedName = sessionStorage.getItem('qag_vault_name') || localStorage.getItem('qag_vault_name');
      const storedOrg = sessionStorage.getItem('qag_vault_org') || localStorage.getItem('qag_vault_org');
      if (storedName && storedOrg) {
        window.location.href = `/dossier?asset=${encodeURIComponent(currentVaultDoc.id)}&page=${currentVaultDoc.startPage}&name=${encodeURIComponent(storedName)}&org=${encodeURIComponent(storedOrg)}`;
      } else {
        showVaultStep(stepRequest);
      }
    });
  }

  // Step 2 -> Step 1: Back to synopsis
  if (backToSynopsisBtn) {
    backToSynopsisBtn.addEventListener('click', () => {
      showVaultStep(stepSynopsis);
    });
  }

  // Step 2: Handle Clearance Form Submit & Redirect to Full Page Dossier
  if (clearanceForm) {
    clearanceForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('vault-user-name').value.trim() || 'Executive Delegate';
      const email = document.getElementById('vault-user-email').value.trim() || 'executive@enterprise.com';
      const org = document.getElementById('vault-user-org').value.trim() || 'Enterprise Holdings';
      const role = document.getElementById('vault-user-role').value.trim() || 'Managing Director';

      authorizedVaultUser = { name, email, org, role };
      sessionStorage.setItem('qag_vault_name', name);
      sessionStorage.setItem('qag_vault_org', org);
      localStorage.setItem('qag_vault_name', name);
      localStorage.setItem('qag_vault_org', org);

      playSuccessChime();

      // Smoothly navigate to dedicated full-page dossier viewer
      setTimeout(() => {
        window.location.href = `/dossier?asset=${encodeURIComponent(currentVaultDoc.id)}&page=${currentVaultDoc.startPage}&name=${encodeURIComponent(name)}&org=${encodeURIComponent(org)}`;
      }, 250);
    });
  }

  // Handle Quick Page Jump Buttons
  jumpBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const page = btn.getAttribute('data-page') || '1';
      if (pdfIframe) {
        pdfIframe.src = `/assets/LEGACY%20LENS%20NETWORK%20COMPANY%20PORFOLIO.pdf#page=${page}&toolbar=0&navpanes=0&scrollbar=1&statusbar=0&messages=0&navpanes=0`;
      }
    });
  });

  // Anti-Download & Security Protection (Disable right click inside container)
  if (pdfContainer) {
    pdfContainer.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      return false;
    });
  }

  // Close modal logic
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      if (pdfIframe) pdfIframe.src = '';
      playTone(350, 0.08, 'sine');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      if (pdfIframe) pdfIframe.src = '';
    }
  });
}

/* ==========================================================================
   8. BOOKS & INTELLECTUAL PROPERTIES MODAL
   ========================================================================== */
const BOOKS_DATA = {
  mindset: {
    title: "THE 30-DAY MINDSET SHIFT",
    subtitle: "A Radical 30-Day Cognitive Protocol for Marketplace Expansion",
    author: "Faith Lael Wanjiku Sila (Lael Qohel)",
    synopsis: "This premier holistic program is explicitly built to dismantle and rearrange the reader's mindset in terms of the corporate world, helping them uncover the hidden, misaligned identity works that actively cause them to stay held back from their true economic expansion.",
    features: [
      "30 Daily Cognitive Reframing Modules",
      "Corporate Friction Diagnostic Checklists",
      "Raw Faith & Raw Strategy Execution Frameworks",
      "Executive Audio Accompaniment Dossier"
    ],
    price: "KSh 15,000 / Digital Master Edition"
  },
  stripped: {
    title: "STRIPPED TO THE FRAME",
    subtitle: "The Radical Blueprint for Finding Your True Identity When Everything Else is Torn Away",
    author: "Faith Lael Wanjiku Sila (Lael Qohel)",
    synopsis: "An unyielding, data-driven identity roadmap engineered specifically for high-capacity visionaries navigating intense institutional transitions, creative isolation, and high-stakes organizational friction. Born directly out of the raw crucible of a definitive life-altering attack, this strategic framework moves beyond generic motivational text to deconstruct the exact cognitive boundary systems, emotional decoupling layers, and core execution parameters required to rebuild from sovereign bedrock.",
    features: [
      "Forensic Identity Audit Matrices",
      "Emotional Decoupling Systems",
      "High-Stakes Organizational Friction Protocols",
      "Sovereign Visionary Roadmap"
    ],
    price: "Hardcover Executive Edition & VIP Study Guide"
  }
};

function initBooksModal() {
  const modal = document.getElementById('book-modal');
  const closeBtn = document.getElementById('close-book-modal');
  const triggers = document.querySelectorAll('.trigger-book-modal');

  if (!modal) return;

  function openBook(key) {
    const book = BOOKS_DATA[key] || BOOKS_DATA.mindset;
    document.getElementById('book-modal-title').innerText = book.title;
    document.getElementById('book-modal-subtitle').innerText = book.subtitle;
    document.getElementById('book-modal-author').innerText = book.author;
    document.getElementById('book-modal-synopsis').innerText = book.synopsis;
    document.getElementById('book-modal-price').innerText = book.price;

    const listContainer = document.getElementById('book-modal-features');
    if (listContainer) {
      listContainer.innerHTML = book.features.map(f => `
        <li class="flex items-center gap-2 text-xs text-slate-300">
          <svg class="w-4 h-4 text-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
          <span>${f}</span>
        </li>
      `).join('');
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    playTone(650, 0.08, 'sine');
  }

  triggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const key = btn.getAttribute('data-book-key');
      openBook(key);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      playTone(350, 0.08, 'sine');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

/* ==========================================================================
   9. TWC 2026 PASS ACQUISITION — PESAPAL M-PESA IFRAME & TICKET GENERATOR
   ========================================================================== */
function initTWCModals() {
  const modal = document.getElementById('twc-pass-modal');
  const closeBtn = document.getElementById('close-twc-pass-modal');
  const passBtns = document.querySelectorAll('.trigger-twc-pass');

  // Steps
  const stepForm = document.getElementById('twc-step-form');
  const stepWaiting = document.getElementById('twc-step-waiting');
  const stepSuccess = document.getElementById('twc-step-success');
  const stepFailed = document.getElementById('twc-step-failed');

  if (!modal || !stepForm) return;

  // State
  let currentOrderTrackingId = null;
  let currentOrderRef = null;
  let currentOrderData = null;
  let currentTierName = '';
  let currentTierPrice = '';
  let currentTierCode = '';
  let pollInterval = null;
  let countdownInterval = null;

  /* ---------- Show specific step, hide others ---------- */
  function showStep(step) {
    [stepForm, stepWaiting, stepSuccess, stepFailed].forEach(s => {
      if (s) s.classList.add('hidden');
    });
    if (step) step.classList.remove('hidden');
  }

  /* ---------- Reset modal to initial state ---------- */
  function resetModal() {
    showStep(stepForm);
    currentOrderTrackingId = null;
    currentOrderRef = null;
    currentOrderData = null;
    stopPolling();
    const iframe = document.getElementById('twc-pesapal-iframe');
    if (iframe) iframe.src = 'about:blank';
    const form = document.getElementById('twc-pass-form');
    if (form) form.reset();
  }

  /* ---------- Open modal from tier buttons ---------- */
  passBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      currentTierName = btn.getAttribute('data-tier-name') || 'Executive Pass';
      currentTierPrice = btn.getAttribute('data-tier-price') || 'KSH 7,500';
      currentTierCode = btn.getAttribute('data-tier-code') || 'DELEGATE';

      const nameEl = document.getElementById('twc-selected-tier-name');
      const priceEl = document.getElementById('twc-selected-tier-price');
      if (nameEl) nameEl.innerText = currentTierName;
      if (priceEl) priceEl.innerText = currentTierPrice;

      resetModal();
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      playTone(550, 0.08, 'sine');
    });
  });

  /* ---------- Close modal ---------- */
  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    stopPolling();
    playTone(350, 0.08, 'sine');
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  /* ---------- Cancel / Retry / Done buttons ---------- */
  const cancelBtn = document.getElementById('twc-cancel-payment');
  if (cancelBtn) cancelBtn.addEventListener('click', () => { stopPolling(); resetModal(); });

  const retryBtn = document.getElementById('twc-retry-payment');
  if (retryBtn) retryBtn.addEventListener('click', () => { resetModal(); });

  const doneBtn = document.getElementById('twc-close-success');
  if (doneBtn) doneBtn.addEventListener('click', closeModal);

  /* ---------- Stop polling ---------- */
  function stopPolling() {
    if (pollInterval) { clearInterval(pollInterval); pollInterval = null; }
    if (countdownInterval) { clearInterval(countdownInterval); countdownInterval = null; }
  }

  /* ---------- Form submit → Initiate PesaPal Order & Show Iframe ---------- */
  const form = document.getElementById('twc-pass-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const delegateName = document.getElementById('twc-name').value.trim();
      const email = document.getElementById('twc-email').value.trim();
      const phone = document.getElementById('twc-phone').value.trim();
      const organization = document.getElementById('twc-org').value.trim();

      if (!delegateName || !email || !phone || !organization) {
        alert('Please complete all required fields.');
        return;
      }

      const priceText = currentTierPrice.replace(/[^0-9]/g, '');
      const amount = parseInt(priceText, 10) || 7500;

      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          Connecting to PesaPal...
        `;
      }

      try {
        const response = await fetch('/api/initiate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            delegateName,
            email,
            phone,
            organization,
            tierName: currentTierName,
            tierPrice: amount,
            tierCode: currentTierCode,
            origin: window.location.origin
          })
        });

        const data = await response.json();

        if (!response.ok || !data.success || !data.redirectUrl) {
          throw new Error(data.error || data.message || 'Payment initiation failed');
        }

        currentOrderTrackingId = data.orderTrackingId;
        currentOrderRef = data.reference;
        currentOrderData = {
          delegateName,
          email,
          phone: data.phone || phone,
          organization,
          tierName: currentTierName,
          tierPrice: amount,
          tierCode: currentTierCode,
          orderRef: data.reference,
          orderTrackingId: data.orderTrackingId
        };

        playSuccessChime();

        // Update waiting screen labels
        const waitingPhone = document.getElementById('twc-waiting-phone');
        if (waitingPhone) waitingPhone.textContent = data.phone || phone;

        const orderRefDisplay = document.getElementById('twc-order-ref-display');
        if (orderRefDisplay) orderRefDisplay.textContent = data.reference;

        // Load PesaPal iframe
        const iframe = document.getElementById('twc-pesapal-iframe');
        if (iframe) {
          iframe.src = data.redirectUrl;
        }

        // Switch to waiting/iframe step
        showStep(stepWaiting);

        // Start polling & countdown
        startStatusPolling(data.orderTrackingId, currentOrderData);

      } catch (err) {
        console.error('Payment initiation error:', err);
        alert(`Payment Initialization Error: ${err.message}\n\nPlease verify network connection and try again.`);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
            Confirm &amp; Send M-Pesa Prompt
          `;
        }
      }
    });
  }

  /* ---------- Check Payment Status on Demand ---------- */
  async function checkPaymentStatus(orderTrackingId, orderMeta, isManual = false) {
    const feedbackEl = document.getElementById('twc-status-feedback');
    if (feedbackEl && isManual) feedbackEl.textContent = 'Checking PesaPal status...';

    try {
      const res = await fetch(`/api/status?orderTrackingId=${encodeURIComponent(orderTrackingId)}`);
      const data = await res.json();

      if (data.status === 'COMPLETED') {
        stopPolling();
        playSuccessChime();

        // 1. Determine Tier ID (general, executive, or corporate)
        const rawTier = (orderMeta.tierCode || orderMeta.tierName || '').toLowerCase();
        let tierId = 'executive';
        if (rawTier.includes('gen') || rawTier.includes('2,500') || rawTier.includes('2500')) tierId = 'general';
        else if (rawTier.includes('corp') || rawTier.includes('block') || rawTier.includes('20,000') || rawTier.includes('20000')) tierId = 'corporate';

        const tier = window.QAG_TICKETS ? window.QAG_TICKETS.getTier(tierId) : { id: tierId, seats: tierId === 'corporate' ? 10 : 1 };
        const txRef = orderMeta.orderRef || data.confirmationCode || orderTrackingId || (window.QAG_TICKETS ? window.QAG_TICKETS.makeTransactionId() : 'SFC' + Date.now());
        const ticketId = window.QAG_TICKETS ? window.QAG_TICKETS.makeTicketId(tier.id, txRef) : `TWC-${tier.id.toUpperCase()}-${txRef}`;

        // 2. Mint & Persist Ticket Object
        const ticket = {
          id: ticketId,
          tier: tier.id,
          name: (orderMeta.delegateName || '').trim().toUpperCase(),
          email: (orderMeta.email || '').trim(),
          phone: (orderMeta.phone || '').trim(),
          organization: (orderMeta.organization || '').trim().toUpperCase(),
          amount: Number(orderMeta.tierPrice) || tier.price || 7500,
          seats: tier.seats || (tierId === 'corporate' ? 10 : 1),
          transactionId: txRef,
          issuedAt: new Date().toISOString(),
          scans: []
        };

        if (window.QAG_TICKETS) {
          window.QAG_TICKETS.saveTicket(ticket);
        }

        // 3. Update Success State Header Details
        const el = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };
        el('twc-success-ref', txRef);
        el('twc-success-amount', `KSH ${ticket.amount.toLocaleString()}`);

        // 4. Render the Full-Fidelity Visual Ticket Card
        const previewSlot = document.getElementById('twc-modal-ticket-preview');
        const verifyUrl = `${window.location.origin}/verify/${encodeURIComponent(ticket.id)}`;

        if (previewSlot && window.QAG_TICKETS) {
          window.QAG_TICKETS.renderTicketCardHTML(ticket, verifyUrl).then((cardHtml) => {
            previewSlot.innerHTML = cardHtml;
            // Render the scannable QR codes after HTML is in the DOM
            setTimeout(() => {
              window.QAG_TICKETS.renderQRsInContainer(previewSlot, verifyUrl);
            }, 50);
          });
        }

        // 5. Connect Action Buttons
        const openPageBtn = document.getElementById('twc-open-ticket-page-btn');
        if (openPageBtn) openPageBtn.href = `/ticket/${encodeURIComponent(ticket.id)}`;

        const testQrBtn = document.getElementById('twc-test-qr-btn');
        if (testQrBtn) testQrBtn.href = `/verify/${encodeURIComponent(ticket.id)}`;

        const downloadBtn = document.getElementById('twc-download-ticket-btn');
        if (downloadBtn) {
          downloadBtn.onclick = () => {
            generateLuxuryPDFTicket({
              ...orderMeta,
              ticketId: ticket.id,
              confirmationCode: txRef,
              seats: ticket.seats
            });
          };
        }

        showStep(stepSuccess);
        return true;

      } else if (data.status === 'FAILED') {
        stopPolling();
        showStep(stepFailed);
        return false;
      } else {
        if (feedbackEl) {
          feedbackEl.textContent = isManual ? 'Payment pending in M-Pesa. Complete PIN on phone.' : 'Awaiting M-Pesa PIN confirmation...';
        }
        return false;
      }
    } catch (err) {
      if (feedbackEl) feedbackEl.textContent = 'Connection check... will retry.';
      return false;
    }
  }

  // Hook manual verification button
  const manualCheckBtn = document.getElementById('twc-check-status-btn');
  if (manualCheckBtn) {
    manualCheckBtn.addEventListener('click', () => {
      if (currentOrderTrackingId && currentOrderData) {
        checkPaymentStatus(currentOrderTrackingId, currentOrderData, true);
      }
    });
  }

  /* ---------- Poll payment status every 3 seconds for up to 5 min ---------- */
  function startStatusPolling(orderTrackingId, orderMeta) {
    const POLL_INTERVAL_MS = 3000;
    const MAX_POLL_DURATION_MS = 5 * 60 * 1000;
    const startTime = Date.now();

    const countdownEl = document.getElementById('twc-poll-countdown');

    countdownInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, MAX_POLL_DURATION_MS - elapsed);
      const mins = Math.floor(remaining / 60000);
      const secs = Math.floor((remaining % 60000) / 1000);
      if (countdownEl) countdownEl.textContent = `${mins}:${String(secs).padStart(2, '0')}`;
    }, 1000);

    pollInterval = setInterval(async () => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= MAX_POLL_DURATION_MS) {
        stopPolling();
        showStep(stepFailed);
        return;
      }
      await checkPaymentStatus(orderTrackingId, orderMeta, false);
    }, POLL_INTERVAL_MS);
  }
}

/* ==========================================================================
   LUXURY CLIENT-SIDE PDF TICKET GENERATOR (jsPDF + QRCode)
   ========================================================================== */
async function generateLuxuryPDFTicket(order) {
  if (!window.jspdf || !window.jspdf.jsPDF) {
    alert('PDF Generator library loading... Please click download again in 2 seconds.');
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const W = 210; // mm
  const H = 297; // mm

  // Background: Deep Obsidian Navy
  doc.setFillColor(4, 7, 17);
  doc.rect(0, 0, W, H, 'F');

  // Top Gold Accent Bar
  doc.setFillColor(212, 175, 55);
  doc.rect(0, 0, W, 4, 'F');

  // Outer Gold Hairline Borders
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.4);
  doc.rect(10, 8, W - 20, H - 16, 'S');

  doc.setDrawColor(180, 140, 40);
  doc.setLineWidth(0.15);
  doc.rect(12, 10, W - 24, H - 20, 'S');

  // QAG Monogram Emblem
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.8);
  doc.circle(W / 2, 28, 12, 'S');
  doc.setTextColor(212, 175, 55);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('QAG', W / 2, 31.5, { align: 'center' });

  // Sovereign Brand Wordmark
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(212, 175, 55);
  doc.text('QOHEL AFRICA GROUP', W / 2, 48, { align: 'center' });

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('Corporate Systems, Strategic Infrastructure & Enterprise Holdings', W / 2, 53, { align: 'center' });

  // Divider line
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.3);
  doc.line(25, 59, W - 25, 59);

  // Summit Convocation Title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(245, 227, 163);
  doc.text('THE WEALTH CONVERGENCE', W / 2, 68, { align: 'center' });

  doc.setFontSize(10);
  doc.setTextColor(212, 175, 55);
  doc.text('TWC 2026 — OFFICIAL DELEGATE PASS', W / 2, 75, { align: 'center' });

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text('SEPTEMBER 19, 2026  •  NAIROBI, KENYA  •  EAST AFRICA CORPORATE ARENA', W / 2, 81, { align: 'center' });

  doc.line(25, 87, W - 25, 87);

  // Tier Badge Box
  doc.setFillColor(13, 22, 42);
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.6);
  doc.roundedRect(W / 2 - 45, 93, 90, 22, 2, 2, 'FD');

  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(148, 163, 184);
  doc.text('DELEGATE PASS TIER', W / 2, 98, { align: 'center' });

  doc.setFontSize(12);
  doc.setTextColor(212, 175, 55);
  doc.text((order.tierName || 'EXECUTIVE PASS').toUpperCase(), W / 2, 107, { align: 'center' });

  // Delegate Information Container
  const infoY = 122;
  doc.setFillColor(11, 19, 40);
  doc.setDrawColor(30, 45, 74);
  doc.setLineWidth(0.3);
  doc.roundedRect(20, infoY, W - 40, 52, 2, 2, 'FD');

  const lbl = (t, x, y) => {
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(t.toUpperCase(), x, y);
  };
  const val = (t, x, y, isGold = false) => {
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    if (isGold) doc.setTextColor(212, 175, 55);
    else doc.setTextColor(248, 250, 252);
    doc.text(String(t || '—'), x, y);
  };

  // Left Column
  lbl('Delegate Full Name', 28, infoY + 8);
  val(order.delegateName, 28, infoY + 14);

  lbl('Enterprise / Organization', 28, infoY + 24);
  val(order.organization, 28, infoY + 30);

  lbl('M-Pesa / Contact Telephone', 28, infoY + 40);
  val(order.phone, 28, infoY + 46);

  // Vertical Separator
  doc.setDrawColor(30, 45, 74);
  doc.line(W / 2 + 5, infoY + 6, W / 2 + 5, infoY + 46);

  // Right Column
  lbl('Ticket Reference', W / 2 + 12, infoY + 8);
  val(order.orderRef || 'QAG-TWC-PASS', W / 2 + 12, infoY + 14, true);

  lbl('Total Investment Paid', W / 2 + 12, infoY + 24);
  val(`KSH ${Number(order.tierPrice).toLocaleString()}`, W / 2 + 12, infoY + 30, true);

  lbl('Clearance Status', W / 2 + 12, infoY + 40);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 185, 129);
  doc.text(`CONFIRMED (${order.confirmationCode || 'VERIFIED'})`, W / 2 + 12, infoY + 46);

  // QR Code Generation
  const qrContainer = document.createElement('div');
  qrContainer.style.display = 'none';
  document.body.appendChild(qrContainer);

  const targetId = order.ticketId || order.orderRef || 'TWC-VIP';
  const qrText = `${window.location.origin}/verify/${encodeURIComponent(targetId)}`;
  new QRCode(qrContainer, {
    text: qrText,
    width: 128,
    height: 128,
    colorDark: "#040711",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });

  setTimeout(() => {
    try {
      const qrImg = qrContainer.querySelector('img') || qrContainer.querySelector('canvas');
      const qrDataUrl = qrImg.src || qrImg.toDataURL('image/png');

      const qrSize = 40; // mm
      const qrX = W / 2 - qrSize / 2;
      const qrY = 182;

      // QR Code Container Frame
      doc.setFillColor(11, 19, 40);
      doc.setDrawColor(212, 175, 55);
      doc.setLineWidth(0.4);
      doc.roundedRect(qrX - 4, qrY - 4, qrSize + 8, qrSize + 8, 2, 2, 'FD');

      doc.addImage(qrDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);

      doc.setFontSize(6.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(148, 163, 184);
      doc.text('CRYPTOGRAPHIC GATE ENTRY VERIFICATION', W / 2, qrY + qrSize + 8, { align: 'center' });

      // Summit Logistics Details Grid
      const logY = 245;
      doc.setDrawColor(30, 45, 74);
      doc.line(25, logY - 4, W - 25, logY - 4);

      const items = [
        ['CONVOCATION DATE', 'Sept 19, 2026 • 09:00 EAT'],
        ['LOCATION', 'Nairobi, Kenya'],
        ['SOVEREIGN PARENT', 'Qohel Africa Group'],
        ['INTAKE INQUIRIES', 'legacylensnetwork@gmail.com']
      ];

      const colWidth = (W - 40) / 4;
      items.forEach(([h, t], i) => {
        const x = 20 + i * colWidth + colWidth / 2;
        doc.setFontSize(6);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 116, 139);
        doc.text(h, x, logY, { align: 'center' });

        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(203, 213, 225);
        doc.text(t, x, logY + 5, { align: 'center' });
      });

      // Bottom Gold Bar
      doc.setFillColor(212, 175, 55);
      doc.rect(0, H - 4, W, 4, 'F');

      // Footer Legal Notice
      doc.setFontSize(5.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text(
        'This pass is strictly non-transferable and requires valid photo identification matching the registered delegate legal name. Issued under sovereign charter of Qohel Africa Group Holdings.',
        W / 2, H - 10, { align: 'center' }
      );

      // Save PDF
      const slug = (order.delegateName || 'Delegate').replace(/[^a-zA-Z0-9]/g, '-');
      doc.save(`TWC2026-${slug}-${order.tierCode || 'PASS'}.pdf`);

    } catch (pdfErr) {
      console.error('PDF error:', pdfErr);
      alert('Could not render PDF. Please try again.');
    } finally {
      document.body.removeChild(qrContainer);
    }
  }, 300);
}

/* ==========================================================================
   10. MOBILE DOCK SCROLLSPY & ACTIVE HIGHLIGHT
   ========================================================================== */
function initMobileDockScrollspy() {
  const dockLinks = document.querySelectorAll('.mobile-bottom-dock a[href^="#"]');
  if (dockLinks.length === 0) return;

  const sections = [];
  dockLinks.forEach(link => {
    const id = link.getAttribute('href').substring(1);
    const target = document.getElementById(id);
    if (target) sections.push({ link, target });
  });

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 200;
    sections.forEach(({ link, target }) => {
      const top = target.offsetTop;
      const height = target.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        dockLinks.forEach(l => l.classList.remove('text-gold', 'active'));
        link.classList.add('text-gold', 'active');
      }
    });
  }, { passive: true });
}

/* ==========================================================================
   11. METHODOLOGY DIAMOND NEXUS MATRIX INTERACTION
   ========================================================================== */
function initMethodologyMatrix() {
  const tiles = document.querySelectorAll('.diamond-tile');
  const cards = document.querySelectorAll('.methodology-card');
  if (tiles.length === 0 || cards.length === 0) return;

  function setActivePhase(phase) {
    tiles.forEach(t => t.classList.toggle('active', t.getAttribute('data-phase') === phase));
    cards.forEach(c => c.classList.toggle('active', c.getAttribute('data-phase') === phase));
  }

  function clearActivePhase() {
    tiles.forEach(t => t.classList.remove('active'));
    cards.forEach(c => c.classList.remove('active'));
  }

  tiles.forEach(tile => {
    tile.addEventListener('mouseenter', () => {
      const phase = tile.getAttribute('data-phase');
      setActivePhase(phase);
      playTone(523.25, 0.05, 'triangle');
    });
    tile.addEventListener('mouseleave', clearActivePhase);
    tile.addEventListener('click', () => {
      const phase = tile.getAttribute('data-phase');
      setActivePhase(phase);
      playTone(659.25, 0.08, 'sine');
    });
  });

  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      const phase = card.getAttribute('data-phase');
      setActivePhase(phase);
      playTone(523.25, 0.05, 'triangle');
    });
    card.addEventListener('mouseleave', clearActivePhase);
    card.addEventListener('click', () => {
      const phase = card.getAttribute('data-phase');
      setActivePhase(phase);
      playTone(659.25, 0.08, 'sine');
    });
  });
}


