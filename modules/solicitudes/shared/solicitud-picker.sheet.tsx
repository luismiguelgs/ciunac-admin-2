"use client"

import * as React from "react"
import { Calendar, Fingerprint, Globe2, Layers, ListPlus, Loader2, Search, User } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { formatDate } from "@/lib/utils"
import useOpciones from "@/modules/estructura/hooks/use-opciones"
import type { IEstado } from "@/modules/estructura/interfaces/types.interface"
import { Collection } from "@/modules/estructura/services/opciones.service"
import type { ISolicitud } from "./solicitud.interface"
import { findSolicitudEstado, type SolicitudEstadoKey } from "./solicitud-workflow"
import SolicitudesService from "./solicitudes.service"

interface SolicitudPickerSheetProps {
    endpoint: string
    stateKey?: SolicitudEstadoKey
    triggerLabel?: string
    title?: string
    description?: string
    onSelect: (solicitud: ISolicitud) => void | Promise<void>
    disabled?: boolean
}

export function SolicitudPickerSheet({
    endpoint,
    stateKey = "pagada",
    triggerLabel = "Asignar solicitud",
    title = "Solicitudes pagadas",
    description = "Seleccione una solicitud para completar el formulario.",
    onSelect,
    disabled = false,
}: SolicitudPickerSheetProps) {
    const [open, setOpen] = React.useState(false)
    const [items, setItems] = React.useState<ISolicitud[]>([])
    const [query, setQuery] = React.useState("")
    const [loading, setLoading] = React.useState(false)
    const [selectingId, setSelectingId] = React.useState<number | null>(null)
    const { data: estados, loading: loadingEstados } = useOpciones<IEstado>(Collection.Estados)
    const estado = React.useMemo(() => findSolicitudEstado(estados, stateKey), [estados, stateKey])

    React.useEffect(() => {
        if (!open || loadingEstados) return
        if (typeof estado?.id !== "number") {
            toast.error(`No se encontro el estado ${stateKey} para solicitudes`)
            return
        }

        let active = true
        setLoading(true)
        setQuery("")
        SolicitudesService.fetchItemByState(endpoint, estado.id)
            .then(data => {
                if (active) setItems(Array.isArray(data) ? data : [])
            })
            .catch(error => {
                console.error(error)
                toast.error("No se pudieron cargar las solicitudes")
            })
            .finally(() => {
                if (active) setLoading(false)
            })

        return () => {
            active = false
        }
    }, [endpoint, estado?.id, loadingEstados, open, stateKey])

    const filteredItems = React.useMemo(() => {
        const normalized = query.trim().toLocaleLowerCase("es-PE")
        if (!normalized) return items

        return items.filter(item => {
            const student = `${item.estudiante?.apellidos || ""} ${item.estudiante?.nombres || ""}`.toLocaleLowerCase("es-PE")
            const document = item.estudiante?.numeroDocumento?.toLocaleLowerCase("es-PE") || ""
            return student.includes(normalized) || document.includes(normalized) || String(item.id).includes(normalized)
        })
    }, [items, query])

    async function handleSelect(item: ISolicitud) {
        setSelectingId(item.id)
        try {
            await onSelect(item)
            setOpen(false)
        } catch (error) {
            console.error(error)
            toast.error("No se pudo asignar la solicitud")
        } finally {
            setSelectingId(null)
        }
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button type="button" variant="outline" disabled={disabled} className="gap-2">
                    <ListPlus className="h-4 w-4" />
                    {triggerLabel}
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex h-full w-[420px] flex-col sm:w-[560px]">
                <SheetHeader className="shrink-0">
                    <SheetTitle>{title}</SheetTitle>
                    <SheetDescription>{description}</SheetDescription>
                    <div className="relative pt-3">
                        <Search className="absolute left-2.5 top-5.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            value={query}
                            onChange={event => setQuery(event.target.value)}
                            placeholder="Buscar por estudiante, documento o ID..."
                            className="pl-8"
                        />
                    </div>
                </SheetHeader>

                <div className="mt-4 flex-1 overflow-y-auto pr-2">
                    {loading || loadingEstados ? (
                        <div className="flex h-40 items-center justify-center">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : filteredItems.length === 0 ? (
                        <div className="py-16 text-center text-sm text-muted-foreground">No hay solicitudes disponibles.</div>
                    ) : (
                        filteredItems.map((item, index) => {
                            const selecting = selectingId === item.id
                            return (
                                <React.Fragment key={item.id}>
                                    <button
                                        type="button"
                                        disabled={selectingId !== null}
                                        onClick={() => handleSelect(item)}
                                        className="flex w-full flex-col gap-2 border-l-2 border-transparent p-3 text-left transition-colors hover:border-primary hover:bg-muted/40 disabled:opacity-60"
                                    >
                                        <div className="flex w-full items-start justify-between gap-3">
                                            <div className="flex min-w-0 items-center gap-2">
                                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                    {selecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <User className="h-4 w-4" />}
                                                </span>
                                                <span className="min-w-0">
                                                    <span className="block truncate text-sm font-semibold uppercase">
                                                        {item.estudiante?.apellidos} {item.estudiante?.nombres}
                                                    </span>
                                                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                        <Fingerprint className="h-3 w-3" />
                                                        {item.estudiante?.numeroDocumento || "Sin documento"} · ID {item.id}
                                                    </span>
                                                </span>
                                            </div>
                                            <Badge variant="outline">{item.digital ? "Digital" : "Fisico"}</Badge>
                                        </div>
                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDate(item.creadoEn)}</span>
                                            <span className="flex items-center gap-1"><Globe2 className="h-3 w-3" />{item.idioma?.nombre}</span>
                                            <span className="flex items-center gap-1"><Layers className="h-3 w-3" />{item.nivel?.nombre}</span>
                                        </div>
                                    </button>
                                    {index < filteredItems.length - 1 ? <Separator /> : null}
                                </React.Fragment>
                            )
                        })
                    )}
                </div>
            </SheetContent>
        </Sheet>
    )
}
