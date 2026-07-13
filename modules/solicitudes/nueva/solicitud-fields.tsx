"use client"

import type { UseFormReturn } from "react-hook-form"
import { SelectField } from "@/components/forms/select.field"
import type { IIdioma, INivel, ITipoSolicitud } from "@/modules/estructura/interfaces/types.interface"
import type { NuevaSolicitudFormValues } from "./nueva-solicitud.schema"

interface SolicitudFieldsProps {
    form: UseFormReturn<NuevaSolicitudFormValues>
    tiposSolicitud: ITipoSolicitud[]
    idiomas: IIdioma[]
    niveles: INivel[]
    loading: boolean
}

export function SolicitudFields({ form, tiposSolicitud, idiomas, niveles, loading }: SolicitudFieldsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-3">
            <SelectField
                control={form.control}
                name="tipoSolicitudId"
                label="Tipo de solicitud"
                options={tiposSolicitud.map(tipo => ({
                    label: `${tipo.solicitud} - S/ ${Number(tipo.precio || 0).toFixed(2)}`,
                    value: String(tipo.id),
                }))}
                loading={loading && tiposSolicitud.length === 0}
            />
            <SelectField
                control={form.control}
                name="idiomaId"
                label="Idioma"
                options={idiomas.map(idioma => ({ label: idioma.nombre, value: String(idioma.id) }))}
                loading={loading && idiomas.length === 0}
            />
            <SelectField
                control={form.control}
                name="nivelId"
                label="Nivel"
                options={niveles.map(nivel => ({ label: nivel.nombre, value: String(nivel.id) }))}
                loading={loading && niveles.length === 0}
            />
        </div>
    )
}
