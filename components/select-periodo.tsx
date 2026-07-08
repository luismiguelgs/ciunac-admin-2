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

interface BaseSelectPeriodoProps {
    value?: string
    onValueChange?: (value: string) => void
    className?: string
    placeholder: string
    disabled: boolean
    triggerClassName?: string
    label: string
    selectId?: string
    invalid?: boolean
    showLoadingDescription?: boolean
}

function useVisiblePeriodos(value?: string, onValueChange?: (value: string) => void) {
    const { data: rawData, loading } = useOpciones<IModulo>(Collection.Modulos)
    const periodos = React.useMemo(() => rawData?.filter((modulo) => modulo.visible) || [], [rawData])

    React.useEffect(() => {
        if (!loading && periodos.length > 0 && !value && onValueChange) {
            const active = periodos.find((modulo) => modulo.activo)
            const defaultPeriod = active ?? periodos[0]

            if (defaultPeriod?.id) {
                onValueChange(String(defaultPeriod.id))
            }
        }
    }, [loading, periodos, value, onValueChange])

    return { loading, periodos }
}

function BaseSelectPeriodo({
    value,
    onValueChange,
    className,
    placeholder,
    disabled,
    triggerClassName,
    label,
    selectId,
    invalid,
    showLoadingDescription = false,
}: BaseSelectPeriodoProps) {
    const { loading, periodos } = useVisiblePeriodos(value, onValueChange)

    if (loading) {
        return (
            <div className={cn("space-y-2", className)}>
                {label && <Skeleton className="h-4 w-20" />}
                <Skeleton className="h-10 w-full" />
                {showLoadingDescription && <Skeleton className="h-3 w-40" />}
            </div>
        )
    }

    return (
        <Select value={value} onValueChange={onValueChange} disabled={disabled}>
            <SelectTrigger
                id={selectId}
                aria-invalid={invalid}
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
}

function ControlledSelectPeriodo<T extends FieldValues>({
    control,
    name,
    className,
    placeholder,
    disabled,
    triggerClassName,
    orientation,
    label,
}: SelectPeriodoProps<T> & { control: Control<T>; name: Path<T>; placeholder: string; disabled: boolean; label: string }) {
    const { field, fieldState } = useController({ control, name })
    const selectId = `select-${name}`

    return (
        <Field
            orientation={orientation}
            data-invalid={fieldState.invalid}
            className={className}
        >
            {label && (
                <FieldLabel htmlFor={selectId}>
                    {label}
                </FieldLabel>
            )}
            <FieldContent>
                <BaseSelectPeriodo
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    triggerClassName={triggerClassName}
                    label={label}
                    selectId={selectId}
                    invalid={fieldState.invalid}
                    showLoadingDescription
                />
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

function StandaloneSelectPeriodo({
    value,
    onValueChange,
    className,
    placeholder,
    disabled,
    triggerClassName,
    label,
}: BaseSelectPeriodoProps) {
    return (
        <div className={className}>
            {label && <label className="text-sm font-medium mb-2 block">{label}</label>}
            <BaseSelectPeriodo
                value={value}
                onValueChange={onValueChange}
                placeholder={placeholder}
                disabled={disabled}
                triggerClassName={triggerClassName}
                label={label}
            />
        </div>
    )
}

export function SelectPeriodo<T extends FieldValues>({
    control,
    name,
    value,
    onValueChange,
    className,
    placeholder = "Seleccionar periodo",
    disabled = false,
    triggerClassName,
    orientation = "vertical",
    label = "Periodo"
}: SelectPeriodoProps<T>) {
    if (control && name) {
        return (
            <ControlledSelectPeriodo
                control={control}
                name={name}
                className={className}
                placeholder={placeholder}
                disabled={disabled}
                triggerClassName={triggerClassName}
                orientation={orientation}
                label={label}
            />
        )
    }

    return (
        <StandaloneSelectPeriodo
            value={value}
            onValueChange={onValueChange}
            className={className}
            placeholder={placeholder}
            disabled={disabled}
            triggerClassName={triggerClassName}
            label={label}
        />
    )
}
