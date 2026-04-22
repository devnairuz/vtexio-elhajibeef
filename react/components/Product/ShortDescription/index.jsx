import { useProduct } from "vtex.product-context"

import styles from "./ShortDescription.css"

const ShortDescription = () => {
  const { product } = useProduct()

  return (
    <>
      {product?.description && (
        <div className={styles.shortDescription}>
          <div
            className={styles.shortDescriptionContent}
            dangerouslySetInnerHTML={{__html: product.description}}
          />
        </div>
      )}
    </>
  )
}

export default ShortDescription