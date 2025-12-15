import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useChat } from '../hooks/useChat';
import { useAuth } from '../hooks/useAuth';
import ProfileModal from './ProfileModal';

interface ChatRoomProps {
    movieId: number;
    movieTitle: string;
}

const ChatRoom = ({ movieId, movieTitle }: ChatRoomProps) => {
    const { user } = useAuth();
    const { messages, loading, sendMessage } = useChat(movieId);
    const [inputMessage, setInputMessage] = useState('');
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // 자동 스크롤
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        const result = await sendMessage(inputMessage);
        if (result.success) {
            setInputMessage('');
        } else {
            alert(result.message);
        }
    };

    const handleUserClick = (userId: string) => {
        if (userId === user?.uid) return; // 본인 프로필은 열지 않음
        setSelectedUserId(userId);
    };

    return (
        <Container>
            <Header>
                <Title>💬 실시간 채팅</Title>
                <Subtitle>{movieTitle}</Subtitle>
            </Header>

            <MessagesContainer>
                {loading ? (
                    <LoadingMessage>메시지를 불러오는 중...</LoadingMessage>
                ) : messages.length === 0 ? (
                    <EmptyMessage>아직 메시지가 없습니다. 첫 메시지를 남겨보세요!</EmptyMessage>
                ) : (
                    messages.map((msg) => (
                        <MessageItem key={msg.id} $isMyMessage={msg.userId === user?.uid}>
                            <UserInfo onClick={() => handleUserClick(msg.userId)}>
                                <Avatar src={msg.userPhoto || '/default-avatar.png'} alt={msg.userName} />
                                <UserName>{msg.userName}</UserName>
                            </UserInfo>
                            <MessageBubble $isMyMessage={msg.userId === user?.uid}>
                                {msg.message}
                            </MessageBubble>
                            <Timestamp>
                                {new Date(msg.timestamp).toLocaleTimeString('ko-KR', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </Timestamp>
                        </MessageItem>
                    ))
                )}
                <div ref={messagesEndRef} />
            </MessagesContainer>

            <InputForm onSubmit={handleSubmit}>
                {!user ? (
                    <DisabledInput disabled placeholder="로그인 후 채팅에 참여하세요" />
                ) : (
                    <>
                        <Input
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="메시지를 입력하세요..."
                            maxLength={500}
                        />
                        <SendButton type="submit" disabled={!inputMessage.trim()}>
                            전송
                        </SendButton>
                    </>
                )}
            </InputForm>

            {selectedUserId && (
                <ProfileModal userId={selectedUserId} onClose={() => setSelectedUserId(null)} />
            )}
        </Container>
    );
};

export default ChatRoom;

// Styled Components
const Container = styled.div`
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    height: 600px;
    display: flex;
    flex-direction: column;
`;

const Header = styled.div`
    padding: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Title = styled.h3`
    font-size: 1.2rem;
    color: #e50914;
    margin-bottom: 5px;
`;

const Subtitle = styled.p`
    font-size: 0.85rem;
    color: #999;
    margin: 0;
`;

const MessagesContainer = styled.div`
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 15px;

    &::-webkit-scrollbar {
        width: 6px;
    }

    &::-webkit-scrollbar-thumb {
        background: rgba(229, 9, 20, 0.5);
        border-radius: 3px;
    }
`;

const LoadingMessage = styled.div`
    text-align: center;
    color: #999;
    padding: 40px;
`;

const EmptyMessage = styled.div`
    text-align: center;
    color: #666;
    padding: 40px 20px;
`;

interface MessageItemProps {
    $isMyMessage: boolean;
}

const MessageItem = styled.div<MessageItemProps>`
    display: flex;
    flex-direction: column;
    align-items: ${(props) => (props.$isMyMessage ? 'flex-end' : 'flex-start')};
    gap: 5px;
`;

const UserInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    transition: opacity 0.2s;

    &:hover {
        opacity: 0.8;
    }
`;

const Avatar = styled.img`
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 1px solid #e50914;
`;

const UserName = styled.span`
    font-size: 0.85rem;
    color: #ccc;
`;

interface MessageBubbleProps {
    $isMyMessage: boolean;
}

const MessageBubble = styled.div<MessageBubbleProps>`
    background: ${(props) =>
            props.$isMyMessage
                    ? 'linear-gradient(135deg, #e50914 0%, #831010 100%)'
                    : 'rgba(255, 255, 255, 0.1)'};
    color: white;
    padding: 10px 15px;
    border-radius: 12px;
    max-width: 80%;
    word-break: break-word;
    line-height: 1.4;
`;

const Timestamp = styled.span`
    font-size: 0.75rem;
    color: #666;
`;

const InputForm = styled.form`
    padding: 15px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    gap: 10px;
`;

const Input = styled.input`
    flex: 1;
    padding: 10px 15px;
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(0, 0, 0, 0.5);
    color: white;
    font-size: 0.9rem;

    &:focus {
        outline: none;
        border-color: #e50914;
    }
`;

const DisabledInput = styled.input`
    flex: 1;
    padding: 10px 15px;
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.3);
    color: #666;
    font-size: 0.9rem;
`;

const SendButton = styled.button`
    background: linear-gradient(135deg, #e50914 0%, #831010 100%);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 20px;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.2s;

    &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(229, 9, 20, 0.4);
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;