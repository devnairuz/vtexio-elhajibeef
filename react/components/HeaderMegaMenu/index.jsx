import React, { useEffect, useMemo, useState } from 'react'

import styles from './headerMegaMenu.css'

const normalizeText = value =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()

const toCategoryUrl = category => {
  const rawUrl = String(category?.url || category?.href || '').trim()

  if (!rawUrl) return '#'

  try {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://localhost'
    const parsedUrl = new URL(rawUrl, baseUrl)

    return `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}` || '#'
  } catch (error) {
    return rawUrl.charAt(0) === '/' ? rawUrl : `/${rawUrl}`
  }
}

const isAllCategoriesItem = item => item?.type === 'all-categories'

const getBannerConfig = (category, banners = []) => {
  if (!Array.isArray(banners)) return null

  const categoryId = String(category?.id || '')
  const categoryName = normalizeText(category?.name)

  return banners.find(item => {
    const configuredId = String(item?.categoryId || '')
    const configuredName = normalizeText(item?.categoryName)

    return (
      (configuredId && configuredId === categoryId) ||
      (configuredName && configuredName === categoryName)
    )
  })
}

const mapCategory = (category, banners) => {
  const bannerConfig = getBannerConfig(category, banners)

  return {
    id: category?.id,
    label: category?.name,
    modalLabel: bannerConfig?.modalLabel,
    url: toCategoryUrl(category),
    banner: bannerConfig?.banner,
    alt: bannerConfig?.alt || category?.name,
    subcategories: (category?.children || []).map(child => ({
      id: child?.id,
      label: child?.name,
      url: toCategoryUrl(child),
    })),
  }
}

const hasDropdown = item => Boolean(item?.banner) || (item?.subcategories?.length || 0) > 0

const FullCategoriesDropdown = ({ activeItem, items }) => (
  <div className={styles.fullDropdown}>
    {activeItem?.banner && (
      <a className={styles.fullBannerLink} href={activeItem.url || '#'}>
        <img
          className={styles.fullBanner}
          src={activeItem.banner}
          alt={activeItem.alt || activeItem.label}
          loading="lazy"
        />
      </a>
    )}

    <div className={styles.fullColumns}>
      {items.filter(item => !isAllCategoriesItem(item)).map((item, index) => (
        <div className={styles.fullColumn} key={`${item.id || item.label}-${index}`}>
          <a className={styles.fullColumnTitle} href={item.url || '#'}>
            {item.modalLabel || item.label}
          </a>

          {!!item.subcategories?.length && (
            <ul className={styles.fullSubcategoryList}>
              {item.subcategories.map((subcategory, subIndex) => (
                <li
                  className={styles.fullSubcategoryItem}
                  key={`${subcategory?.id || subcategory?.label}-${subIndex}`}
                >
                  <a
                    className={styles.fullSubcategoryLink}
                    href={subcategory?.url || '#'}
                  >
                    {subcategory?.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  </div>
)

const HeaderMegaMenu = ({
  allCategoriesAlt,
  allCategoriesBanner,
  allCategoriesLabel,
  categoryBanners,
  categoryTreeLevel,
}) => {
  const [activeIndex, setActiveIndex] = useState(null)
  const [categories, setCategories] = useState([])

  useEffect(() => {
    let isMounted = true
    const level = Number(categoryTreeLevel) || 2

    fetch(`/api/catalog_system/pub/category/tree/${level}`)
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
  }, [categoryTreeLevel])

  const menuItems = useMemo(() => {
    const categoryItems = categories
      .filter(category => category?.name)
      .map(category => mapCategory(category, categoryBanners))

    if (!categoryItems.length) return []

    return [
      ...categoryItems,
      {
        label: allCategoriesLabel,
        url: '#',
        banner: allCategoriesBanner,
        alt: allCategoriesAlt || allCategoriesLabel,
        type: 'all-categories',
      },
    ]
  }, [allCategoriesAlt, allCategoriesBanner, allCategoriesLabel, categories, categoryBanners])

  const activeItem = activeIndex !== null ? menuItems[activeIndex] : null
  const isFullDropdownOpen = activeItem && isAllCategoriesItem(activeItem)

  if (!menuItems.length) {
    return null
  }

  return (
    <nav
      className={styles.megaMenu}
      aria-label="Categorias"
      onMouseLeave={() => setActiveIndex(null)}
    >
      <ul className={styles.menuList}>
        {menuItems.map((item, index) => {
          const isAllCategories = isAllCategoriesItem(item)
          const isOpen = activeIndex === index && hasDropdown(item) && !isAllCategories

          return (
            <li
              className={styles.menuItem}
              key={`${item.id || item.label}-${index}`}
              onMouseEnter={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
            >
              <a
                className={styles.menuLink}
                href={item.url || '#'}
                aria-haspopup={hasDropdown(item) || isAllCategories ? 'true' : undefined}
                aria-expanded={hasDropdown(item) || isAllCategories ? activeIndex === index : undefined}
              >
                {item.label}
              </a>

              {isOpen && (
                <div className={styles.dropdown}>
                  {item.banner && (
                    <a className={styles.bannerLink} href={item.url || '#'}>
                      <img
                        className={styles.banner}
                        src={item.banner}
                        alt={item.alt || item.label}
                        loading="lazy"
                      />
                    </a>
                  )}

                  {!!item.subcategories?.length && (
                    <ul className={styles.subcategoryList}>
                      {item.subcategories.map((subcategory, subIndex) => (
                        <li
                          className={styles.subcategoryItem}
                          key={`${subcategory?.id || subcategory?.label}-${subIndex}`}
                        >
                          <a
                            className={styles.subcategoryLink}
                            href={subcategory?.url || '#'}
                          >
                            {subcategory?.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </li>
          )
        })}
      </ul>

      {isFullDropdownOpen && (
        <FullCategoriesDropdown activeItem={activeItem} items={menuItems} />
      )}
    </nav>
  )
}

HeaderMegaMenu.defaultProps = {
  allCategoriesAlt: 'Todas as Categorias',
  allCategoriesBanner: '',
  allCategoriesLabel: 'Todas as Categorias',
  categoryBanners: [],
  categoryTreeLevel: 2,
}

HeaderMegaMenu.schema = {
  title: 'Mega menu do header',
  description: 'Categorias e subcategorias vêm do admin. Configure aqui apenas banners e textos auxiliares.',
  type: 'object',
  properties: {
    categoryTreeLevel: {
      title: 'Nível da árvore de categorias',
      type: 'number',
      default: 2,
    },
    allCategoriesLabel: {
      title: 'Texto do botão Todas as Categorias',
      type: 'string',
      default: 'Todas as Categorias',
    },
    allCategoriesBanner: {
      title: 'Banner do modal Todas as Categorias',
      type: 'string',
      widget: {
        'ui:widget': 'image-uploader',
      },
    },
    allCategoriesAlt: {
      title: 'Texto alternativo do banner Todas as Categorias',
      type: 'string',
    },
    categoryBanners: {
      title: 'Banners por categoria',
      type: 'array',
      items: {
        title: 'Banner de categoria',
        type: 'object',
        properties: {
          categoryId: {
            title: 'ID da categoria no admin',
            type: 'string',
          },
          categoryName: {
            title: 'Nome da categoria no admin',
            type: 'string',
          },
          modalLabel: {
            title: 'Texto da categoria no modal completo',
            type: 'string',
          },
          banner: {
            title: 'Banner do dropdown da categoria',
            type: 'string',
            widget: {
              'ui:widget': 'image-uploader',
            },
          },
          alt: {
            title: 'Texto alternativo do banner',
            type: 'string',
          },
        },
      },
    },
  },
}

export default HeaderMegaMenu
