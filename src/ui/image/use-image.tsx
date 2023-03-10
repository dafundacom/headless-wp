/* eslint-disable no-unused-vars */
import * as React from "react"

export interface UseImageProps {
  src?: string
  srcSet?: string
  sizes?: string
  onLoad?(event: React.SyntheticEvent<HTMLImageElement, Event>): void
  onError?(error: string | React.SyntheticEvent<HTMLImageElement, Event>): void
  ignoreFallback?: boolean
  crossOrigin?: React.ImgHTMLAttributes<any>["crossOrigin"]
}

type Status = "loading" | "failed" | "pending" | "loaded"
type ImageEvent = React.SyntheticEvent<HTMLImageElement, Event>

export function useImage(props: UseImageProps) {
  const { src, srcSet, onLoad, onError, crossOrigin, sizes, ignoreFallback } =
    props

  const [status, setStatus] = React.useState<Status>("pending")

  React.useEffect(() => {
    setStatus(src ? "loading" : "pending")
  }, [src])

  const imageRef = React.useRef<HTMLImageElement | null>()

  const load = React.useCallback(() => {
    if (!src) return

    flush()
    const img = new Image()
    img.src = src

    if (crossOrigin) {
      img.crossOrigin = crossOrigin
    }

    if (srcSet) {
      img.srcset = srcSet
    }

    if (sizes) {
      img.sizes = sizes
    }

    img.onload = (event) => {
      flush()
      setStatus("loaded")
      onLoad?.(event as unknown as ImageEvent)
    }
    img.onerror = (error) => {
      flush()
      setStatus("failed")
      onError?.(error as any)
    }

    imageRef.current = img
  }, [src, crossOrigin, srcSet, sizes, onLoad, onError])

  const flush = () => {
    if (imageRef.current) {
      imageRef.current.onload = null
      imageRef.current.onerror = null
      imageRef.current = null
    }
  }

  React.useEffect(() => {
    if (ignoreFallback) return undefined

    if (status === "loading") {
      load()
    }
    return () => {
      flush()
    }
  }, [status, load, ignoreFallback])

  return ignoreFallback ? "loaded" : status
}

export type UseImageReturn = ReturnType<typeof useImage>
