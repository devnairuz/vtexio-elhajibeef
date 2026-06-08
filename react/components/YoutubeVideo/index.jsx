import React, { useMemo } from 'react'
import styles from './youtubeVideo.css'

const DEFAULT_YOUTUBE_URL = 'https://youtube.com/shorts/pELYldb4YXU?si=xOpIM3yTqzsS6z66'

const getYoutubeVideoId = (url) => {
  if (!url) return null

  const rawUrl = String(url).trim()

  try {
    const parsedUrl = new URL(rawUrl)
    const host = parsedUrl.hostname.replace(/^www\./, '')
    const pathParts = parsedUrl.pathname.split('/').filter(Boolean)

    if (host === 'youtu.be') {
      return pathParts[0] || null
    }

    if (host.endsWith('youtube.com')) {
      if (pathParts[0] === 'shorts' || pathParts[0] === 'embed') {
        return pathParts[1] || null
      }

      return parsedUrl.searchParams.get('v')
    }
  } catch (error) {
    const fallbackMatch = rawUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:shorts\/|embed\/)|[?&]v=)([A-Za-z0-9_-]{6,})/)

    return fallbackMatch?.[1] || null
  }

  return null
}

const YoutubeVideo = ({
  youtubeUrl = DEFAULT_YOUTUBE_URL,
  title = 'Video institucional El Haji Beef',
}) => {
  const embedUrl = useMemo(() => {
    const videoId = getYoutubeVideoId(youtubeUrl)

    return videoId ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1` : null
  }, [youtubeUrl])

  if (!embedUrl) {
    return (
      <a className={styles.youtubeVideoFallback} href={youtubeUrl} rel="noopener noreferrer" target="_blank">
        Assistir video
      </a>
    )
  }

  return (
    <div className={styles.youtubeVideoRoot}>
      <iframe
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className={styles.youtubeVideoFrame}
        loading="lazy"
        src={embedUrl}
        title={title}
      />
    </div>
  )
}

YoutubeVideo.schema = {
  title: 'Video do YouTube',
  description: 'Video institucional com link editavel pelo painel.',
  type: 'object',
  properties: {
    youtubeUrl: {
      title: 'Link do YouTube',
      type: 'string',
      default: DEFAULT_YOUTUBE_URL,
    },
    title: {
      title: 'Titulo acessivel do video',
      type: 'string',
      default: 'Video institucional El Haji Beef',
    },
  },
}

export default YoutubeVideo
