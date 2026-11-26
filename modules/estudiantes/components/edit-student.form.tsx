"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"
import BackButton from "@/components/back.button"
import SaveButton from "@/components/save.button"
import { InputField } from "@/components/forms/input.field"
import { SelectField } from "@/components/forms/select.field"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { studentApi, StudentClientError, studentJson } from "../estudiantes.client"
import { studentPatchSchema, type Faculty, type School, type StudentDetail } from "../estudiantes.contract"
import { buildStudentPatch, editStudentSchema, getEditDefaults, studentDocumentOptions, studentGenderOptions, type EditStudentValues } from "../estudiantes.forms"
import { getStudentDocumentError, StudentAcademicFields, StudentDocumentField } from "./student-fields"
import { useStudentDocument } from "./use-student-document"

export function EditStudentForm({ student, faculties, schools, detailHref }: {
    student: StudentDetail
    faculties: Faculty[]
    schools: School[]
    detailHref: string
}) {
    const router = useRouter()
    const defaults = getEditDefaults(student)
    const form = useForm<EditStudentValues>({ resolver: zodResolver(editStudentSchema), defaultValues: defaults })
    const { control, formState: { isSubmitting, isDirty } } = form
    const uploading = useStudentDocument()
    const [file, setFile] = useState<File>()
    const [error, setError] = useState<string>()
    const locked = useRef(false)
    const [saved, setSaved] = useState(false)
    const identityLocked = Boolean(student.idQ10?.trim())
    const disabled = isSubmitting || saved

    async function save(values: EditStudentValues) {
        if (locked.current || saved || (file && getStudentDocumentError(file))) return
        setError(undefined)
        const parsed = studentPatchSchema.safeParse(buildStudentPatch(values, defaults, identityLocked))
        if (!parsed.success) {
            setError("Revise los campos que cambió antes de guardar.")
            return
        }
        const patch = parsed.data
        if (!Object.keys(patch).length && !file) {
            setError("No hay cambios para guardar.")
            return
        }
        locked.current = true
        try {
            const imgDoc = await uploading.upload(file)
            if (imgDoc) patch.imgDoc = imgDoc
            const updated = await studentApi<StudentDetail | null>(`/${student.id}`, studentJson("PATCH", patch))
            if (!updated?.id) {
                setError("CIUNAC no devolvió el estudiante actualizado.")
                return
            }
            setSaved(true)
            toast.success("Datos locales actualizados")
            router.replace(detailHref)
            router.refresh()
        } catch (failure) {
            setError(failure instanceof StudentClientError ? failure.message : "No se pudo guardar la ficha local.")
        } finally {
            locked.current = false
        }
    }

    const documentOptions = studentDocumentOptions.some(({ value }) => value === student.tipoDocumento)
        ? studentDocumentOptions
        : [...studentDocumentOptions, { value: student.tipoDocumento, label: student.tipoDocumento }]

    return (
        <FormProvider {...form}>
            <Card className="max-w-5xl">
                <CardHeader><CardTitle>Datos del alumno</CardTitle></CardHeader>
                <CardContent>
                    <form id="edit-student-form" noValidate className="space-y-5" onSubmit={form.handleSubmit(save)}>
                        <Alert><AlertDescription>Los cambios se guardan exclusivamente en CIUNAC. La ficha en Q10 conserva sus datos.</AlertDescription></Alert>
                        {error ? <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert> : null}
                        <div className="grid gap-4 md:grid-cols-2">
                            <InputField control={control} name="nombres" label="Nombres" disabled={disabled} />
                            <InputField control={control} name="apellidos" label="Apellidos" disabled={disabled} />
                            <SelectField control={control} name="tipoDocumento" label="Tipo de documento" options={documentOptions} disabled={disabled || identityLocked} />
                            <InputField control={control} name="numeroDocumento" label="Número de documento" disabled={disabled || identityLocked} />
                            <SelectField control={control} name="genero" label="Género" options={studentGenderOptions} disabled={disabled} />
                            <InputField control={control} name="fechaNacimiento" label="Fecha de nacimiento" type="date" disabled={disabled} />
                            <InputField control={control} name="email" label="Correo" type="email" disabled={disabled} />
                            <InputField control={control} name="celular" label="Celular" type="tel" disabled={disabled} />
                            <InputField control={control} name="direccion" label="Dirección" disabled={disabled} />
                        </div>
                        <div className="space-y-3 border-t pt-4">
                            <h2 className="text-sm font-semibold">Datos académicos</h2>
                            <StudentAcademicFields faculties={faculties} schools={schools} disabled={disabled} canLeaveUnclassified={!student.tipoEstudiante} />
                        </div>
                        <StudentDocumentField file={file} onChange={setFile} disabled={disabled}
                            uploading={uploading.uploading} uploaded={Boolean(file && file === uploading.uploadedFile)} current={student.imgDoc} />
                    </form>
                </CardContent>
                <CardFooter className="flex flex-wrap justify-between gap-2 border-t">
                    <BackButton href={detailHref} />
                    <SaveButton form={form} formId="edit-student-form"
                        disabled={disabled || (!isDirty && !file) || Boolean(file && getStudentDocumentError(file))} />
                </CardFooter>
            </Card>
        </FormProvider>
    )
}
