import Link from "next/link"
import { Pencil } from "lucide-react"
import NavigationBread from "@/components/navigation-bread"
import BackButton from "@/components/back.button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { ensureServerPermission } from "@/lib/server-permissions"
import { StudentDetail } from "@/modules/estudiantes/components/student-detail"
import { studentId } from "@/modules/estudiantes/estudiantes.contract"
import { studentNavigation, type StudentSearchParams } from "@/modules/estudiantes/estudiantes.navigation"
import { getStudent } from "@/modules/estudiantes/estudiantes.server"

export default async function EstudiantePage({ params, searchParams }: {
    params: Promise<{ id: string }>
    searchParams: StudentSearchParams
}) {
    await ensureServerPermission("/estudiantes")
    const { id } = await params
    const [student, href] = await Promise.all([
        studentId.safeParse(id).success ? getStudent(id) : Promise.resolve(null),
        studentNavigation(searchParams, id),
    ])

    return (
        <>
            <NavigationBread section="Estudiantes" href={href.list} page="Detalle" />
            <div className="container mx-auto min-w-0 space-y-4 px-2 py-2">
                <div className="flex max-w-5xl flex-wrap items-center justify-between gap-3">
                    <h1 className="text-2xl font-bold">Detalle del estudiante</h1>
                    <div className="flex flex-wrap gap-2">
                        <BackButton href={href.list} />
                        {student ? <Button asChild><Link href={href.edit} prefetch={false}><Pencil className="size-4" /> Editar datos locales</Link></Button> : null}
                    </div>
                </div>
                {student ? <StudentDetail student={student} /> : <Alert><AlertDescription>Estudiante no encontrado.</AlertDescription></Alert>}
            </div>
        </>
    )
}
