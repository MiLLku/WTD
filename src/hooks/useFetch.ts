import { useState, useEffect } from 'react';
import axios from '../api/axios';
import type { Movie, TMDBResponse } from '../types/types';

// URL만 넘기면 데이터를 가져와주는 마법의 훅
export const useFetch = (fetchUrl: string) => {
    const [data, setData] = useState<Movie[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get<TMDBResponse>(fetchUrl);
                setData(response.data.results);
            } catch (err: any) {
                console.error("API Fetch Error:", err);
                setError(err.message || 'Something went wrong');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [fetchUrl]);

    return { data, loading, error };
};
