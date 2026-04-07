import Image from "next/image"
import { Info, Globe } from "lucide-react"
import { LoginForm } from "@/components/login-form"
import packageJson from "@/package.json"

export default function LoginPage() {
	return (
		<div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
			<div className="flex w-full max-w-sm flex-col gap-6">
				<div className="flex flex-col items-center gap-4 self-center font-medium">
					<Image 
						src="/images/logo-ciunac-trans.png" 
						alt="CIUNAC Logo" 
						width={160} 
						height={160}
						className="drop-shadow-sm"
						priority
					/>
					<h1 className="text-2xl font-black tracking-tight text-primary uppercase">CIUNAC Admin</h1>
				</div>
				
				<LoginForm />
				
				<div className="flex flex-col gap-6 mt-2">
					<div className="text-muted-foreground flex items-center justify-center gap-2 text-center text-xs bg-background/50 py-2 px-4 rounded-full border border-border/40 shadow-sm">
						<Info className="size-3 text-primary" />
						<span>
							¿Tienes dudas? Revisa nuestro{" "}
							<a
								href="https://drive.google.com/file/d/1Eg9hX5Num6yYiJuPSl43FCmwiSXfe-uY/view?usp=drive_link"
								target="_blank"
								rel="noopener noreferrer"
								className="font-bold underline underline-offset-4 hover:text-primary transition-colors text-foreground"
							>
								Tutorial de Acceso
							</a>
						</span>
					</div>
					
					<div className="flex flex-col items-center justify-center gap-2 text-[10px] text-muted-foreground/60">
						<a 
							href="https://ciunac.unac.edu.pe" 
							target="_blank" 
							rel="noopener noreferrer"
							className="flex items-center gap-1.5 hover:text-primary transition-all font-semibold uppercase tracking-wider px-3 py-1 rounded-md border border-transparent hover:border-primary/20 hover:bg-primary/5"
						>
							<Globe className="size-3" />
							Web Oficial CIUNAC
						</a>
						<div className="flex flex-col items-center gap-0.5 opacity-70">
							<p>© {new Date().getFullYear()} - Universidad Nacional del Callao</p>
							<p className="font-mono bg-muted px-2 py-0.5 rounded border border-border/50">VERSION {packageJson.version}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
