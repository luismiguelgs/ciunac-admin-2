const API_URL = process.env.NEXT_PUBLIC_API_URL;
const apiKey: string = process.env.NEXT_PUBLIC_API_KEY!;

export enum CRUD {
	CREATE = 'create',
	READ = 'read',
	UPDATE = 'update',
	DELETE = 'delete'
}

import { getSession } from "next-auth/react";

export async function apiFetch<T>(url: string, method: string, body?: unknown): Promise<T> {
	let token = '';
	if (typeof window !== 'undefined') {
		const session = await getSession();
		token = (session as any)?.accessToken || '';
	} else {
		try {
			// Dynamic require to prevent bundling node modules on the client
			const authModule = require('@/auth');
			const session = await authModule.auth();
			token = session?.accessToken || '';
		} catch (e) {
			console.warn("Could not fetch server session dynamically", e);
		}
	}

	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		'x-api-key': apiKey,
	};

	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	}

	const response = await fetch(`${API_URL}/${url}`, {
		method,
		headers,
		credentials: 'include',
		body: body ? JSON.stringify(body) : undefined,
	});

	if (!response.ok) {
		const msg = await response.text();
		throw new Error(`HTTP error! status: ${response.status}: ${msg}`);
	}

	const text = await response.text();
	if (!text) return {} as T;

	try {
		return JSON.parse(text) as T;
	} catch (e) {
		// If it's not JSON, return the text directly
		// This handles cases where the API returns a raw string (like a token)
		return text as unknown as T;
	}
}

export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
	const copy = { ...obj };
	keys.forEach((key) => {
		delete copy[key];
	});
	return copy;
}

export function errorHandler(err: unknown, operation: string): void {
	if (err instanceof Error) {
		switch (operation) {
			case CRUD.CREATE:
				console.error('Error al crear el elemento:', err.message);
				break;
			case CRUD.UPDATE:
				console.error('Error al actualizar el elemento:', err.message);
				break;
			case CRUD.DELETE:
				console.error('Error al borrar el elemento:', err.message);
				break;
			case CRUD.READ:
				console.error('Error al cargar el elemento:', err.message);
				break;
		}
	} else {
		console.error('Error desconocido al actualizar el elemento:', err);
	}
	throw err
}   