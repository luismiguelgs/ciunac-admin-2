import Link from "next/link"
import { FilePlus } from "lucide-react"
import NavigationBread from "@/components/navigation-bread"
import { Button } from "@/components/ui/button"
import { CertificadoReporteButton } from "@/modules/certificados/components/report/certificado-reporte.button"
import { CertificadosTable } from "@/modules/certificados/components/certificados.table"
import { resolveCertificadosPage, validateCertificadosPage } from "@/modules/certificados/certificados-list-state"
import { CertificadosService } from "@/modules/certificados/certificados.service"

interface PageProps {
    searchParams: Promise<{ pagina?: string | string[] }>
}

export default async function CertificadosPage({ searchParams }: PageProps) {
    const [certificados, query] = await Promise.all([
        CertificadosService.fetchBySigned(false),
        searchParams,
    ])
    const initialPage = validateCertificadosPage(resolveCertificadosPage(query.pagina), certificados.length)

    return (
        <>
            <NavigationBread section="Certificados" href="/certificados" page="Pendientes" />
            <div className="container mx-auto space-y-5 px-4 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold">Certificados pendientes de firma</h1>
                        <p className="text-sm text-muted-foreground">Documentos físicos y digitales preparados para su firma.</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <CertificadoReporteButton />
                        <Button asChild><Link href="/certificados/nuevo"><FilePlus className="h-4 w-4" />Nuevo certificado</Link></Button>
                    </div>
                </div>
                <CertificadosTable initialData={certificados} signed={false} initialPage={initialPage} />
            </div>
        </>
    )
}
