import { ChartBar } from "lucide-react"
import NavigationBread from "@/components/navigation-bread"
import ProtectedRoute from "@/components/protected-route"
import { ReportesWorkspace } from "@/modules/reportes/components/reportes-workspace"
import type { ReportKind } from "@/modules/reportes/reportes.interface"

interface ReportesPageProps {
    searchParams: Promise<{ reporte?: string | string[] }>
}

export default async function ReportesPage({ searchParams }: ReportesPageProps) {
    const { reporte } = await searchParams
    const requestedReport = Array.isArray(reporte) ? reporte[0] : reporte
    const activeReport: ReportKind = requestedReport === "examen" ? "examen" : "documentos"

    return (
        <ProtectedRoute>
            <NavigationBread section="Gestión de Pagos" href="/pagos/datos-banco" page="Reportes" />
            <main className="flex flex-1 flex-col gap-6 p-4 pt-0">
                <div className="flex items-start gap-3">
                    <div className="rounded-lg border bg-slate-950 p-2 text-white shadow-sm">
                        <ChartBar className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Reportes de solicitudes</h1>
                        <p className="text-sm text-muted-foreground">
                            Consulte solicitudes por periodo y exporte los resultados en formato Excel.
                        </p>
                    </div>
                </div>
                <ReportesWorkspace activeReport={activeReport} />
            </main>
        </ProtectedRoute>
    )
}

