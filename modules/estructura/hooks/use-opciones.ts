'use client'
import OpcionesService, { Collection } from "@/modules/estructura/services/opciones.service";
import React from "react";
import { useOpcionesStore } from "../store/opciones.store";

const useOpciones = <T,>(collection: Collection) => {
    // 1. Estados locales y del store
    const { data: cachedData, setData: setStoreData } = useOpcionesStore();
    const [data, setData] = React.useState<T[]>((cachedData[collection] as T[]) || []);
    const [loading, setLoading] = React.useState<boolean>(false);

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
                const res = await OpcionesService.fetchItems<T>(collection);
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

export default useOpciones;