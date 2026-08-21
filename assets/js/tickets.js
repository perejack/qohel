/**
 * QOHEL AFRICA GROUP — TWC 2026 TICKET & VERIFICATION ENGINE
 * Implements the exact tier models, 3-tier luxury visual cards,
 * QR code minting, PesaPal transaction binding, and 10-scan verification limits.
 */

(function (window) {
  'use strict';

  const KEY = 'twc2026.tickets';

  const TIERS = [
    {
      id: 'general',
      index: 1,
      name: 'General Delegate Bundle',
      shortName: 'General Admission Delegate',
      price: 10,
      unit: 'Per Individual Delegate (Test Mode: KSH 10)',
      seats: 1,
      cta: 'Claim General Delegate Pass (KSH 10)',
      classLabel: 'DELEGATE',
      perks: [
        'Full admission to summit mainstage and enterprise exhibition floor',
        'Access to General Keynote & Economic Strategy Panels',
        'Official TWC 2026 Digital Delegate Kit',
        'Includes free 30-day Mindset Shift eBook download',
      ],
    },
    {
      id: 'executive',
      index: 2,
      name: 'Executive Pass (VIP)',
      shortName: 'VIP Executive Pass',
      price: 10,
      unit: 'Per Executive VIP (Test Mode: KSH 10)',
      seats: 1,
      cta: 'Secure Executive VIP Pass (KSH 10)',
      badge: 'Recommended Executive VIP',
      classLabel: 'EXECUTIVE VIP',
      perks: [
        'VIP access to all summit mainstage, closed-door breakouts & masterclasses',
        'Exclusive High-Stature VIP Networking Luncheon & Private Lounge',
        'Direct audience with verified wealth controllers & investors',
        'Priority fast-track registration & Executive Swag Asset Kit',
      ],
    },
    {
      id: 'corporate',
      index: 3,
      name: 'Corporate Block Allocation',
      shortName: 'Institutional Group Allocation Pass',
      price: 10,
      unit: 'Structured Master Pass (10 Delegates - Test Mode: KSH 10)',
      seats: 10,
      cta: 'Claim Corporate Block (10 Passes - KSH 10)',
      classLabel: 'COHORT PASS',
      perks: [
        'Master corporate pass for up to 10 executive delegates (Quantity x 10)',
        'Reserved corporate seating row on main summit auditorium floor',
        'Corporate entity mention in official Summit Dossier index',
        'Valid for up to 10 scans at venue entry',
      ],
    },
  ];

  const SUMMIT = {
    title: 'The Wealth Convergence',
    tagline: 'Redesigning Economic Architecture.',
    date: 'MARCH 24-26, 2026',
    venue: 'NAIROBI, KENYA',
    convener: 'QOHEL AFRICA GROUP',
  };

  const prefix = {
    general: 'GEN',
    executive: 'VIP',
    corporate: 'BLOCK',
  };

  function getTier(id) {
    if (!id) return TIERS[1]; // default executive
    const normalized = id.toLowerCase();
    return TIERS.find((t) => t.id === normalized || t.id === normalized.replace('-tier', '')) ||
      (normalized.includes('gen') ? TIERS[0] : normalized.includes('corp') ? TIERS[2] : TIERS[1]);
  }

  function hash(input) {
    let h = 5381;
    for (let i = 0; i < input.length; i++) {
      h = ((h << 5) + h + input.charCodeAt(i)) >>> 0;
    }
    return h.toString(36).toUpperCase().padStart(6, '0').slice(-6);
  }

  function makeTransactionId(seed) {
    if (seed && typeof seed === 'string' && seed.length >= 6) {
      return seed.toUpperCase();
    }
    const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `SFC${Date.now().toString().slice(-7)}${rand}`;
  }

  function makeTicketId(tierId, transactionId) {
    const tier = getTier(tierId);
    const p = prefix[tier.id] || 'VIP';
    return `TWC-${p}-${hash((transactionId || '') + tier.id)}`;
  }

  function formatKsh(n) {
    return `KSH ${Number(n).toLocaleString('en-KE')}`;
  }

  function loadTickets() {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(window.localStorage.getItem(KEY) || '[]');
    } catch (e) {
      return [];
    }
  }

  function saveTicket(ticket) {
    const all = loadTickets().filter((t) => t.id.toLowerCase() !== ticket.id.toLowerCase());
    all.push(ticket);
    try {
      window.localStorage.setItem(KEY, JSON.stringify(all));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
    // Also save to server if endpoint exists
    try {
      fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticket),
      }).catch(() => {});
    } catch (err) {}
  }

  function findTicket(id) {
    if (!id) return null;
    const cleanId = id.trim().replace(/^#/, '').toLowerCase();
    return loadTickets().find((t) => t.id.toLowerCase() === cleanId) || null;
  }

  async function findTicketAsync(id) {
    const local = findTicket(id);
    if (local) return local;
    try {
      const cleanId = id.trim().replace(/^#/, '');
      const res = await fetch(`/api/tickets/${encodeURIComponent(cleanId)}`);
      if (res.ok) {
        const remote = await res.json();
        if (remote && remote.id) {
          saveTicket(remote);
          return remote;
        }
      }
    } catch (e) {}
    return null;
  }

  function registerScan(id) {
    const ticket = findTicket(id);
    if (!ticket) return { status: 'unknown', ticket: undefined };
    if (!Array.isArray(ticket.scans)) ticket.scans = [];
    if (ticket.scans.length >= (ticket.seats || 1)) {
      return { status: 'exhausted', ticket };
    }
    ticket.scans = [...ticket.scans, new Date().toISOString()];
    saveTicket(ticket);
    return { status: 'valid', ticket };
  }

  async function registerScanAsync(id) {
    let ticket = await findTicketAsync(id);
    if (!ticket) return { status: 'unknown', ticket: undefined };
    if (!Array.isArray(ticket.scans)) ticket.scans = [];
    if (ticket.scans.length >= (ticket.seats || 1)) {
      return { status: 'exhausted', ticket };
    }
    ticket.scans = [...ticket.scans, new Date().toISOString()];
    saveTicket(ticket);
    try {
      await fetch(`/api/verify/${encodeURIComponent(ticket.id)}`, { method: 'POST' });
    } catch (e) {}
    return { status: 'valid', ticket };
  }

  function generateQrDataUrl(text, size = 160) {
    return new Promise((resolve) => {
      const div = document.createElement('div');
      div.style.display = 'none';
      document.body.appendChild(div);
      try {
        if (typeof QRCode !== 'undefined') {
          new QRCode(div, {
            text: text,
            width: size,
            height: size,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.M,
          });
          setTimeout(() => {
            const canvas = div.querySelector('canvas');
            const img = div.querySelector('img');
            let dataUrl = '';
            if (canvas) dataUrl = canvas.toDataURL('image/png');
            else if (img && img.src) dataUrl = img.src;
            div.remove();
            resolve(dataUrl);
          }, 50);
        } else {
          div.remove();
          // Fallback to QR API
          resolve(`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`);
        }
      } catch (e) {
        div.remove();
        resolve(`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`);
      }
    });
  }

  /* --------------------------------------------------------------------------
     RENDER HTML TICKET CARD (Matching reference 1-to-1)
     -------------------------------------------------------------------------- */
  async function renderTicketCardHTML(ticket, verifyUrl) {
    const tier = getTier(ticket.tier);
    const qrUrl = await generateQrDataUrl(verifyUrl, 160);

    const convenerMark = (tone = 'light') => `
      <div class="flex items-center gap-2">
        <div class="flex size-8 items-center justify-center rounded-full border-2 ${
          tone === 'gold' ? 'border-[#d4af37] text-[#d4af37]' : 'border-white/80 text-white/90'
        }">
          <span class="text-[9px] font-bold tracking-tight">QAG</span>
        </div>
        <div class="text-[10px] leading-tight font-semibold tracking-[0.14em] uppercase ${
          tone === 'gold' ? 'text-[#d4af37]' : 'text-white'
        }">
          Qohel Africa<br />Group
        </div>
      </div>
    `;

    // 1. GENERAL DELEGATE BUNDLE
    if (tier.id === 'general') {
      return `
        <div class="ticket-card shadow-lux flex w-full overflow-hidden rounded-lg bg-black border border-white/20 select-none text-left">
          <!-- Zone 1 — flank -->
          <div class="bg-gradient-ink flex w-[26%] flex-col justify-between p-4 sm:p-6 border-r border-white/10">
            ${convenerMark('light')}
            <div class="flex items-end gap-2 pb-1">
              <h3 class="vertical-rl text-gradient-silver text-xl leading-none font-extrabold tracking-tight uppercase sm:text-3xl">
                The Wealth<br />Convergence
              </h3>
              <p class="vertical-rl text-[7px] leading-tight tracking-[0.18em] text-white/50 uppercase sm:text-[10px]">
                Shaping global economic architecture through strategic partnerships.
              </p>
            </div>
          </div>

          <!-- Zone 2 — core -->
          <div class="bg-gradient-silver text-slate-900 flex flex-1 flex-col items-center justify-center gap-3 px-4 py-6 text-center sm:py-8">
            <div class="flex items-center gap-2">
              <div class="w-12 h-12 rounded-full border-2 border-slate-900 flex items-center justify-center font-serif font-black text-lg text-slate-900">
                QAG
              </div>
            </div>
            <h2 class="text-base font-extrabold tracking-tight uppercase sm:text-2xl text-slate-950 font-serif">
              ${SUMMIT.title}
            </h2>
            <p class="text-[9px] tracking-[0.1em] uppercase sm:text-sm font-semibold text-slate-700">
              ${SUMMIT.tagline}
            </p>
            <div class="flex w-full items-center justify-center gap-2 rounded-lg bg-[#3b82f6]/20 px-3 py-2 text-[9px] leading-tight font-bold uppercase text-blue-950 sm:text-xs">
              <svg class="size-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V4a2 2 0 10-2 2h2zm-7 4h14M5 12a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H7a2 2 0 01-2-2v-8z"/></svg>
              Includes free 30-day mindset shift ebook download
            </div>
            <div class="text-[10px] leading-relaxed sm:text-sm text-slate-800 font-medium">
              <p><span class="font-bold">DATE:</span> ${SUMMIT.date}</p>
              <p><span class="font-bold">VENUE:</span> ${SUMMIT.venue}</p>
            </div>
            <div class="w-full bg-black px-4 py-2 text-[9px] font-bold tracking-[0.08em] text-white uppercase sm:text-xs rounded">
              ▪ ${tier.shortName} ▪
            </div>
          </div>

          <!-- Zone 3 — dynamic -->
          <div class="flex w-[28%] flex-col justify-between gap-3 bg-black p-4 sm:p-5 border-l border-white/10">
            <div class="bg-white p-2 rounded flex justify-center">
              <img src="${qrUrl}" alt="QR verification" class="size-24 sm:size-32 object-contain" />
            </div>
            <div class="space-y-1 text-[8px] tracking-wide uppercase sm:text-xs text-left">
              <p class="text-white/60">NAME: <span class="font-semibold text-white block sm:inline">${ticket.name}</span></p>
              <p class="text-white/60">CORP: <span class="font-semibold text-white block sm:inline">${ticket.organization}</span></p>
              <p class="text-white/60">CLASS: <span class="font-semibold text-white">${tier.classLabel}</span></p>
              <p class="text-white/60">ID: <span class="font-semibold text-gold">#${ticket.id}</span></p>
            </div>
            <p class="text-base font-bold text-gold sm:text-xl text-left">${formatKsh(ticket.amount)}</p>
          </div>
        </div>
      `;
    }

    // 2. VIP EXECUTIVE PASS
    if (tier.id === 'executive') {
      return `
        <div class="ticket-card shadow-lux bg-gradient-ink relative flex w-full overflow-hidden rounded-lg border border-[#d4af37]/40 select-none text-left">
          <div class="bg-gradient-gold absolute inset-x-0 top-0 h-1.5 z-10"></div>
          
          <!-- stub -->
          <div class="bg-gradient-silver flex w-[10%] flex-col items-center justify-around py-5 text-neutral-800">
            <span class="vertical-rl text-[8px] font-bold tracking-[0.2em] uppercase sm:text-[10px]">Valid</span>
            <span class="vertical-rl text-[8px] font-bold tracking-[0.2em] uppercase sm:text-[10px]">Valid</span>
            <span class="vertical-rl text-[8px] font-bold tracking-[0.2em] uppercase sm:text-[10px]">Valid</span>
            <span class="vertical-rl text-[8px] font-bold tracking-[0.2em] uppercase sm:text-[10px]">Valid</span>
          </div>

          <!-- Main VIP Area -->
          <div class="flex flex-1 flex-col gap-3 p-4 sm:p-7 justify-between">
            ${convenerMark('gold')}
            <div>
              <h2 class="font-serif text-gradient-gold text-2xl leading-tight uppercase sm:text-4xl font-bold">
                The Wealth Convergence:
              </h2>
              <p class="font-serif text-lg leading-tight text-white uppercase sm:text-2xl font-light">
                Redesigning Economic Architecture
              </p>
            </div>
            <div class="text-xs leading-relaxed sm:text-sm">
              <p class="text-gold font-semibold tracking-[0.1em] uppercase text-[10px] sm:text-xs">Date:</p>
              <p class="text-white font-medium mb-1">${SUMMIT.date}</p>
              <p class="text-gold font-semibold tracking-[0.1em] uppercase text-[10px] sm:text-xs">Venue:</p>
              <p class="text-white font-medium">${SUMMIT.venue}</p>
            </div>
            <p class="mt-auto text-[8px] tracking-[0.18em] text-white/50 uppercase sm:text-[10px]">
              Convened by ${SUMMIT.convener}
            </p>
          </div>

          <!-- Right VIP Stub -->
          <div class="flex w-[38%] flex-col justify-between border-l border-[#d4af37]/30 bg-black/60">
            <div class="bg-[#581c24] flex items-center justify-center gap-2 px-3 py-2.5 text-center">
              <span class="text-gold font-bold text-sm">★</span>
              <div class="text-gold text-[9px] font-bold tracking-[0.12em] uppercase sm:text-xs">
                VIP Executive Pass
                <div class="text-sm text-white sm:text-xl font-serif">${formatKsh(ticket.amount)}</div>
              </div>
              <span class="text-gold font-bold text-sm">★</span>
            </div>

            <div class="flex flex-col sm:flex-row items-center gap-3 p-3 sm:p-4">
              <div class="bg-white p-1.5 rounded flex justify-center shrink-0">
                <img src="${qrUrl}" alt="QR code" class="size-20 sm:size-24 object-contain" />
              </div>
              <div class="space-y-1 text-[8px] tracking-wide uppercase sm:text-[11px] text-left">
                <p class="text-gold font-bold font-mono">#${ticket.id}</p>
                <p class="font-semibold text-white">${ticket.name}</p>
                <p class="text-white/60 truncate max-w-[140px]">${ticket.organization}</p>
                <p class="text-white/60">Class: <span class="text-slate-200">${tier.classLabel}</span></p>
              </div>
            </div>

            <p class="bg-gradient-gold text-slate-950 px-3 py-1.5 text-center text-[7px] font-bold tracking-[0.15em] uppercase sm:text-[9px]">
              Non-transferable · Single admission
            </p>
          </div>
        </div>
      `;
    }

    // 3. CORPORATE BLOCK ALLOCATION (10 DELEGATES)
    return `
      <div class="ticket-card shadow-lux bg-gradient-teal flex w-full overflow-hidden rounded-lg border border-teal-500/30 select-none text-left">
        <!-- Left Flank -->
        <div class="flex w-[26%] flex-col justify-between bg-black/70 p-4 sm:p-6 border-r border-white/10">
          ${convenerMark('light')}
          <div class="flex items-end gap-2">
            <h3 class="vertical-rl text-sm leading-tight font-bold tracking-[0.12em] text-white uppercase sm:text-lg">
              Convened by<br />${SUMMIT.convener}
            </h3>
          </div>
          <p class="text-[7px] tracking-[0.1em] text-teal-300/70 uppercase sm:text-[10px]">
            Enterprise Sovereign Network
          </p>
        </div>

        <!-- Center Core (Grid Mesh) -->
        <div class="grid-mesh flex flex-1 flex-col items-center justify-center gap-3 px-4 py-6 text-center sm:py-8">
          <div class="w-12 h-12 rounded-full border-2 border-teal-300 flex items-center justify-center font-serif font-black text-lg text-teal-200">
            QAG
          </div>
          <h2 class="text-base font-extrabold tracking-tight text-white uppercase sm:text-2xl font-serif">
            ${SUMMIT.title}
          </h2>
          <p class="text-[9px] tracking-[0.14em] text-teal-200/80 uppercase sm:text-sm">
            ${SUMMIT.tagline}
          </p>
          <div class="flex w-full items-center justify-center gap-2 bg-white/15 px-3 py-2 text-[9px] font-bold tracking-wide text-white uppercase sm:text-xs rounded">
            ▪ ${tier.shortName} ▪
          </div>
          <div class="text-[10px] leading-relaxed text-white sm:text-sm">
            <p class="text-teal-300/80 tracking-[0.14em] uppercase text-[9px]">Summit Coordinates</p>
            <p><span class="font-bold">DATE:</span> ${SUMMIT.date}</p>
            <p><span class="font-bold">VENUE:</span> ${SUMMIT.venue}</p>
          </div>
          <div class="w-full bg-black/90 border border-teal-400/40 px-3 py-1.5 text-[9px] font-bold tracking-[0.08em] text-teal-300 uppercase sm:text-xs rounded">
            ▪ Valid for up to ${ticket.seats} scans at venue entry ▪
          </div>
        </div>

        <!-- Right Stub -->
        <div class="flex w-[28%] flex-col justify-between gap-3 bg-black p-4 sm:p-5 border-l border-white/10">
          <div class="bg-white p-2 rounded flex justify-center">
            <img src="${qrUrl}" alt="QR verification" class="size-24 sm:size-32 object-contain" />
          </div>
          <div class="space-y-1 text-[8px] tracking-wide uppercase sm:text-xs text-left">
            <p class="text-teal-300/80">SPONSOR: <span class="font-semibold text-white block sm:inline">${ticket.organization}</span></p>
            <p class="text-teal-300/80">SEATS: <span class="font-bold text-teal-300">${ticket.seats} ALLOCATED</span></p>
            <p class="text-teal-300/80">CLASS: <span class="font-semibold text-white">${tier.classLabel}</span></p>
            <p class="text-teal-300/80">ID: <span class="font-semibold text-gold">#${ticket.id}</span></p>
            <p class="text-teal-300/80">LEAD: <span class="font-semibold text-white truncate block max-w-[130px]">${ticket.name}</span></p>
          </div>
          <p class="text-[6px] tracking-wide text-white/50 uppercase sm:text-[8px] text-left">
            Non-transferable outside the nominated institution
          </p>
        </div>
      </div>
    `;
  }

  // Export globally
  window.QAG_TICKETS = {
    TIERS,
    SUMMIT,
    getTier,
    makeTransactionId,
    makeTicketId,
    formatKsh,
    loadTickets,
    saveTicket,
    findTicket,
    findTicketAsync,
    registerScan,
    registerScanAsync,
    generateQrDataUrl,
    renderTicketCardHTML,
  };
})(typeof window !== 'undefined' ? window : this);
