import React from 'react'
import styles from './infoCards.css'

const InfoCards = ({ cards = [] }) => {
  return (
    <div className={styles.container}>
      {cards.map((card, i) => (
        <div key={i} className={styles.card}>
          <img src={card.icon} alt={card.headline} className={styles.icon} />
          <div className={styles.text}>
            <strong className={styles.headline}>{card.headline}</strong>
            <span className={styles.subheadline}>{card.subheadline}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

InfoCards.schema = {
  title: 'Benefícios da loja',
  description: 'Edite os cards de benefícios exibidos abaixo do banner principal.',
  type: 'object',
  properties: {
    cards: {
      title: 'Benefícios',
      description: 'Cada item representa um benefício exibido na faixa abaixo do banner.',
      type: 'array',
      __editorItemTitle: 'headline',
      items: {
        type: 'object',
        title: 'Benefício',
        properties: {
          icon: {
            title: 'Ícone',
            type: 'string',
            widget: {
              'ui:widget': 'image-uploader',
            },
          },
          headline: {
            title: 'Título',
            type: 'string',
          },
          subheadline: {
            title: 'Texto de apoio',
            type: 'string',
          },
        },
      },
    },
  },
}

export default InfoCards
