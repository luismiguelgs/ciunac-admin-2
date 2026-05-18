export interface UploadResponse {
    id: string;
    name: string;
    folder: string;
    viewLink: string;
    downloadLink: string;
}

type UploadFolder = 'dnis' | 'vouchers' | 'becas' | 'cvs' | 'constancias';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const apiKey: string = process.env.NEXT_PUBLIC_API_KEY!;

export async function uploadCSVFile<T = any>(file: File, url: string):
    Promise<T> {
    const formData = new FormData();
    formData.append('file', file);
    try {
        const response = await fetch(`${API_URL}/${url}`, {
            method: 'POST',
            body: formData,
            headers: {
                'x-api-key': apiKey,
            },
        });

        if (!response.ok) {
            throw new Error('❌ Error al subir el archivo CSV');
        }

        const data = await response.json();
        return data as T;
    } catch (error: any) {
        console.error('❌ Error al subir el archivo CSV:', error);
        throw new Error(error.message || 'Error al subir el archivo CSV');
    }
}

export async function uploadFile(
    file: File,
    folder: UploadFolder,
    dni: string = '', name: string = '',
    fileId: string = ''
) {
    try {
        const formData = new FormData();
        formData.append('file', file);
        if (dni) formData.append('nombre', getFileName(dni, folder, name));
        if (fileId) formData.append('fileId', fileId);

        const response = await fetch(`${API_URL}/upload/${folder}`, {
            method: 'POST',
            body: formData,
            headers: {
                'x-api-key': apiKey,
            },
        });

        if (!response.ok) {
            // Leer el cuerpo del error para obtener detalles del backend
            let errorDetail = `HTTP ${response.status}`;
            try {
                const errorBody = await response.json();
                errorDetail = errorBody.message || errorBody.error || JSON.stringify(errorBody);
            } catch {
                errorDetail = await response.text().catch(() => `HTTP ${response.status}`);
            }
            console.error('❌ Error del servidor al subir archivo:', errorDetail);
            throw new Error(`Error al subir archivo: ${errorDetail}`);
        }

        const data = await response.json();
        return data as UploadResponse;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error('❌ Error al subir archivo:', error);
        throw error;
    }
}

function getFileName(dni: string, folder: UploadFolder, originalName: string): string {
    const today = new Date().toISOString().split('T')[0]

    switch (folder) {
        case 'dnis':
            return `DOCUMENTO_IDENTIDAD_${dni}`;
        case 'vouchers':
            return `VOUCHER_${dni}_${today}`;
        case 'becas':
            // Prefijar el nombre original con BECAS y DNI
            return `BECAS_${dni}_${originalName}_${today}`;
        case 'cvs':
            return `CV_${dni}_${today}`;
        case 'constancias':
            return `${dni}-${originalName}`;
    }
}