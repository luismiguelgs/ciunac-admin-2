'use client'

import { useState } from "react";
import { format } from "date-fns";
import { IDocente } from "../docente.interface";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { defaultValues, DocenteSchema, schema } from "./docente.schema";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/forms/input.field";
import { DatePicker } from "@/components/forms/date-picker.field";
import { SelectField } from "@/components/forms/select.field";
import { RadioGroupField } from "@/components/forms/radio-group.field";
import { SwitchField } from "@/components/forms/switch.field";
import { Pencil, X } from "lucide-react";
import DocentesService from "../docente.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import SaveButton from "@/components/save.button";
import { AuditSection } from "@/components/audit.section";

export default function DocenteForm({ docente }: { docente?: IDocente }) {
    const form = useForm<DocenteSchema>({
        resolver: zodResolver(schema),
        defaultValues: docente ? {
            nombres: docente.nombres,
            apellidos: docente.apellidos,
            fechaNacimiento: new Date(docente.fechaNacimiento),
            genero: docente.genero as "M" | "F",
            tipoDocumento: docente.tipoDocumento as "DNI" | "CE" | "PASAPORTE",
            numeroDocumento: docente.numeroDocumento,
            celular: docente.celular,
            activo: docente.activo,
        } : defaultValues,
    })

    const [isEditing, setIsEditing] = useState(!docente);
    const router = useRouter();

    const onSubmit = async (data: DocenteSchema) => {
        try {
            const payload = {
                ...data,
                fechaNacimiento: data.fechaNacimiento ? format(data.fechaNacimiento, "yyyy-MM-dd") : undefined
            };
            if (docente) {
                await DocentesService.updateItem({ ...payload, id: docente.id } as IDocente);
                toast.success("Docente actualizado", { description: "El docente se ha actualizado correctamente." });
            } else {
                const newDocente = await DocentesService.newItem(payload as IDocente);
                toast.success("Docente creado", { description: "El docente se ha creado correctamente." });
                router.push(`/perfil-docente/docentes/${newDocente.id}`);
            }
            setIsEditing(false); // Disable editing mode after successful save
        } catch (error) {
            console.error(error);
            toast.error("Error", { description: "Ha ocurrido un error al guardar." });
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{docente ? 'Editar Docente' : 'Nuevo Docente'}</CardTitle>
                <CardDescription>
                    Complete la información del docente.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form id="docente-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField
                            control={form.control}
                            name="nombres"
                            label="Nombres"
                            placeholder="Ingrese nombres"
                            disabled={!isEditing}
                        />
                        <InputField
                            control={form.control}
                            name="apellidos"
                            label="Apellidos"
                            placeholder="Ingrese apellidos"
                            disabled={!isEditing}
                        />
                        <DatePicker
                            control={form.control}
                            name="fechaNacimiento"
                            label="Fecha de Nacimiento"
                            disabled={!isEditing}
                        />
                        <InputField
                            control={form.control}
                            name="celular"
                            label="Celular"
                            placeholder="Ingrese número de celular"
                            disabled={!isEditing}
                        />
                        <SelectField
                            control={form.control}
                            name="tipoDocumento"
                            label="Tipo de Documento"
                            options={[
                                { value: "DNI", label: "DNI" },
                                { value: "CE", label: "CE" },
                                { value: "PASAPORTE", label: "PASAPORTE" },
                            ]}
                            disabled={!isEditing}
                        />
                        <InputField
                            control={form.control}
                            name="numeroDocumento"
                            label="Número de Documento"
                            placeholder="Ingrese número de documento"
                            disabled={!isEditing}
                        />
                        <RadioGroupField
                            control={form.control}
                            name="genero"
                            label="Género"
                            orientation="responsive"
                            options={[
                                { value: "M", label: "Masculino" },
                                { value: "F", label: "Femenino" },
                            ]}
                            disabled={!isEditing}
                        />
                        <SwitchField
                            control={form.control}
                            name="activo"
                            label="Activo"
                            description="Indica si el docente está activo"
                            disabled={!isEditing}
                        />
                    </div>

                    {docente && (
                        <AuditSection creadoEn={docente.creadoEn} modificadoEn={docente.modificadoEn} />
                    )}
                </form>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                {docente && !isEditing && (
                    <Button onClick={() => setIsEditing(true)}>
                        <Pencil className="w-4 h-4 mr-2" />
                        Editar
                    </Button>
                )}
                {isEditing && (
                    <>
                        {docente && (
                            <Button variant="secondary" onClick={() => setIsEditing(false)} disabled={form.formState.isSubmitting}>
                                <X className="w-4 h-4 mr-2" />
                                Cancelar
                            </Button>
                        )}
                        <SaveButton form={form} formId="docente-form" />
                    </>
                )}
            </CardFooter>
        </Card>
    )
}