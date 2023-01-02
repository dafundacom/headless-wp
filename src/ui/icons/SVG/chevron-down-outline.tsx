import * as React from "react"
import { tx } from "@twind/core"

import { IconProps } from "../icon"

export const ChevronDownOutlineIcon = React.forwardRef<
  SVGSVGElement,
  IconProps
>((props, ref) => {
  const { color = "currentColor", width, height, className, ...rest } = props

  return (
    <svg
      ref={ref}
      className={tx(className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke={color}
      height={height}
      width={width}
      {...rest}
    >
      <path
        fillRule="evenodd"
        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
        clipRule="evenodd"
      ></path>
    </svg>
  )
})
