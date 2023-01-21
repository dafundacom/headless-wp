import NextLink from "next/link"
import * as React from "react"
import { Text } from "@/ui"

import env from "@/env"

interface SideNavProps {
  primaryMenus?: any
}

export const SideNav = React.forwardRef<HTMLDivElement, SideNavProps>(
  (props, ref) => {
    const { primaryMenus, ...rest } = props

    return (
      <nav className="flex w-full flex-col w-56 relative" ref={ref} {...rest}>
        <ul className="flex flex-col p-4  border-b border-gray-100 dark:border-gray-700">
          {primaryMenus?.length > 0 &&
            primaryMenus?.map((menu: { url: string; label: string }) => {
              const domainUrl = `https://${env.DOMAIN}`
              const fullUrl = menu.url.includes(domainUrl)
              let slicedUrl
              if (fullUrl) {
                slicedUrl = menu.url.slice(domainUrl.length + 1)
              }

              return (
                <li key={menu.label}>
                  <NextLink
                    href={`/${fullUrl ? slicedUrl : menu.url}`}
                    className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800"
                  >
                    <Text className="font-bold">{menu.label}</Text>
                  </NextLink>
                </li>
              )
            })}
        </ul>
      </nav>
    )
  },
)
