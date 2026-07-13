"use client"

import { InputMask } from "@react-input/mask"
import { Controller, type UseFormReturn } from "react-hook-form"
import { DatePicker } from "@/components/forms/date-picker.field"
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field"
import { InputField } from "@/components/forms/input.field"
import { Input } from "@/components/ui/input"
import { TextareaField } from "@/components/forms/textarea.field"
import type { NuevaSolicitudFormValues } from "./nueva-solicitud.schema"

export function PagoFields({ form }: { form: UseFormReturn<NuevaSolicitudFormValues> }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
                <Controller
                    control={form.control}
                    name="numeroVoucher"
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="input-numeroVoucher">Numero de voucher</FieldLabel>
                            <FieldContent>
                                <InputMask
                                    {...field}
                                    ref={field.ref}
                                    id="input-numeroVoucher"
                                    component={Input}
                                    mask="_______________"
                                    replacement={{ _: /\d/ }}
                                    placeholder="15 digitos"
                                    inputMode="numeric"
                                    aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                            </FieldContent>
                        </Field>
                    )}
                />
                <InputField control={form.control} name="pago" label="Monto" type="number" />
                <DatePicker control={form.control} name="fechaPago" label="Fecha de pago" />
            </div>
            <TextareaField
                control={form.control}
                name="observaciones"
                label="Observaciones (opcional)"
                placeholder="Informacion adicional de la solicitud"
                className="[&_textarea]:min-h-20"
            />
        </div>
    )
}
