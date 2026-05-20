import { useEffect } from 'react'

const PDP_REVIEWS_SELECTOR = '[class*="flexRow--reviews-pdp"]'
const AVERAGE_SELECTOR = '[class*="vtex-reviews-and-ratings-3-x-reviewsRatingAverage"]'
const COUNT_SELECTOR = '[class*="vtex-reviews-and-ratings-3-x-reviewsRatingCount"]'
const CLONE_FLAG = 'data-cleaner-clone'
const HIDDEN_FLAG = 'data-cleaner-hidden'

const firstNumber = (text) => {
  const match = String(text || '').match(/\d+(?:[.,]\d+)?/)

  return match ? match[0] : ''
}

const ensureClone = (original) => {
  const sibling = original.nextElementSibling

  if (sibling && sibling.getAttribute(CLONE_FLAG) === 'true') return sibling

  const clone = document.createElement('span')

  clone.setAttribute(CLONE_FLAG, 'true')
  clone.className = original.className
  original.parentNode.insertBefore(clone, original.nextSibling)

  return clone
}

const hideOriginal = (original) => {
  if (original.getAttribute(HIDDEN_FLAG) === 'true') return

  original.setAttribute(HIDDEN_FLAG, 'true')
  original.style.display = 'none'
}

const syncText = (original, transform) => {
  if (!original) return

  hideOriginal(original)

  const clone = ensureClone(original)
  const next = transform(original.textContent)

  if (next && clone.textContent !== next) clone.textContent = next
}

const normalizeSummary = (container) => {
  syncText(container.querySelector(AVERAGE_SELECTOR), (text) =>
    firstNumber(text).replace('.', ',')
  )

  syncText(container.querySelector(COUNT_SELECTOR), (text) => {
    const n = firstNumber(text)

    return n ? `(${n})` : ''
  })
}

const ReviewsSummaryCleaner = () => {
  useEffect(() => {
    let observer
    let rafId

    const attach = () => {
      const container = document.querySelector(PDP_REVIEWS_SELECTOR)

      if (!container) {
        rafId = window.requestAnimationFrame(attach)
        return
      }

      normalizeSummary(container)

      observer = new MutationObserver(() => normalizeSummary(container))
      observer.observe(container, {
        childList: true,
        subtree: true,
        characterData: true,
      })
    }

    attach()

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      if (observer) observer.disconnect()
    }
  }, [])

  return null
}

export default ReviewsSummaryCleaner
