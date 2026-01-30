"use client"

import { Control, Controller, FieldValues, Path } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { cn } from "@/lib/utils"

interface InputFieldProps<T extends FieldValues> {
    control: Control<T>
    name: Path<T>
    label: string
    placeholder?: string
    description?: string
    type?: string
    disabled?: boolean
    orientation?: "vertical" | "horizontal" | "responsive"
    className?: string
    autoComplete?: string
}

export function InputField<T extends FieldValues>({
    control,
    name,
    label,
    placeholder,
    description,
    type = "text",
    disabled = false,
    orientation = "vertical",
    className,
    autoComplete = "off"
}: InputFieldProps<T>) {
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
                    <FieldLabel htmlFor={`input-${name}`}>
                        {label}
                    </FieldLabel>
                    <FieldContent>
                        <Input
                            {...field}
                            id={`input-${name}`}
                            type={type}
                            disabled={disabled}
                            placeholder={placeholder}
                            autoComplete={autoComplete}
                            aria-invalid={fieldState.invalid}
                            className={cn(fieldState.invalid && "border-destructive focus-visible:ring-destructive")}
                        />
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
