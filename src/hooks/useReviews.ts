import { useState, useEffect } from 'react';
import { collection, addDoc, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './useAuth';
import type { Review } from '../types/types';

// Review 타입을 다시 export (ReviewCard에서 사용)
export type { Review } from '../types/types';

export const useReviews = (movieId: number) => {
    const { user } = useAuth();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!movieId) {
            console.log('useReviews: movieId가 없습니다');
            setLoading(false);
            return;
        }

        console.log('useReviews: 리뷰 구독 시작, movieId:', movieId);

        try {
            const reviewsRef = collection(db, 'reviews');
            const q = query(
                reviewsRef,
                where('movieId', '==', movieId),
                orderBy('createdAt', 'desc')
            );

            const unsubscribe = onSnapshot(
                q,
                (snapshot) => {
                    console.log('useReviews: 스냅샷 수신, 문서 수:', snapshot.size);
                    const reviewsData: Review[] = [];
                    snapshot.forEach((doc) => {
                        const data = doc.data();
                        console.log('리뷰 문서:', doc.id, data);
                        reviewsData.push({ id: doc.id, ...data } as Review);
                    });
                    setReviews(reviewsData);
                    setLoading(false);
                    setError(null);
                },
                (err) => {
                    console.error('useReviews: 스냅샷 오류:', err);
                    setError(err.message);
                    setLoading(false);
                }
            );

            return () => {
                console.log('useReviews: 구독 해제');
                unsubscribe();
            };
        } catch (err) {
            console.error('useReviews: 쿼리 생성 오류:', err);
            setError(err instanceof Error ? err.message : '알 수 없는 오류');
            setLoading(false);
        }
    }, [movieId]);

    const addReview = async (rating: number, comment: string) => {
        if (!user) {
            return { success: false, message: '로그인이 필요합니다.' };
        }

        if (!comment.trim()) {
            return { success: false, message: '리뷰 내용을 입력해주세요.' };
        }

        try {
            console.log('리뷰 등록 시작:', { movieId, rating, comment });

            const reviewData = {
                movieId,
                userId: user.uid,
                userName: user.displayName || '익명',
                userPhoto: user.photoURL || null,
                rating,
                comment: comment.trim(),
                createdAt: Date.now(),
            };

            console.log('Firestore에 저장할 데이터:', reviewData);

            const docRef = await addDoc(collection(db, 'reviews'), reviewData);

            console.log('리뷰 등록 성공, 문서 ID:', docRef.id);

            return { success: true, message: '리뷰가 등록되었습니다.' };
        } catch (error) {
            console.error('리뷰 등록 실패:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : '리뷰 등록에 실패했습니다.'
            };
        }
    };

    return { reviews, loading, error, addReview };
};
