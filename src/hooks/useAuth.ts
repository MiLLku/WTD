import { useState, useEffect } from 'react';
import {
    signInWithPopup,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    type User,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, githubProvider, db } from '../config/firebase';

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 인증 상태 변화 감지
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);

            // 신규 사용자인 경우 Firestore에 프로필 생성
            if (currentUser) {
                const userRef = doc(db, 'users', currentUser.uid);
                const userSnap = await getDoc(userRef);

                if (!userSnap.exists()) {
                    await setDoc(userRef, {
                        email: currentUser.email,
                        displayName: currentUser.displayName || 'Anonymous',
                        photoURL: currentUser.photoURL || '',
                        createdAt: serverTimestamp(),
                        friends: [],
                        favoriteGenres: [],
                    });
                    console.log('✅ 신규 사용자 프로필 생성 완료');
                }
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Google 로그인
    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            console.log('✅ Google 로그인 성공:', result.user);
            return { success: true, user: result.user };
        } catch (error: any) {
            console.error('❌ Google 로그인 실패:', error);
            return { success: false, error: error.message };
        }
    };

    // GitHub 로그인
    const signInWithGithub = async () => {
        try {
            const result = await signInWithPopup(auth, githubProvider);
            console.log('✅ GitHub 로그인 성공:', result.user);
            return { success: true, user: result.user };
        } catch (error: any) {
            console.error('❌ GitHub 로그인 실패:', error);
            return { success: false, error: error.message };
        }
    };

    // 로그아웃
    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
            console.log('✅ 로그아웃 성공');
            return { success: true };
        } catch (error: any) {
            console.error('❌ 로그아웃 실패:', error);
            return { success: false, error: error.message };
        }
    };

    return {
        user,
        loading,
        signInWithGoogle,
        signInWithGithub,
        signOut,
    };
};