'use client'

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { documentoDefaultValues, DocumentoSchema, documentoSchema } from "./documento.schema";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/forms/input.field";
import { SelectField } from "@/components/forms/select.field";
import { TextareaField } from "@/components/forms/textarea.field";
import { DatePicker } from "@/components/forms/date-picker.field";
import { toast } from "sonner";
import IDocumentosPerfil from "../interfaces/documentos-perfil.interface";
import DocumentosDocenteService from "../services/documentos-docente.service";
import usePerfilOpciones from "@/modules/seguimiento-docente/opciones/perfil-opciones.hook";
import { Collection } from "@/modules/seguimiento-docente/opciones/perfil-opciones.service";
import SaveButton from "@/components/save.button";
import { FileUploaderCard } from "@/components/forms/upload.field";
import { FileTextIcon } from "lucide-react";

interface DocumentoFormProps {
    documento?: IDocumentosPerfil;
    perfilDocenteId: string;
    onSuccess: () => void;
}

export default function DocumentoForm({ documento, perfilDocenteId, onSuccess }: DocumentoFormProps) {
    const form = useForm<DocumentoSchema>({
        resolver: zodResolver(documentoSchema),
        defaultValues: documento ? {
            tipoDocumentoPerfilId: String(documento.tipoDocumentoPerfilId),
            estadoId: String(documento.estadoId),
            descripcion: documento.descripcion,
            institucionEmisora: documento.institucionEmisora,
            urlArchivo: documento.urlArchivo,
            fechaEmision: new Date(documento.fechaEmision),
            horasCapacitacion: String(documento.horasCapacitacion),
            puntaje: String(documento.puntaje),
            experienciaLaboral: String(documento.experienciaLaboral),
        } : {
            ...documentoDefaultValues,
        },
    });

    const { data: tiposDoc, loading: loadingTipos } = usePerfilOpciones<any>(Collection.TiposDocumentosPerfil);

    // Fallback states if not found in a collection (assuming 1: Pendiente, 2: Validado, 3: Rechazado)
    // Actually, I'll try to find if there's an 'estados' collection in 구조.
    const estados = [
        { label: "PENDIENTE", value: "9" },
        { label: "VALIDADO", value: "10" },
        { label: "RECHAZADO", value: "11" },
    ];

    const onSubmit = async (data: DocumentoSchema) => {
        try {
            const payload = {
                ...data,
                perfilDocenteId,
                tipoDocumentoPerfilId: Number(data.tipoDocumentoPerfilId),
                estadoId: Number(data.estadoId),
                horasCapacitacion: Number(data.horasCapacitacion),
                puntaje: Number(data.puntaje),
                experienciaLaboral: Number(data.experienciaLaboral),
                fechaEmision: data.fechaEmision.toISOString(),
            };

            if (documento?.id) {
                await DocumentosDocenteService.updateItem({ ...payload, id: documento.id } as any);
                toast.success("Documento actualizado correctamente");
            } else {
                await DocumentosDocenteService.newItem(payload as any);
                toast.success("Documento creado correctamente");
            }
            onSuccess();
        } catch (error) {
            console.error(error);
            toast.error("Error al guardar el documento");
        }
    };

    const optionsTipos = tiposDoc?.map(t => ({ label: t.nombre, value: String(t.id) })) || [];

    return (
        <FormProvider {...form}>
            <form id="documento-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <SelectField
                    control={form.control}
                    name="tipoDocumentoPerfilId"
                    label="Tipo de Documento"
                    placeholder="Seleccionar tipo..."
                    options={optionsTipos}
                    loading={loadingTipos}
                />
                <SelectField
                    control={form.control}
                    name="estadoId"
                    label="Estado"
                    placeholder="Seleccionar estado..."
                    options={estados}
                />
                <TextareaField
                    control={form.control}
                    name="descripcion"
                    label="Descripción"
                    placeholder="Ingrese una descripción"
                />
                <InputField
                    control={form.control}
                    name="institucionEmisora"
                    label="Institución Emisora"
                    placeholder="Ingrese la institución"
                />
                <FileUploaderCard
                    name="urlArchivo"
                    label="Archivo del Documento"
                    icon={FileTextIcon}
                    dni={perfilDocenteId}
                    folder="cvs"
                />
                <DatePicker
                    control={form.control}
                    name="fechaEmision"
                    label="Fecha de Emisión"
                />
                <div className="grid grid-cols-3 gap-4">
                    <InputField
                        control={form.control}
                        name="horasCapacitacion"
                        label="Horas"
                        type="number"
                    />
                    <InputField
                        control={form.control}
                        name="puntaje"
                        label="Puntaje"
                        type="number"
                    />
                    <InputField
                        control={form.control}
                        name="experienciaLaboral"
                        label="Exp. Laboral"
                        type="number"
                    />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                    <SaveButton form={form} formId="documento-form" />
                </div>
            </form>
        </FormProvider>
    );
}
