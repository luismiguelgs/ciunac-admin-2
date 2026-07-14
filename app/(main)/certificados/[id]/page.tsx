import { notFound } from "next/navigation"
import NavigationBread from "@/components/navigation-bread"
import { CertificadoForm } from "@/modules/certificados/components/certificado.form"
import { CertificadosService } from "@/modules/certificados/certificados.service"

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function CertificadoDetallePage({ params }: PageProps) {
    const { id } = await params
    let certificado

    try {
        certificado = await CertificadosService.getItem(id)
    } catch {
        notFound()
    }

    return (
        <>
            <NavigationBread section="Certificados" href="/certificados" page={`Detalle ${certificado.numeroRegistro}`} />
            <div className="container mx-auto max-w-7xl px-4 py-4">
                <CertificadoForm certificado={certificado} />
            </div>
        </>
    )
}
