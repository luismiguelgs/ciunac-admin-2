"use client"

import { Loader2, Search } from "lucide-react"
import type { UseFormReturn } from "react-hook-form"
import { InputField } from "@/components/forms/input.field"
import { SelectField } from "@/components/forms/select.field"
import { SwitchField } from "@/components/forms/switch.field"
import { Button } from "@/components/ui/button"
import { DOCUMENT_TYPES, type NuevaSolicitudFormValues } from "./nueva-solicitud.schema"

interface EstudianteFieldsProps {
    form: UseFormReturn<NuevaSolicitudFormValues>
    facultadOptions: Array<{ label: string; value: string }>
    escuelaOptions: Array<{ label: string; value: string }>
    loadingCatalogs: boolean
    searching: boolean
    foundStudent: boolean
    onSearch: () => void
}

export function EstudianteFields({
    form,
    facultadOptions,
    escuelaOptions,
    loadingCatalogs,
    searching,
    foundStudent,
    onSearch,
}: EstudianteFieldsProps) {
    return (
        <div className="space-y-5">
            <div className="grid gap-4 md:grid-cols-3 md:items-start">
                <SelectField
                    control={form.control}
                    name="tipoDocumento"
                    label="Tipo de documento"
                    options={[...DOCUMENT_TYPES]}
                    disabled={searching}
                />
                <InputField
                    control={form.control}
                    name="numeroDocumento"
                    label="Numero de documento"
                    placeholder="Ingrese el documento"
                    disabled={searching}
                />
                <Button
                    type="button"
                    onClick={onSearch}
                    disabled={searching}
                    className="mt-7 h-9 w-full px-4 font-semibold shadow-sm"
                >
                    {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                    Buscar
                </Button>
            </div>

            {foundStudent ? (
                <p className="text-sm font-medium text-emerald-700">Estudiante encontrado. Puede actualizar sus datos antes de guardar.</p>
            ) : null}

            <div className="grid gap-4 md:grid-cols-2">
                <InputField control={form.control} name="nombres" label="Nombres" />
                <InputField control={form.control} name="apellidos" label="Apellidos" />
                <InputField control={form.control} name="celular" label="Celular" placeholder="9 digitos" />
            </div>

            <SwitchField
                control={form.control}
                name="alumnoCiunac"
                label="Alumno CIUNAC"
                description="La informacion academica es opcional por el momento."
            />

            <div className="grid gap-4 md:grid-cols-3">
                <SelectField
                    control={form.control}
                    name="facultadId"
                    label="Facultad (opcional)"
                    placeholder="Sin facultad"
                    options={facultadOptions}
                    loading={loadingCatalogs && facultadOptions.length <= 1}
                />
                <SelectField
                    control={form.control}
                    name="escuelaId"
                    label="Escuela (opcional)"
                    placeholder="Sin escuela"
                    options={escuelaOptions}
                    loading={loadingCatalogs && escuelaOptions.length <= 1}
                    disabled={!form.watch("facultadId") || form.watch("facultadId") === "none"}
                />
                <InputField control={form.control} name="codigo" label="Codigo (opcional)" />
            </div>
        </div>
    )
}
