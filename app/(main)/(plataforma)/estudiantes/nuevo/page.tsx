import NavigationBread from "@/components/navigation-bread"
import { ensureServerPermission } from "@/lib/server-permissions"
import { NewStudentForm } from "@/modules/estudiantes/components/new-student.form"
import { studentHref } from "@/modules/estudiantes/estudiantes.contract"
import { studentReturnQuery, type StudentSearchParams } from "@/modules/estudiantes/estudiantes.navigation"
import { getStudentCatalogs } from "@/modules/estudiantes/estudiantes.server"

export default async function NuevoEstudiantePage({ searchParams }: { searchParams: StudentSearchParams }) {
    await ensureServerPermission("/estudiantes")
    const [catalogs, query] = await Promise.all([getStudentCatalogs(), studentReturnQuery(searchParams)])

    return (
        <>
            <NavigationBread section="Estudiantes" href={studentHref("/estudiantes", query)} page="Nuevo alumno" />
            <div className="container mx-auto min-w-0 space-y-4 px-2 py-2">
                <h1 className="text-2xl font-bold">Nuevo alumno</h1>
                <NewStudentForm {...catalogs} query={query} />
            </div>
        </>
    )
}
