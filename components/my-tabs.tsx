import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

type MyTabsProps = React.ComponentProps<typeof Tabs> & {
    items: {
        value: string
        label: string
        content: React.ReactNode
    }[]
}

export default function MyTabs({
    className,
    defaultValue,
    items,
    ...props
}: MyTabsProps) {
    return (
        <Tabs defaultValue={defaultValue} className={cn("w-full", className)} {...props}>
            <TabsList className="mx-auto">
                {items.map((item) => (
                    <TabsTrigger key={item.value} value={item.value}>{item.label}</TabsTrigger>
                ))}
            </TabsList>
            {items.map((item) => (
                <TabsContent key={item.value} value={item.value}>
                    {item.content}
                </TabsContent>
            ))}
        </Tabs>
    )
}