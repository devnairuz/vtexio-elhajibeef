// WARNING: THE USAGE OF CUSTOM SCRIPTS IS NOT SUPPORTED. VTEX IS NOT LIABLE FOR ANY DAMAGES THIS MAY CAUSE. THIS MAY BREAK YOUR STORE AND STOP SALES. IN CASE OF ERRORS, PLEASE DELETE THE CONTENT OF THIS SCRIPT.

$(document).ready(function() {
    setTimeout(function() {
        $('#ship-postalCode').attr('placeholder', 'Insira o seu CEP');
        $('#cart-coupon').attr('placeholder', 'Insira o código');

        if($('#shipping-calculate-link')) {
            $('#shipping-calculate-link').trigger('click');
        }
        console.log('explode');
    }, 3000);
});


$(document).ready(function() {
  $('#client-company-document').on('input', function() {
    // Obtém o valor do campo
    var inputValue = $(this).val();

    // Remove qualquer caractere que não seja número
    inputValue = inputValue.replace(/[^0-9]/g, '');

    // Limita o comprimento a 14 caracteres (CNPJ)
    if (inputValue.length > 14) {
      inputValue = inputValue.substring(0, 14);
    }

    // Formatação para CNPJ sem "/"
    if (inputValue.length > 11) {
      inputValue = inputValue.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})$/, '$1.$2.$3/$4');
    } else if (inputValue.length > 6) {
      inputValue = inputValue.replace(/^(\d{2})(\d{3})(\d{3})$/, '$1.$2.$3');
    } else if (inputValue.length > 2) {
      inputValue = inputValue.replace(/^(\d{2})(\d{3})$/, '$1.$2');
    }

    // Atualiza o campo com o valor formatado
    $(this).val(inputValue);
  });
});

$(document).ready(function() {
  $('.gift-card-section #payment-discounts-code').attr('placeholder', 'Digite seu vale aqui');
});

;(function () {
  var CART_IMAGE_SIZE = '106-106'
  var VTEX_IMAGE_SIZE_RE = /(\/arquivos\/ids\/\d+)(?:-\d+-\d+)?(\/[^?\s"']*)/
  var CART_PRODUCT_NAME_SELECTOR = 'table.cart-items .product-name a'
  var CART_ROW_SELECTOR = 'table.cart-items tr.product-item'
  var observer = null
  var scheduled = false

  function resizeVtexImageUrl(url, size) {
    if (!url || !VTEX_IMAGE_SIZE_RE.test(url)) return url

    return url.replace(VTEX_IMAGE_SIZE_RE, '$1-' + (size || CART_IMAGE_SIZE) + '$2')
  }

  function resizeSrcset(srcset) {
    if (!srcset) return srcset

    return srcset
      .split(',')
      .map(function (item) {
        var parts = item.trim().split(/\s+/)
        var url = parts[0]
        var descriptor = parts.slice(1).join(' ')
        var resizedUrl = resizeVtexImageUrl(url)

        return descriptor ? resizedUrl + ' ' + descriptor : resizedUrl
      })
      .join(', ')
  }

  function upgradeAllCartImages() {
    document
      .querySelectorAll('table.cart-items img[id^="product-image-"]')
      .forEach(function (img) {
        var currentSrc = img.getAttribute('src')
        var currentDataSrc = img.getAttribute('data-src')
        var currentSrcset = img.getAttribute('srcset')
        var nextSrc = resizeVtexImageUrl(currentSrc)
        var nextDataSrc = resizeVtexImageUrl(currentDataSrc)
        var nextSrcset = resizeSrcset(currentSrcset)

        if (nextSrc && nextSrc !== currentSrc) {
          img.setAttribute('src', nextSrc)
        }

        if (nextDataSrc && nextDataSrc !== currentDataSrc) {
          img.setAttribute('data-src', nextDataSrc)
        }

        if (nextSrcset && nextSrcset !== currentSrcset) {
          img.setAttribute('srcset', nextSrcset)
        }

        img.setAttribute('width', '106')
        img.setAttribute('height', '106')
      })
  }

  function normalizeSpaces(value) {
    return String(value || '').replace(/\s+/g, ' ').trim()
  }

  function getCurrencyText(value) {
    var match = normalizeSpaces(value).match(/R\$\s?[\d.]+,\d{2}/)

    return match ? match[0] : ''
  }

  function getDedupedProductName(name) {
    var normalizedName = normalizeSpaces(name)
    var firstWords = normalizedName.split(' ').slice(0, 3).join(' ')

    if (!firstWords) return normalizedName

    var repeatedAt = normalizedName.indexOf(firstWords, firstWords.length)

    if (repeatedAt <= 0) return normalizedName

    return normalizeSpaces(normalizedName.slice(repeatedAt))
  }

  function normalizeDuplicatedProductNames() {
    document
      .querySelectorAll(CART_PRODUCT_NAME_SELECTOR)
      .forEach(function (link) {
        var currentName = normalizeSpaces(link.textContent)
        var storedOriginalName = link.getAttribute('data-cart-name-original')
        var storedNextName = storedOriginalName ? getDedupedProductName(storedOriginalName) : ''
        var originalName = storedOriginalName && currentName === storedNextName ? storedOriginalName : currentName
        var nextName = getDedupedProductName(originalName)

        if (!nextName || nextName === currentName) return

        link.setAttribute('data-cart-name-original', originalName)
        link.setAttribute('data-cart-name-normalized', 'true')
        link.setAttribute('title', nextName)
        link.textContent = nextName
      })
  }

  function getRowListPrice(row) {
    var priceCell = row.querySelector('td.product-price')

    if (!priceCell) return ''

    var listPriceElement =
      priceCell.querySelector('.list-price') ||
      priceCell.querySelector('.old-product-price') ||
      priceCell.querySelector('[class*="list-price"]') ||
      priceCell.querySelector('[class*="old-product-price"]')

    var quantityPriceCell = row.querySelector('td.quantity-price')
    var finalPriceElement = quantityPriceCell && quantityPriceCell.querySelector('span:not(.cart-mobile-list-price)')
    var listPrice = getCurrencyText(listPriceElement ? listPriceElement.textContent : priceCell.textContent)
    var finalPrice = getCurrencyText(finalPriceElement ? finalPriceElement.textContent : '')

    return listPrice && listPrice !== finalPrice ? listPrice : ''
  }

  function syncMobileListPrices() {
    document
      .querySelectorAll(CART_ROW_SELECTOR)
      .forEach(function (row) {
        var quantityPriceCell = row.querySelector('td.quantity-price')
        var existingPrice = quantityPriceCell && quantityPriceCell.querySelector('.cart-mobile-list-price')
        var listPrice = getRowListPrice(row)

        if (!quantityPriceCell) return

        if (!listPrice) {
          if (existingPrice) existingPrice.remove()
          return
        }

        if (!existingPrice) {
          existingPrice = document.createElement('span')
          existingPrice.className = 'cart-mobile-list-price'
          quantityPriceCell.insertBefore(existingPrice, quantityPriceCell.firstChild)
        }

        existingPrice.textContent = listPrice
      })
  }

  function upgradeCartItems() {
    upgradeAllCartImages()
    normalizeDuplicatedProductNames()
    syncMobileListPrices()
  }

  function scheduleUpgrade() {
    if (scheduled) return

    scheduled = true
    requestAnimationFrame(function () {
      scheduled = false
      upgradeCartItems()
    })
  }

  function startCartImageObserver() {
    if (observer) return

    observer = new MutationObserver(function (mutations) {
      var shouldUpgrade = mutations.some(function (mutation) {
        if (mutation.type === 'attributes') {
          return mutation.target && mutation.target.matches && mutation.target.matches('table.cart-items img[id^="product-image-"]')
        }

        if (mutation.type === 'characterData') {
          var parent = mutation.target && mutation.target.parentElement

          return !!(parent && parent.closest && parent.closest(CART_ROW_SELECTOR))
        }

        if (mutation.type !== 'childList') return false

        return Array.prototype.some.call(mutation.addedNodes, function (node) {
          if (!node || node.nodeType !== 1) return false
          if (node.matches && node.matches('table.cart-items img[id^="product-image-"]')) return true
          if (node.matches && node.matches(CART_ROW_SELECTOR)) return true
          if (node.matches && node.matches(CART_PRODUCT_NAME_SELECTOR)) return true

          return !!(
            node.querySelector &&
            node.querySelector(
              'table.cart-items img[id^="product-image-"], ' + CART_ROW_SELECTOR + ', ' + CART_PRODUCT_NAME_SELECTOR
            )
          )
        })
      })

      if (shouldUpgrade) scheduleUpgrade()
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['src', 'data-src', 'srcset'],
    })
  }

  $(function () {
    scheduleUpgrade()
    startCartImageObserver()
  })

  $(window)
    .off('orderFormUpdated.vtex.cartImageQuality hashchange.cartImageQuality')
    .on('orderFormUpdated.vtex.cartImageQuality hashchange.cartImageQuality', scheduleUpgrade)
})()

// Customização Exibição CPF E PJ CHECKOUT
;(function () {

  var toggleLock = false
  var clientTypeScrollDone = false // garante que só rolamos uma vez no mobile

  function injectStyles() {
    if (document.querySelector('#nrz-client-type-style')) return

    var style = document.createElement('style')
    style.id = 'nrz-client-type-style'
    style.innerHTML = `
      .nrz-client-type-wrap {
        margin: 12px 0 16px;
      }
      .nrz-client-type-helper {
        font-size: 14px;
        line-height: 1.4;
        color: #555555;
        margin: 0 0 12px;
      }
      .nrz-client-type-options {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .nrz-client-type-option {
        display: flex;
        align-items: center;
        cursor: pointer;
        font-size: 14px;
        color: #333333;
      }
      .nrz-client-type-option input {
        display: none;
      }
      .nrz-client-type-radio {
        width: 14px;
        height: 14px;
        border-radius: 3px;
        border: 2px solid #FA0209;
        box-sizing: border-box;
        margin-right: 8px;
      }
      .nrz-client-type-option input:checked + .nrz-client-type-radio {
        background-color: #FA0209;
      }
      .nrz-client-type-label {
        user-select: none;
      }
      /* esconde visualmente o link padrão PF/PJ sem quebrar o Knockout */
      .nrz-hide-pf-pj-toggle {
        position: absolute !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }
    `
    document.head.appendChild(style)
  }

  function waitForClientProfile() {
    var box = document.querySelector('#client-profile-data .box-client-info')
    if (!box) {
      setTimeout(waitForClientProfile, 300)
      return
    }
    initClientTypeToggle(box)
  }

  // faz o scroll automático das flags no mobile
  function scrollClientTypeIntoViewIfMobile() {
    // só roda uma vez + só mobile
    if (clientTypeScrollDone) return
    if (window.innerWidth > 768) return

    var wrapper = document.querySelector('#client-profile-data .nrz-client-type-wrap')
    if (!wrapper) return

    var rect = wrapper.getBoundingClientRect()
    var headerOffset = 80 // ajusta se tiver header fixo maior/menor

    var targetY = rect.top + window.pageYOffset - headerOffset

    window.scrollTo({
      top: targetY,
      behavior: 'smooth'
    })

    clientTypeScrollDone = true
  }

  function initClientTypeToggle(container) {
    injectStyles()

    // links nativos PF -> PJ e PJ -> PF
    var pfToPjLink = container.querySelector('#is-corporate-client')
    var pjToPfLink = container.querySelector('#not-corporate-client')

    // esconde a linha original dos links, mas deixa no DOM
    var pfPjLi = container.querySelector('li.pf-pj')
    if (pfPjLi && !pfPjLi.classList.contains('nrz-hide-pf-pj-toggle')) {
      pfPjLi.classList.add('nrz-hide-pf-pj-toggle')
    }

    // cria o bloco de PF/PJ se ainda não existir
    var wrapper = container.querySelector('.nrz-client-type-wrap')
    if (!wrapper) {
      wrapper = document.createElement('div')
      wrapper.className = 'nrz-client-type-wrap'
      wrapper.innerHTML = `
        <p class="nrz-client-type-helper">
          Selecione o tipo de pessoa para continuar:
        </p>
        <div class="nrz-client-type-options">
          <label class="nrz-client-type-option">
            <input type="radio" name="nrzClientType" value="pf">
            <span class="nrz-client-type-radio"></span>
            <span class="nrz-client-type-label">Pessoa Física (CPF)</span>
          </label>
          <label class="nrz-client-type-option">
            <input type="radio" name="nrzClientType" value="pj">
            <span class="nrz-client-type-radio"></span>
            <span class="nrz-client-type-label">Pessoa Jurídica (CNPJ)</span>
          </label>
        </div>
      `
      var row = container.querySelector('.row-fluid')
      if (row && row.parentNode) {
        row.parentNode.insertBefore(wrapper, row)
      } else {
        container.insertBefore(wrapper, container.firstChild)
      }
    }

    var pfRadio = wrapper.querySelector('input[value="pf"]')
    var pjRadio = wrapper.querySelector('input[value="pj"]')

    if (!pfRadio || !pjRadio) return

    // lê do DOM se PJ está ativo (corporate-info-box visível)
    function isCorporateNow() {
      var corporateBox = container.querySelector('.corporate-info-box')
      if (!corporateBox) return false
      var display = window.getComputedStyle(corporateBox).display
      return display !== 'none'
    }

    // mantém rádio em sincronia com o estado real do formulário
    function syncRadios() {
      var corp = isCorporateNow()
      pfRadio.checked = !corp
      pjRadio.checked = corp
    }

    /**
     * Espera o DOM chegar no estado desejado (PF ou PJ)
     * e, se a primeira tentativa "não pegar", tenta clicar de novo
     * automaticamente (máx. 2 tentativas).
     */
    function waitForCorporate(targetCorp, linkEl, callback, retries, attempt, stableHits) {
      if (typeof retries === 'undefined') retries = 15  // 15 tentativas
      if (typeof attempt === 'undefined') attempt = 1   // primeira tentativa
      if (typeof stableHits === 'undefined') stableHits = 0

      if (retries <= 0) {
        // Se ainda não chegou no estado desejado, tenta mais uma vez
        if (isCorporateNow() !== targetCorp && attempt < 2 && linkEl) {
          // nova tentativa de clique no link nativo
          linkEl.click()

          // recomeça o polling para a segunda tentativa
          waitForCorporate(targetCorp, linkEl, callback, 15, attempt + 1, 0)
          return
        }

        // Se já está no estado desejado ou já tentamos 2 vezes, finaliza
        callback()
        return
      }

      if (isCorporateNow() === targetCorp) {
        stableHits += 1
      } else {
        stableHits = 0
      }

      // aguarda alguns ciclos estáveis para evitar falso positivo (abre/fecha instantâneo)
      if (stableHits >= 3) {
        callback()
      } else {
        setTimeout(function () {
          waitForCorporate(targetCorp, linkEl, callback, retries - 1, attempt, stableHits)
        }, 150)
      }
    }

    function setType(type) {
      if (toggleLock) return

      var targetCorp = type === 'pj'
      var isCorp = isCorporateNow()

      // se já está no estado certo, só sincroniza e sai
      if (targetCorp === isCorp) {
        syncRadios()
        return
      }

      toggleLock = true

      if (targetCorp) {
        // quero PJ
        if (pfToPjLink) {
          pfToPjLink.click()
          waitForCorporate(true, pfToPjLink, function () {
            toggleLock = false
            syncRadios()
          })
        } else {
          toggleLock = false
          syncRadios()
        }
      } else {
        // quero PF
        if (pjToPfLink) {
          pjToPfLink.click()
          waitForCorporate(false, pjToPfLink, function () {
            toggleLock = false
            syncRadios()
          })
        } else {
          toggleLock = false
          syncRadios()
        }
      }
    }

    // usa propriedades diretas para evitar acúmulo de listeners.
    // `onclick` permite tentar novamente no mesmo tipo sem precisar alternar PF/PJ.
    pfRadio.onclick = function () {
      setType('pf')
    }
    pjRadio.onclick = function () {
      setType('pj')
    }
    pfRadio.onchange = function () {
      if (pfRadio.checked) setType('pf')
    }
    pjRadio.onchange = function () {
      if (pjRadio.checked) setType('pj')
    }

    // garante que o estado inicial dos rádios bate com o DOM
    syncRadios()

    // dá um tempinho para a VTEX fazer o scroll padrão e depois ajusta no mobile
    setTimeout(scrollClientTypeIntoViewIfMobile, 600)
  }

  // primeira carga
  waitForClientProfile()

  // quando volta para "Dados pessoais" pela hash
  window.addEventListener('hashchange', function () {
    if (location.hash.indexOf('profile') !== -1) {
      setTimeout(waitForClientProfile, 800)
    }
  })
})()

//alterar a url do botão carrinho
;(function () {
  var SELECTOR = '#cart-to-orderform'
  var NEW_HREF = '#/profile/#client-profile-data'
  var MAX_WIDTH = 991

  function isMobile() {
    return window.matchMedia
      ? window.matchMedia('(max-width: ' + MAX_WIDTH + 'px)').matches
      : window.innerWidth <= MAX_WIDTH
  }

  function updateHref() {
    if (!isMobile()) return

    var el = document.querySelector(SELECTOR)
    if (!el) return

    if (el.getAttribute('href') !== NEW_HREF) {
      el.setAttribute('href', NEW_HREF)
    }
  }

  updateHref()

  var obs = new MutationObserver(function () {
    updateHref()
  })
  obs.observe(document.documentElement, { childList: true, subtree: true })

  window.addEventListener('resize', updateHref)
})()

//Scroll para pular
;(function () {
  function isMobile() {
    return window.matchMedia('(max-width: 991px)').matches
  }

  let alreadyFixed = false

  function fixProfileScrollMobile() {
    if (!isMobile()) return
    if (alreadyFixed) return
    if (location.hash.indexOf('profile') === -1) return

    const target = document.querySelector('#client-profile-data')
    if (!target) return

    alreadyFixed = true

    // Remove foco imediatamente
    document.activeElement && document.activeElement.blur()

    // Scroll direto (sem smooth)
    window.scrollTo(0, target.offsetTop)

    // Segurança: remove focus novamente após render final
    setTimeout(function () {
      document.activeElement && document.activeElement.blur()
      window.scrollTo(0, target.offsetTop)
    }, 300)
  }

  // Reset ao sair do profile (voltar carrinho)
  $(window).on('hashchange', function () {
    if (location.hash.indexOf('profile') === -1) {
      alreadyFixed = false
    } else {
      setTimeout(fixProfileScrollMobile, 200)
    }
  })

  // Login / reload / update
  $(window).on('orderFormUpdated.vtex', function () {
    fixProfileScrollMobile()
  })
})()

//Forçar newsletter
;(function () {
  function aplicarPadraoNewsletter() {
    const $cb = $('#opt-in-newsletter');
    if (!$cb.length) return;

    // Se não estiver marcado, simula o clique REAL (geralmente é no label/wrapper)
    if (!$cb.prop('checked')) {
      // 1) Preferência: clicar no label associado (é o que o usuário clica na UI)
      const $label = $('label[for="opt-in-newsletter"]');

      if ($label.length) {
        $label.get(0).click();
        return;
      }

      // 2) Fallback: clicar no "container" mais próximo (caso não use for="")
      const $wrapper = $cb.closest('label, .checkbox, .vtex-omnishipping-1-x-checkbox, .newsletter, .client-newsletter');
      if ($wrapper.length) {
        $wrapper.get(0).click();
        return;
      }

      // 3) Último fallback: clicar no próprio input
      $cb.get(0).click();
    }
  }

  // Tenta no ready
  $(aplicarPadraoNewsletter);

  // Checkout VTEX costuma re-renderizar: reaplica quando orderForm atualiza
  $(window).on('orderFormUpdated.vtex', aplicarPadraoNewsletter);

  // Fallback: caso o nó seja injetado depois
  const obs = new MutationObserver(aplicarPadraoNewsletter);
  obs.observe(document.body, { childList: true, subtree: true });
})()

;(function initScrollOnPaymentError() {
  const BTN_SEL = '#payment-data-submit';
  const ROOT_SEL = '#payment-data';
  const HEADER_OFFSET = 80; // ajuste se tiver header fixo

  let userTriedToSubmit = false;
  let lastScrollAt = 0;

  function scrollToPaymentIssue({ behavior = 'smooth' } = {}) {
    const root = document.querySelector(ROOT_SEL);
    if (!root) return;

    // Primeiro erro fora do iframe
    const errorField =
      root.querySelector('.error input:not([type="hidden"]), input.error:not([type="hidden"])') ||
      root.querySelector('.error select, select.error') ||
      root.querySelector('.error textarea, textarea.error') ||
      root.querySelector('[aria-invalid="true"]');

    // Topo do iframe/placeholder do cartão (fallback)
    const iframeBox =
      root.querySelector('#iframe-placeholder-creditCardPaymentGroup') ||
      root.querySelector('.box-payment-option.active') ||
      root.querySelector('.box-payment-option');

    const target = errorField || iframeBox || root;

    const top = target.getBoundingClientRect().top + window.pageYOffset - HEADER_OFFSET;
    window.scrollTo({ top: Math.max(0, top), behavior });

    // Foco só se for campo normal (fora do iframe)
    if (errorField) {
      setTimeout(() => {
        try { errorField.focus({ preventScroll: true }); }
        catch { errorField.focus(); }
      }, 250);
    }
  }

  function hasVisiblePaymentErrorUI() {
    const root = document.querySelector(ROOT_SEL);
    if (!root) return false;

    // Alerta de validação da VTEX (quando aparece)
    const alert = root.querySelector('.payment-alert-error');
    const alertVisible = !!alert && alert.offsetParent !== null;

    // Campos com erro fora do iframe
    const anyError = !!root.querySelector('.error, [aria-invalid="true"]');

    return alertVisible || anyError;
  }

  function maybeScrollAfterError() {
    // evita loops
    const now = Date.now();
    if (now - lastScrollAt < 900) return;

    // só scrolla se o usuário acabou de tentar finalizar
    if (!userTriedToSubmit) return;

    // dá um tempinho pra UI aplicar classes/mostrar mensagens
    setTimeout(() => {
      if (hasVisiblePaymentErrorUI()) {
        lastScrollAt = Date.now();
        scrollToPaymentIssue();
      } else {
        // Se o erro for dentro do iframe (cartão), pode não haver .error fora.
        // Nesse caso, ainda assim levar o usuário pro topo do iframe ajuda.
        lastScrollAt = Date.now();
        scrollToPaymentIssue();
      }
      userTriedToSubmit = false;
    }, 50);
  }

  function bind() {
    const btn = document.querySelector(BTN_SEL);
    if (!btn) return false;

    // Marca que o usuário tentou finalizar (click/tap)
    btn.addEventListener('click', () => {
      userTriedToSubmit = true;
    }, true);

    // Observa mudanças no atributo disabled
    const obs = new MutationObserver(() => {
      // Cenário de erro: VTEX desabilita durante o submit e depois reabilita
      const isDisabled = btn.hasAttribute('disabled');
      if (!isDisabled) {
        maybeScrollAfterError();
      }
    });

    obs.observe(btn, { attributes: true, attributeFilter: ['disabled', 'class'] });

    return true;
  }

  // O checkout às vezes recria o botão; então tentamos algumas vezes
  let tries = 0;
  const t = setInterval(() => {
    tries += 1;
    if (bind() || tries > 40) clearInterval(t);
  }, 250);
})()

// Oculta Pix quando houver produto com peso variavel no carrinho
;(function initHidePixForVariableWeightProducts() {
  return

  var VARIABLE_WEIGHT_SPEC_NAME = 'Produto Pesável?'
  var PIX_GROUP_ID = 'payment-group-instantPaymentPaymentGroup'
  var PIX_HIDDEN_CLASS = 'nrz-hide-pix-payment'
  var productCache = {}
  var lastSignature = ''
  var lastShouldHidePix = null
  var requestToken = 0
  var scheduled = false
  var scheduledOrderForm = null
  var observer = null

  function normalizeText(value) {
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase()
  }

  function isTrueValue(value) {
    var normalized = normalizeText(Array.isArray(value) ? value[0] : value)

    return normalized === 'true' || normalized === 'sim' || normalized === 'yes' || normalized === '1'
  }

  function getSpecificationValue(product, specificationName) {
    var targetName = normalizeText(specificationName)

    if (!product) return undefined

    var directKey = Object.keys(product).find(function (key) {
      return normalizeText(key) === targetName
    })

    if (directKey) {
      var directValue = product[directKey]

      return Array.isArray(directValue) ? directValue[0] : directValue
    }

    var properties = product.properties || product.productSpecifications || product.specifications || []
    var property = properties.find(function (item) {
      return normalizeText(item && item.name) === targetName
    })

    if (property) {
      var propertyValue = property.values || property.value || property.Values || property.Value

      return Array.isArray(propertyValue) ? propertyValue[0] : propertyValue
    }

    var groups = product.specificationGroups || []
    var groupSpecification

    groups.some(function (group) {
      var specs = group && group.specifications ? group.specifications : []

      groupSpecification = specs.find(function (item) {
        return normalizeText(item && item.name) === targetName
      })

      return !!groupSpecification
    })

    if (groupSpecification) {
      var groupValue = groupSpecification.values || groupSpecification.value || groupSpecification.Values || groupSpecification.Value

      return Array.isArray(groupValue) ? groupValue[0] : groupValue
    }

    return undefined
  }

  function isVariableWeightProduct(product) {
    return isTrueValue(getSpecificationValue(product, VARIABLE_WEIGHT_SPEC_NAME))
  }

  function isVariableWeightItem(item) {
    if (!item) return false

    return (
      isVariableWeightProduct(item) ||
      isVariableWeightProduct(item.additionalInfo) ||
      isVariableWeightProduct(item.product) ||
      isVariableWeightProduct(item.itemMetadata)
    )
  }

  function getProductId(item) {
    return String((item && item.productId) || '').trim()
  }

  function getCartSignature(orderForm) {
    return (orderForm && orderForm.items ? orderForm.items : [])
      .map(function (item) {
        return [
          item.uniqueId || '',
          item.id || '',
          item.productId || '',
          item.quantity || 0,
        ].join(':')
      })
      .join('|')
  }

  function fetchProduct(productId) {
    if (!productId) return Promise.resolve(null)

    if (productCache[productId]) return productCache[productId]

    productCache[productId] = fetch('/api/catalog_system/pub/products/search/?fq=productId:' + encodeURIComponent(productId) + '&_from=0&_to=0', {
      credentials: 'same-origin',
    })
      .then(function (response) {
        if (!response.ok) return null

        return response.json()
      })
      .then(function (products) {
        return products && products[0] ? products[0] : null
      })
      .catch(function () {
        return null
      })

    return productCache[productId]
  }

  function orderFormHasVariableWeightProduct(orderForm) {
    var items = orderForm && orderForm.items ? orderForm.items : []

    if (!items.length) return Promise.resolve(false)

    if (items.some(isVariableWeightItem)) return Promise.resolve(true)

    var productIds = items
      .map(getProductId)
      .filter(function (productId, index, list) {
        return productId && list.indexOf(productId) === index
      })

    if (!productIds.length) return Promise.resolve(false)

    return Promise.all(productIds.map(fetchProduct)).then(function (products) {
      return products.some(isVariableWeightProduct)
    })
  }

  function getPixElements() {
    var selectors = [
      '#' + PIX_GROUP_ID,
      '[data-name="Pix"]',
      '[data-name="PIX"]',
      '.payment-group-item[href="#/payment/' + PIX_GROUP_ID.replace('payment-group-', '') + '"]',
      '.payment-group-item[data-payment-group="' + PIX_GROUP_ID.replace('payment-group-', '') + '"]',
    ]
    var elements = []

    selectors.forEach(function (selector) {
      Array.prototype.forEach.call(document.querySelectorAll(selector), function (element) {
        if (elements.indexOf(element) === -1) elements.push(element)
      })
    })

    return elements.filter(function (element) {
      var text = normalizeText(element.textContent)
      var id = normalizeText(element.id)

      return id.indexOf('instantpayment') !== -1 || text === 'pix' || text.indexOf('pix') !== -1
    })
  }

  function injectStyle() {
    if (document.querySelector('#nrz-hide-pix-payment-style')) return

    var style = document.createElement('style')
    style.id = 'nrz-hide-pix-payment-style'
    style.textContent = '.' + PIX_HIDDEN_CLASS + '{display:none!important;}'
    document.head.appendChild(style)
  }

  function isVisible(element) {
    return !!(element && element.offsetParent !== null && window.getComputedStyle(element).display !== 'none')
  }

  function selectAlternativePayment() {
    var pixElements = getPixElements()
    var selectedPix = pixElements.find(function (element) {
      return element.classList.contains('active') ||
        element.classList.contains('payment-group-item-active') ||
        element.getAttribute('aria-selected') === 'true'
    })

    if (!selectedPix) return

    var alternatives = Array.prototype.slice.call(document.querySelectorAll('.payment-group-item')).filter(function (element) {
      return pixElements.indexOf(element) === -1 && isVisible(element) && !element.classList.contains(PIX_HIDDEN_CLASS)
    })

    if (alternatives[0]) alternatives[0].click()
  }

  function applyPixVisibility(shouldHidePix) {
    injectStyle()

    getPixElements().forEach(function (element) {
      element.classList.toggle(PIX_HIDDEN_CLASS, shouldHidePix)
      element.setAttribute('aria-hidden', shouldHidePix ? 'true' : 'false')
    })

    if (shouldHidePix) {
      selectAlternativePayment()
    }
  }

  function getOrderFormFromVtex() {
    if (window.vtexjs && window.vtexjs.checkout && window.vtexjs.checkout.getOrderForm) {
      return window.vtexjs.checkout.getOrderForm()
    }

    return null
  }

  function evaluate(orderForm) {
    var currentToken = ++requestToken

    if (!orderForm) {
      var promise = getOrderFormFromVtex()

      if (promise && promise.done) {
        promise.done(evaluate)
      }

      return
    }

    var signature = getCartSignature(orderForm)

    if (signature === lastSignature && lastShouldHidePix !== null) {
      applyPixVisibility(lastShouldHidePix)
      return
    }

    lastSignature = signature

    orderFormHasVariableWeightProduct(orderForm).then(function (shouldHidePix) {
      if (currentToken !== requestToken) return

      lastShouldHidePix = shouldHidePix
      applyPixVisibility(shouldHidePix)
    })
  }

  function schedule(orderForm) {
    if (orderForm) scheduledOrderForm = orderForm
    if (scheduled) return

    scheduled = true
    setTimeout(function () {
      var nextOrderForm = scheduledOrderForm

      scheduledOrderForm = null
      scheduled = false
      evaluate(nextOrderForm)
    }, 150)
  }

  function startObserver() {
    if (observer || !document.body) return

    observer = new MutationObserver(function (mutations) {
      var shouldRun = mutations.some(function (mutation) {
        if (mutation.type !== 'childList') return false

        return Array.prototype.some.call(mutation.addedNodes, function (node) {
          if (!node || node.nodeType !== 1) return false

          return !!(
            (node.matches && node.matches('#payment-data, .payment-group, .payment-group-item, #' + PIX_GROUP_ID)) ||
            (node.querySelector && node.querySelector('#payment-data, .payment-group, .payment-group-item, #' + PIX_GROUP_ID))
          )
        })
      })

      if (shouldRun) schedule()
    })

    observer.observe(document.body, { childList: true, subtree: true })
  }

  $(function () {
    schedule()
    startObserver()
  })

  $(window)
    .off('orderFormUpdated.vtex.hidePixForVariableWeight hashchange.hidePixForVariableWeight')
    .on('orderFormUpdated.vtex.hidePixForVariableWeight', function (_, orderForm) {
      schedule(orderForm)
    })
    .on('hashchange.hidePixForVariableWeight', function () {
      schedule()
    })
})()
