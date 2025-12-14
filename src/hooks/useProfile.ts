import { useState, useEffect } from 'react';
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './useAuth';

export interface UserProfile {
    uid: string;
    displayName: string;
    photoURL: string;
    email: string;
    bio: string;
    favoriteGenres: string[];
    createdAt: any;
    updatedAt: any;
}

export const useProfile = (userId?: string) => {
    const { user } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    // 현재 사용자 또는 특정 사용자의 프로필 가져오기
    useEffect(() => {
        const targetUserId = userId || user?.uid;

        if (!targetUserId) {
            setLoading(false);
            return;
        }

        const fetchProfile = async () => {
            try {
                const profileDoc = await getDoc(doc(db, 'users', targetUserId));

                if (profileDoc.exists()) {
                    setProfile({ uid: targetUserId, ...profileDoc.data() } as UserProfile);
                } else if (user && targetUserId === user.uid) {
                    // 프로필이 없으면 자동 생성 (본인만)
                    const newProfile: Partial<UserProfile> = {
                        uid: user.uid,
                        displayName: user.displayName || 'Anonymous',
                        photoURL: user.photoURL || '',
                        email: user.email || '',
                        bio: '',
                        favoriteGenres: [],
                        createdAt: serverTimestamp(),
                        updatedAt: serverTimestamp(),
                    };

                    await setDoc(doc(db, 'users', user.uid), newProfile);
                    setProfile(newProfile as UserProfile);
                }

                setLoading(false);
            } catch (error) {
                console.error('❌ 프로필 로드 실패:', error);
                setLoading(false);
            }
        };

        fetchProfile();
    }, [userId, user]);

    // 프로필 업데이트
    const updateProfile = async (updates: Partial<UserProfile>) => {
        if (!user) {
            return { success: false, message: '로그인이 필요합니다.' };
        }

        try {
            await updateDoc(doc(db, 'users', user.uid), {
                ...updates,
                updatedAt: serverTimestamp(),
            });

            setProfile((prev) => (prev ? { ...prev, ...updates } : null));

            console.log('✅ 프로필 업데이트 성공');
            return { success: true, message: '프로필이 업데이트되었습니다.' };
        } catch (error: any) {
            console.error('❌ 프로필 업데이트 실패:', error);
            return { success: false, message: error.message };
        }
    };

    return {
        profile,
        loading,
        updateProfile,
    };
};