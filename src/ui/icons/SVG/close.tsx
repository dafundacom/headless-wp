import * as React from "react"
import { tx } from "@twind/core"

import { IconProps } from "../icon"

export const CloseIcon = React.forwardRef<SVGSVGElement, IconProps>(
  (props, ref) => {
    const {
      color = "currentColor",
      width = "1em",
      height = "1em",
      className,
      ...rest
    } = props

    return (
      <svg
        ref={ref}
        className={tx(className)}
        xmlns="http://www.w3.org/2000/svg"
        stroke={color}
        fill={color}
        strokeWidth="0"
        viewBox="0 0 24 24"
        height={height}
        width={width}
        {...rest}
      >
        <path fill="none" d="M0 0h24v24H0z"></path>
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
      </svg>
    )
  },
)
