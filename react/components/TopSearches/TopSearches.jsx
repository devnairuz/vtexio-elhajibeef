import { useEffect, useRef, useState } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import styles from './topSearches.css'

const CSS_HANDLES = [
  'topSearchesRoot',
  'topSearchesSearch',
  'topSearchesContainer',
  'topSearchesTitle',
  'topSearchesList',
  'topSearchesItem',
  'topSearchesIndex',
  'topSearchesLink',
]

const searchInputSelector =
  'input.vtex-styleguide-9-x-input, input[class*="searchBar"], input[placeholder*="procura"], input[placeholder*="busca"]'

const TopSearches = ({ children, title = 'Produtos mais procurados', items = [] }) => {
  useCssHandles(CSS_HANDLES)

  const containerRef = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const wrapper = containerRef.current

    if (!wrapper) return undefined

    const updateVisibility = (searchInput) => {
      const value = searchInput.value || ''
      setVisible(value.trim() === '')
    }

    const isCurrentSearchInput = (target) => {
      const isSearchInput = target?.matches?.(searchInputSelector)

      if (!isSearchInput) return false

      return wrapper.contains(target)
    }

    const handleOpen = () => {
      const searchInput = wrapper.querySelector(searchInputSelector)
      const value = searchInput?.value || ''

      setVisible(value.trim() === '')
    }

    const handleFocus = (event) => {
      if (!isCurrentSearchInput(event.target)) return

      updateVisibility(event.target)
    }

    const handleInput = (event) => {
      if (!isCurrentSearchInput(event.target)) return

      updateVisibility(event.target)
    }

    const handleDocumentClick = (event) => {
      if (wrapper.contains(event.target)) return

      setVisible(false)
    }

    wrapper.addEventListener('click', handleOpen)
    wrapper.addEventListener('touchend', handleOpen)
    wrapper.addEventListener('focusin', handleOpen)
    document.addEventListener('focusin', handleFocus)
    document.addEventListener('input', handleInput)
    document.addEventListener('mousedown', handleDocumentClick)

    return () => {
      wrapper.removeEventListener('click', handleOpen)
      wrapper.removeEventListener('touchend', handleOpen)
      wrapper.removeEventListener('focusin', handleOpen)
      document.removeEventListener('focusin', handleFocus)
      document.removeEventListener('input', handleInput)
      document.removeEventListener('mousedown', handleDocumentClick)
    }
  }, [])

  if (!items?.length) return null

  return (
    <div className={styles.topSearchesRoot} ref={containerRef}>
      <div className={styles.topSearchesSearch}>{children}</div>

      {visible && (
        <div className={styles.topSearchesContainer}>
          <p className={styles.topSearchesTitle}>{title}</p>
          <ul className={styles.topSearchesList}>
            {items.map((item, index) => (
              <li key={`${item.label}-${index}`} className={styles.topSearchesItem}>
                <span className={styles.topSearchesIndex}>{index + 1}</span>
                <a href={item.link} className={styles.topSearchesLink}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

TopSearches.schema = {
  title: 'Buscas mais procuradas',
  type: 'object',
  properties: {
    title: {
      title: 'Titulo',
      type: 'string',
      default: 'Produtos mais procurados',
    },
    items: {
      title: 'Itens',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          label: {
            title: 'Texto',
            type: 'string',
          },
          link: {
            title: 'Link',
            type: 'string',
          },
        },
      },
    },
  },
}

export default TopSearches
