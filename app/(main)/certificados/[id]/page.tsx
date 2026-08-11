import { notFound } from "next/navigation"
import NavigationBread from "@/components/navigation-bread"
import { CertificadoForm } from "@/modules/certificados/components/certificado.form"
import { buildCertificadosListHref, resolveCertificadosPage } from "@/modules/certificados/certificados-list-state"
import { CertificadosService } from "@/modules/certificados/certificados.service"

interface PageProps {
    params: Promise<{ id: string }>
    searchParams: Promise<{ pagina?: string | string[] }>
}

export default async function CertificadoDetallePage({ params, searchParams }: PageProps) {
    const [{ id }, query] = await Promise.all([params, searchParams])
    let certificado

    try {
        certificado = await CertificadosService.getItem(id)
    } catch {
        notFound()
    }

    const backHref = buildCertificadosListHref(
        Boolean(certificado.impreso),
        resolveCertificadosPage(query.pagina),
    )

    return (
        <>
            <NavigationBread section="Certificados" href={backHref} page={`Detalle ${certificado.numeroRegistro}`} />
            <div className="container mx-auto max-w-7xl px-4 py-4">
                <CertificadoForm certificado={certificado} backHref={backHref} />
            </div>
        </>
    )
}
