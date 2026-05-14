import React from "react"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export default function NavigationBread({ 
    section, 
    page, 
    href, 
    extraPath 
}: { 
    section: string, 
    page?: string, 
    href?: string, 
    extraPath?: { label: string, href: string }[] 
}) {
    return (
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mr-2 data-[orientation=vertical]:h-4"
                />
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem className="hidden md:block">
                            <BreadcrumbLink href={href}>
                                {section}
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        {page && (
                            <>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    {extraPath && extraPath.length > 0 ? (
                                        <BreadcrumbLink href={href ? `${href}/${page.toLowerCase()}` : undefined}>
                                            {page}
                                        </BreadcrumbLink>
                                    ) : (
                                        <BreadcrumbPage>{page}</BreadcrumbPage>
                                    )}
                                </BreadcrumbItem>
                            </>
                        )}
                        {extraPath?.map((item, index) => (
                            <React.Fragment key={index}>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    {index === extraPath.length - 1 ? (
                                        <BreadcrumbPage>{item.label}</BreadcrumbPage>
                                    ) : (
                                        <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                                    )}
                                </BreadcrumbItem>
                            </React.Fragment>
                        ))}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        </header>
    )
}