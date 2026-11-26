import NavigationBread from "@/components/navigation-bread"
import BackButton from "@/components/back.button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ensureServerPermission } from "@/lib/server-permissions"
import { EditStudentForm } from "@/modules/estudiantes/components/edit-student.form"
import { studentId } from "@/modules/estudiantes/estudiantes.contract"
import { studentNavigation, type StudentSearchParams } from "@/modules/estudiantes/estudiantes.navigation"
import { getStudent, getStudentCatalogs } from "@/modules/estudiantes/estudiantes.server"

export default async function EditarEstudiantePage({ params, searchParams }: {
    params: Promise<{ id: string }>
    searchParams: StudentSearchParams
}) {
    await ensureServerPermission("/estudiantes")
    const { id } = await params
    const [data, href] = await Promise.all([
        studentId.safeParse(id).success ? Promise.all([getStudent(id), getStudentCatalogs()]) : Promise.resolve(null),
        studentNavigation(searchParams, id),
    ])

    return (
        <>
            <NavigationBread section="Estudiantes" href={href.list} page="Edición local" />
            <div className="container mx-auto min-w-0 space-y-4 px-2 py-2">
                <h1 className="text-2xl font-bold">Editar datos locales</h1>
                {data?.[0] ? <EditStudentForm student={data[0]} {...data[1]} detailHref={href.detail} /> : (
                    <>
                        <Alert><AlertDescription>Estudiante no encontrado.</AlertDescription></Alert>
                        <BackButton href={href.list} />
                    </>
                )}
            </div>
        </>
    )
}
