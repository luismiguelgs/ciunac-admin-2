"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight, Eye, Plus } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton"
import { studentApi, StudentClientError } from "../estudiantes.client"
import { studentHref, type Faculty, type School, type StudentPage } from "../estudiantes.contract"

const typeOptions = [
    { value: "PRE", label: "Pregrado" },
    { value: "POS", label: "Posgrado" },
    { value: "PG", label: "PG" },
    { value: "SIN_CLASIFICAR", label: "Sin clasificar" },
]

function FilterSelect({ id, label, value, options, onChange, className }: {
    id: string
    label: string
    value: string
    options: { value: string; label: string }[]
    onChange: (value: string) => void
    className?: string
}) {
    return (
        <Field className={className ?? "gap-1.5"}>
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger id={id} className="w-full"><SelectValue placeholder="Todos" /></SelectTrigger>
                <SelectContent>
                    {options.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}
                </SelectContent>
            </Select>
        </Field>
    )
}

function replaceQuery(params: URLSearchParams) {
    window.history.replaceState(null, "", studentHref("/estudiantes", params.toString()))
}

type ListResult = { query: string; attempt: number } & ({ page: StudentPage } | { error: string })

export function EstudiantesList({ faculties, schools }: { faculties: Faculty[]; schools: School[] }) {
    const params = useSearchParams()
    const query = params.toString()
    const [search, setSearch] = useState(params.get("search") ?? "")
    const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
    const [result, setResult] = useState<ListResult>()
    const [attempt, setAttempt] = useState(0)
    const current = result?.query === query && result.attempt === attempt ? result : undefined
    const response = current && "page" in current ? current.page : undefined
    const facultyId = params.get("facultadId") ?? "all"
    const hasFilters = ["search", "tipoEstudiante", "facultadId", "escuelaId", "vinculadoQ10"].some((key) => params.has(key))

    useEffect(() => {
        const controller = new AbortController()
        studentApi<StudentPage>(query ? `?${query}` : "", { signal: controller.signal }).then((page) => {
            if (controller.signal.aborted) return
            if (page.meta.total > 0 && page.meta.page > page.meta.totalPages && page.meta.totalPages > 0) {
                const next = new URLSearchParams(query)
                next.set("page", String(page.meta.totalPages))
                replaceQuery(next)
                return
            }
            setResult({ query, attempt, page })
        }).catch((error) => {
            if (controller.signal.aborted) return
            setResult({ query, attempt, error: error instanceof StudentClientError ? error.message : "No se pudo cargar el listado." })
        })
        return () => controller.abort()
    }, [query, attempt])

    useEffect(() => {
        const restoreSearch = () => {
            clearTimeout(timer.current)
            setSearch(new URLSearchParams(window.location.search).get("search") ?? "")
        }
        window.addEventListener("popstate", restoreSearch)
        return () => {
            clearTimeout(timer.current)
            window.removeEventListener("popstate", restoreSearch)
        }
    }, [])

    function updateQuery(mutator: (next: URLSearchParams) => void) {
        clearTimeout(timer.current)
        const next = new URLSearchParams(window.location.search)
        mutator(next)
        if (next.toString() !== new URLSearchParams(window.location.search).toString()) replaceQuery(next)
    }

    function applySearch(next: URLSearchParams, value: string) {
        if (value === (next.get("search") ?? "")) return
        if (value) next.set("search", value)
        else next.delete("search")
        next.delete("page")
    }

    function setFilter(key: string, value: string) {
        updateQuery((next) => {
            applySearch(next, search.trim())
            if (value === "all") next.delete(key)
            else next.set(key, value)
            next.delete("page")
            if (key === "facultadId" && value !== "all" && !schools.some((item) =>
                String(item.facultadId) === value && String(item.id) === next.get("escuelaId")
            )) next.delete("escuelaId")
        })
    }

    function goTo(page: number) {
        updateQuery((next) => {
            const before = next.get("search") ?? ""
            applySearch(next, search.trim())
            if (before === search.trim()) next.set("page", String(page))
        })
    }

    return (
        <>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-2xl font-bold">Estudiantes</h1>
                <Button asChild><Link href={studentHref("/estudiantes/nuevo", query)} prefetch={false}><Plus className="size-4" /> Nuevo alumno</Link></Button>
            </div>
            <div className="mb-4 grid grid-cols-2 items-end gap-3 xl:grid-cols-6">
                <Field className="col-span-2 gap-1.5">
                    <FieldLabel htmlFor="student-search">Buscar estudiantes</FieldLabel>
                    <Input id="student-search" value={search} placeholder="Nombre, documento, código o correo"
                        onChange={(event) => {
                            const value = event.target.value
                            setSearch(value)
                            clearTimeout(timer.current)
                            timer.current = setTimeout(() => updateQuery((next) => applySearch(next, value.trim())), 350)
                        }} />
                </Field>
                <FilterSelect id="student-type" label="Tipo de alumno" value={params.get("tipoEstudiante") ?? "all"}
                    options={[{ value: "all", label: "Todos" }, ...typeOptions]} onChange={(value) => setFilter("tipoEstudiante", value)} />
                <FilterSelect id="student-faculty" label="Facultad" value={facultyId}
                    options={[{ value: "all", label: "Todas" }, ...faculties.map((item) => ({ value: String(item.id), label: item.nombre }))]}
                    onChange={(value) => setFilter("facultadId", value)} />
                <FilterSelect id="student-school" label="Escuela" value={params.get("escuelaId") ?? "all"}
                    options={[{ value: "all", label: "Todas" }, ...schools.filter((item) => facultyId === "all" || String(item.facultadId) === facultyId)
                        .map((item) => ({ value: String(item.id), label: item.nombre }))]}
                    onChange={(value) => setFilter("escuelaId", value)} />
                <FilterSelect id="student-q10" label="Vínculo Q10" value={params.get("vinculadoQ10") ?? "all"}
                    options={[{ value: "all", label: "Todos" }, { value: "true", label: "Con vínculo local" }, { value: "false", label: "Sin vínculo local" }]}
                    onChange={(value) => setFilter("vinculadoQ10", value)} />
            </div>
            {query || search ? (
                <Button className="mb-3" type="button" variant="outline" size="sm" onClick={() => {
                    clearTimeout(timer.current)
                    setSearch("")
                    replaceQuery(new URLSearchParams())
                }}>Limpiar filtros</Button>
            ) : null}
            {!current ? <DataTableSkeleton /> : null}
            {current && "error" in current ? (
                <Alert variant="destructive">
                    <AlertDescription className="flex flex-wrap items-center gap-2">
                        {current.error}<Button variant="outline" size="sm" onClick={() => setAttempt((value) => value + 1)}>Volver a consultar</Button>
                    </AlertDescription>
                </Alert>
            ) : null}
            {response ? (
                <>
                    <div className="overflow-hidden rounded-md border">
                        <Table className="text-[13px]">
                            <TableHeader className="bg-black">
                                <TableRow className="hover:bg-black">
                                    {["Estudiante", "Documento", "Código local", "Tipo", "Facultad", "Escuela", "Q10", "Acciones"].map((label) =>
                                        <TableHead className="font-semibold text-white" key={label}>{label}</TableHead>)}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {response.data.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.apellidos}, {item.nombres}</TableCell>
                                        <TableCell>{item.tipoDocumento} {item.numeroDocumento}</TableCell>
                                        <TableCell>{item.codigo || "—"}</TableCell>
                                        <TableCell>{typeOptions.find((option) => option.value === item.tipoEstudiante)?.label ?? "Sin clasificar"}</TableCell>
                                        <TableCell>{item.facultad?.nombre ?? "—"}</TableCell>
                                        <TableCell>{item.escuela?.nombre ?? "—"}</TableCell>
                                        <TableCell><Badge variant={item.idQ10?.trim() ? "secondary" : "outline"}>
                                            {item.idQ10?.trim() || "Sin vínculo Q10 local"}
                                        </Badge></TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={studentHref(`/estudiantes/${item.id}`, query)} prefetch={false} aria-label="Ver detalle" title="Ver detalle">
                                                    <Eye className="size-4" />
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {response.data.length === 0 ? (
                                    <TableRow><TableCell colSpan={8} className="h-24 text-center">
                                        {hasFilters ? "No hay estudiantes que coincidan con los filtros." : "No hay estudiantes registrados."}
                                    </TableCell></TableRow>
                                ) : null}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                        <span className="text-muted-foreground" role="status">{response.meta.total} estudiantes</span>
                        <div className="flex flex-wrap items-end gap-2">
                            <FilterSelect id="student-limit" label="Filas por página" className="w-auto gap-1.5" value={String(response.meta.limit)}
                                options={[...new Set([10, 25, 50, 100, response.meta.limit])].sort((a, b) => a - b)
                                    .map((limit) => ({ value: String(limit), label: String(limit) }))}
                                onChange={(value) => setFilter("limit", value)} />
                            <span className="self-end px-2 pb-2 whitespace-nowrap">Página {response.meta.totalPages ? response.meta.page : 0} de {response.meta.totalPages}</span>
                            <Button variant="outline" size="icon" title="Página anterior" aria-label="Página anterior"
                                disabled={response.meta.page <= 1 || !response.meta.totalPages} onClick={() => goTo(response.meta.page - 1)}><ChevronLeft /></Button>
                            <Button variant="outline" size="icon" title="Página siguiente" aria-label="Página siguiente"
                                disabled={response.meta.page >= response.meta.totalPages} onClick={() => goTo(response.meta.page + 1)}><ChevronRight /></Button>
                        </div>
                    </div>
                </>
            ) : null}
        </>
    )
}
