/**
 * QAG_TICKETS — TWC 2026 Ticket Engine
 * Exact port of reference project TicketCard.tsx + tickets.ts + styles.css
 * All three ticket tier designs rendered 1:1 as HTML+CSS in vanilla JS
 */
(function (global) {

  /* ─── Summit constants ─────────────────────────────────────────── */
  const SUMMIT = {
    title: 'The Wealth Convergence',
    tagline: 'Redesigning Economic Architecture.',
    date: 'MARCH 24-26, 2026',
    venue: 'NAIROBI, KENYA',
    convener: 'QOHEL AFRICA GROUP',
  };

  /* ─── Tier definitions ─────────────────────────────────────────── */
  const TIERS = [
    {
      id: 'general', index: 1,
      name: 'General Delegate Pass',
      shortName: 'General Admission Delegate',
      price: 2500, unit: 'Per Individual Delegate', seats: 1,
      cta: 'Claim General Delegate Pass', classLabel: 'DELEGATE',
      perks: [
        'Full admission to summit mainstage and exhibition pavilions',
        'Immediate digital copy of "The 30-Day Mindset Shift" eBook',
        'Includes free 30-day mindset shift ebook download',
      ],
    },
    {
      id: 'executive', index: 2,
      name: 'Executive Pass (VIP)',
      shortName: 'VIP Executive Pass',
      price: 7500, unit: 'Per Executive VIP', seats: 1,
      cta: 'Secure Executive VIP Pass', badge: 'Recommended Executive VIP',
      classLabel: 'EXECUTIVE VIP',
      perks: [
        'VIP access to all summit sessions and exclusive networking events',
        'Premium seating at mainstage presentations',
        'Digital + Physical copy of "The 30-Day Mindset Shift" (Hardcover)',
        'Exclusive executive briefing materials',
        'Priority access to speaker meet-and-greets',
      ],
    },
    {
      id: 'corporate', index: 3,
      name: 'Corporate Block Allocation',
      shortName: 'Institutional Group Allocation Pass',
      price: 20000, unit: 'Structured Master Pass (10 Delegates)', seats: 10,
      cta: 'Claim Corporate Block (10 Passes)', classLabel: 'COHORT PASS',
      perks: [
        'Master corporate pass for up to 10 executive delegates (Quantity x 10)',
        'Reserved corporate seating row on main summit auditorium floor',
        'Digital + Physical copies of "The 30-Day Mindset Shift" for corporate delegation',
        'Corporate entity mention in official Summit Dossier index',
        'Priority concierge and dedicated entry clearance',
      ],
    },
  ];

  function getTier(id) { return TIERS.find((t) => t.id === id) || TIERS[1]; }
  function formatKsh(n) { return 'KSH ' + Number(n).toLocaleString('en-KE'); }

  function hash(input) {
    let h = 5381;
    for (let i = 0; i < input.length; i++) h = (((h << 5) + h) + input.charCodeAt(i)) >>> 0;
    return h.toString(36).toUpperCase().padStart(6, '0').slice(-6);
  }
  function makeTransactionId() {
    return 'SFC' + Date.now().toString().slice(-7) + Math.random().toString(36).slice(2,8).toUpperCase();
  }
  const PREFIX = { general: 'GEN', executive: 'VIP', corporate: 'BLOCK' };
  function makeTicketId(tier, txId) {
    return 'TWC-' + (PREFIX[tier] || 'VIP') + '-' + hash(txId + tier);
  }

  /* ─── Storage ──────────────────────────────────────────────────── */
  const LS_KEY = 'twc2026.tickets';
  function loadTickets() {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); } catch { return []; }
  }
  function saveTicket(ticket) {
    const all = loadTickets().filter((t) => t.id !== ticket.id);
    all.push(ticket);
    localStorage.setItem(LS_KEY, JSON.stringify(all));
    fetch('/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticket),
    }).catch(() => {});
  }
  function findTicket(id) {
    return loadTickets().find((t) => t.id.toLowerCase() === id.toLowerCase());
  }
  function registerScan(id) {
    const ticket = findTicket(id);
    if (!ticket) return { status: 'unknown', ticket: undefined };
    if (ticket.scans.length >= ticket.seats) return { status: 'exhausted', ticket };
    ticket.scans = [...ticket.scans, new Date().toISOString()];
    saveTicket(ticket);
    return { status: 'valid', ticket };
  }

  /* ─── TWC Logo SVG (inline, matches twc-logo.png spirit) ──────── */
  function twcLogoSVG(fill) {
    const c = fill || 'currentColor';
    return `<svg viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg" style="height:56px;width:auto;object-fit:contain;display:block;">
      <text x="100" y="22" text-anchor="middle" font-family="'Cormorant Garamond',Georgia,serif" font-size="13" font-weight="800" fill="${c}" letter-spacing="4">THE WEALTH</text>
      <text x="100" y="41" text-anchor="middle" font-family="'Cormorant Garamond',Georgia,serif" font-size="13" font-weight="800" fill="${c}" letter-spacing="4">CONVERGENCE</text>
      <text x="100" y="55" text-anchor="middle" font-family="Montserrat,system-ui,sans-serif" font-size="7.5" fill="${c}" opacity="0.65" letter-spacing="5">TWC 2026</text>
    </svg>`;
  }

  /* ─── ConvenerMark component ───────────────────────────────────── */
  function convenerMark(tone) {
    const isGold = tone === 'gold';
    const ring  = isGold ? '#d4af37' : 'rgba(255,255,255,0.8)';
    const color = isGold ? '#d4af37' : '#fff';
    return `<div style="display:flex;align-items:center;gap:8px;">
      <div style="display:flex;width:32px;height:32px;align-items:center;justify-content:center;border-radius:50%;border:2px solid ${ring};color:${color};">
        <span style="font-size:9px;font-weight:700;letter-spacing:-0.03em;font-family:Montserrat,system-ui,sans-serif;">QAG</span>
      </div>
      <div style="font-size:10px;line-height:1.35;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:${color};font-family:Montserrat,system-ui,sans-serif;">
        Qohel Africa<br>Group
      </div>
    </div>`;
  }

  /* ─── QR placeholder (filled by renderQRsInContainer) ─────────── */
  let _qrSeq = 0;
  function qrHolder(size) {
    const uid = 'qrh-' + (++_qrSeq) + '-' + Date.now();
    return { uid, html: `<div id="${uid}" data-qr-size="${size||132}" style="background:#fff;padding:8px;display:inline-block;flex-shrink:0;"></div>` };
  }

  function renderQRsInContainer(container, verifyUrl) {
    if (!window.QRCode || !container) return;
    container.querySelectorAll('[id^="qrh-"]').forEach((el) => {
      const size = parseInt(el.dataset.qrSize) || 132;
      el.innerHTML = '';
      new QRCode(el, {
        text: verifyUrl, width: size, height: size,
        colorDark: '#000000', colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.M,
      });
    });
  }

  /* ══════════════════════════════════════════════════════════════
     TIER RENDERERS — exact 1:1 port of TicketCard.tsx zones
  ══════════════════════════════════════════════════════════════ */

  /* ── General Delegate ── */
  function renderGeneral(ticket) {
    const tier = getTier('general');
    const qr   = qrHolder(132);
    const html = `
<div style="display:flex;width:100%;overflow:hidden;border-radius:6px;box-shadow:0 24px 60px -20px rgba(0,0,0,0.7);" class="twc-ticket-card">

  <!-- Zone 1: ink flank -->
  <div style="background:linear-gradient(150deg,#1a1e2e,#0c0f1a);width:26%;display:flex;flex-direction:column;justify-content:space-between;padding:20px;">
    ${convenerMark('light')}
    <div style="display:flex;align-items:flex-end;gap:8px;padding-bottom:4px;">
      <h3 style="writing-mode:vertical-rl;transform:rotate(180deg);background:linear-gradient(160deg,#f0f0f0,#c8c8c8 45%,#ebebeb);-webkit-background-clip:text;background-clip:text;color:transparent;font-size:clamp(14px,2.2vw,26px);line-height:1;font-weight:800;letter-spacing:-0.02em;text-transform:uppercase;font-family:'Cormorant Garamond',Georgia,serif;margin:0;">The Wealth<br>Convergence</h3>
      <p style="writing-mode:vertical-rl;transform:rotate(180deg);font-size:clamp(6px,0.8vw,10px);line-height:1.3;letter-spacing:0.18em;color:rgba(255,255,255,0.5);text-transform:uppercase;margin:0;font-family:Montserrat,system-ui,sans-serif;">Shaping global economic architecture through strategic partnerships.</p>
    </div>
  </div>

  <!-- Zone 2: silver core -->
  <div style="background:linear-gradient(160deg,#f8f8f8,#c8c8c8 45%,#efefef);color:#111;flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:24px 20px;text-align:center;">
    <div style="color:#111;">${twcLogoSVG('#111')}</div>
    <h2 style="font-size:clamp(13px,1.8vw,22px);font-weight:800;letter-spacing:-0.02em;text-transform:uppercase;margin:0;font-family:'Cormorant Garamond',Georgia,serif;">${SUMMIT.title}</h2>
    <p style="font-size:clamp(8px,0.9vw,13px);letter-spacing:0.1em;text-transform:uppercase;margin:0;font-family:Montserrat,system-ui,sans-serif;">${SUMMIT.tagline}</p>
    <div style="display:flex;align-items:center;justify-content:center;gap:8px;width:100%;background:#4a90a4;padding:10px 14px;border-radius:8px;font-size:clamp(7px,0.8vw,11px);font-weight:700;text-transform:uppercase;line-height:1.3;color:#fff;box-shadow:inset 0 1px 3px rgba(0,0,0,0.25);font-family:Montserrat,system-ui,sans-serif;">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><path d="M20 12v10H4V2h8"/><path d="m14.5 2.5 5 5"/><path d="M8 18h4M8 14h8"/></svg>
      Includes free 30-day mindset shift ebook download
    </div>
    <div style="font-size:clamp(9px,1vw,14px);line-height:1.9;font-family:Montserrat,system-ui,sans-serif;">
      <p style="margin:0;"><strong>DATE:</strong> ${SUMMIT.date}</p>
      <p style="margin:0;"><strong>VENUE:</strong> ${SUMMIT.venue}</p>
    </div>
    <div style="width:100%;background:#000;padding:8px 14px;font-size:clamp(7px,0.9vw,12px);font-weight:700;letter-spacing:0.08em;color:#fff;text-transform:uppercase;font-family:Montserrat,system-ui,sans-serif;">
      &#9642; ${tier.shortName} &#9642;
    </div>
  </div>

  <!-- Zone 3: black stub -->
  <div style="width:26%;display:flex;flex-direction:column;justify-content:space-between;gap:12px;background:#000;padding:14px;">
    ${qr.html}
    <div style="font-size:clamp(7px,0.8vw,11px);letter-spacing:0.06em;text-transform:uppercase;line-height:1.9;font-family:Montserrat,system-ui,sans-serif;">
      <p style="color:rgba(255,255,255,0.6);margin:0;">NAME: <span style="font-weight:600;color:#fff;">${ticket.name}</span></p>
      <p style="color:rgba(255,255,255,0.6);margin:0;">CORP: <span style="font-weight:600;color:#fff;">${ticket.organization}</span></p>
      <p style="color:rgba(255,255,255,0.6);margin:0;">CLASS: <span style="font-weight:600;color:#fff;">${tier.classLabel}</span></p>
      <p style="color:rgba(255,255,255,0.6);margin:0;">ID: <span style="font-weight:600;color:#fff;">#${ticket.id}</span></p>
    </div>
    <p style="font-size:clamp(14px,1.8vw,22px);font-weight:700;color:#fff;margin:0;font-family:'Cormorant Garamond',Georgia,serif;">${formatKsh(ticket.amount)}</p>
  </div>
</div>`;
    return { html, qrUid: qr.uid };
  }

  /* ── Executive VIP ── */
  function renderExecutive(ticket) {
    const tier = getTier('executive');
    const qr   = qrHolder(120);
    const valid5 = [1,2,3,4,5].map(() =>
      `<span style="writing-mode:vertical-rl;transform:rotate(180deg);font-size:clamp(7px,0.8vw,10px);font-weight:700;letter-spacing:0.2em;color:#777;text-transform:uppercase;font-family:Montserrat,system-ui,sans-serif;">Valid</span>`
    ).join('');
    const html = `
<div style="background:linear-gradient(150deg,#1a1e2e,#0c0f1a);position:relative;display:flex;width:100%;overflow:hidden;border-radius:6px;border:1px solid rgba(212,175,55,0.25);box-shadow:0 24px 60px -20px rgba(0,0,0,0.7);" class="twc-ticket-card">

  <!-- Gold top bar -->
  <div style="position:absolute;top:0;left:0;right:0;height:6px;background:linear-gradient(135deg,#9a7a1a,#f5e8a0 45%,#d4af37);"></div>

  <!-- Silver stub: 5x VALID -->
  <div style="background:linear-gradient(160deg,#f8f8f8,#c8c8c8 45%,#efefef);width:10%;display:flex;flex-direction:column;align-items:center;justify-content:space-around;padding:20px 0;margin-top:6px;">
    ${valid5}
  </div>

  <!-- Main content -->
  <div style="flex:1;display:flex;flex-direction:column;gap:16px;padding:24px;margin-top:6px;">
    ${convenerMark('gold')}
    <div style="color:#d4af37;">${twcLogoSVG('#d4af37')}</div>
    <div>
      <h2 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:clamp(16px,2.2vw,36px);line-height:1.15;text-transform:uppercase;background:linear-gradient(135deg,#9a7a1a,#f5e8a0 45%,#d4af37);-webkit-background-clip:text;background-clip:text;color:transparent;margin:0;">The Wealth Convergence:</h2>
      <p style="font-family:'Cormorant Garamond',Georgia,serif;font-size:clamp(13px,1.8vw,28px);line-height:1.2;color:#fff;text-transform:uppercase;margin:0;">Redesigning Economic Architecture</p>
    </div>
    <div style="font-size:clamp(10px,1.1vw,15px);line-height:2;font-family:Montserrat,system-ui,sans-serif;">
      <p style="color:#d4af37;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;margin:0;">Date:</p>
      <p style="color:#fff;margin:0;">${SUMMIT.date}</p>
      <p style="color:#d4af37;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;margin:0;">Venue:</p>
      <p style="color:#fff;margin:0;">${SUMMIT.venue}</p>
    </div>
    <p style="margin-top:auto;font-size:clamp(7px,0.8vw,10px);letter-spacing:0.18em;color:rgba(255,255,255,0.45);text-transform:uppercase;font-family:Montserrat,system-ui,sans-serif;">
      Convened by ${SUMMIT.convener}
    </p>
  </div>

  <!-- Right stub: wine header + QR + non-transferable bar -->
  <div style="width:38%;display:flex;flex-direction:column;justify-content:space-between;border-left:1px solid rgba(212,175,55,0.2);background:rgba(0,0,0,0.4);margin-top:6px;">
    <div style="background:#5c1a1a;display:flex;align-items:center;justify-content:center;gap:8px;padding:12px 14px;text-align:center;">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#d4af37" stroke="#d4af37" stroke-width="0.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
      <div style="color:#d4af37;font-size:clamp(8px,0.9vw,12px);font-weight:700;letter-spacing:0.12em;text-transform:uppercase;font-family:Montserrat,system-ui,sans-serif;">
        VIP Executive Pass
        <div style="font-size:clamp(13px,1.6vw,22px);color:#fff;font-family:'Cormorant Garamond',Georgia,serif;">${formatKsh(ticket.amount)}</div>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#d4af37" stroke="#d4af37" stroke-width="0.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
    </div>
    <div style="display:flex;align-items:center;gap:14px;padding:14px;flex:1;">
      ${qr.html}
      <div style="font-size:clamp(7px,0.8vw,11px);letter-spacing:0.06em;text-transform:uppercase;line-height:2;font-family:Montserrat,system-ui,sans-serif;">
        <p style="color:#d4af37;font-weight:700;margin:0;">#${ticket.id}</p>
        <p style="font-weight:600;color:#fff;margin:0;">${ticket.name}</p>
        <p style="color:rgba(255,255,255,0.6);margin:0;">${ticket.organization}</p>
        <p style="color:rgba(255,255,255,0.6);margin:0;">Class: ${tier.classLabel}</p>
      </div>
    </div>
    <div style="background:linear-gradient(135deg,#9a7a1a,#f5e8a0 45%,#d4af37);color:#111;padding:6px 14px;text-align:center;font-size:clamp(7px,0.8vw,10px);font-weight:700;letter-spacing:0.15em;text-transform:uppercase;font-family:Montserrat,system-ui,sans-serif;">
      Non-transferable &middot; Single admission
    </div>
  </div>
</div>`;
    return { html, qrUid: qr.uid };
  }

  /* ── Corporate Block ── */
  function renderCorporate(ticket) {
    const tier = getTier('corporate');
    const qr   = qrHolder(132);
    const html = `
<div style="background:linear-gradient(160deg,#1f4a45,#0f2520);display:flex;width:100%;overflow:hidden;border-radius:6px;box-shadow:0 24px 60px -20px rgba(0,0,0,0.7);" class="twc-ticket-card">

  <!-- Left flank -->
  <div style="width:26%;display:flex;flex-direction:column;justify-content:space-between;background:rgba(0,0,0,0.7);padding:20px;">
    ${convenerMark('light')}
    <div style="display:flex;align-items:flex-end;gap:8px;">
      <h3 style="writing-mode:vertical-rl;transform:rotate(180deg);font-size:clamp(11px,1.5vw,20px);line-height:1.25;font-weight:700;letter-spacing:0.12em;color:#fff;text-transform:uppercase;margin:0;font-family:'Cormorant Garamond',Georgia,serif;">Convened by<br>${SUMMIT.convener}</h3>
    </div>
    <p style="font-size:clamp(6px,0.7vw,10px);letter-spacing:0.1em;color:rgba(255,255,255,0.5);text-transform:uppercase;margin:0;font-family:Montserrat,system-ui,sans-serif;">Full service media market agency</p>
  </div>

  <!-- Center: grid-mesh -->
  <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:24px 20px;text-align:center;background-image:linear-gradient(rgba(255,255,255,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.05) 1px,transparent 1px);background-size:14px 14px;">
    <div style="color:rgba(255,255,255,0.9);">${twcLogoSVG('rgba(255,255,255,0.9)')}</div>
    <h2 style="font-size:clamp(13px,1.8vw,22px);font-weight:800;letter-spacing:-0.02em;text-transform:uppercase;color:#fff;margin:0;font-family:'Cormorant Garamond',Georgia,serif;">${SUMMIT.title}</h2>
    <p style="font-size:clamp(8px,0.9vw,13px);letter-spacing:0.14em;color:rgba(255,255,255,0.7);text-transform:uppercase;margin:0;font-family:Montserrat,system-ui,sans-serif;">${SUMMIT.tagline}</p>
    <div style="display:flex;align-items:center;justify-content:center;gap:8px;width:100%;background:rgba(255,255,255,0.12);padding:10px 14px;font-size:clamp(7px,0.8vw,11px);font-weight:700;letter-spacing:0.06em;color:#fff;text-transform:uppercase;font-family:Montserrat,system-ui,sans-serif;">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 17V7"/></svg>
      ${tier.shortName}
    </div>
    <div style="font-size:clamp(9px,1vw,14px);line-height:1.9;color:#fff;font-family:Montserrat,system-ui,sans-serif;">
      <p style="color:rgba(255,255,255,0.6);letter-spacing:0.14em;text-transform:uppercase;margin:0;">Summit coordinates</p>
      <p style="margin:0;"><strong>DATE:</strong> ${SUMMIT.date}</p>
      <p style="margin:0;"><strong>VENUE:</strong> ${SUMMIT.venue}</p>
    </div>
    <div style="width:100%;background:#000;padding:8px 14px;font-size:clamp(7px,0.9vw,12px);font-weight:700;letter-spacing:0.08em;color:#fff;text-transform:uppercase;font-family:Montserrat,system-ui,sans-serif;">
      &#9642; Valid for up to ${ticket.seats} scans at venue entry &#9642;
    </div>
  </div>

  <!-- Right stub -->
  <div style="width:28%;display:flex;flex-direction:column;justify-content:space-between;gap:12px;background:#000;padding:14px;">
    ${qr.html}
    <div style="font-size:clamp(7px,0.8vw,11px);letter-spacing:0.06em;text-transform:uppercase;line-height:2;font-family:Montserrat,system-ui,sans-serif;">
      <p style="color:rgba(94,234,212,0.8);margin:0;">SPONSOR: <span style="font-weight:600;color:#fff;">${ticket.organization}</span></p>
      <p style="color:rgba(94,234,212,0.8);margin:0;">SEATS: <span style="font-weight:600;color:#fff;">${ticket.seats} ALLOCATED</span></p>
      <p style="color:rgba(94,234,212,0.8);margin:0;">CLASS: <span style="font-weight:600;color:#fff;">${tier.classLabel}</span></p>
      <p style="color:rgba(94,234,212,0.8);margin:0;">ID: <span style="font-weight:600;color:#fff;">#${ticket.id}</span></p>
      <p style="color:rgba(94,234,212,0.8);margin:0;">LEAD: <span style="font-weight:600;color:#fff;">${ticket.name}</span></p>
    </div>
    <p style="font-size:clamp(6px,0.7vw,9px);letter-spacing:0.06em;color:rgba(255,255,255,0.45);text-transform:uppercase;margin:0;font-family:Montserrat,system-ui,sans-serif;">
      Non-transferable outside the nominated institution
    </p>
  </div>
</div>`;
    return { html, qrUid: qr.uid };
  }

  /* ─── Main render dispatcher ─────────────────────────────────── */
  async function renderTicketCardHTML(ticket, verifyUrl) {
    let result;
    if (ticket.tier === 'general')        result = renderGeneral(ticket);
    else if (ticket.tier === 'executive') result = renderExecutive(ticket);
    else                                   result = renderCorporate(ticket);

    // Return html; caller must inject into DOM then call renderQRsInContainer
    result._verifyUrl = verifyUrl;
    return result.html;
  }

  /* ─── Public API ─────────────────────────────────────────────── */
  global.QAG_TICKETS = {
    TIERS, SUMMIT,
    getTier, formatKsh,
    makeTransactionId, makeTicketId,
    loadTickets, saveTicket, findTicket, registerScan,
    renderTicketCardHTML, renderQRsInContainer,
  };

})(window);
