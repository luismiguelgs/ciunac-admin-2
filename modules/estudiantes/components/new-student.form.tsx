"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2, Search, UserRoundPlus } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm, useWatch, type FieldPath } from "react-hook-form"
import BackButton from "@/components/back.button"
import { InputField } from "@/components/forms/input.field"
import { SelectField } from "@/components/forms/select.field"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
    AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogHeader, AlertDialogFooter,
} from "@/components/ui/alert-dialog"
import { studentApi, studentJson, StudentClientError } from "../estudiantes.client"
import { studentHref, type Faculty, type Program, type RegistrationSuccess, type School, type StudentApiFailure, type StudentDetail } from "../estudiantes.contract"
import { commonDefaults, newStudentSchema, studentDocumentOptions, studentGenderOptions, toQ10Payload, type NewStudentValues } from "../estudiantes.forms"
import { getStudentDocumentError, StudentAcademicFields, StudentDocumentField } from "./student-fields"
import { useStudentDocument } from "./use-student-document"

type FoundStudent = { id: string; idQ10: string | null }
type Lookup = { identity: string; student: FoundStudent | null }
const correctableCodes = new Set([
    "Q10_INVALID_JSON", "Q10_REQUEST_VALIDATION_FAILED", "Q10_LOCAL_VALIDATION_FAILED", "Q10_REQUEST_TOO_LARGE",
    "Q10_UNAUTHORIZED", "PROGRAM_UNAVAILABLE", "Q10_CATALOG_UNAVAILABLE", "Q10_CATALOG_CONFIGURATION",
    "Q10_CATALOG_INVALID", "CIUNAC_CONFIGURATION", "CIUNAC_UNAVAILABLE", "CIUNAC_UNAUTHORIZED",
    "INVALID_FIELDS", "INVALID_JSON", "INVALID_ORIGIN", "SESSION_REQUIRED", "FORBIDDEN", "REQUEST_TOO_LARGE",
    "STUDENT_ALREADY_LINKED", "STUDENT_REVIEW_REQUIRED",
])
const fieldMap: Record<string, FieldPath<NewStudentValues>> = {
    Primer_nombre: "primerNombre", Segundo_nombre: "segundoNombre", Primer_apellido: "primerApellido",
    Segundo_apellido: "segundoApellido", Email: "email", Codigo_tipo_identificacion: "tipoDocumento",
    Numero_identificacion: "numeroDocumento", Genero: "genero", Fecha_nacimiento: "fechaNacimiento",
    Telefono: "telefono", Celular: "celular", Direccion: "direccion", Codigo_programa: "programa",
    tipoEstudiante: "tipoEstudiante", codigo: "codigo", facultadId: "facultadId", escuelaId: "escuelaId",
}
const ruleMessages: Record<string, string> = {
    FACULTY_NOT_FOUND: "La facultad seleccionada ya no está disponible.",
    SCHOOL_NOT_FOUND: "La escuela seleccionada ya no está disponible.",
    SCHOOL_FACULTY_MISMATCH: "La escuela no corresponde a la facultad.",
    SCHOOL_UNCLASSIFIED: "La escuela no está clasificada para este tipo de alumno.",
    SCHOOL_TYPE_MISMATCH: "La escuela no corresponde al tipo de alumno.",
    isEmail: "Ingrese un correo válido.",
    isLength: "Revise la longitud del valor.",
}

export function NewStudentForm({ faculties, schools, query }: { faculties: Faculty[]; schools: School[]; query: string }) {
    const router = useRouter()
    const form = useForm<NewStudentValues>({
        resolver: zodResolver(newStudentSchema),
        defaultValues: {
            ...commonDefaults, primerNombre: "", segundoNombre: "", primerApellido: "", segundoApellido: "",
            tipoDocumento: "DNI", numeroDocumento: "", fechaNacimiento: "", telefono: "", programa: "",
        },
    })
    const { control } = form
    const [attempt, setAttempt] = useState(0)
    const [catalog, setCatalog] = useState<{ attempt: number; programs: Program[]; error?: string }>()
    const currentCatalog = catalog?.attempt === attempt ? catalog : undefined
    const [lookup, setLookup] = useState<Lookup>()
    const [searching, setSearching] = useState(false)
    const [lookupError, setLookupError] = useState<string>()
    const [verified, setVerified] = useState<Lookup>()
    const [attachment, setAttachment] = useState<{ identity: string; file: File }>()
    const [confirmation, setConfirmation] = useState<NewStudentValues>()
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<StudentApiFailure>()
    const [completed, setCompleted] = useState<RegistrationSuccess>()
    const [blocked, setBlocked] = useState(false)
    const [detailStatus, setDetailStatus] = useState<"loading" | "ready" | "mismatch" | "error">()
    const operation = useRef(false)
    const documentUpload = useStudentDocument()
    const [type, number] = useWatch({ control, name: ["tipoDocumento", "numeroDocumento"] })
    const identity = `${type}:${number.trim()}`
    const checked = lookup?.identity === identity ? lookup : undefined
    const linked = Boolean(checked?.student?.idQ10?.trim())
    const verificationRequired = !!checked?.student && !linked
    const verifiedUnlinked = !!checked && verified === checked
    const file = attachment?.identity === identity ? attachment.file : undefined

    useEffect(() => {
        const controller = new AbortController()
        studentApi<Program[]>("/programas", { signal: controller.signal }).then((programs) => {
            if (!controller.signal.aborted) setCatalog({ programs, attempt })
        }).catch((failure: unknown) => {
            if (!controller.signal.aborted) {
                setCatalog({ programs: [], attempt, error: failure instanceof StudentClientError ? failure.message : "No se pudo consultar Q10." })
            }
        })
        return () => controller.abort()
    }, [attempt])

    async function search() {
        if (!(await form.trigger(["tipoDocumento", "numeroDocumento"]))) return
        setSearching(true)
        setLookupError(undefined)
        setLookup(undefined)
        try {
            const student = await studentApi<FoundStudent | null>("/buscar", studentJson("POST", { documento: number.trim() }))
            setLookup({ identity, student })
        } catch (failure) {
            setLookupError(failure instanceof StudentClientError ? failure.message : "No se pudo buscar el documento.")
        } finally {
            setSearching(false)
        }
    }

    function prepare(values: NewStudentValues) {
        if (!checked || linked || (verificationRequired && !verifiedUnlinked)) return
        if (file && getStudentDocumentError(file)) return
        if (!currentCatalog?.programs.some(({ code }) => code === values.programa)) {
            form.setError("programa", { message: "Seleccione un programa disponible." })
            return
        }
        setError(undefined)
        setConfirmation(values)
    }

    async function loadDetail(id: string, expectedDate: string) {
        setDetailStatus("loading")
        try {
            const student = await studentApi<StudentDetail | null>(`/${id}`)
            if (!student) {
                setDetailStatus("error")
                return
            }
            setDetailStatus(student.fechaNacimiento?.slice(0, 10) !== expectedDate ? "mismatch" : "ready")
        } catch {
            setDetailStatus("error")
        }
    }

    async function confirm() {
        if (!confirmation || operation.current || blocked || completed) return
        const values = confirmation
        operation.current = true
        setSaving(true)
        setConfirmation(undefined)
        let registrationSent = false
        try {
            const imgDoc = await documentUpload.upload(file)
            registrationSent = true
            const result = await studentApi<RegistrationSuccess>("/alta", studentJson("POST", {
                payload: toQ10Payload(values, imgDoc), verifiedUnlinked,
            }))
            setCompleted(result)
            await loadDetail(result.estudiante.id, values.fechaNacimiento)
        } catch (failure) {
            const apiFailure = failure instanceof StudentClientError ? failure.failure : undefined
            if (!registrationSent) {
                setError(apiFailure ?? { code: "UPLOAD_FAILED", message: "No se pudo subir el documento. Revise el archivo y vuelva a confirmar." })
                return
            }
            if (apiFailure && correctableCodes.has(apiFailure.code)) {
                for (const issue of apiFailure.validationErrors ?? []) {
                    if (Object.hasOwn(fieldMap, issue.field)) {
                        const message = issue.rules.map((rule) => Object.hasOwn(ruleMessages, rule) ? ruleMessages[rule] : "Revise el valor de este campo.").join(" ")
                        form.setError(fieldMap[issue.field], { message })
                    }
                }
                if (apiFailure.code === "STUDENT_ALREADY_LINKED" || apiFailure.code === "STUDENT_REVIEW_REQUIRED") setLookup(undefined)
                setError(apiFailure)
            } else {
                setBlocked(true)
                setError(apiFailure?.code.startsWith("Q10_") ? apiFailure : {
                    code: "Q10_RESULT_UNCERTAIN", message: "No se pudo confirmar el resultado del alta. Consulte con soporte antes de volver a registrar al alumno.",
                })
            }
        } finally {
            operation.current = false
            setSaving(false)
        }
    }

    const backHref = studentHref("/estudiantes", query)
    const detailHref = (id: string) => studentHref(`/estudiantes/${id}`, query)
    if (completed) {
        return (
            <Alert>
                <AlertTitle>Alta confirmada en Q10</AlertTitle>
                <AlertDescription>
                    <p>Identificador Q10 {completed.estudiante.idQ10}</p>
                    <p className="break-all">UUID local {completed.estudiante.id}</p>
                    <p className="break-all">Referencia {completed.operationId}</p>
                    {detailStatus === "loading" ? <p role="status">Consultando la ficha local…</p> : null}
                    {detailStatus === "error" ? <p>No se pudo consultar la ficha local.</p> : null}
                    {detailStatus === "mismatch" ? <p>La fecha de nacimiento devuelta por CIUNAC difiere de la enviada. Revise la ficha local.</p> : null}
                    <div className="mt-2 flex flex-wrap gap-2">
                        <BackButton href={backHref} />
                        {detailStatus === "error" ? (
                            <Button variant="outline" type="button" onClick={() => void loadDetail(completed.estudiante.id, form.getValues("fechaNacimiento"))}>Volver a consultar</Button>
                        ) : (
                            <Button asChild><Link href={detailHref(completed.estudiante.id)} prefetch={false}>Ver detalle</Link></Button>
                        )}
                    </div>
                </AlertDescription>
            </Alert>
        )
    }

    const disabled = saving || blocked
    const programs = currentCatalog?.programs ?? []
    return (
        <FormProvider {...form}>
            <Card className="max-w-5xl">
                <CardHeader><CardTitle>Datos del alumno</CardTitle></CardHeader>
                <CardContent>
                    <form id="new-student-form" noValidate className="space-y-5" onSubmit={form.handleSubmit(prepare)}>
                        {error ? (
                            <Alert variant="destructive">
                                <AlertTitle>{blocked ? "Alta pendiente de revisión" : "No se pudo completar el alta"}</AlertTitle>
                                <AlertDescription>
                                    <p>{error.message}</p>
                                    {error.operationId ? <p className="break-all">Referencia {error.operationId}</p> : null}
                                    {error.idQ10 ? <p>Identificador Q10 {error.idQ10}</p> : null}
                                    {error.estudianteId ? <Link className="underline" href={detailHref(error.estudianteId)} prefetch={false}>Consultar ficha local</Link> : null}
                                    {error.validationErrors?.some(({ field }) => !Object.hasOwn(fieldMap, field)) ? <p>Revise el formato de la solicitud antes de confirmar.</p> : null}
                                    {error.code === "Q10_LOCAL_VALIDATION_FAILED" ? (
                                        <Button size="sm" className="mt-2" variant="outline" type="button" onClick={() => router.refresh()}>Actualizar catálogos</Button>
                                    ) : null}
                                </AlertDescription>
                            </Alert>
                        ) : null}
                        <div className="grid items-start gap-4 md:grid-cols-3">
                            <SelectField control={control} name="tipoDocumento" label="Tipo de documento" options={studentDocumentOptions} disabled={disabled || searching} />
                            <InputField control={control} name="numeroDocumento" label="Número de documento" disabled={disabled || searching} />
                            <Button className="justify-self-start md:mt-7" type="button" variant="outline" disabled={disabled || searching} onClick={() => void search()}>
                                {searching ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />} Buscar documento
                            </Button>
                        </div>
                        {lookupError ? <Alert variant="destructive"><AlertDescription>{lookupError}</AlertDescription></Alert> : null}
                        {checked ? (
                            <Alert>
                                <AlertDescription>
                                    {linked ? "El estudiante ya tiene un vínculo Q10 local." : checked.student ? "El estudiante existe localmente y no tiene vínculo Q10 local." : "No se encontró un registro local para este documento."}
                                    {checked.student ? <Link className="underline" href={detailHref(checked.student.id)} prefetch={false}> Ver ficha local</Link> : null}
                                    {verificationRequired ? (
                                        <label className="mt-2 flex items-start gap-2 text-foreground">
                                            <Checkbox checked={verifiedUnlinked} disabled={disabled} onCheckedChange={(value) => setVerified(value === true ? checked : undefined)} />
                                            Confirmo que revisé Q10 y puedo continuar con el alta.
                                        </label>
                                    ) : null}
                                </AlertDescription>
                            </Alert>
                        ) : null}
                        <div className="grid gap-4 md:grid-cols-2">
                            <InputField control={control} name="primerNombre" label="Primer nombre" disabled={disabled} />
                            <InputField control={control} name="segundoNombre" label="Segundo nombre (opcional)" disabled={disabled} />
                            <InputField control={control} name="primerApellido" label="Primer apellido" disabled={disabled} />
                            <InputField control={control} name="segundoApellido" label="Segundo apellido" disabled={disabled} />
                            <SelectField control={control} name="genero" label="Género" options={studentGenderOptions} disabled={disabled} />
                            <InputField control={control} name="fechaNacimiento" label="Fecha de nacimiento" type="date" disabled={disabled} />
                            <InputField control={control} name="email" label="Correo" type="email" disabled={disabled} />
                            <InputField control={control} name="telefono" label="Teléfono" type="tel" disabled={disabled} />
                            <InputField control={control} name="celular" label="Celular" type="tel" disabled={disabled} />
                            <InputField control={control} name="direccion" label="Dirección (opcional)" disabled={disabled} />
                        </div>
                        <div className="space-y-3 border-t pt-4">
                            <h2 className="text-sm font-semibold">Datos académicos</h2>
                            <SelectField control={control} name="programa" label="Programa Q10" disabled={disabled || !programs.length}
                                loading={!currentCatalog} options={programs.map(({ code, name }) => ({ value: code, label: name }))} />
                            {currentCatalog && (!programs.length || error?.code === "PROGRAM_UNAVAILABLE" || error?.code.startsWith("Q10_CATALOG")) ? (
                                <Alert variant="destructive">
                                    <AlertDescription className="flex flex-wrap items-center gap-2">
                                        {currentCatalog.error || (programs.length ? "Actualice el catálogo de programas Q10." : "No hay programas Q10 disponibles.")}
                                        <Button size="sm" variant="outline" type="button" disabled={disabled} onClick={() => setAttempt((value) => value + 1)}>Actualizar programas</Button>
                                    </AlertDescription>
                                </Alert>
                            ) : null}
                            <StudentAcademicFields faculties={faculties} schools={schools} disabled={disabled} />
                        </div>
                        <StudentDocumentField file={file} disabled={disabled} uploading={documentUpload.uploading}
                            uploaded={Boolean(file && file === documentUpload.uploadedFile)}
                            onChange={(selected) => setAttachment(selected ? { identity, file: selected } : undefined)} />
                    </form>
                </CardContent>
                <CardFooter className="flex flex-wrap justify-between gap-2 border-t">
                    {saving ? <Button variant="outline" disabled>Regresar</Button> : <BackButton href={backHref} />}
                    <Button type="submit" form="new-student-form"
                        disabled={disabled || searching || !checked || linked || (verificationRequired && !verifiedUnlinked) || !programs.length || Boolean(file && getStudentDocumentError(file))}>
                        {saving ? <Loader2 className="size-4 animate-spin" /> : <UserRoundPlus className="size-4" />}
                        {saving ? documentUpload.uploading ? "Subiendo documento…" : "Registrando…" : "Registrar en Q10"}
                    </Button>
                </CardFooter>
            </Card>
            <AlertDialog open={Boolean(confirmation)} onOpenChange={(open) => { if (!open) setConfirmation(undefined) }}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar alta en Q10</AlertDialogTitle>
                        <AlertDialogDescription>Se registrará al alumno, se sincronizará su ficha local y se solicitará su matrícula en el programa seleccionado.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <dl className="space-y-1 break-words text-sm">
                        <div><dt className="inline font-semibold">Alumno </dt><dd className="inline">{confirmation?.primerNombre} {confirmation?.segundoNombre} {confirmation?.primerApellido} {confirmation?.segundoApellido}</dd></div>
                        <div><dt className="inline font-semibold">Documento </dt><dd className="inline">{confirmation?.tipoDocumento} {confirmation?.numeroDocumento}</dd></div>
                        <div><dt className="inline font-semibold">Programa </dt><dd className="inline">{programs.find(({ code }) => code === confirmation?.programa)?.name}</dd></div>
                    </dl>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <Button onClick={() => void confirm()}>Confirmar registro</Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </FormProvider>
    )
}
