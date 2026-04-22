import styles from './social.medias.css'

const SocialMedias = () => {

  return (
    <div className={styles.socialMediasWrapper}>
      <div className={styles.socialMediasHeader}>
        <svg
        xmlns="http://www.w3.org/2000/svg"
        width="45.025"
        height="38.91"
        viewBox="0 0 45.025 38.91"
        >
          <g transform="translate(0 -1.919)">
            <path
              fill="#dbada7"
              d="M22.512 19.577c.014.022.025.046.041.07h-.086c.015-.022.033-.047.045-.07zm22.513-12.99v23.505c0 2.574-2.394 4.668-5.334 4.668H29.113l-6.6 6.069-6.6-6.069H5.334C2.392 34.758 0 32.666 0 30.09V6.587c0-2.574 2.392-4.668 5.334-4.668h34.355c2.942 0 5.332 2.093 5.336 4.668zm-11.682 9.839a5.872 5.872 0 00-10.831-3.149 5.872 5.872 0 10-9.253 7.149l8.831 8.192 9.157-7.7a5.863 5.863 0 002.096-4.492z"
              data-name="Caminho 113"
            ></path>
          </g>
        </svg>
        
        <div className={styles.socialMediasHeaderText}>
          <h3 className={styles.socialMediasHeaderTitle}>Siga-nos em nossas redes sociais!</h3>
          <p className={styles.socialMediasHeaderSubtitle}>Acompanhe nossas novidades e lançamentos</p>
        </div>
      </div>

      <div className={styles.socialMediasContent}>
        <a href='https://br.pinterest.com/' target='_blank' title='Pinterest' className={styles.socialMediaLink}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
          >
            <path
              d="M18 9.562a9 9 0 01-11.664 8.6A10.117 10.117 0 007.454 15.8l.559-2.141a2.41 2.41 0 002.061 1.034c2.715 0 4.671-2.5 4.671-5.6A5.282 5.282 0 009.2 3.9c-3.887 0-5.952 2.6-5.952 5.445a4.039 4.039 0 001.825 3.488c.171.08.261.044.3-.12.029-.123.181-.737.25-1.02a.269.269 0 00-.062-.258A3.544 3.544 0 014.9 9.381a3.9 3.9 0 014.065-3.9 3.553 3.553 0 013.76 3.662c0 2.435-1.23 4.123-2.831 4.123a1.305 1.305 0 01-1.332-1.626 18.085 18.085 0 00.744-3 1.13 1.13 0 00-1.14-1.267c-.9 0-1.629.933-1.629 2.185a3.243 3.243 0 00.263 1.333s-.889 3.767-1.052 4.471a8.712 8.712 0 00-.033 2.584A9 9 0 1118 9.562z"
              data-name="Icon awesome-pinterest"
              transform="translate(0 -.563)"
            ></path>
          </svg>
        </a>

        <a href='https://www.youtube.com/channel/UCu70MAqws64Vk2dYQlCFVYg' target='_blank' title='YouTube' className={styles.socialMediaLink}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="12.656"
            viewBox="0 0 18 12.656"
          >
            <path
              d="M18.674 6.48a2.262 2.262 0 00-1.591-1.6 53.449 53.449 0 00-7.033-.38 53.449 53.449 0 00-7.032.379 2.262 2.262 0 00-1.591 1.6 23.726 23.726 0 00-.376 4.361 23.726 23.726 0 00.375 4.36 2.228 2.228 0 001.591 1.576 53.449 53.449 0 007.032.379 53.449 53.449 0 007.032-.379 2.228 2.228 0 001.593-1.576 23.726 23.726 0 00.376-4.361 23.726 23.726 0 00-.376-4.361zM8.209 13.517V8.165l4.7 2.676-4.7 2.676z"
              data-name="Icon awesome-youtube"
              transform="translate(-1.05 -4.5)"
            ></path>
          </svg>
        </a>

        <a href='https://twitter.com/?lang=pt-br' target='_blank' title='X' className={styles.socialMediaLink}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15.534"
            height="15.534"
            viewBox="0 0 15.534 15.534"
          >
            <path
              d="M13.87 2.25H1.664A1.665 1.665 0 000 3.914V16.12a1.665 1.665 0 001.664 1.664H13.87a1.665 1.665 0 001.664-1.664V3.914A1.665 1.665 0 0013.87 2.25zm-1.7 5.506c.007.1.007.2.007.295a6.426 6.426 0 01-6.47 6.47A6.44 6.44 0 012.219 13.5a4.791 4.791 0 00.548.028 4.559 4.559 0 002.823-.971 2.277 2.277 0 01-2.126-1.578 2.451 2.451 0 001.026-.042 2.274 2.274 0 01-1.82-2.231v-.027a2.273 2.273 0 001.03.287 2.269 2.269 0 01-1.016-1.893 2.246 2.246 0 01.309-1.148A6.457 6.457 0 007.68 8.3a2.279 2.279 0 013.88-2.077A4.456 4.456 0 0013 5.679a2.268 2.268 0 01-1 1.252 4.526 4.526 0 001.311-.354 4.787 4.787 0 01-1.137 1.179z"
              data-name="Icon awesome-twitter-square"
              transform="translate(0 -2.25)"
            ></path>
          </svg>
        </a>

        <a href='https://www.instagram.com/nairuzdigital/' target='_blank' title='Instagram' className={styles.socialMediaLink}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16.062"
            height="16.058"
            viewBox="0 0 16.062 16.058"
          >
            <path
              d="M8.027 6.15a4.117 4.117 0 104.117 4.117A4.111 4.111 0 008.027 6.15zm0 6.794a2.677 2.677 0 112.673-2.677 2.681 2.681 0 01-2.677 2.677zm5.246-6.962a.96.96 0 11-.96-.96.958.958 0 01.96.959zM16 6.956a4.752 4.752 0 00-1.3-3.365 4.783 4.783 0 00-3.365-1.3c-1.326-.075-5.3-.075-6.625 0a4.777 4.777 0 00-3.362 1.297 4.768 4.768 0 00-1.3 3.365c-.075 1.326-.075 5.3 0 6.625a4.752 4.752 0 001.3 3.365 4.79 4.79 0 003.365 1.3c1.326.075 5.3.075 6.625 0a4.752 4.752 0 003.365-1.3A4.783 4.783 0 0016 13.578c.075-1.326.075-5.3 0-6.622zM14.287 15a2.71 2.71 0 01-1.526 1.526c-1.057.419-3.565.322-4.733.322s-3.68.093-4.733-.322A2.71 2.71 0 011.768 15c-.419-1.057-.322-3.565-.322-4.733s-.093-3.68.322-4.733a2.71 2.71 0 011.526-1.527c1.057-.419 3.565-.322 4.733-.322s3.68-.093 4.733.322a2.71 2.71 0 011.526 1.526c.419 1.057.322 3.565.322 4.733s.098 3.681-.321 4.734z"
              data-name="Icon awesome-instagram"
              transform="translate(.005 -2.238)"
            ></path>
          </svg>
        </a>

        <a href='https://www.facebook.com/NairuzConsultoriaDigital' target='_blank' title='Facebook' className={styles.socialMediaLink}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15.475"
            height="15.475"
            viewBox="0 0 15.475 15.475"
          >
            <path
              d="M13.817 2.25H1.658A1.658 1.658 0 000 3.908v12.159a1.658 1.658 0 001.658 1.658H6.4v-5.261H4.223V9.987H6.4V8.1a3.022 3.022 0 013.234-3.333 13.183 13.183 0 011.918.167v2.108h-1.08a1.238 1.238 0 00-1.4 1.338v1.607h2.376l-.38 2.476h-2v5.261h4.741a1.658 1.658 0 001.658-1.658V3.908a1.658 1.658 0 00-1.65-1.658z"
              data-name="Icon awesome-facebook-square"
              transform="translate(0 -2.25)"
            ></path>
          </svg>
        </a>
      </div>
    </div>
  )
}

export default SocialMedias