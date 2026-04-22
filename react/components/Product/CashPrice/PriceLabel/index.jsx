import { FormattedCurrency } from 'vtex.format-currency'

const PriceLabel = ({ priceValue }) => {
  return (
    <>
      <svg xmlns="http://www.w3.org/2000/svg" width="20.5" height="15.77" viewBox="0 0 20.5 15.77" fill="#4F4F4F">
        <g id="Icon_ionic-ios-barcode" data-name="Icon ionic-ios-barcode" transform="translate(-3.375 -6.75)">
          <path id="Caminho_1" data-name="Caminho 1" d="M7,21.14H4.991a.2.2,0,0,1-.2-.2V8.327a.2.2,0,0,1,.2-.2h2a.726.726,0,0,0,.724-.69.647.647,0,0,0-.2-.493.881.881,0,0,0-.586-.2H4.262a.805.805,0,0,0-.887.788V21.731a.764.764,0,0,0,.838.788H6.987a.664.664,0,0,0,.522-1.138A.73.73,0,0,0,7,21.14Z"/>
          <path id="Caminho_2" data-name="Caminho 2" d="M29.936,6.75H27.162a.691.691,0,0,0-.69.9.534.534,0,0,0,.039.094.7.7,0,0,0,.636.384h2.011a.2.2,0,0,1,.2.2V20.938a.2.2,0,0,1-.2.2h-2a.718.718,0,0,0-.724.685.691.691,0,0,0,.2.513.679.679,0,0,0,.508.187h2.789a.769.769,0,0,0,.838-.808V7.538A.764.764,0,0,0,29.936,6.75Z" transform="translate(-6.899)"/>
          <path id="Caminho_3" data-name="Caminho 3" d="M8.319,12.375a.691.691,0,0,0-.69.685v6.51a.69.69,0,0,0,1.38,0V13.06A.691.691,0,0,0,8.319,12.375Z" transform="translate(-1.272 -1.683)"/>
          <path id="Caminho_4" data-name="Caminho 4" d="M27.092,20.26a.691.691,0,0,0,.69-.685V13.06a.69.69,0,0,0-1.38,0v6.51A.692.692,0,0,0,27.092,20.26Z" transform="translate(-6.888 -1.683)"/>
          <path id="Caminho_5" data-name="Caminho 5" d="M22.663,10.125a.7.7,0,0,0-.69.71v9.615a.69.69,0,1,0,1.38,0V10.835A.7.7,0,0,0,22.663,10.125Z" transform="translate(-5.563 -1.01)"/>
          <path id="Caminho_6" data-name="Caminho 6" d="M12.749,10.125a.7.7,0,0,0-.69.71v9.615a.69.69,0,1,0,1.38,0V10.835A.7.7,0,0,0,12.749,10.125Z" transform="translate(-2.597 -1.01)"/>
          <path id="Caminho_7" data-name="Caminho 7" d="M17.706,11.25a.7.7,0,0,0-.69.7v8.057a.69.69,0,1,0,1.38,0V11.95A.7.7,0,0,0,17.706,11.25Z" transform="translate(-4.08 -1.346)"/>
        </g>
      </svg>
      <FormattedCurrency value={priceValue} />
      <span>à vista</span>
    </>
  )
}

export default PriceLabel