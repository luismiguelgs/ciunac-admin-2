import { auth } from "@/auth"
import NavigationBread from "@/components/navigation-bread"
import { CertificadoForm } from "@/modules/certificados/components/certificado.form"

export default async function NuevoCertificadoPage() {
    const session = await auth()
    const user = session?.user as { name?: string | null; email?: string | null } | undefined
    const elaborador = user?.name || user?.email || ""

    return (
        <>
            <NavigationBread section="Certificados" href="/certificados" page="Nuevo certificado" />
            <div className="container mx-auto max-w-7xl px-4 py-4">
                <CertificadoForm elaborador={elaborador} />
            </div>
        </>
    )
}
