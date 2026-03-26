// ── HELPERS ──────────────────────────────────────────────────────────────────

function ph(text) {
  return `<div class="section-img-full-ph">${text}</div>`;
}

function phPair(text) {
  return `<div class="section-img-pair-ph">${text}</div>`;
}

function phAside(text) {
  return `<div class="section-aside-img-ph">${text}</div>`;
}

function imgOrPh(img, wrapClass, phFn) {
  if (!img) return '';
  const inner = img.src
    ? `<img src="${img.src}" alt="${img.caption || ''}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">${phFn(img.ph)}`
    : phFn(img.ph);
  const caption = img.caption ? `<div class="img-caption">${img.caption}</div>` : '';
  return `<div class="${wrapClass}">${inner}</div>${caption}`;
}


// ── PROJECT RENDERER ─────────────────────────────────────────────────────────

function renderProject(id) {
  const p = projects[id];
  if (!p) return;

  document.title = p.title + ' — Lara Yeyati Preiss';

  document.getElementById('proj-ctx').textContent = p.ctx;
  document.getElementById('proj-title').textContent = p.title;
  document.getElementById('proj-summary').textContent = p.summary;

  const btn = document.getElementById('proj-live-btn');
  btn.href = p.liveUrl;
  btn.innerHTML = `See live site <span class="proj-live-arrow">↗</span>`;

  document.getElementById('proj-meta-sidebar').innerHTML = `
    <div class="proj-meta-item">
      <div class="proj-meta-label">Role</div>
      <div class="proj-meta-value">${p.role}</div>
    </div>
    <div class="proj-meta-item">
      <div class="proj-meta-label">Context</div>
      <div class="proj-meta-value">${p.context}</div>
    </div>
    <div class="proj-meta-item">
      <div class="proj-meta-label">Data</div>
      <div class="proj-meta-value">${p.data}</div>
    </div>
  `;

  const videoSection = document.getElementById('proj-video-section');
  if (p.vimeoId) {
    videoSection.innerHTML = `
      <div class="proj-video-container">
        <div class="video-ratio">
          <iframe src="https://player.vimeo.com/video/${p.vimeoId}?title=0&byline=0&portrait=0&dnt=1"
            allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
        </div>
      </div>`;
  } else {
    videoSection.innerHTML = `<div class="proj-video-placeholder">Add vimeoId: 'YOUR_ID' in data.js</div>`;
  }

  // Question
  const q = p.question;
  let qHtml = `<div class="proj-section-body">${q.text.map(t => `<p>${t}</p>`).join('')}</div>`;
  if (q.img) qHtml += imgOrPh(q.img, 'section-img-full', ph);
  document.getElementById('proj-question-content').innerHTML = qHtml;

  // Process
  const proc = p.process;
  const procTextHtml = `<div class="proj-section-body">${proc.text.map(t => `<p>${t}</p>`).join('')}</div>`;
  let procImgHtml = '';

  if (proc.images && proc.images.length) {
    if (proc.layout === 'split' && proc.images.length >= 2) {
      procImgHtml = `<div class="section-img-pair">
        ${imgOrPh(proc.images[0], 'section-img-pair-item', phPair)}
        ${imgOrPh(proc.images[1], 'section-img-pair-item', phPair)}
      </div>`;
    } else if (proc.layout === 'aside' && proc.images.length >= 1) {
      const asideHtml = `<div class="section-aside" style="margin-top:24px">
        ${procTextHtml}
        <div>
          ${imgOrPh(proc.images[0], 'section-aside-img', phAside)}
          ${proc.images[0] && proc.images[0].caption ? `<div class="img-caption">${proc.images[0].caption}</div>` : ''}
        </div>
      </div>`;
      document.getElementById('proj-process-content').innerHTML = asideHtml;
      renderResult(p);
      return;
    } else {
      procImgHtml = proc.images.map(img => imgOrPh(img, 'section-img-full', ph)).join('');
    }
  }

  document.getElementById('proj-process-content').innerHTML = procTextHtml + procImgHtml;
  renderResult(p);
}

function renderResult(p) {
  const res = p.result;
  const resTextHtml = `<div class="proj-section-body">${res.text.map(t => `<p>${t}</p>`).join('')}</div>`;
  let resImgHtml = '';

  if (res.images && res.images.length) {
    if (res.images.length >= 2) {
      resImgHtml = `<div class="section-img-pair">
        ${imgOrPh(res.images[0], 'section-img-pair-item', phPair)}
        ${imgOrPh(res.images[1], 'section-img-pair-item', phPair)}
      </div>`;
    } else {
      resImgHtml = imgOrPh(res.images[0], 'section-img-full', ph);
    }
  }

  const vizLink = document.getElementById('proj-viz-link');
  vizLink.href = p.liveUrl;
  vizLink.innerHTML = 'See live site <span class="proj-live-arrow">↗</span>';

  document.getElementById('proj-result-content').innerHTML = resTextHtml + resImgHtml;
}


// ── ILLUSTRATION RENDERER ─────────────────────────────────────────────────────

function renderIllo(id) {
  const il = illustrations[id];
  if (!il) return;

  document.title = il.title + ' — Lara Yeyati Preiss';

  document.getElementById('illo-ctx').textContent = il.ctx;
  document.getElementById('illo-title').textContent = il.title;
  document.getElementById('illo-summary').innerHTML = il.summary;

  document.getElementById('illo-meta').innerHTML = `
    <div class="meta-row">
      <div class="meta-label">Role</div>
      <div class="meta-value">${il.role}</div>
    </div>
    <div class="meta-row">
      <div class="meta-label">Context</div>
      <div class="meta-value">${il.context}</div>
    </div>
  `;

  document.getElementById('illo-gallery').innerHTML = buildGallery(il);
}

function imgEl(img, extraClass = '') {
  return `
    <div class="${extraClass}">
      <img src="${img.src}" alt="${img.alt}"
        onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
      <div class="img-ph" style="display:none">${img.ph.replace('\n','<br>')}</div>
    </div>`;
}

function buildGallery(il) {
  if (il.galleryType === 'reencantar') {
    const [a, b, c] = il.images;
    return `<div class="illo-gallery-reencantar">${imgEl(a,'img-main')}${imgEl(b,'img-side')}${imgEl(c,'img-side')}</div>`;
  }
  if (il.galleryType === 'abierto') {
    const img = il.images[0];
    return `<div class="illo-gallery-abierto">
      <img src="${img.src}" alt="${img.alt}"
        onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
      <div class="img-ph" style="display:none">${img.ph.replace('\n','<br>')}</div>
    </div>`;
  }
  if (il.galleryType === 'flores') {
    return `<div class="illo-gallery-flores">${imgEl(il.images[0],'')}</div>`;
  }
  return '';
}
