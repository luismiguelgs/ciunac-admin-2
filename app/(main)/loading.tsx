import { Command } from "lucide-react"

export default function Loading() {
    return (
        <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
                <div className="relative flex items-center justify-center">
                    <div className="absolute size-16 animate-ping rounded-full bg-primary/20" />
                    <div className="bg-primary text-primary-foreground relative flex size-12 items-center justify-center rounded-xl shadow-lg">
                        <Command className="size-6 animate-pulse" />
                    </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <span className="animate-in fade-in slide-in-from-bottom-2 duration-700 text-xl font-bold tracking-tight">
                        CIUNAC
                    </span>
                    <span className="text-muted-foreground animate-in fade-in slide-in-from-bottom-1 delay-200 duration-700 text-xs font-medium uppercase tracking-[0.2em]">
                        Cargando...
                    </span>
                </div>
            </div>
        </div>
    )
}
