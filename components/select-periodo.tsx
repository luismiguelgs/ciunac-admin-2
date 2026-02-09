"use client"

import * as React from "react"
import { Control, FieldValues, Path, useController } from "react-hook-form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Skeleton } from "@/components/ui/skeleton"
import useOpciones from "@/modules/estructura/hooks/use-opciones"
import { Collection } from "@/modules/estructura/services/opciones.service"
import { IModulo } from "@/modules/estructura/interfaces/types.interface"
import { cn } from "@/lib/utils"

interface SelectPeriodoProps<T extends FieldValues> {
    control?: Control<T>
    name?: Path<T>
    value?: string
    onValueChange?: (value: string) => void
    className?: string
    placeholder?: string
    disabled?: boolean
    triggerClassName?: string
    orientation?: "vertical" | "horizontal" | "responsive"
    label?: string
}

export function SelectPeriodo<T extends FieldValues>({
    control,
    name,
    value: propValue,
    onValueChange: propOnValueChange,
    className,
    placeholder = "Seleccionar periodo",
    disabled = false,
    triggerClassName,
    orientation = "vertical",
    label = "Periodo"
}: SelectPeriodoProps<T>) {
    const { data: rawData, loading } = useOpciones<IModulo>(Collection.Modulos)

    // Setup form controller if control and name provided
    const controller = control && name ? useController({ control, name }) : null
    const field = controller?.field
    const fieldState = controller?.fieldState

    // Determine current value and change handler
    const currentValue = field ? field.value : propValue
    const handleChange = field ? field.onChange : propOnValueChange

    // Filter visible modules
    const periodos = React.useMemo(() => {
        return rawData?.filter((m) => m.visible) || []
    }, [rawData])

    // Set default active period if no value is provided
    React.useEffect(() => {
        if (!loading && periodos.length > 0 && !currentValue && handleChange) {
            const active = periodos.find((m) => m.activo)
            if (active && active.id) {
                handleChange(String(active.id))
            } else if (periodos[0]?.id) {
                // Fallback to first visible
                handleChange(String(periodos[0].id))
            }
        }
    }, [loading, periodos, currentValue, handleChange])

    if (loading) {
        return (
            <div className={cn("space-y-2", className)}>
                {label && <Skeleton className="h-4 w-20" />}
                <Skeleton className="h-10 w-full" />
                {control && name && <Skeleton className="h-3 w-40" />}
            </div>
        )
    }

    const SelectComponent = (
        <Select
            value={currentValue}
            onValueChange={handleChange}
            disabled={disabled}
        >
            <SelectTrigger
                id={name ? `select-${name}` : undefined}
                aria-invalid={fieldState?.invalid}
                className={cn("w-full", triggerClassName)}
            >
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent position="item-aligned">
                {periodos.map((option) => (
                    <SelectItem key={option.id} value={String(option.id)}>
                        {option.nombre}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )

    if (control && name && fieldState) {
        return (
            <Field
                orientation={orientation}
                data-invalid={fieldState.invalid}
                className={className}
            >
                {label && (
                    <FieldLabel htmlFor={`select-${name}`}>
                        {label}
                    </FieldLabel>
                )}
                <FieldContent>
                    {SelectComponent}
                    <FieldDescription>
                        Seleccionar {label}
                    </FieldDescription>
                    {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                    )}
                </FieldContent>
            </Field>
        )
    }

    return (
        <div className={className}>
            {label && !control && <label className="text-sm font-medium mb-2 block">{label}</label>}
            {SelectComponent}
        </div>
    )
}
