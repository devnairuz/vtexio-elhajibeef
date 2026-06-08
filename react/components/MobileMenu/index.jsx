import React, { useCallback, useEffect, useState } from 'react'

import styles from './mobileMenu.css'

const toCategoryUrl = category => {
  const rawUrl = String(category?.url || category?.href || '').trim()

  if (!rawUrl) return '#'

  try {
    const baseUrl =
      typeof window !== 'undefined' ? window.location.origin : 'https://localhost'
    const parsedUrl = new URL(rawUrl, baseUrl)

    return `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}` || '#'
  } catch (error) {
    return rawUrl.charAt(0) === '/' ? rawUrl : `/${rawUrl}`
  }
}

const ACCOUNT_LINKS = [
  {
    key: 'minha-conta',
    label: 'Minha Conta',
    url: '/account',
    iconClass: 'iconPerson',
  },
  {
    key: 'meus-pedidos',
    label: 'Meus Pedidos',
    url: '/account#/orders',
    iconClass: 'iconPackage',
  },
  {
    key: 'meus-favoritos',
    label: 'Meus Favoritos',
    url: '/wishlist',
    iconClass: 'iconHeart',
  },
]

const MobileMenu = ({ allCategoriesLabel, allCategoriesUrl }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [categories, setCategories] = useState([])
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    let isMounted = true

    fetch('/api/catalog_system/pub/category/tree/3')
      .then(response => (response.ok ? response.json() : []))
      .then(data => {
        if (!isMounted) return
        setCategories(Array.isArray(data) ? data : [])
      })
      .catch(() => {
        if (isMounted) setCategories([])
      })

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (typeof document === 'undefined') return undefined

    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleOpen = useCallback(() => setIsOpen(true), [])
  const handleClose = useCallback(() => {
    setIsOpen(false)
    setExpandedId(null)
  }, [])

  const toggleExpanded = useCallback(id => {
    setExpandedId(current => (current === id ? null : id))
  }, [])

  const menuItems = categories
    .filter(category => category?.name)
    .map(category => ({
      id: category.id,
      label: category.name,
      url: toCategoryUrl(category),
      children: (category.children || [])
        .filter(child => child?.name)
        .map(child => ({
          id: child.id,
          label: child.name,
          url: toCategoryUrl(child),
          children: (child.children || [])
            .filter(grand => grand?.name)
            .map(grand => ({
              id: grand.id,
              label: grand.name,
              url: toCategoryUrl(grand),
            })),
        })),
    }))

  return (
    <div className={styles.root}>
      <button
        type="button"
        className={styles.trigger}
        aria-label="Abrir menu"
        onClick={handleOpen}
      >
        <span className={styles.triggerIcon} aria-hidden="true" />
      </button>

      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`}
        onClick={handleClose}
        aria-hidden={!isOpen}
      />

      <aside
        className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ''}`}
        aria-hidden={!isOpen}
      >
        <div className={styles.headerMenuMob}>
          <button
            type="button"
            className={styles.closeButton}
            aria-label="Fechar menu"
            onClick={handleClose}
          >
            <span className={styles.closeIcon} aria-hidden="true" />
          </button>
        </div>

        <nav className={styles.body} aria-label="Menu mobile">
          <ul className={styles.categoryList}>
            {menuItems.map(item => {
              const isExpanded = expandedId === item.id
              const hasChildren = item.children.length > 0

              return (
                <li key={item.id} className={styles.categoryItem}>
                  {hasChildren ? (
                    <button
                      type="button"
                      className={`${styles.categoryToggle} ${
                        isExpanded ? styles.categoryToggleOpen : ''
                      }`}
                      aria-expanded={isExpanded}
                      onClick={() => toggleExpanded(item.id)}
                    >
                      <span className={styles.categoryToggleLabel}>
                        {item.label}
                      </span>
                      <span className={styles.categoryChevron} aria-hidden="true" />
                    </button>
                  ) : (
                    <a href={item.url} className={styles.categoryLink}>
                      {item.label}
                    </a>
                  )}

                  {isExpanded && hasChildren && (
                    <ul className={styles.subList}>
                      <li className={styles.subItem}>
                        <a href={item.url} className={styles.subLinkAll}>
                          Ver todos
                        </a>
                      </li>
                      {item.children.map(child => (
                        <li key={child.id} className={styles.subItem}>
                          <a href={child.url} className={styles.subLink}>
                            {child.label}
                          </a>
                          {child.children.length > 0 && (
                            <ul className={styles.subSubList}>
                              {child.children.map(grand => (
                                <li
                                  key={grand.id}
                                  className={styles.subSubItem}
                                >
                                  <a
                                    href={grand.url}
                                    className={styles.subSubLink}
                                  >
                                    {grand.label}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>

          <ul className={styles.accountList}>
            {ACCOUNT_LINKS.map(link => (
              <li key={link.key} className={styles.accountItem}>
                <a href={link.url} className={styles.accountLink}>
                  <span
                    className={`${styles.accountIcon} ${styles[link.iconClass]}`}
                    aria-hidden="true"
                  />
                  <span className={styles.accountLabel}>{link.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </div>
  )
}

MobileMenu.defaultProps = {
  allCategoriesLabel: 'Todas as Categorias',
  allCategoriesUrl: '#',
}

MobileMenu.schema = {
  title: 'Menu mobile',
  description:
    'Drawer mobile com lista de categorias (do admin) e atalhos da conta.',
  type: 'object',
  properties: {
    allCategoriesLabel: {
      title: 'Texto do link Todas as Categorias',
      type: 'string',
      default: 'Todas as Categorias',
    },
    allCategoriesUrl: {
      title: 'URL do link Todas as Categorias',
      type: 'string',
      default: '#',
    },
  },
}

export default MobileMenu
