import { AuditSection } from "@/components/audit.section"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { StudentDetail as Student } from "../estudiantes.contract"
import { studentGenderOptions, studentTypeOptions } from "../estudiantes.forms"
import { StudentDocumentLink } from "./student-fields"

function Details({ items }: { items: { label: string; value?: string | null }[] }) {
    return (
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map(({ label, value }) => (
                <div className="min-w-0" key={label}>
                    <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
                    <dd className="break-words text-sm">{value || "—"}</dd>
                </div>
            ))}
        </dl>
    )
}

export function StudentDetail({ student }: { student: Student }) {
    const birth = student.fechaNacimiento?.slice(0, 10).split("-").reverse().join("/")
    return (
        <Card className="max-w-5xl">
            <CardHeader><CardTitle>{student.apellidos}, {student.nombres}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <Details items={[
                    { label: "Documento", value: `${student.tipoDocumento} ${student.numeroDocumento}` },
                    { label: "Género", value: studentGenderOptions.find(({ value }) => value === student.genero)?.label ?? student.genero },
                    { label: "Fecha de nacimiento", value: birth },
                    { label: "Correo", value: student.email },
                    { label: "Celular", value: student.celular },
                    { label: "Dirección", value: student.direccion },
                ]} />
                <StudentDocumentLink value={student.imgDoc} />
                <section className="space-y-3 border-t pt-4">
                    <h2 className="text-sm font-semibold">Datos académicos</h2>
                    <Details items={[
                        { label: "Tipo de alumno", value: studentTypeOptions.find(({ value }) => value === student.tipoEstudiante)?.label ?? "Sin clasificar" },
                        { label: "Facultad", value: student.facultad?.nombre },
                        { label: "Escuela", value: student.escuela?.nombre },
                        { label: "Código local", value: student.codigo },
                        { label: "Identificador Q10", value: student.idQ10?.trim() || "Sin vínculo Q10 local" },
                        { label: "UUID local", value: student.id },
                    ]} />
                </section>
                <AuditSection creadoEn={student.creadoEn ? new Date(student.creadoEn) : undefined}
                    modificadoEn={student.modificadoEn ? new Date(student.modificadoEn) : undefined} />
            </CardContent>
        </Card>
    )
}
