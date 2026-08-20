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
  initTicketVerificationSystem();
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
  vca: {
    title: "Visual Conversion Architecture (VCA-2026-A)",
    code: "MASTER ASSET ID // CLIENT ID: LLN001 // PROJECT ID: VCA-2026-A",
    classification: "SOVEREIGN COMMERCIAL DIRECTIVE",
    body: `
      <h4>Mandate Overview</h4>
      <p>Visual Conversion Architecture executed for a premium fine-dining bistro & luxury hospitality venue in Nairobi. Reengineered flat lifestyle aesthetics into behavioral short-form video geometry, resulting in traceable digital-to-commercial foot traffic and optimized table reservation velocity.</p>
      
      <h4>Performance Telemetry</h4>
      <ul class="space-y-2 my-3 font-mono text-xs">
        <li class="flex justify-between border-b border-white/10 pb-1"><span>Total Organic Reach:</span> <strong class="text-gold">132,478 Verified Impressions</strong></li>
        <li class="flex justify-between border-b border-white/10 pb-1"><span>Bio-Link Direct Conversion:</span> <strong class="text-gold">89.4% Attribution</strong></li>
        <li class="flex justify-between border-b border-white/10 pb-1"><span>Paid Media Allocation:</span> <strong class="text-gold">KSh 0.00 (Zero Ad Spend)</strong></li>
        <li class="flex justify-between pb-1"><span>Commercial Yield:</span> <strong class="text-gold">+340% Table Reservations</strong></li>
      </ul>
      <p class="text-xs text-slate-400">Archived under Qohel Africa Group Fiduciary Media Standards.</p>
    `
  },
  lhe: {
    title: "Luxury Hospitality Ecosystem (LHE-2026-B)",
    code: "MASTER ASSET ID // CLIENT ID: LLN002 // PROJECT ID: LHE-2026-B",
    classification: "ENTERPRISE ASSET BLUEPRINT",
    body: `
      <h4>Execution Summary</h4>
      <p>Multi-tier visual status engineering deployed for high-end boutique hospitality chain. Integrated cinematic storytelling with closed-loop customer capture pipelines, driving direct corporate bookings and executive retreat buyouts.</p>
      
      <h4>Core Strategic Pillars</h4>
      <ul class="space-y-2 my-3 font-mono text-xs">
        <li class="flex justify-between border-b border-white/10 pb-1"><span>Brand Prestige Lift:</span> <strong class="text-gold">Category Dominance</strong></li>
        <li class="flex justify-between border-b border-white/10 pb-1"><span>Direct Executive Retainers:</span> <strong class="text-gold">7 Enterprise Clients</strong></li>
        <li class="flex justify-between pb-1"><span>System Protocol:</span> <strong class="text-gold">Sovereign Asset Protection</strong></li>
      </ul>
    `
  },
  fiduciary: {
    title: "Sovereign Fiduciary Charter & Compliance",
    code: "QAG-GOV // FIDUCIARY-2026-Z",
    classification: "INSTITUTIONAL CHARTER",
    body: `
      <h4>Fiduciary Standard</h4>
      <p>Qohel Africa Group operates as a sovereign holding network strictly enforcing closed-loop capital protection, operational compliance, and non-dilutive economic leverage across all subsidiary divisions and incubators.</p>
      <p class="my-2">Enterprise Standard: <em>Metrics track numbers; we track revenue. Legacy is built through execution.</em></p>
    `
  }
};

function initGovernanceVault() {
  const modal = document.getElementById('vault-modal');
  const closeBtn = document.getElementById('close-vault-modal');
  const triggers = document.querySelectorAll('.trigger-vault-doc');

  if (!modal) return;

  function openVault(docKey) {
    const doc = VAULT_DOCS[docKey] || VAULT_DOCS.vca;
    document.getElementById('vault-doc-title').innerText = doc.title;
    document.getElementById('vault-doc-code').innerText = doc.code;
    document.getElementById('vault-doc-class').innerText = doc.classification;
    document.getElementById('vault-doc-body').innerHTML = doc.body;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    playTone(600, 0.08, 'sine');
  }

  triggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const docKey = btn.getAttribute('data-doc-key');
      openVault(docKey);
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

        const el = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };
        el('twc-success-name', orderMeta.delegateName);
        el('twc-success-tier', orderMeta.tierName);
        el('twc-success-amount', `KSH ${Number(orderMeta.tierPrice).toLocaleString()}`);
        el('twc-success-ref', orderMeta.orderRef || orderTrackingId);

        // Derive authentic unique ticket ID
        const cleanRef = String(orderMeta.orderRef || orderTrackingId || '0001').replace(/[^a-zA-Z0-9]/g, '');
        const suffix = cleanRef.substring(Math.max(0, cleanRef.length - 4)).toUpperCase() || '001';
        
        let prefix = 'TWC-GEN';
        const tUpper = (orderMeta.tierName || '').toUpperCase();
        if (tUpper.includes('VIP') || tUpper.includes('EXECUTIVE')) {
          prefix = 'TWC-VIP';
        } else if (tUpper.includes('CORPORATE') || tUpper.includes('BLOCK') || tUpper.includes('INSTITUTIONAL')) {
          prefix = 'TWC-BLOCK';
        } else if (tUpper.includes('PROGRAM') || tUpper.includes('COURSE') || tUpper.includes('CLASS')) {
          prefix = 'TWC-PROG';
        }
        const ticketId = `#${prefix}-${suffix}`;

        const fullOrder = {
          ...orderMeta,
          ticketId,
          confirmationCode: data.confirmationCode || 'CONFIRMED'
        };

        // Render live authentic ticket to screen
        renderAuthenticLiveTicket(fullOrder);

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

  // Hook instant pass clearance button (for testing & instant generation)
  const simulateSuccessBtn = document.getElementById('twc-simulate-success-btn');
  if (simulateSuccessBtn) {
    simulateSuccessBtn.addEventListener('click', () => {
      stopPolling();
      playSuccessChime();

      const orderMeta = currentOrderData || {
        delegateName: document.getElementById('twc-name')?.value || 'Faith Wanjiku',
        organization: document.getElementById('twc-org')?.value || 'Qohel Enterprise Group',
        email: document.getElementById('twc-email')?.value || 'delegate@qohelafrica.com',
        phone: document.getElementById('twc-phone')?.value || '0700000000',
        tierName: currentTierName,
        tierPrice: currentTierPrice.replace(/[^0-9]/g, '') || '7500',
        tierCode: currentTierCode,
        orderRef: 'QAG-SIM-' + Math.floor(100000 + Math.random() * 900000)
      };

      const cleanRef = String(orderMeta.orderRef || '0001').replace(/[^a-zA-Z0-9]/g, '');
      const suffix = cleanRef.substring(Math.max(0, cleanRef.length - 4)).toUpperCase() || '001';
      
      let prefix = 'TWC-GEN';
      const tUpper = (orderMeta.tierName || '').toUpperCase();
      if (tUpper.includes('VIP') || tUpper.includes('EXECUTIVE')) {
        prefix = 'TWC-VIP';
      } else if (tUpper.includes('CORPORATE') || tUpper.includes('BLOCK') || tUpper.includes('INSTITUTIONAL')) {
        prefix = 'TWC-BLOCK';
      } else if (tUpper.includes('PROGRAM') || tUpper.includes('COURSE') || tUpper.includes('CLASS')) {
        prefix = 'TWC-PROG';
      }
      const ticketId = `#${prefix}-${suffix}`;

      const fullOrder = {
        ...orderMeta,
        ticketId,
        confirmationCode: 'TEST-CONFIRMED'
      };

      const el = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };
      el('twc-success-name', orderMeta.delegateName);
      el('twc-success-tier', orderMeta.tierName);
      el('twc-success-amount', `KSH ${Number(orderMeta.tierPrice).toLocaleString()}`);
      el('twc-success-ref', fullOrder.orderRef);

      renderAuthenticLiveTicket(fullOrder);
      showStep(stepSuccess);
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
   AUTHENTIC LIVE TICKET GENERATION ENGINE (Images 1, 2 & 3 Matching)
   ========================================================================== */
let activeTicketOrder = null;

function renderAuthenticLiveTicket(order) {
  activeTicketOrder = order;
  const mount = document.getElementById('twc-live-ticket-mount');
  if (!mount) return;

  // Build live scannable verification URL (encodes up to 10 max scans)
  const baseUrl = window.location.origin + window.location.pathname;
  const verifyUrl = `${baseUrl}?verify_ticket=1&id=${encodeURIComponent(order.ticketId)}&name=${encodeURIComponent(order.delegateName)}&org=${encodeURIComponent(order.organization)}&tier=${encodeURIComponent(order.tierName)}&ref=${encodeURIComponent(order.orderRef || order.orderTrackingId || 'QAG')}&max=10`;

  // Generate QR Code data URL using offscreen helper
  const qrTemp = document.createElement('div');
  qrTemp.style.display = 'none';
  document.body.appendChild(qrTemp);

  new QRCode(qrTemp, {
    text: verifyUrl,
    width: 256,
    height: 256,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });

  setTimeout(() => {
    let qrDataUrl = '';
    const qrImg = qrTemp.querySelector('img') || qrTemp.querySelector('canvas');
    if (qrImg) {
      qrDataUrl = qrImg.src || qrImg.toDataURL('image/png');
    }
    document.body.removeChild(qrTemp);

    const tierUpper = (order.tierName || '').toUpperCase();
    let ticketHTML = '';

    // ------------------------------------------------------------------------
    // THEME 1: INSTITUTIONAL GROUP ALLOCATION PASS (Image 1: Teal Cyber Grid)
    // ------------------------------------------------------------------------
    if (tierUpper.includes('CORPORATE') || tierUpper.includes('BLOCK') || tierUpper.includes('INSTITUTIONAL')) {
      ticketHTML = `
        <div id="live-ticket-node" class="twc-ticket-card ticket-theme-corporate">
          <!-- Zone 1: The Flank -->
          <div class="ticket-flank">
            <div class="flex flex-col items-center">
              <svg class="w-7 h-7 text-white mb-2" viewBox="0 0 48 48" fill="none" stroke="currentColor">
                <circle cx="24" cy="24" r="20" stroke-width="2"/>
                <path d="M16 24C16 19.5817 19.5817 16 24 16C28.4183 16 32 19.5817 32 24C32 28.4183 28.4183 32 24 32" stroke-width="2"/>
              </svg>
              <span class="font-serif font-bold text-[10px] text-white tracking-widest block leading-tight">QOHEL AFRICA<br>GROUP</span>
            </div>
            <div class="flank-rotated-text">
              CONVENED BY QOHEL AFRICA GROUP
            </div>
            <div class="text-[8px] font-mono text-slate-400 tracking-wider">
              SOVEREIGN ENTERPRISE NETWORK
            </div>
          </div>

          <!-- Zone 2: The Core Body -->
          <div class="ticket-core">
            <div class="flex items-center justify-center gap-2 mb-1">
              <!-- Interconnected Arrows Emblem -->
              <svg class="w-10 h-10 text-slate-200" viewBox="0 0 64 64" fill="currentColor">
                <path d="M22 14 L34 26 L28 26 L28 36 L38 36 L38 30 L50 42 L38 54 L38 48 L20 48 L20 26 L14 26 Z" opacity="0.95"/>
                <path d="M42 50 L30 38 L36 38 L36 28 L26 28 L26 34 L14 22 L26 10 L26 16 L44 16 L44 38 L50 38 Z" opacity="0.75"/>
              </svg>
            </div>
            
            <h2 class="font-serif text-2xl sm:text-3xl font-extrabold text-white tracking-wider mb-0.5">
              THE WEALTH CONVERGENCE
            </h2>
            <p class="font-mono text-[11px] text-slate-300 tracking-widest uppercase mb-3">
              REDESIGNING ECONOMIC ARCHITECTURE
            </p>
            
            <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded bg-black/60 border border-white/20 text-xs text-white font-medium mb-3">
              <span>🏛️</span>
              <span class="tracking-wider uppercase font-semibold">INSTITUTIONAL GROUP ALLOCATION PASS</span>
            </div>

            <div class="text-xs font-mono text-slate-300 space-y-1 mb-3">
              <p class="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">SUMMIT COORDINATES</p>
              <p class="text-white font-bold text-sm tracking-wide">DATE: MARCH 24 - 26, 2026</p>
              <p class="text-slate-200">VENUE: NAIROBI, KENYA</p>
            </div>

            <div class="w-full py-1.5 bg-black/80 rounded border-t border-b border-cyan-500/30 text-[10px] font-mono text-cyan-300 tracking-widest font-bold uppercase">
              ■ VALID FOR UP TO 10 SCANS AT VENUE ENTRY ■
            </div>
          </div>

          <!-- Zone 3: Dynamic Box -->
          <div class="ticket-dynamic-box">
            <div class="ticket-qr-frame">
              <img src="${qrDataUrl}" alt="Scannable QR Pass">
            </div>

            <div class="text-left font-mono text-[11px] space-y-1.5 text-cyan-300 pt-3">
              <div>
                <span class="text-slate-400 block text-[9px]">SPONSOR:</span>
                <strong class="text-white block truncate uppercase">${order.organization || order.delegateName}</strong>
              </div>
              <div>
                <span class="text-slate-400 block text-[9px]">SEATS:</span>
                <strong class="text-cyan-300 block">10 ALLOCATED</strong>
              </div>
              <div>
                <span class="text-slate-400 block text-[9px]">CLASS:</span>
                <strong class="text-white block">COHORT PASS</strong>
              </div>
              <div>
                <span class="text-slate-400 block text-[9px]">ID:</span>
                <strong class="text-gold block font-bold">${order.ticketId}</strong>
              </div>
            </div>

            <p class="text-[8px] font-mono text-slate-400 text-center uppercase tracking-wider pt-2 border-t border-white/10">
              NON-TRANSFERABLE OUTSIDE THE NOMINATED INSTITUTION
            </p>
          </div>
        </div>
      `;

    // ------------------------------------------------------------------------
    // THEME 2: GENERAL ADMISSION DELEGATE PASS (Image 2: Silver Metallic)
    // ------------------------------------------------------------------------
    } else if (tierUpper.includes('DELEGATE') || tierUpper.includes('GENERAL')) {
      ticketHTML = `
        <div id="live-ticket-node" class="twc-ticket-card ticket-theme-delegate">
          <!-- Zone 1: The Flank -->
          <div class="ticket-flank">
            <div class="flex flex-col items-center">
              <svg class="w-7 h-7 text-white mb-2" viewBox="0 0 48 48" fill="none" stroke="currentColor">
                <circle cx="24" cy="24" r="20" stroke-width="2"/>
                <path d="M16 24C16 19.5817 19.5817 16 24 16C28.4183 16 32 19.5817 32 24C32 28.4183 28.4183 32 24 32" stroke-width="2"/>
              </svg>
              <span class="font-serif font-bold text-[10px] text-white tracking-widest block leading-tight">QOHEL AFRICA<br>GROUP</span>
            </div>
            <div class="flank-rotated-text">
              THE WEALTH CONVERGENCE
            </div>
            <div class="text-[8px] font-sans text-slate-300 leading-tight">
              SHAPING GLOBAL ECONOMIC ARCHITECTURE THROUGH STRATEGIC PARTNERSHIPS.
            </div>
          </div>

          <!-- Zone 2: The Core Body (Silver Metallic) -->
          <div class="ticket-core">
            <div class="font-serif text-5xl font-black text-slate-800 tracking-tighter opacity-90 drop-shadow mb-0.5">
              TWC
            </div>
            <h2 class="font-serif text-xl sm:text-2xl font-black text-slate-900 tracking-wider mb-0.5">
              THE WEALTH CONVERGENCE
            </h2>
            <p class="font-mono text-[10px] text-slate-700 tracking-widest uppercase mb-2 font-semibold">
              REDESIGNING ECONOMIC ARCHITECTURE.
            </p>

            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-sky-400 to-blue-600 text-white text-[11px] font-bold shadow-lg mb-2">
              <span>🎁</span>
              <span class="tracking-wide uppercase">INCLUDES FREE 30-DAY MINDSET SHIFT EBOOK DOWNLOAD</span>
            </div>

            <div class="text-xs font-mono text-slate-800 space-y-0.5 mb-2">
              <p class="font-black text-sm tracking-wide">DATE: MARCH 24-26, 2026</p>
              <p class="font-bold">VENUE: NAIROBI, KENYA</p>
            </div>

            <div class="w-full py-1.5 bg-black rounded text-[10px] font-mono text-white tracking-widest font-bold uppercase">
              ■ GENERAL ADMISSION DELEGATE ■
            </div>
          </div>

          <!-- Zone 3: Dynamic Box -->
          <div class="ticket-dynamic-box">
            <div class="ticket-qr-frame">
              <img src="${qrDataUrl}" alt="Scannable QR Pass">
            </div>

            <div class="text-left font-mono text-xs space-y-1.5 text-slate-300 pt-3">
              <div>
                <span class="text-slate-400 block text-[9px]">NAME:</span>
                <strong class="text-white block truncate uppercase">${order.delegateName}</strong>
              </div>
              <div>
                <span class="text-slate-400 block text-[9px]">CORP:</span>
                <strong class="text-slate-200 block truncate uppercase">${order.organization || 'SOVEREIGN DELEGATE'}</strong>
              </div>
              <div>
                <span class="text-slate-400 block text-[9px]">CLASS:</span>
                <strong class="text-cyan-400 block uppercase">DELEGATE</strong>
              </div>
              <div>
                <span class="text-slate-400 block text-[9px]">ID:</span>
                <strong class="text-gold block font-bold">${order.ticketId}</strong>
              </div>
            </div>

            <div class="font-serif text-lg font-bold text-gold text-right pt-2 border-t border-white/10">
              KSH 2,500
            </div>
          </div>
        </div>
      `;

    // ------------------------------------------------------------------------
    // THEME 3: VIP EXECUTIVE PASS & PROGRAMS (Image 3: Obsidian Facets & Crimson)
    // ------------------------------------------------------------------------
    } else {
      ticketHTML = `
        <div id="live-ticket-node" class="twc-ticket-card ticket-theme-vip">
          <!-- Zone 1: The Flank (Hologram Strip) -->
          <div class="ticket-flank">
            <div class="hologram-seal">VALID</div>
            <div class="hologram-seal">VALID</div>
            <div class="hologram-seal">VALID</div>
            <div class="hologram-seal">VALID</div>
            <div class="hologram-seal">VALID</div>
          </div>

          <!-- Zone 2: The Core Body (Obsidian Facets & Crimson VIP Ribbon) -->
          <div class="ticket-core">
            <div class="flex items-center justify-center gap-2 mb-1">
              <svg class="w-8 h-8 text-gold" viewBox="0 0 48 48" fill="none" stroke="currentColor">
                <circle cx="24" cy="24" r="20" stroke-width="2"/>
                <path d="M24 8v32M8 24h32M14 14l20 20M34 14L14 34" stroke-width="1.5"/>
              </svg>
              <span class="font-serif font-bold text-xs text-gold tracking-widest">THE WEALTH CONVERGENCE</span>
            </div>

            <h2 class="font-serif text-xl sm:text-2xl font-bold text-white tracking-wide leading-snug mb-1">
              THE WEALTH CONVERGENCE:<br><span class="text-gold-light">REDESIGNING ECONOMIC ARCHITECTURE</span>
            </h2>

            <div class="vip-crimson-banner my-2">
              ★ ${order.tierName.toUpperCase()} ★ ${order.tierPrice ? `KSH ${Number(order.tierPrice).toLocaleString()}` : ''}
            </div>

            <div class="text-xs font-mono text-slate-200 space-y-0.5 mb-2">
              <p class="font-bold text-sm text-white">DATE: MARCH 24-26, 2026</p>
              <p class="text-gold-light">VENUE: NAIROBI, KENYA</p>
            </div>

            <div class="text-[9px] font-mono text-slate-400 tracking-wider">
              CONVENED BY <strong class="text-white">QOHEL AFRICA GROUP</strong>
            </div>
          </div>

          <!-- Zone 3: Dynamic Box -->
          <div class="ticket-dynamic-box">
            <div class="ticket-qr-frame">
              <img src="${qrDataUrl}" alt="Scannable QR Pass">
            </div>

            <div class="text-left font-mono text-xs space-y-1.5 text-slate-300 pt-3">
              <div>
                <span class="text-slate-400 block text-[9px]">ATTENDEE:</span>
                <strong class="text-white block truncate uppercase">${order.delegateName}</strong>
              </div>
              <div>
                <span class="text-slate-400 block text-[9px]">AFFILIATION:</span>
                <strong class="text-slate-200 block truncate uppercase">${order.organization || 'SOVEREIGN LEADER'}</strong>
              </div>
              <div>
                <span class="text-slate-400 block text-[9px]">ACCESS LEVEL:</span>
                <strong class="text-gold block uppercase">VIP EXECUTIVE CLEARANCE</strong>
              </div>
              <div>
                <span class="text-slate-400 block text-[9px]">AUTHENTICATED ID:</span>
                <strong class="text-gold-light block font-bold">${order.ticketId}</strong>
              </div>
            </div>

            <p class="text-[8px] font-mono text-slate-400 text-center uppercase tracking-wider pt-2 border-t border-white/10">
              INCLUDES PRIVATE BOARDROOM &amp; EXECUTIVE NETWORKING
            </p>
          </div>
        </div>
      `;
    }

    mount.innerHTML = ticketHTML;

    // Attach Download handlers
    const pdfBtn = document.getElementById('twc-download-ticket-btn');
    if (pdfBtn) {
      pdfBtn.onclick = () => generateLuxuryPDFTicket(order);
    }

    const pngBtn = document.getElementById('twc-download-png-btn');
    if (pngBtn) {
      pngBtn.onclick = () => downloadTicketPNG(order);
    }

    const verifyBtn = document.getElementById('twc-verify-link-btn');
    if (verifyBtn) {
      verifyBtn.onclick = () => {
        openTicketVerificationModal({
          id: order.ticketId,
          name: order.delegateName,
          org: order.organization,
          tier: order.tierName,
          ref: order.orderRef || order.orderTrackingId || 'QAG',
          maxScans: 10
        });
      };
    }

  }, 200);
}

/* --------------------------------------------------------------------------
   DOWNLOAD HIGH-RES PNG TICKET (html2canvas)
   -------------------------------------------------------------------------- */
async function downloadTicketPNG(order) {
  const ticketNode = document.getElementById('live-ticket-node');
  if (!ticketNode || !window.html2canvas) {
    alert('Rendering engine initializing... please click in 2 seconds.');
    return;
  }

  try {
    const canvas = await html2canvas(ticketNode, {
      scale: 3,
      useCORS: true,
      backgroundColor: null,
      logging: false
    });

    const link = document.createElement('a');
    const slug = (order.delegateName || 'Attendee').replace(/[^a-zA-Z0-9]/g, '-');
    link.download = `TWC2026-TICKET-${slug}-${order.ticketId || 'PASS'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    playSuccessChime();
  } catch (err) {
    console.error('PNG Render error:', err);
    alert('Could not download image. Please use the PDF button.');
  }
}

/* ==========================================================================
   OFFICIAL TICKET SECURITY VALIDATION SYSTEM & SCAN TRACKER (MAX 10 SCANS)
   ========================================================================== */
function initTicketVerificationSystem() {
  const modal = document.getElementById('ticket-verify-modal');
  const closeBtn = document.getElementById('close-ticket-verify-modal');
  const closeBtn2 = document.getElementById('close-ticket-verify-btn');

  const closeModal = () => {
    if (modal) modal.classList.remove('active');
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (closeBtn2) closeBtn2.addEventListener('click', closeModal);
  if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  // Check URL parameters for live QR scan validation
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('verify_ticket') && urlParams.get('verify_ticket') === '1') {
    const ticketData = {
      id: urlParams.get('id') || '#TWC-PASS-0001',
      name: urlParams.get('name') || 'Registered Attendee',
      org: urlParams.get('org') || 'Sovereign Institution',
      tier: urlParams.get('tier') || 'TWC Summit Pass',
      ref: urlParams.get('ref') || 'QAG-VERIFIED',
      maxScans: parseInt(urlParams.get('max'), 10) || 10
    };
    setTimeout(() => {
      openTicketVerificationModal(ticketData);
    }, 600);
  }
}

function openTicketVerificationModal(ticketData) {
  const modal = document.getElementById('ticket-verify-modal');
  if (!modal) return;

  const storageKey = `twc_ticket_scans_${ticketData.id.replace(/[^a-zA-Z0-9]/g, '_')}`;
  let currentScans = parseInt(localStorage.getItem(storageKey), 10) || 0;
  currentScans += 1;
  localStorage.setItem(storageKey, currentScans);

  const maxScans = ticketData.maxScans || 10;
  const isExhausted = currentScans > maxScans;
  const remaining = Math.max(0, maxScans - currentScans);
  const percentage = Math.min(100, Math.round((currentScans / maxScans) * 100));

  // Update Status Header
  const statusContainer = document.getElementById('verify-status-container');
  if (statusContainer) {
    if (isExhausted) {
      statusContainer.innerHTML = `
        <div class="w-16 h-16 rounded-full bg-red-950/80 border-2 border-red-500 text-red-400 mx-auto flex items-center justify-center mb-3 shadow-[0_0_25px_rgba(239,68,68,0.4)]">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        </div>
        <span class="badge-gold text-[9px] mb-1 bg-red-950 text-red-400 border-red-500/40">ADMISSION LIMIT EXHAUSTED</span>
        <h3 class="font-serif text-2xl font-bold text-white">Scan Limit Reached (10/10 Used)</h3>
        <p class="text-xs text-slate-400 max-w-sm mx-auto mt-1">This ticket has exhausted its maximum 10 venue entry scans. Entry clearance is locked.</p>
      `;
    } else {
      statusContainer.innerHTML = `
        <div class="w-16 h-16 rounded-full bg-emerald-950/80 border-2 border-emerald-400 text-emerald-400 mx-auto flex items-center justify-center mb-3 shadow-[0_0_25px_rgba(52,211,153,0.4)]">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
        </div>
        <span class="badge-gold text-[9px] mb-1 bg-emerald-950 text-emerald-400 border-emerald-500/40">CRYPTOGRAPHIC ENTRY APPROVED</span>
        <h3 class="font-serif text-2xl font-bold text-white">Authentic &amp; Valid Ticket</h3>
        <p class="text-xs text-slate-300 max-w-sm mx-auto mt-1">Issued under the Sovereign Governance of Qohel Africa Group Holdings.</p>
      `;
    }
  }

  // Populate Details
  const el = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };
  el('verify-ticket-id', ticketData.id);
  el('verify-attendee-name', ticketData.name);
  el('verify-org-name', ticketData.org || 'Individual Delegate');
  el('verify-pass-class', ticketData.tier);
  el('verify-payment-ref', ticketData.ref);

  // Scan Counter & Meter
  el('verify-scan-counter-text', `Scan ${currentScans} / ${maxScans} Used`);
  el('verify-remaining-scans-text', `${remaining} Admittances Remaining`);

  const progressBar = document.getElementById('verify-scan-progress-bar');
  if (progressBar) {
    progressBar.style.width = `${percentage}%`;
    if (isExhausted) {
      progressBar.className = 'bg-red-500 h-full transition-all duration-500';
    } else {
      progressBar.className = 'bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 h-full transition-all duration-500';
    }
  }

  playSuccessChime();
  modal.classList.add('active');
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
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [210, 100] });

  const W = 210; // mm
  const H = 100; // mm

  // Background: Deep Obsidian
  doc.setFillColor(6, 10, 16);
  doc.rect(0, 0, W, H, 'F');

  // Outer Gold Accent Borders
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.5);
  doc.rect(4, 4, W - 8, H - 8, 'S');

  // Flank Left Bar
  doc.setFillColor(11, 16, 24);
  doc.rect(4, 4, 32, H - 8, 'F');
  doc.setDrawColor(212, 175, 55);
  doc.line(36, 4, 36, H - 4);

  // Flank text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(212, 175, 55);
  doc.text('QOHEL AFRICA', 20, 16, { align: 'center' });
  doc.setFontSize(6.5);
  doc.setTextColor(255, 255, 255);
  doc.text('GROUP', 20, 20, { align: 'center' });

  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('CONVENED BY', 20, 45, { align: 'center' });
  doc.setFontSize(7.5);
  doc.setTextColor(212, 175, 55);
  doc.text('QOHEL AFRICA GROUP', 20, 50, { align: 'center' });

  // Core Center
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('THE WEALTH CONVERGENCE', 105, 18, { align: 'center' });

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(212, 175, 55);
  doc.text('REDESIGNING ECONOMIC ARCHITECTURE', 105, 23, { align: 'center' });

  // Tier Badge Box
  doc.setFillColor(15, 23, 42);
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.3);
  doc.roundedRect(55, 28, 100, 10, 1.5, 1.5, 'FD');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(254, 240, 138);
  doc.text((order.tierName || 'SUMMIT PASS').toUpperCase(), 105, 34.5, { align: 'center' });

  // Attendee Info
  const startX = 46;
  const startY = 48;

  doc.setFontSize(6);
  doc.setTextColor(148, 163, 184);
  doc.text('ATTENDEE / DELEGATE:', startX, startY);
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text(String(order.delegateName || '—').toUpperCase(), startX, startY + 5);

  doc.setFontSize(6);
  doc.setTextColor(148, 163, 184);
  doc.text('ENTERPRISE / AFFILIATION:', startX, startY + 12);
  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225);
  doc.text(String(order.organization || 'Individual Delegate').toUpperCase(), startX, startY + 17);

  doc.setFontSize(6);
  doc.setTextColor(148, 163, 184);
  doc.text('SUMMIT COORDINATES:', startX, startY + 24);
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text('MARCH 24-26, 2026 • NAIROBI, KENYA', startX, startY + 29);

  // Bottom Notice
  doc.setFillColor(4, 7, 12);
  doc.rect(46, 84, 110, 8, 'F');
  doc.setFontSize(6.5);
  doc.setTextColor(14, 165, 233);
  doc.text('■ VALID FOR UP TO 10 SCANS AT VENUE ENTRY ■', 101, 89, { align: 'center' });

  // Right Box: QR Code & ID
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.3);
  doc.line(160, 4, 160, H - 4);

  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(212, 175, 55);
  doc.text(order.ticketId || '#TWC-PASS-0001', 183, 14, { align: 'center' });

  // Generate QR for PDF
  const baseUrl = window.location.origin + window.location.pathname;
  const verifyUrl = `${baseUrl}?verify_ticket=1&id=${encodeURIComponent(order.ticketId || '#TWC-001')}&name=${encodeURIComponent(order.delegateName)}&org=${encodeURIComponent(order.organization)}&tier=${encodeURIComponent(order.tierName)}&ref=${encodeURIComponent(order.orderRef || 'QAG')}&max=10`;

  const qrContainer = document.createElement('div');
  qrContainer.style.display = 'none';
  document.body.appendChild(qrContainer);

  new QRCode(qrContainer, {
    text: verifyUrl,
    width: 200,
    height: 200,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });

  setTimeout(() => {
    try {
      const qrImg = qrContainer.querySelector('img') || qrContainer.querySelector('canvas');
      const qrDataUrl = qrImg.src || qrImg.toDataURL('image/png');

      doc.setFillColor(255, 255, 255);
      doc.roundedRect(165, 20, 36, 36, 1.5, 1.5, 'F');
      doc.addImage(qrDataUrl, 'PNG', 167, 22, 32, 32);

      doc.setFontSize(5.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(148, 163, 184);
      doc.text('SCAN FOR GATE VALIDATION', 183, 62, { align: 'center' });
      doc.text(`INVESTMENT: KSH ${Number(order.tierPrice || 0).toLocaleString()}`, 183, 68, { align: 'center' });
      doc.text(`REF: ${order.orderRef || 'VERIFIED'}`, 183, 74, { align: 'center' });

      doc.setFontSize(5);
      doc.setTextColor(100, 116, 139);
      doc.text('NON-TRANSFERABLE PASS', 183, 89, { align: 'center' });

      const slug = (order.delegateName || 'Delegate').replace(/[^a-zA-Z0-9]/g, '-');
      doc.save(`TWC2026-TICKET-${slug}-${order.ticketId || 'PASS'}.pdf`);
      playSuccessChime();

    } catch (e) {
      console.error('PDF generation error:', e);
      alert('Could not render PDF. Please try again.');
    } finally {
      document.body.removeChild(qrContainer);
    }
  }, 250);
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


