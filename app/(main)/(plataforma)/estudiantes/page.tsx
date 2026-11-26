import { Suspense } from "react"
import NavigationBread from "@/components/navigation-bread"
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton"
import { ensureServerPermission } from "@/lib/server-permissions"
import { EstudiantesList } from "@/modules/estudiantes/components/estudiantes-list"
import { getStudentCatalogs } from "@/modules/estudiantes/estudiantes.server"

export default async function EstudiantesPage() {
    await ensureServerPermission("/estudiantes")
    const catalogs = await getStudentCatalogs()

    return (
        <>
            <NavigationBread section="Plataforma" href="/dashboard" page="Estudiantes" />
            <div className="container mx-auto min-w-0 px-2 py-2">
                <Suspense fallback={<DataTableSkeleton />}><EstudiantesList {...catalogs} /></Suspense>
            </div>
        </>
    )
}
