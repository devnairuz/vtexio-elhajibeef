# Header e Topline

Este documento explica a logica do header e da topline/topbar do tema El Haji Beef em VTEX IO.

## Visao geral

O header principal e definido em `store/blocks/header/header.jsonc`.

Existem tres entradas:

- `header`: header padrao usado nas paginas comuns.
- `header#home`: header especifico da home.
- `header.full`: alias do header completo, usando a mesma estrutura do header padrao.

Estrutura atual:

```jsonc
"header": {
  "blocks": ["header-layout.desktop", "header-layout.mobile"]
},
"header#home": {
  "blocks": ["header-layout.desktop#home", "header-layout.mobile#home"]
},
"header.full": {
  "blocks": ["header-layout.desktop", "header-layout.mobile"]
}
```

A home escolhe `header#home` em `store/blocks/home/home.jsonc`:

```jsonc
"parent": {
  "header": "header#home"
}
```

Por isso, a home pode ter comportamento diferente das outras paginas.

## Desktop

Arquivo principal:

`store/blocks/header/desktop/header-layout.desktop.jsonc`

### Header desktop padrao

Fluxo:

```txt
header-layout.desktop
  aux-floating-container#header-desktop
    sticky-layout#header-desktop
      flex-layout.row#header-desktop
      flex-layout.row#menu-desktop
```

O header padrao de desktop tem:

- barra principal do header;
- menu de categorias.

### Header desktop da home

Fluxo:

```txt
header-layout.desktop#home
  aux-floating-container#header-desktop-home
    sticky-layout#header-desktop-home
      flex-layout.row#top-bar
      flex-layout.row#header-desktop
      flex-layout.row#menu-desktop
```

A diferenca e que a home adiciona `flex-layout.row#top-bar` antes da barra principal.

## Barra principal desktop

Arquivo:

`store/blocks/header/desktop/row.header-desktop.jsonc`

Fluxo:

```txt
flex-layout.row#header-desktop
  flex-layout.col#logo-desktop
    logo
  flex-layout.col#search-desktop
    search-suggestions
      search-bar
  flex-layout.col#utils-desktop
    flex-layout.row#store-info-desktop
    flex-layout.row#login-desktop
    flex-layout.row#minicart-desktop
```

Responsabilidades:

- `logo`: definido em `store/blocks/header/logo/logo.jsonc`.
- `search-suggestions`: wrapper React que abre sugestoes ao interagir com a busca.
- `search-bar`: busca nativa VTEX.
- `store-info`: link/icone de Feed Shop.
- `header-login`: componente React que envolve o bloco VTEX `login`.
- `minicart.v2`: minicart VTEX.

## Menu desktop

Arquivo:

`store/blocks/header/desktop/row.menu-desktop.jsonc`

Fluxo:

```txt
flex-layout.row#menu-desktop
  flex-layout.col#menu-desktop
    category-menu#header-category-menu
```

O menu usa `category-menu` com:

```jsonc
"showAllDepartments": true,
"showSubcategories": true,
"menuDisposition": "center"
```

Existe tambem uma estrutura de banner do mega menu (`image#header-mega-menu-banner`), mas hoje ela nao esta sendo renderizada porque `flex-layout.col#header-mega-menu-card` esta comentado nos children.

## Mobile

Arquivo principal:

`store/blocks/header/mobile/header-layout.mobile.jsonc`

### Header mobile padrao

Fluxo:

```txt
header-layout.mobile
  aux-floating-container#header-mobile
    sticky-layout#header-mobile
      flex-layout.row#header-mobile
      flex-layout.row#search-mobile
```

O header mobile padrao tem:

- linha principal com menu, logo e carrinho;
- linha de busca.

### Header mobile da home

Fluxo atual:

```txt
header-layout.mobile#home
  aux-floating-container#header-mobile-home
    sticky-layout#header-mobile-home
      flex-layout.row#top-bar
      flex-layout.row#header-mobile
      flex-layout.row#search-mobile
```

A diferenca da home e a inclusao da `top-bar` antes da linha principal do header.

Se a busca da home precisar ficar exatamente igual as outras paginas, o caminho mais simples e fazer `header#home` usar `header-layout.mobile` no lugar de `header-layout.mobile#home`.

## Barra principal mobile

Arquivo:

`store/blocks/header/mobile/row.header-mobile.jsonc`

Fluxo:

```txt
flex-layout.row#header-mobile
  flex-layout.col#drawer-mobile
    category-menu#mobile
  flex-layout.col#logo-mobile
    logo
  flex-layout.col#minicart-mobile
    flex-layout.row#login-desktop
    minicart.v2
```

Observacoes:

- O menu mobile usa `category-menu#mobile`.
- O login mobile reaproveita `flex-layout.row#login-desktop`.
- O carrinho usa o mesmo `minicart.v2`.

## Busca mobile

Arquivo:

`store/blocks/header/mobile/row.search-mobile.jsonc`

Fluxo:

```txt
flex-layout.row#search-mobile
  flex-layout.col#search-mobile
    search-suggestions
      search-bar
```

O bloco `search-suggestions` e definido em:

`store/blocks/header/search/search-bar.jsonc`

Ele recebe:

- titulo do painel de sugestoes;
- lista de produtos sugeridos;
- bloco filho `search-bar`.

A busca nativa usa placeholder:

```jsonc
"placeholder": "O que voce procura?"
```

## Topline / Topbar

Arquivo:

`store/blocks/header/topline/topline.jsonc`

A topline e o bloco `flex-layout.row#top-bar`.

Fluxo:

```txt
flex-layout.row#top-bar
  slider-layout#topbar-desk
    flex-layout.col#frete-bar
      rich-text#text-frete-gratis
    flex-layout.col#parcelamento-bar
      rich-text#text-parcelamento
```

Apesar do nome `topbar-desk`, o slider esta configurado para desktop, tablet e phone:

```jsonc
"itemsPerPage": {
  "desktop": 1,
  "tablet": 1,
  "phone": 1
}
```

O slider:

- troca automaticamente a cada 3000 ms;
- nao pausa no hover;
- e infinito;
- nao mostra setas;
- nao mostra dots.

Textos atuais:

- `Tenha 10% OFF na primeira compra no site | CUPOM: ELHAJI10`
- `Frete gratis em Sao Paulo em pedidos acima de R$500,00`

## Estilos relacionados

Principais arquivos de estilo:

- `styles/css/vtex.flex-layout.css`
- `styles/css/vtex.rich-text.css`
- `styles/css/vtex.slider-layout.css`
- `styles/css/vtex.store-components.css`
- `react/components/AuxFloatingContainer/custom.floating.css`

### Topbar

Em `vtex.flex-layout.css`:

```css
.flexRow--wrapper-topbar {
  background: #666666;
}

.flexRowContent--wrapper-topbar {
  align-items: center;
  justify-content: center;
  min-height: 32px;
}
```

No mobile, a altura e padding sao ajustados:

```css
.flexRowContent--wrapper-topbar {
  min-height: 30px;
  padding: 0 15px;
}
```

Em `vtex.rich-text.css`, o texto da topbar usa `blockClass: "text-topbar"`.

### Busca

Em `vtex.flex-layout.css`, a linha mobile da busca recebe:

```css
.flexRow--search-mobile-container {
  background: #E9E9E9;
  box-shadow: 3px 3px 6px #00000014;
  padding: 10px 0;
}
```

Em `vtex.store-components.css`, o bloco VTEX `search-bar` e estilizado por classes como:

- `.searchBarContainer`
- `.searchBarContainer :global(.vtex-input-prefix__group)`
- `.searchBarIcon`

## AuxFloatingContainer

Arquivo:

`react/components/AuxFloatingContainer/index.jsx`

Esse componente envolve os sticky layouts do header e aplica uma classe diferente se a rota for home ou nao:

```jsx
<div className={!isAtHome ? classes.notHomeRoute : classes.homeRoute}>
  {children}
</div>
```

Hoje ele considera home quando `window.location.pathname === '/'`.

O CSS relacionado fica em:

`react/components/AuxFloatingContainer/custom.floating.css`

Em desktop grande, `.homeRoute` fica absoluta:

```css
@media (min-width: 1100px) {
  .homeRoute {
    position: absolute !important;
    left: 0;
    right: 0;
  }
}
```

Isso ajuda o header da home a ficar sobreposto/flutuante no desktop.

## Pontos de atencao

- A home usa `header#home`; portanto qualquer diferenca em `header-layout.desktop#home` ou `header-layout.mobile#home` afeta somente a home.
- A topbar entra no header da home porque esta nos children de `sticky-layout#header-desktop-home` e `sticky-layout#header-mobile-home`.
- Se a topbar deve aparecer apenas no desktop, remova `flex-layout.row#top-bar` de `sticky-layout#header-mobile-home`.
- Se a busca mobile deve ser padronizada entre home e demais paginas, use `header-layout.mobile` tambem dentro de `header#home`.
- Os textos com acentos devem ser conferidos no editor/arquivo para evitar caracteres quebrados por encoding.
