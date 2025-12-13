import { useState, useEffect } from 'react';
import type { Movie } from '../types/tmdb';

const WISHLIST_KEY = 'netflix_wishlist';

export const useWishlist = () => {
    const [wishlist, setWishlist] = useState<Movie[]>([]);

    // 초기 로딩: LocalStorage에서 데이터 가져오기
    useEffect(() => {
        const stored = localStorage.getItem(WISHLIST_KEY);
        if (stored) {
            setWishlist(JSON.parse(stored));
        }
    }, []);

    // 찜하기 토글 함수 (있으면 삭제, 없으면 추가)
    const toggleWishlist = (movie: Movie) => {
        const stored = localStorage.getItem(WISHLIST_KEY);
        let currentWishlist: Movie[] = stored ? JSON.parse(stored) : [];

        const isExisting = currentWishlist.find((item) => item.id === movie.id);

        if (isExisting) {
            // 이미 있으면 제거
            currentWishlist = currentWishlist.filter((item) => item.id !== movie.id);
            alert(`${movie.title || movie.name}이(가) 찜 목록에서 삭제되었습니다.`);
        } else {
            // 없으면 추가
            currentWishlist.push(movie);
            alert(`${movie.title || movie.name}이(가) 찜 목록에 추가되었습니다!`);
        }

        // LocalStorage 및 상태 업데이트
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(currentWishlist));
        setWishlist(currentWishlist);
    };

    return { wishlist, toggleWishlist };
};