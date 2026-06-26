"use client"

import React from "react"
import { Control, FieldValues, Path } from "react-hook-form"
import { ComboField } from "@/components/forms/combo.field"
import { IDocente } from "../docente.interface"

interface DocenteComboFieldProps<T extends FieldValues> {
    control: Control<T>
    name: Path<T>
    docentes: IDocente[]
    currentDocenteId?: string
    label?: string
    placeholder?: string
    description?: string
    loading?: boolean
    orientation?: "vertical" | "horizontal" | "responsive"
    className?: string
    disabled?: boolean
}

export function DocenteComboField<T extends FieldValues>({
    control,
    name,
    docentes,
    currentDocenteId,
    label = "Docente",
    placeholder = "Buscar docente...",
    description,
    loading = false,
    orientation = "vertical",
    className,
    disabled = false,
}: DocenteComboFieldProps<T>) {
    const optionsDocentes = React.useMemo(() => {
        const selectedId = currentDocenteId ?? ""

        return docentes
            .filter((docente) => docente.activo || String(docente.id) === selectedId)
            .map((docente) => ({
                label: `${docente.nombres} ${docente.apellidos}`.trim(),
                value: String(docente.id),
            }))
    }, [currentDocenteId, docentes])

    return (
        <ComboField
            control={control}
            name={name}
            label={label}
            placeholder={placeholder}
            description={description}
            options={optionsDocentes}
            loading={loading}
            orientation={orientation}
            className={className}
            disabled={disabled}
        />
    )
}
