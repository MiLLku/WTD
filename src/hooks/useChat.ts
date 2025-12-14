import { useState, useEffect, useRef } from 'react';
import {
  ref,
  push,
  onValue,
  query,
  orderByChild,
  limitToLast,
  serverTimestamp,
} from 'firebase/database';
import { realtimeDb } from '../config/firebase';
import { useAuth } from './useAuth';

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userPhoto: string;
  message: string;
  timestamp: number;
}

export const useChat = (movieId?: number) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const messagesRef = useRef<any>(null);

  // 실시간 채팅 메시지 구독
  useEffect(() => {
    if (!movieId) {
      setLoading(false);
      return;
    }

    // 채팅방 경로: chats/movie_{movieId}/messages
    const chatRef = ref(realtimeDb, `chats/movie_${movieId}/messages`);
    const chatQuery = query(chatRef, orderByChild('timestamp'), limitToLast(50));

    messagesRef.current = chatRef;

      const unsubscribe = onValue(
          chatQuery,
          (snapshot) => {
              const messagesData: ChatMessage[] = [];

              snapshot.forEach((childSnapshot) => {
                  messagesData.push({
                      id: childSnapshot.key as string,
                      ...childSnapshot.val(),
                  });
              });

              setMessages(messagesData);
              setLoading(false);
              console.log(`✅ ${movieId}번 영화 채팅 메시지 ${messagesData.length}개 로드`);
          },
          (error) => {
              console.error('❌ 채팅 메시지 로드 실패:', error);
              setLoading(false);
          }
      );

      // ✅ 클린업: unsubscribe() 함수 호출
      return () => {
          unsubscribe();
      };
  }, [movieId]);

  // 메시지 전송
  const sendMessage = async (message: string) => {
    if (!user) {
      alert('로그인이 필요합니다!');
      return { success: false, message: '로그인이 필요합니다.' };
    }

    if (!movieId) {
      return { success: false, message: '영화 ID가 없습니다.' };
    }

    if (message.trim().length === 0) {
      return { success: false, message: '메시지를 입력해주세요.' };
    }

    if (message.trim().length > 500) {
      return { success: false, message: '메시지는 500자 이하로 작성해주세요.' };
    }

    try {
      const chatRef = ref(realtimeDb, `chats/movie_${movieId}/messages`);

      await push(chatRef, {
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        userPhoto: user.photoURL || '',
        message: message.trim(),
        timestamp: serverTimestamp(),
      });

      console.log('✅ 메시지 전송 성공');
      return { success: true, message: '메시지가 전송되었습니다.' };
    } catch (error: any) {
      console.error('❌ 메시지 전송 실패:', error);
      return { success: false, message: error.message };
    }
  };

  return {
    messages,
    loading,
    sendMessage,
  };
};