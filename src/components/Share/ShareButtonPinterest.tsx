import * as React from "react"
import { FaPinterestP } from "react-icons/fa"

import { ShareButton, ShareButtonProps } from "./ShareButton"

export const ShareButtonPinterest = React.forwardRef<
  HTMLDivElement,
  ShareButtonProps
>((props, ref) => {
  const { url, onClick, text, shareText, mediaSrc, ...rest } = props

  return (
    <ShareButton
      additionalClassName="text-[#C61F26] bg-white lg:bg-[#C61F26] lg:hover:bg-[#C61F26]  lg:text-white dark:text-gray-100 dark:bg-[#374151]"
      onClick={onClick}
      icon={<FaPinterestP />}
      text={text || "Pinterest"}
      fullUrl={`https://pinterest.com/pin/create/button/?url=${encodeURI(
        url as string,
      )}&media=${encodeURI(mediaSrc as string)}&description=${encodeURI(
        shareText as string,
      )}`}
      ref={ref}
      {...rest}
    />
  )
})