'use client'
import { Collection, PerfilOpcionesService } from "@/modules/perfil-docente/opciones/perfil-opciones.service";
import React from "react";
import { usePerfilOpcionesStore } from "./perfil-opciones.store";

const usePerfilOpciones = <T,>(collection: Collection) => {
    // 1. Estados locales y del store
    const { data: cachedData, setData: setStoreData } = usePerfilOpcionesStore();
    const [data, setData] = React.useState<T[]>((cachedData[collection] as T[]) || []);
    // Inicializamos loading en true si no hay datos en caché para evitar el parpadeo de "sin datos" antes del skeleton
    const [loading, setLoading] = React.useState<boolean>(!cachedData[collection] || (cachedData[collection] as T[]).length === 0);

    // 2. Efecto para cargar datos
    React.useEffect(() => {
        const fetchData = async () => {
            // Si ya hay datos en el cache locales, no marcamos loading para evitar parpadeos si no es necesario
            // Pero igual refrescamos en segundo plano o si el cache está vacío
            const isCacheEmpty = !cachedData[collection] || cachedData[collection].length === 0;

            if (isCacheEmpty) {
                setLoading(true);
            }

            try {
                const res = await PerfilOpcionesService.fetchItems<T>(collection);
                setData(res);
                setStoreData(collection, res);
            } catch (error) {
                console.error(`Error al cargar la colección ${collection}:`, error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [collection, setStoreData]); // El store data no se incluye para evitar bucles infinitos

    return { data, loading, setData };
};

export default usePerfilOpciones;