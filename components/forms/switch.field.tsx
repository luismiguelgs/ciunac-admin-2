"use client"

import { Control, Controller, FieldValues, Path } from "react-hook-form"
import { Switch } from "@/components/ui/switch"
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { cn } from "@/lib/utils"

interface SwitchFieldProps<T extends FieldValues> {
    control: Control<T>
    name: Path<T>
    label: string
    description?: string
    disabled?: boolean
    orientation?: "vertical" | "horizontal" | "responsive"
    className?: string
}

export function SwitchField<T extends FieldValues>({
    control,
    name,
    label,
    description,
    disabled = false,
    orientation = "horizontal",
    className,
}: SwitchFieldProps<T>) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <Field
                    orientation={orientation}
                    data-invalid={fieldState.invalid}
                    className={cn("items-center justify-between rounded-lg border p-4 shadow-sm", className)}
                >
                    <FieldContent className="flex flex-col space-y-0.5">
                        <FieldLabel htmlFor={`switch-${name}`}>
                            {label}
                        </FieldLabel>
                        {description && (
                            <FieldDescription>
                                {description}
                            </FieldDescription>
                        )}
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </FieldContent>
                    <Switch
                        id={`switch-${name}`}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={disabled}
                    />
                </Field>
            )}
        />
    )
}
