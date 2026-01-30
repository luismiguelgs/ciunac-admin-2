"use client"

import { Control, Controller, FieldValues, Path } from "react-hook-form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface SelectOption {
    label: string
    value: string
}

interface SelectFieldProps<T extends FieldValues> {
    control: Control<T>
    name: Path<T>
    label: string
    placeholder?: string
    description?: string
    options?: SelectOption[]
    loading?: boolean
    orientation?: "vertical" | "horizontal" | "responsive"
    className?: string
    triggerClassName?: string
    disabled?: boolean
}

export function SelectField<T extends FieldValues>({
    control,
    name,
    label,
    placeholder = "Seleccionar...",
    description,
    options = [],
    loading = false,
    orientation = "vertical",
    className,
    triggerClassName,
    disabled = false
}: SelectFieldProps<T>) {
    if (loading) {
        return (
            <div className={cn("space-y-2", className)}>
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
                {description && <Skeleton className="h-3 w-40" />}
            </div>
        )
    }

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <Field
                    orientation={orientation}
                    data-invalid={fieldState.invalid}
                    className={className}
                >
                    <FieldLabel htmlFor={`select-${name}`}>
                        {label}
                    </FieldLabel>
                    <FieldContent>
                        <Select
                            name={field.name}
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={disabled}
                        >
                            <SelectTrigger
                                id={`select-${name}`}
                                aria-invalid={fieldState.invalid}
                                className={cn("w-full", triggerClassName)}
                            >
                                <SelectValue placeholder={placeholder} />
                            </SelectTrigger>
                            <SelectContent position="item-aligned">
                                {options.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {description && (
                            <FieldDescription>
                                {description}
                            </FieldDescription>
                        )}
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </FieldContent>
                </Field>
            )}
        />
    )
}
