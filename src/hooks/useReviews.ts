import { useState, useEffect } from 'react';
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    orderBy,
    onSnapshot,
    serverTimestamp,
    arrayUnion,
    arrayRemove,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './useAuth';

export interface Review {
    id: string;
    userId: string;
    userName: string;
    userPhoto: string;
    movieId: number;
    movieTitle: string;
    rating: number; // 1-10
    content: string;
    spoiler: boolean;
    likes: string[]; // 좋아요 누른 사용자 ID 배열
    createdAt: any;
    updatedAt: any;
}

export const useReviews = (movieId?: number) => {
    const { user } = useAuth();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [userReview, setUserReview] = useState<Review | null>(null);

    // 특정 영화의 리뷰 실시간 구독
    useEffect(() => {
        if (!movieId) {
            setLoading(false);
            return;
        }

        const reviewsRef = collection(db, 'reviews');
        const q = query(
            reviewsRef,
            where('movieId', '==', movieId),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const reviewsData = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Review[];

                setReviews(reviewsData);

                // 현재 사용자의 리뷰 찾기
                if (user) {
                    const myReview = reviewsData.find((r) => r.userId === user.uid);
                    setUserReview(myReview || null);
                }

                setLoading(false);
                console.log(`✅ ${movieId}번 영화 리뷰 ${reviewsData.length}개 로드`);
            },
            (error) => {
                console.error('❌ 리뷰 로드 실패:', error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [movieId, user]);

    // 리뷰 작성
    const addReview = async (
        movieId: number,
        movieTitle: string,
        rating: number,
        content: string,
        spoiler: boolean
    ) => {
        if (!user) {
            alert('로그인이 필요합니다!');
            return { success: false, message: '로그인이 필요합니다.' };
        }

        if (rating < 1 || rating > 10) {
            return { success: false, message: '평점은 1~10 사이여야 합니다.' };
        }

        if (content.trim().length < 10) {
            return { success: false, message: '리뷰는 최소 10자 이상 작성해주세요.' };
        }

        try {
            const reviewData = {
                userId: user.uid,
                userName: user.displayName || 'Anonymous',
                userPhoto: user.photoURL || '',
                movieId,
                movieTitle,
                rating,
                content: content.trim(),
                spoiler,
                likes: [],
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };

            await addDoc(collection(db, 'reviews'), reviewData);
            console.log('✅ 리뷰 작성 성공');
            return { success: true, message: '리뷰가 등록되었습니다!' };
        } catch (error: any) {
            console.error('❌ 리뷰 작성 실패:', error);
            return { success: false, message: error.message };
        }
    };

    // 리뷰 수정
    const updateReview = async (
        reviewId: string,
        rating: number,
        content: string,
        spoiler: boolean
    ) => {
        if (!user) {
            return { success: false, message: '로그인이 필요합니다.' };
        }

        try {
            const reviewRef = doc(db, 'reviews', reviewId);
            await updateDoc(reviewRef, {
                rating,
                content: content.trim(),
                spoiler,
                updatedAt: serverTimestamp(),
            });

            console.log('✅ 리뷰 수정 성공');
            return { success: true, message: '리뷰가 수정되었습니다!' };
        } catch (error: any) {
            console.error('❌ 리뷰 수정 실패:', error);
            return { success: false, message: error.message };
        }
    };

    // 리뷰 삭제
    const deleteReview = async (reviewId: string) => {
        if (!user) {
            return { success: false, message: '로그인이 필요합니다.' };
        }

        try {
            await deleteDoc(doc(db, 'reviews', reviewId));
            console.log('✅ 리뷰 삭제 성공');
            return { success: true, message: '리뷰가 삭제되었습니다.' };
        } catch (error: any) {
            console.error('❌ 리뷰 삭제 실패:', error);
            return { success: false, message: error.message };
        }
    };

    // 리뷰 좋아요 토글
    const toggleLike = async (reviewId: string) => {
        if (!user) {
            alert('로그인이 필요합니다!');
            return;
        }

        try {
            const reviewRef = doc(db, 'reviews', reviewId);
            const review = reviews.find((r) => r.id === reviewId);

            if (!review) return;

            const hasLiked = review.likes.includes(user.uid);

            if (hasLiked) {
                // 좋아요 취소
                await updateDoc(reviewRef, {
                    likes: arrayRemove(user.uid),
                });
            } else {
                // 좋아요
                await updateDoc(reviewRef, {
                    likes: arrayUnion(user.uid),
                });
            }

            console.log(`✅ 좋아요 ${hasLiked ? '취소' : '등록'}`);
        } catch (error: any) {
            console.error('❌ 좋아요 처리 실패:', error);
        }
    };

    // 평균 평점 계산
    const getAverageRating = (): number => {
        if (reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        return Math.round((sum / reviews.length) * 10) / 10;
    };

    return {
        reviews,
        loading,
        userReview,
        addReview,
        updateReview,
        deleteReview,
        toggleLike,
        getAverageRating,
    };
};