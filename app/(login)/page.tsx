import { GalleryVerticalEnd, Info } from "lucide-react"
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
	return (
		<div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
			<div className="flex w-full max-w-sm flex-col gap-6">
				<a href="#" className="flex items-center gap-2 self-center font-medium">
					<div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
						<GalleryVerticalEnd className="size-4" />
					</div>
					CIUNAC
				</a>
				<LoginForm />
				<div className="text-muted-foreground flex items-center justify-center gap-2 text-center text-xs">
					<Info className="size-3" />
					<span>
						¿Tienes dudas sobre cómo ingresar? Revisa nuestro{" "}
						<a
							href="https://drive.google.com/file/d/1Eg9hX5Num6yYiJuPSl43FCmwiSXfe-uY/view?usp=drive_link"
							target="_blank"
							rel="noopener noreferrer"
							className="underline underline-offset-4 hover:text-primary transition-colors"
						>
							Tutorial de Acceso
						</a>
					</span>
				</div>
			</div>
		</div>
	)
}
