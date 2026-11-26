"use client"

import { useFormContext, useWatch } from "react-hook-form"
import { FileText } from "lucide-react"
import { InputField } from "@/components/forms/input.field"
import { SelectField } from "@/components/forms/select.field"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { allowedDocumentTypes, documentMaximumBytes, documentUrl, type Faculty, type School } from "../estudiantes.contract"
import { schoolMatches, studentTypeOptions, type AcademicValues } from "../estudiantes.forms"

export function StudentAcademicFields({ faculties, schools, disabled, canLeaveUnclassified = true }: {
    faculties: Faculty[]
    schools: School[]
    disabled: boolean
    canLeaveUnclassified?: boolean
}) {
    const { control, getValues, setValue } = useFormContext<AcademicValues>()
    const facultyId = useWatch({ control, name: "facultadId" })
    const kind = useWatch({ control, name: "tipoEstudiante" })
    const schoolId = useWatch({ control, name: "escuelaId" })
    const compatible = schools.filter((school) => schoolMatches(school, facultyId, kind))
    const currentSchool = schools.find((school) => String(school.id) === schoolId)
    const schoolOptions = currentSchool && !compatible.includes(currentSchool) ? [...compatible, currentSchool] : compatible

    function clearIncompatible(nextFaculty: string, nextKind: string) {
        const selected = schools.find((school) => String(school.id) === getValues("escuelaId"))
        if (selected && !schoolMatches(selected, nextFaculty, nextKind)) {
            setValue("escuelaId", "none", { shouldDirty: true })
        }
    }

    return (
        <div className="grid gap-4 md:grid-cols-2">
            <SelectField name="tipoEstudiante" control={control} label="Tipo de alumno" disabled={disabled}
                options={canLeaveUnclassified ? [{ value: "none", label: "Sin clasificar" }, ...studentTypeOptions] : studentTypeOptions}
                onValueChange={(value) => clearIncompatible(getValues("facultadId"), value)} />
            <InputField name="codigo" control={control} label="Código local" disabled={disabled} />
            <SelectField name="facultadId" control={control} label="Facultad" disabled={disabled}
                options={[{ value: "none", label: "Sin facultad" }, ...faculties.map((faculty) => ({ value: String(faculty.id), label: faculty.nombre }))]}
                onValueChange={(value) => {
                    if (value === "none") setValue("escuelaId", "none", { shouldDirty: true })
                    else clearIncompatible(value, getValues("tipoEstudiante"))
                }} />
            <SelectField name="escuelaId" control={control} label="Escuela" disabled={disabled}
                options={[{ value: "none", label: "Sin escuela" }, ...schoolOptions.map((school) => ({ value: String(school.id), label: school.nombre }))]}
                onValueChange={(value) => {
                    const school = schools.find((item) => String(item.id) === value)
                    if (school && !Number(getValues("facultadId"))) {
                        setValue("facultadId", String(school.facultadId), { shouldDirty: true })
                    }
                }} />
        </div>
    )
}

export function StudentDocumentLink({ value }: { value?: string | null }) {
    const parsed = documentUrl.safeParse(value)
    if (!parsed.success) return <span className="text-sm text-muted-foreground">Sin documento disponible</span>
    return (
        <Button variant="outline" size="sm" asChild>
            <a href={parsed.data} target="_blank" rel="noopener noreferrer"><FileText className="size-4" /> Ver documento</a>
        </Button>
    )
}

export function StudentDocumentField({ file, onChange, disabled, uploading, uploaded, current }: {
    file?: File
    onChange: (file?: File) => void
    disabled: boolean
    uploading: boolean
    uploaded: boolean
    current?: string | null
}) {
    const error = file && getStudentDocumentError(file)
    return (
        <Field className="gap-2" data-invalid={Boolean(error)}>
            <FieldLabel htmlFor={!file ? "student-document-file" : undefined}>Documento de identidad (opcional)</FieldLabel>
            {current ? <StudentDocumentLink value={current} /> : null}
            {!file ? (
                <Input id="student-document-file" className="max-w-md" type="file" accept={allowedDocumentTypes.join(",")}
                    disabled={disabled} onChange={(event) => onChange(event.target.files?.[0])} />
            ) : (
                <div className="flex flex-wrap items-center gap-2">
                    <span className="break-all text-sm">{file.name}</span>
                    <Button disabled={disabled} variant="outline" size="sm" type="button" onClick={() => onChange()}>Quitar archivo</Button>
                </div>
            )}
            <FieldDescription>PDF, JPG o PNG de hasta 10 MB.</FieldDescription>
            {uploading ? <span className="text-sm" role="status">Subiendo documento…</span> : null}
            {uploaded ? <span className="text-sm" role="status">Documento cargado</span> : null}
            {error ? <FieldError>{error}</FieldError> : null}
        </Field>
    )
}

export function getStudentDocumentError(file: File) {
    if (!allowedDocumentTypes.includes(file.type) || !file.size) return "Seleccione un documento PDF, JPG o PNG válido."
    if (file.size > documentMaximumBytes) return "El documento debe pesar como máximo 10 MB."
}
