"use client"

import { Control, Controller, FieldValues, Path } from "react-hook-form"
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
    ComboboxTrigger,
    ComboboxValue,
} from "@/components/ui/combobox"
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

interface ComboOption {
    label: string
    value: string
}

interface ComboFieldProps<T extends FieldValues> {
    control: Control<T>
    name: Path<T>
    label: string
    placeholder?: string
    description?: string
    options?: ComboOption[]
    loading?: boolean
    orientation?: "vertical" | "horizontal" | "responsive"
    className?: string
    disabled?: boolean
}

export function ComboField<T extends FieldValues>({
    control,
    name,
    label,
    placeholder = "Seleccionar...",
    description,
    options = [],
    loading = false,
    orientation = "vertical",
    className,
    disabled = false
}: ComboFieldProps<T>) {
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
            render={({ field, fieldState }) => {
                const selectedOption = options.find(d => d.value === String(field.value)) || { label: placeholder, value: "" };
                return (
                    <Field
                        orientation={orientation}
                        data-invalid={fieldState.invalid}
                    >
                        <FieldLabel htmlFor={`combo-${name}`}>{label}</FieldLabel>
                        <FieldContent>
                            <Combobox
                                disabled={disabled}
                                items={options}
                                value={selectedOption}
                                onValueChange={(val) => field.onChange(val?.value)}
                            >
                                <ComboboxTrigger id={`combo-${name}`} render={<Button variant="outline" className="w-full justify-between font-normal"><ComboboxValue /> <ChevronDown className="h-4 w-4 opacity-50" /></Button>} />
                                <ComboboxContent>
                                    <ComboboxInput showTrigger={false} placeholder='Buscar...' />
                                    <ComboboxEmpty>No se encontraron resultados.</ComboboxEmpty>
                                    <ComboboxList>
                                        {(item) => (
                                            <ComboboxItem key={item.value} value={item}>
                                                {item.label}
                                            </ComboboxItem>
                                        )}
                                    </ComboboxList>
                                </ComboboxContent>
                            </Combobox>
                        </FieldContent>
                        <FieldDescription>
                            {description}
                        </FieldDescription>
                        <FieldError errors={[fieldState.error]} />
                    </Field>
                )
            }}
        />
    )
}
