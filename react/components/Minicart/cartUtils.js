export const getCartItemsCount = (items = []) =>
  items.reduce((acc, item) => acc + (item.quantity || 0), 0)
