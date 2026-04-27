import React, { useEffect, useRef, useState } from 'react'
import styles from './searchSuggestions.css'

const DEFAULT_ITEMS = [
  { label: 'Picanha', href: '/picanha' },
  { label: 'Hamburguer', href: '/hamburguer' },
  { label: 'Ancho', href: '/ancho' },
  { label: 'Contra Filé', href: '/contra-file' },
  { label: 'Costela', href: '/costela' },
]

const SearchSuggestions = ({
  children,
  title = 'Produtos mais procurados',
  items = DEFAULT_ITEMS,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef(null)

  useEffect(() => {
    const wrapper = wrapperRef.current

    if (!wrapper) return

    const handleOpen = () => {
      setIsOpen(true)
    }

    const handleClickOutside = event => {
      if (wrapper.contains(event.target)) return

      setIsOpen(false)
    }

    const handleKeyDown = event => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    wrapper.addEventListener('click', handleOpen)
    wrapper.addEventListener('touchend', handleOpen)
    wrapper.addEventListener('focusin', handleOpen)

    document.addEventListener('click', handleClickOutside)
    document.addEventListener('touchend', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      wrapper.removeEventListener('click', handleOpen)
      wrapper.removeEventListener('touchend', handleOpen)
      wrapper.removeEventListener('focusin', handleOpen)

      document.removeEventListener('click', handleClickOutside)
      document.removeEventListener('touchend', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const suggestions = items?.length ? items : DEFAULT_ITEMS

  return (
    <div className={styles.container} ref={wrapperRef}>
      <div className={styles.search}>{children}</div>

      {isOpen && (
        <div className={styles.panel}>
          <p className={styles.title}>{title}</p>

          <ol className={styles.list}>
            {suggestions.map((item, index) => (
              <li className={styles.item} key={`${item.label}-${index}`}>
                <a
                  className={styles.link}
                  href={item.href || '/'}
                  onClick={() => setIsOpen(false)}
                >
                  <span className={styles.index}>{index + 1}</span>
                  <span className={styles.label}>{item.label}</span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}

SearchSuggestions.schema = {
  title: 'Sugestões da busca',
  description:
    'Lista exibida abaixo da barra de busca quando o cliente clica no campo.',
  type: 'object',
  properties: {
    title: {
      title: 'Título do painel',
      description: 'Exemplo: Produtos mais procurados.',
      type: 'string',
      default: 'Produtos mais procurados',
    },
    items: {
      title: 'Produtos sugeridos',
      description: 'Links exibidos abaixo da busca.',
      type: 'array',
      minItems: 1,
      __editorItemTitle: 'label',
      items: {
        title: 'Produto sugerido',
        type: 'object',
        properties: {
          label: {
            title: 'Nome do produto',
            type: 'string',
          },
          href: {
            title: 'Link de destino',
            type: 'string',
          },
        },
      },
      default: DEFAULT_ITEMS,
    },
  },
}

export default SearchSuggestions