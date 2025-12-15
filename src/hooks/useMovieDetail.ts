import { useState, useEffect } from 'react';
import type { MovieDetail } from '../types/types';

export const useMovieDetail = (movieId: string) => {
    const [movie, setMovie] = useState<MovieDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMovieDetail = async () => {
            try {
                setLoading(true);
                setError(null);

                const apiKey = import.meta.env.VITE_TMDB_API_KEY;

                if (!apiKey) {
                    throw new Error('TMDB API 키가 설정되지 않았습니다.');
                }

                console.log('영화 정보 로딩 중... ID:', movieId);

                const response = await fetch(
                    `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=ko-KR`
                );

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('영화를 찾을 수 없습니다.');
                    }
                    throw new Error(`API 오류: ${response.status}`);
                }

                const data = await response.json();
                console.log('영화 정보 로딩 완료:', data.title);
                setMovie(data);
            } catch (err) {
                console.error('영화 정보 로딩 실패:', err);
                setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        if (movieId) {
            fetchMovieDetail();
        } else {
            setLoading(false);
            setError('영화 ID가 없습니다.');
        }
    }, [movieId]);

    return { movie, loading, error };
};
