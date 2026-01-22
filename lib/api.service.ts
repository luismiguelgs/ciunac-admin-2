const API_URL = process.env.NEXT_PUBLIC_API_URL;
const apiKey: string = process.env.NEXT_PUBLIC_API_KEY!;

export enum CRUD {
    CREATE = 'create',
    READ = 'read',
    UPDATE = 'update',
    DELETE = 'delete'
}

export async function apiFetch<T>(url: string, method: string, body?: unknown): Promise<T> {
  const response = await fetch(`${API_URL}/${url}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const msg = await response.text();
    throw new Error(`HTTP error! status: ${response.status}: ${msg}`);
  }

  return (await response.json()) as T;
}

export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const copy = { ...obj };
  keys.forEach((key) => {
    delete copy[key];
  });
  return copy;
}

export function errorHandler(err: unknown, operation:string): void {
        if (err instanceof Error) {
            switch (operation){
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