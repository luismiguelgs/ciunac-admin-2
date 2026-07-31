"use client";

import { useEffect, useRef, useState } from "react";
import { useFormContext, Controller, useWatch } from "react-hook-form";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LucideIcon, Upload } from "lucide-react";
import { uploadFile } from "@/services/upload.service";
import { toast } from "sonner";
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field";

interface FileUploaderCardProps {
	name: string;
	label?: string;
	icon: LucideIcon
	dni: string | undefined;
	folder: 'dnis' | 'vouchers' | 'becas' | 'cvs';
	variant?: 'card' | 'field';
	disabled?: boolean;
	onUploadingChange?: (uploading: boolean) => void;
}

export const FileUploaderCard = ({
	name,
	label,
	icon: Icon,
	dni,
	folder,
	variant = 'card',
	disabled = false,
	onUploadingChange,
}: FileUploaderCardProps) => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const uploadedFileIdRef = useRef('');
	const [uploading, setUploading] = useState(false);
	const [progress, setProgress] = useState(0);
	const { control, setValue } = useFormContext();
	const fieldValue = useWatch({ control, name });

	useEffect(() => {
		if (!fieldValue) {
			uploadedFileIdRef.current = '';
			if (fileInputRef.current) fileInputRef.current.value = '';
		}
	}, [fieldValue]);

	const handleFileSelect = () => {
		fileInputRef.current?.click();
	};

	const handleUpload = async (file: File) => {
		if ((folder === 'becas' || folder === 'cvs') && file.type !== "application/pdf") {
			toast.error("Solo se permiten archivos PDF.");
			if (fileInputRef.current) fileInputRef.current.value = '';
			return;
		}

		if (folder !== 'becas' && folder !== 'cvs' && !["application/pdf", "image/jpeg", "image/png"].includes(file.type)) {
			toast.error("Solo se permiten archivos PDF, JPG y PNG.");
			if (fileInputRef.current) fileInputRef.current.value = '';
			return;
		}

		try {
			setUploading(true);
			onUploadingChange?.(true);
			setProgress(20);
			setProgress(40);
			const { id, viewLink, downloadLink } = await uploadFile(
				file,
				folder,
				dni,
				name,
				uploadedFileIdRef.current,
			);
			const isImage = file.type.startsWith('image/');
			const url = isImage || folder === 'cvs' || folder === 'vouchers' ? viewLink : downloadLink;
			uploadedFileIdRef.current = id;
			setValue(name, url, {
				shouldDirty: true,
				shouldTouch: true,
				shouldValidate: true,
			});
			setProgress(100);
		} catch (err) {
			console.error('Error al subir archivo:', err);
			toast.error('Error al subir archivo');
		} finally {
			setUploading(false);
			onUploadingChange?.(false);
			if (fileInputRef.current) fileInputRef.current.value = '';
		}
	};

	const handleDisabled = (): boolean => {
		if (folder === 'dnis') {
			return disabled || uploading || String(dni).length < 8
		} else {
			return disabled || uploading
		}
	}

	return (
		<Controller
			control={control}
			name={name}
			render={({ field: { value }, fieldState: { error } }) => {
				const uploader = (
					<>
						<input
							type="file"
							ref={fileInputRef}
							accept={(folder === 'becas' || folder === 'cvs') ? ".pdf" : ".pdf, .jpg, .jpeg, .png"}
							onChange={(e) => {
								const file = e.target.files?.[0];
								if (file) void handleUpload(file);
							}}
							className="hidden"
						/>

						<Button type="button" onClick={handleFileSelect} disabled={handleDisabled()}>
							<Upload className="w-4 h-4 mr-2" />
							{uploading ? "Subiendo..." : value ? "Reemplazar documento" : "Subir documento"}
						</Button>

						{uploading && <Progress value={progress} className="h-2" />}

						{value && !uploading && (
							<p className="text-sm text-green-600">
								Archivo cargado:{" "}
								<a href={value} target="_blank" className="underline" rel="noopener noreferrer">
									Ver archivo
								</a>
							</p>
						)}
					</>
				);

				if (variant === 'field') {
					return (
						<Field data-invalid={Boolean(error)}>
							{label ? (
								<FieldLabel className="flex items-center gap-2">
									{Icon ? <Icon className="h-4 w-4 text-muted-foreground" /> : null}
									{label}
								</FieldLabel>
							) : null}
							<FieldContent className="gap-2">
								{uploader}
								{error ? <FieldError errors={[error]} /> : null}
							</FieldContent>
						</Field>
					);
				}

				return (
					<Card className="w-full">
						{label ? (
							<CardHeader className="flex flex-row items-center gap-2">
								{Icon ? <Icon className="h-5 w-5 text-muted-foreground" /> : null}
								<CardTitle className="text-base">{label}</CardTitle>
							</CardHeader>
						) : null}
						<CardContent className="flex flex-col gap-1">
							{uploader}
							{error ? <p className="text-sm text-red-600">{error.message}</p> : null}
						</CardContent>
					</Card>
				);
			}}
		/>
	);
};
