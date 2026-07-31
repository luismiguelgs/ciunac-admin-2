"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import MyTabs from "@/components/my-tabs"

type MyTabsProps = React.ComponentProps<typeof MyTabs>

interface UrlStateTabsProps extends Omit<MyTabsProps, "defaultValue" | "value" | "onValueChange"> {
    activeValue: string
    queryParam: string
}

export function UrlStateTabs({
    activeValue,
    queryParam,
    items,
    ...props
}: UrlStateTabsProps) {
    const pathname = usePathname()
    const router = useRouter()
    const [value, setValue] = React.useState(activeValue)

    React.useEffect(() => {
        setValue(activeValue)
    }, [activeValue])

    const handleValueChange = (nextValue: string) => {
        if (!items.some(item => item.value === nextValue)) return

        setValue(nextValue)

        const params = new URLSearchParams(window.location.search)
        params.set(queryParam, nextValue)
        const query = params.toString()

        router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
    }

    return (
        <MyTabs
            {...props}
            items={items}
            value={value}
            onValueChange={handleValueChange}
        />
    )
}
