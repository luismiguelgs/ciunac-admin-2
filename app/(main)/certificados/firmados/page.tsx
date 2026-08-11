import NavigationBread from "@/components/navigation-bread"
import { CertificadosTable } from "@/modules/certificados/components/certificados.table"
import { resolveCertificadosPage, validateCertificadosPage } from "@/modules/certificados/certificados-list-state"
import { CertificadosService } from "@/modules/certificados/certificados.service"

interface PageProps {
    searchParams: Promise<{ pagina?: string | string[] }>
}

export default async function CertificadosFirmadosPage({ searchParams }: PageProps) {
    const [certificados, query] = await Promise.all([
        CertificadosService.fetchBySigned(true),
        searchParams,
    ])
    const initialPage = validateCertificadosPage(resolveCertificadosPage(query.pagina), certificados.length)

    return (
        <>
            <NavigationBread section="Certificados" href="/certificados" page="Firmados" />
            <div className="container mx-auto space-y-5 px-4 py-4">
                <div>
                    <h1 className="text-2xl font-bold">Certificados firmados</h1>
                    <p className="text-sm text-muted-foreground">Consulta y registro de entrega de certificados.</p>
                </div>
                <CertificadosTable initialData={certificados} signed initialPage={initialPage} />
            </div>
        </>
    )
}
