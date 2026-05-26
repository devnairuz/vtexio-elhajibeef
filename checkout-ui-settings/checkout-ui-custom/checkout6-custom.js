$(document).ready(function () {
  /* =========================================
     BLOCO 1 â€“ SEU CÃ“DIGO ORIGINAL
  ========================================= */
  let intervalId;

  function initLoadingInterval() {
    intervalId = setInterval(function () {
      $('.container.container-main .loading.loading-bg').css('display', 'block');
      if($('button#shipping-calculate-link')){
        $('button#shipping-calculate-link').click();
        $('input#ship-postalCode').blur();
        $('input#ship-postalCode').attr('placeholder', "Insira o seu CEP");
        $('input#cart-coupon').attr('placeholder', "Insira o código");
      }
    }, 200);
  }

  function clearLoadingInterval() {
    clearInterval(intervalId);
  }

  initLoadingInterval();

  setTimeout(function () {
    $('.container.container-main .loading.loading-bg').css('display', 'none');
    clearLoadingInterval();
  }, 4000);

  function alignCartSummaryBlocks() {
    const moreOptions = document.querySelector('.summary-template-holder .cart-more-options');
    const couponWrap = document.querySelector('.summary-template-holder .summary-coupon-wrap');
    const shippingPreview = document.querySelector('#shipping-preview-container');

    if (!moreOptions || !couponWrap || !shippingPreview) return;

    couponWrap.dataset.figmaCartPosition = 'true';
    couponWrap.classList.add('cart-coupon-card-section');
    shippingPreview.classList.add('cart-shipping-card-section');

    if (couponWrap.parentElement !== moreOptions || couponWrap.nextElementSibling !== shippingPreview) {
      moreOptions.insertBefore(couponWrap, shippingPreview);
    }
  }

  alignCartSummaryBlocks();
  $(window).on('orderFormUpdated.vtex hashchange', alignCartSummaryBlocks);


  /* =========================================
     BLOCO 2 â€“ RESUMO DE PERSONALIZAÃ‡ÃƒO
  ========================================= */

  const SELECTORS = {
    productRow: 'table.cart-items tbody tr.product-item',
    productNameCell: (row) => row.querySelector('.product-name'),

    // seus TDs corretos:
    unitCellPriceEl: (row) =>
      row.querySelector('td.product-price .new-product-price, td.product-price .best-price, td.product-price .price, td.product-price [data-bind*="price"]'),

    totalCellPriceEl: (row) =>
      row.querySelector('td.quantity-price .new-product-price, td.quantity-price .best-price, td.quantity-price .price, td.quantity-price [data-bind*="price"]'),

    // QUANTIDADE â€” agora cobrindo seu HTML (input type="tel" e Ã¢ncoras)
    qtyContainer: (row) =>
      row.querySelector('td.quantity, td.item-quantity, td.product-quantity, td.qty, td.quantity-field') || null,

    qtyInput: (row) =>
      row.querySelector('td.quantity input[id^="item-quantity-"], td.item-quantity input[id^="item-quantity-"], td.product-quantity input[id^="item-quantity-"], td.qty input[id^="item-quantity-"]'),

    qtyLinks: (row) =>
      row.querySelectorAll('td.quantity a.item-quantity-change, td.item-quantity a.item-quantity-change, td.product-quantity a.item-quantity-change, td.qty a.item-quantity-change')
  };

  const THERMAL_BAG_TEXT = 'sacola termica';

  function normalizeText(value) {
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  function isThermalBag(service) {
    return normalizeText(`${service && service.name} ${service && service.type}`).includes(THERMAL_BAG_TEXT);
  }

  function renderThermalBagButtons() {
    if (!window.vtexjs || !window.vtexjs.checkout) return;

    window.vtexjs.checkout.getOrderForm().done(function (orderForm) {
      document.querySelectorAll(SELECTORS.productRow).forEach(function (row, index) {
        const nameCell = SELECTORS.productNameCell(row);
        const item = orderForm.items && orderForm.items[index];
        const offering = item && item.offerings && item.offerings.find(isThermalBag);
        const added = item && item.bundleItems && item.bundleItems.some(isThermalBag);
        const current = nameCell && nameCell.querySelector('.thermal-bag-button');

        if (!nameCell || (!offering && !added)) {
          if (current) current.remove();
          return;
        }

        if (current) {
          current.disabled = !!added;
          current.textContent = added ? 'Sacola t\u00e9rmica adicionada' : 'Adicionar sacola t\u00e9rmica';
          return;
        }

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'thermal-bag-button';
        button.disabled = !!added;
        button.textContent = added ? 'Sacola t\u00e9rmica adicionada' : 'Adicionar sacola t\u00e9rmica';

        button.addEventListener('click', function () {
          if (!offering || !offering.id) return;

          button.disabled = true;
          button.textContent = 'Adicionando...';

          fetch('/api/checkout/pub/orderForm/' + orderForm.id + '/items/' + index + '/offerings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ id: offering.id })
          })
            .then(function () {
              $(window).trigger('orderFormUpdated.vtex');
              renderThermalBagButtons();
            })
            .catch(function () {
              button.disabled = false;
              button.textContent = 'Tentar novamente';
            });
        });

        nameCell.appendChild(button);
      });
    });
  }

  function parseCurrencyLabel(el) {
    if (!el) return null;
    const t = el.textContent || '';
    const m = t.match(/R\$\s?[\d\.\,]+/);
    return m ? m[0].trim() : null;
  }

  function currencyToNumber(label) {
    if (!label) return 0;
    return Number(label.replace(/[R$\s\.]/g, '').replace(',', '.')) || 0;
  }

  function numberToCurrency(n) {
    return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function matchServicePriceForAttachment(label, services) {
    const l = (label || '').toLowerCase();
    const hit = services.find((s) => {
      const n = (s.name || '').toLowerCase();
      if (l.includes('nome')) return n.includes('nome');
      if (l.includes('nÃºmero') || l.includes('numero')) return n.includes('nÃºmero') || n.includes('numero');
      return services.length === 1;
    });
    return hit ? hit.priceLabel : null;
  }

  function buildSummaryHTML(attachments, services) {
    const itemsKV = attachments
      .map((a) => {
        const priceLbl = matchServicePriceForAttachment(a.label, services);
        return `<li><strong>${a.label}:</strong> ${a.value}${priceLbl ? ` <em class="kv-price">+ ${priceLbl}</em>` : ''}</li>`;
      })
      .join('');
    return `
      <div class="customization-summary is-compact">
        <div class="title">PersonalizaÃ§Ã£o:</div>
        ${attachments.length ? `<ul class="kvs">${itemsKV}</ul>` : '<div class="muted">Sem personalizaÃ§Ã£o.</div>'}
      </div>
    `;
  }

  function collectGroupRows(startTr) {
    const rows = [];
    let el = startTr.nextElementSibling;
    while (el && !el.classList.contains('product-item')) {
      rows.push(el);
      el = el.nextElementSibling;
    }
    return rows;
  }

  function extractAttachments(rows) {
    const items = [];
    let currentLabel = null;
    rows.forEach((r) => {
      if (r.classList.contains('item-attachments-head')) {
        const label = (r.querySelector('.item-attachments-header strong') || {}).textContent || '';
        currentLabel = (label || '').trim();
      } else if (r.classList.contains('item-attachments-content')) {
        const input = r.querySelector('.item-attachment-value');
        const value = input ? input.value : '';
        if (input) input.setAttribute('readonly', 'readonly');
        if (currentLabel) items.push({ label: currentLabel, value: value || '-' });
        currentLabel = null;
      }
    });
    return items;
  }

  function extractServices(rows) {
    const services = [];
    rows.forEach((r) => {
      if (!r.classList.contains('item-service')) return;
      const name = (r.querySelector('.bundle-item-name span') || {}).textContent || '';
      const priceLabel = parseCurrencyLabel(r.querySelector('.bundle-quantity-price .new-product-price'));
      services.push({ name: (name || '').trim(), priceLabel, priceNumber: currencyToNumber(priceLabel) });

      const rm = r.querySelector('.bundle-remove');
      if (rm) rm.style.display = 'none';
    });
    return services;
  }

  // TOTAL (td.quantity-price): jÃ¡ somado e com nota
  function ensureBreakdownInTotal(prodRow, services) {
    const totalPriceEl = SELECTORS.totalCellPriceEl(prodRow);
    if (!totalPriceEl) return;

    const personalizationPerUnit = services.reduce((acc, s) => acc + (s.priceNumber || 0), 0);
    if (!personalizationPerUnit) return;

    const qtyInput = SELECTORS.qtyInput(prodRow);
    const qty = Math.max(1, parseInt(qtyInput && qtyInput.value, 10) || 1);

    const baseTotalNumber = currencyToNumber(totalPriceEl.textContent || '');
    const newTotalNumber = baseTotalNumber + personalizationPerUnit * qty;

    if (totalPriceEl.dataset.totalAdjusted === 'true') return;
    totalPriceEl.dataset.totalAdjusted = 'true';

    totalPriceEl.textContent = numberToCurrency(newTotalNumber);

    let note = prodRow.querySelector('.customization-total-note');
    const noteText = `+ ${numberToCurrency(personalizationPerUnit * qty)} de personalizaÃ§Ã£o`;
    if (!note) {
      note = document.createElement('div');
      note.className = 'customization-total-note';
      note.style.fontSize = '12px';
      note.style.opacity = '0.8';
      note.style.marginTop = '2px';
      totalPriceEl.parentElement.appendChild(note);
    }
    note.textContent = noteText;
  }

  // ForÃ§a item Ãºnico quando personalizado
  function enforceSingleQuantityWhenPersonalized(prodRow, hasPersonalization) {
    if (!hasPersonalization) return;

    // marca a linha para bloqueio global (delegado)
    prodRow.classList.add('customization-has-attachments');

    const qtyBox = SELECTORS.qtyContainer(prodRow);
    const qtyInput = SELECTORS.qtyInput(prodRow);
    const qtyLinks = SELECTORS.qtyLinks(prodRow);

    if (qtyInput) {
      qtyInput.value = 1;
      qtyInput.setAttribute('readonly', 'readonly');
      qtyInput.setAttribute('disabled', 'disabled');
      qtyInput.style.pointerEvents = 'none';
      qtyInput.style.opacity = '0.6';
    }

    if (qtyLinks && qtyLinks.length) {
      qtyLinks.forEach(a => {
        a.classList.add('disabled');
        a.setAttribute('aria-disabled', 'true');
        a.style.pointerEvents = 'none';
        a.style.opacity = '0.4';
      });
    }

    if (qtyBox) {
      qtyBox.classList.add('cant-change-qty');
    }
  }

  function renderCompactForRow(prodRow) {
    const nameCell = SELECTORS.productNameCell(prodRow);

    const group = collectGroupRows(prodRow);
    const atts = extractAttachments(group);
    const srvs  = extractServices(group);

    // card (apenas se ainda nÃ£o existir)
    if (nameCell && !nameCell.querySelector('.customization-summary') && (atts.length || srvs.length)) {
      nameCell.insertAdjacentHTML('beforeend', buildSummaryHTML(atts, srvs));
    }

    // preÃ§os e qty
    ensureBreakdownInTotal(prodRow, srvs);
    enforceSingleQuantityWhenPersonalized(prodRow, (atts.length + srvs.length) > 0);
  }

  function normalizeDuplicatedProductName(prodRow) {
    const nameCell = SELECTORS.productNameCell(prodRow);
    const nameLink = nameCell && nameCell.querySelector('a');
    if (!nameLink || nameLink.dataset.cartNameNormalized === 'true') return;

    const originalName = (nameLink.textContent || '').replace(/\s+/g, ' ').trim();
    const firstWords = originalName.split(' ').slice(0, 3).join(' ');
    if (!firstWords) return;

    const repeatedAt = originalName.indexOf(firstWords, firstWords.length);
    if (repeatedAt <= 0) return;

    const normalizedName = originalName.slice(repeatedAt).trim();
    if (!normalizedName || normalizedName === originalName) return;

    nameLink.dataset.cartNameOriginal = originalName;
    nameLink.dataset.cartNameNormalized = 'true';
    nameLink.textContent = normalizedName;
  }

  // Reescreve a URL das imagens do carrinho para 106x106 (CDN VTEX entrega o tamanho pedido na URL).
  // Aceita tanto /arquivos/ids/{id}/  quanto /arquivos/ids/{id}-{W}-{H}/  e força -106-106.
  const VTEX_IMAGE_SIZE_RE = /(\/arquivos\/ids\/\d+)(?:-\d+-\d+)?(\/)/;
  function upgradeAllCartImages() {
    document.querySelectorAll('table.cart-items img[id^="product-image-"]').forEach((img) => {
      const src = img.getAttribute('src') || '';
      if (!VTEX_IMAGE_SIZE_RE.test(src)) return;
      const next = src.replace(VTEX_IMAGE_SIZE_RE, '$1-106-106$2');
      if (next !== src) img.setAttribute('src', next);
    });
  }

  function runCustomizationSummary() {
    const table = document.querySelector('table.cart-items');
    if (!table) return;
    document.querySelectorAll(SELECTORS.productRow).forEach((row) => {
      normalizeDuplicatedProductName(row);
      renderCompactForRow(row);
    });
    renderThermalBagButtons();
    upgradeAllCartImages();
    document.querySelectorAll('.clone-item-container, .clone-item-sep').forEach((el) => (el.style.display = 'none'));
  }

  // Bloqueio duro: evita clique nos increment/decrement mesmo que o KO reabilite
  $(document).on('click', 'td.quantity a.item-quantity-change', function (e) {
    const tr = this.closest('tr');
    if (tr && tr.classList.contains('customization-has-attachments')) {
      e.preventDefault();
      e.stopImmediatePropagation();
      return false;
    }
  });

  // 1Âª execuÃ§Ã£o
  runCustomizationSummary();

  // observa mutaÃ§Ãµes do carrinho (childList p/ linhas novas, attributes p/ src trocado pelo Knockout)
  const cartRoot = document.querySelector('.cart') || document.body;
  const mo = new MutationObserver((mutations) => {
    const onlySrcChange = mutations.every(m => m.type === 'attributes' && m.attributeName === 'src');
    if (onlySrcChange) {
      upgradeAllCartImages();
    } else {
      runCustomizationSummary();
    }
  });
  mo.observe(cartRoot, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });

  const summaryRoot = document.querySelector('.summary-template-holder') || document.body;
  const summaryObserver = new MutationObserver(() => alignCartSummaryBlocks());
  summaryObserver.observe(summaryRoot, { childList: true, subtree: true });
});
