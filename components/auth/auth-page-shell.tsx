import type { ReactNode } from "react"
import Image from "next/image"
import { Globe, Info } from "lucide-react"
import packageJson from "@/package.json"

interface AuthPageShellProps {
    children: ReactNode
}

export function AuthPageShell({ children }: AuthPageShellProps) {
    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <div className="flex flex-col items-center gap-4 self-center font-medium">
                    <Image
                        src="/images/logo-ciunac-trans.png"
                        alt="Logo CIUNAC"
                        width={160}
                        height={160}
                        className="drop-shadow-sm"
                        priority
                    />
                    <h1 className="text-primary text-2xl font-black tracking-normal uppercase">
                        CIUNAC Admin
                    </h1>
                </div>

                {children}

                <div className="mt-2 flex flex-col gap-6">
                    <div className="text-muted-foreground bg-background/50 border-border/40 flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-center text-xs shadow-sm">
                        <Info className="text-primary size-3" />
                        <span>
                            ¿Tienes dudas? Revisa nuestro{" "}
                            <a
                                href="https://drive.google.com/file/d/1Eg9hX5Num6yYiJuPSl43FCmwiSXfe-uY/view?usp=drive_link"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-foreground hover:text-primary font-bold underline underline-offset-4 transition-colors"
                            >
                                Tutorial de Acceso
                            </a>
                        </span>
                    </div>

                    <div className="text-muted-foreground/60 flex flex-col items-center justify-center gap-2 text-[10px]">
                        <a
                            href="https://ciunac.unac.edu.pe"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-primary hover:border-primary/20 hover:bg-primary/5 flex items-center gap-1.5 rounded-md border border-transparent px-3 py-1 font-semibold tracking-wider uppercase transition-all"
                        >
                            <Globe className="size-3" />
                            Web Oficial CIUNAC
                        </a>
                        <div className="flex flex-col items-center gap-0.5 opacity-70">
                            <p>© {new Date().getFullYear()} - Universidad Nacional del Callao</p>
                            <p className="bg-muted border-border/50 rounded border px-2 py-0.5 font-mono">
                                VERSION {packageJson.version}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
