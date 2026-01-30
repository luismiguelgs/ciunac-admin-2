"use client"

import { Control, Controller, FieldValues, Path } from "react-hook-form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { cn } from "@/lib/utils"

interface RadioOption {
    label: string
    value: string
}

interface RadioGroupFieldProps<T extends FieldValues> {
    control: Control<T>
    name: Path<T>
    label: string
    options?: RadioOption[]
    description?: string
    disabled?: boolean
    orientation?: "vertical" | "horizontal" | "responsive"
    className?: string
}

export function RadioGroupField<T extends FieldValues>({
    control,
    name,
    label,
    options = [],
    description,
    disabled = false,
    orientation = "vertical",
    className,
}: RadioGroupFieldProps<T>) {
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
                    <FieldLabel htmlFor={`radio-${name}`}>
                        {label}
                    </FieldLabel>
                    <FieldContent>
                        <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                            disabled={disabled}
                            className={cn("flex flex-col space-y-1")}
                        >
                            {options.map((option) => (
                                <div key={option.value} className="flex items-center space-x-2">
                                    <RadioGroupItem value={option.value} id={`radio-${name}-${option.value}`} />
                                    <Label htmlFor={`radio-${name}-${option.value}`} className="font-normal cursor-pointer">
                                        {option.label}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
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
