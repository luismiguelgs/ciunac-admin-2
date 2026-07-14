import NavigationBread from "@/components/navigation-bread"
import { CertificadosTable } from "@/modules/certificados/components/certificados.table"
import { CertificadosService } from "@/modules/certificados/certificados.service"

export default async function CertificadosFirmadosPage() {
    const certificados = await CertificadosService.fetchBySigned(true)

    return (
        <>
            <NavigationBread section="Certificados" href="/certificados" page="Firmados" />
            <div className="container mx-auto space-y-5 px-4 py-4">
                <div>
                    <h1 className="text-2xl font-bold">Certificados firmados</h1>
                    <p className="text-sm text-muted-foreground">Consulta y registro de entrega de certificados.</p>
                </div>
                <CertificadosTable initialData={certificados} signed />
            </div>
        </>
    )
}
