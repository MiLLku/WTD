import { useState, useEffect } from 'react';
import type { MovieDetail } from '../types/types';

export const useMovieDetail = (movieId: string, isTv: boolean = false) => {
    const [movie, setMovie] = useState<MovieDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setMovie(null);
        setLoading(true);
        setError(null);

        const fetchMovieDetail = async () => {
            try {
                const apiKey = import.meta.env.VITE_TMDB_API_KEY;
                const endpoint = isTv ? 'tv' : 'movie'; // ✅ TV와 영화 구분

                const response = await fetch(
                    `https://api.themoviedb.org/3/${endpoint}/${movieId}?api_key=${apiKey}&language=ko-KR`
                );

                if (!response.ok) {
                    throw new Error('정보를 찾을 수 없습니다.');
                }

                const data = await response.json();

                // ✅ TV 데이터일 경우 영화 데이터 구조로 변환 (title이 없고 name이 있음)
                const normalizedData = {
                    ...data,
                    title: data.title || data.name, // TV쇼 이름(name)을 title로 사용
                    release_date: data.release_date || data.first_air_date, // 방영일을 개봉일로 사용
                    runtime: data.runtime || (data.episode_run_time ? data.episode_run_time[0] : null), // 러닝타임 처리
                };

                setMovie(normalizedData);
            } catch (err: any) {
                console.error('로딩 실패:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (movieId) {
            fetchMovieDetail();
        }
    }, [movieId, isTv]); // ✅ isTv 의존성 추가

    return { movie, loading, error };
};