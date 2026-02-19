"use client"

import { Control, Controller, FieldValues, Path } from "react-hook-form"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { cn } from "@/lib/utils"

interface TextareaFieldProps<T extends FieldValues> {
    control: Control<T>
    name: Path<T>
    label: string
    placeholder?: string
    description?: string
    disabled?: boolean
    orientation?: "vertical" | "horizontal" | "responsive"
    className?: string
}

export function TextareaField<T extends FieldValues>({
    control,
    name,
    label,
    placeholder,
    description,
    disabled = false,
    orientation = "vertical",
    className,
}: TextareaFieldProps<T>) {
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
                    <FieldLabel htmlFor={`textarea-${name}`}>
                        {label}
                    </FieldLabel>
                    <FieldContent>
                        <Textarea
                            {...field}
                            id={`textarea-${name}`}
                            disabled={disabled}
                            placeholder={placeholder}
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
