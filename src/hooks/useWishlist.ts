import { useState, useEffect } from 'react';
import {
    collection,
    doc,
    setDoc,
    deleteDoc,
    query,
    serverTimestamp,
    onSnapshot,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './useAuth';
import type { Movie } from '../types/types';

export const useWishlist = () => {
    const { user } = useAuth();
    const [wishlist, setWishlist] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);

    // Firestore에서 찜 목록 실시간 구독
    useEffect(() => {
        if (!user) {
            // 로그인하지 않은 경우 LocalStorage 사용
            const stored = localStorage.getItem('netflix_wishlist');
            if (stored) {
                try {
                    setWishlist(JSON.parse(stored));
                } catch (e) {
                    console.error('LocalStorage 파싱 에러:', e);
                }
            }
            setLoading(false);
            return;
        }

        // 로그인한 경우 Firestore 실시간 구독
        const wishlistRef = collection(db, 'wishlists', user.uid, 'movies');

        const unsubscribe = onSnapshot(query(wishlistRef), (snapshot) => {
            const movies = snapshot.docs.map((doc) => ({
                id: parseInt(doc.id),
                ...doc.data(),
            })) as Movie[];

            setWishlist(movies);
            setLoading(false);
            console.log('✅ Firestore 찜 목록 로드:', movies.length, '개');
        }, (error) => {
            console.error('❌ Firestore 구독 에러:', error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    // 찜하기 토글
    const toggleWishlist = async (movie: Movie) => {
        if (!user) {
            // 로그인하지 않은 경우 LocalStorage 사용
            const stored = localStorage.getItem('netflix_wishlist');
            let currentWishlist: Movie[] = stored ? JSON.parse(stored) : [];

            const isExisting = currentWishlist.find((item) => item.id === movie.id);

            if (isExisting) {
                currentWishlist = currentWishlist.filter((item) => item.id !== movie.id);
                alert(`${movie.title || movie.name}이(가) 찜 목록에서 삭제되었습니다.`);
            } else {
                currentWishlist.push(movie);
                alert(`${movie.title || movie.name}이(가) 찜 목록에 추가되었습니다!`);
            }

            localStorage.setItem('netflix_wishlist', JSON.stringify(currentWishlist));
            setWishlist(currentWishlist);
            return;
        }

        // 로그인한 경우 Firestore 사용
        const movieRef = doc(db, 'wishlists', user.uid, 'movies', movie.id.toString());
        const isExisting = wishlist.find((item) => item.id === movie.id);

        try {
            if (isExisting) {
                // 삭제
                await deleteDoc(movieRef);
                console.log('✅ Firestore 삭제:', movie.title);
                alert(`${movie.title || movie.name}이(가) 찜 목록에서 삭제되었습니다.`);
            } else {
                // 추가
                // ✅ [핵심 수정] Firestore는 undefined 값을 저장할 수 없으므로 null로 변환하거나 제거해야 함
                const safeMovieData = JSON.parse(JSON.stringify(movie)); // 간단하게 undefined 제거

                await setDoc(movieRef, {
                    ...safeMovieData,
                    addedAt: serverTimestamp(),
                    status: 'want_to_watch',
                });
                console.log('✅ Firestore 추가:', movie.title);
                alert(`${movie.title || movie.name}이(가) 찜 목록에 추가되었습니다!`);
            }
        } catch (error: any) {
            console.error('❌ Firestore 오류:', error);
            // 에러 메시지를 더 자세히 표시하여 디버깅 도움
            alert(`오류가 발생했습니다: ${error.message}`);
        }
    };

    return { wishlist, loading, toggleWishlist };
};
