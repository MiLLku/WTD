import { useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useProfile } from '../hooks/useProfile';
import { useReviews } from '../hooks/useReviews';

interface ProfileModalProps {
    userId: string;
    onClose: () => void;
}

const ProfileModal = ({ userId, onClose }: ProfileModalProps) => {
    const { profile, loading } = useProfile(userId);
    const { reviews } = useReviews(); // 전체 리뷰에서 필터링

    // ESC 키로 닫기
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    // 사용자가 작성한 리뷰만 필터링
    const userReviews = reviews.filter((review) => review.userId === userId);

    if (loading) {
        return (
            <Overlay onClick={onClose}>
                <ModalContent onClick={(e) => e.stopPropagation()}>
                    <LoadingMessage>프로필을 불러오는 중...</LoadingMessage>
                </ModalContent>
            </Overlay>
        );
    }

    if (!profile) {
        return (
            <Overlay onClick={onClose}>
                <ModalContent onClick={(e) => e.stopPropagation()}>
                    <ErrorMessage>프로필을 찾을 수 없습니다.</ErrorMessage>
                    <CloseButton onClick={onClose}>닫기</CloseButton>
                </ModalContent>
            </Overlay>
        );
    }

    return (
        <AnimatePresence>
            <Overlay
                onClick={onClose}
                as={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <ModalContent
                    onClick={(e) => e.stopPropagation()}
                    as={motion.div}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                >
                    <Header>
                        <Avatar src={profile.photoURL || '/default-avatar.png'} alt={profile.displayName} />
                        <UserInfo>
                            <UserName>{profile.displayName}</UserName>
                            <UserEmail>{profile.email}</UserEmail>
                        </UserInfo>
                        <CloseButton onClick={onClose}>✕</CloseButton>
                    </Header>

                    <Body>
                        {profile.bio && (
                            <Section>
                                <SectionTitle>📝 소개</SectionTitle>
                                <Bio>{profile.bio}</Bio>
                            </Section>
                        )}

                        {profile.favoriteGenres && profile.favoriteGenres.length > 0 && (
                            <Section>
                                <SectionTitle>🎬 선호 장르</SectionTitle>
                                <GenreList>
                                    {profile.favoriteGenres.map((genre) => (
                                        <GenreTag key={genre}>{genre}</GenreTag>
                                    ))}
                                </GenreList>
                            </Section>
                        )}

                        <Section>
                            <SectionTitle>⭐ 활동 통계</SectionTitle>
                            <StatsList>
                                <StatItem>
                                    <StatLabel>작성한 리뷰</StatLabel>
                                    <StatValue>{userReviews.length}개</StatValue>
                                </StatItem>
                                <StatItem>
                                    <StatLabel>평균 평점</StatLabel>
                                    <StatValue>
                                        {userReviews.length > 0
                                            ? (
                                                userReviews.reduce((sum, r) => sum + r.rating, 0) /
                                                userReviews.length
                                            ).toFixed(1)
                                            : '0.0'}
                                        /10
                                    </StatValue>
                                </StatItem>
                                <StatItem>
                                    <StatLabel>받은 좋아요</StatLabel>
                                    <StatValue>
                                        {userReviews.reduce((sum, r) => sum + (r.likes?.length || 0), 0)}개
                                    </StatValue>
                                </StatItem>
                            </StatsList>
                        </Section>

                        {userReviews.length > 0 && (
                            <Section>
                                <SectionTitle>📖 최근 리뷰</SectionTitle>
                                <ReviewList>
                                    {userReviews.slice(0, 3).map((review) => (
                                        <ReviewItem key={review.id}>
                                            <ReviewHeader>
                                                <ReviewTitle>{review.movieTitle}</ReviewTitle>
                                                <ReviewRating>⭐ {review.rating}/10</ReviewRating>
                                            </ReviewHeader>
                                            <ReviewContent>
                                                {review.content.length > 100
                                                    ? `${review.content.substring(0, 100)}...`
                                                    : review.content}
                                            </ReviewContent>
                                        </ReviewItem>
                                    ))}
                                </ReviewList>
                            </Section>
                        )}
                    </Body>
                </ModalContent>
            </Overlay>
        </AnimatePresence>
    );
};

export default ProfileModal;

// Styled Components
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  border-radius: 16px;
  border: 1px solid rgba(229, 9, 20, 0.3);
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(229, 9, 20, 0.5);
    border-radius: 4px;
  }
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 30px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    position: relative;
`;

const Avatar = styled.img`
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 3px solid #e50914;
`;

const UserInfo = styled.div`
    flex: 1;
`;

const UserName = styled.h2`
    font-size: 1.8rem;
    font-weight: bold;
    color: white;
    margin: 0 0 5px 0;
`;

const UserEmail = styled.p`
    font-size: 0.9rem;
    color: #999;
    margin: 0;
`;

const CloseButton = styled.button`
    position: absolute;
    top: 20px;
    right: 20px;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    font-size: 1.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;

    &:hover {
        background: rgba(229, 9, 20, 0.8);
        transform: rotate(90deg);
    }
`;

const Body = styled.div`
    padding: 30px;
`;

const Section = styled.div`
    margin-bottom: 30px;

    &:last-child {
        margin-bottom: 0;
    }
`;

const SectionTitle = styled.h3`
    font-size: 1.2rem;
    color: #e50914;
    margin-bottom: 15px;
    font-weight: bold;
`;

const Bio = styled.p`
    color: #ddd;
    line-height: 1.6;
    font-size: 1rem;
`;

const GenreList = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
`;

const GenreTag = styled.span`
  background: rgba(229, 9, 20, 0.2);
  border: 1px solid rgba(229, 9, 20, 0.4);
  color: #ff6b6b;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
`;

const StatsList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const StatItem = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const StatLabel = styled.div`
  font-size: 0.85rem;
  color: #999;
  margin-bottom: 8px;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  color: #e50914;
  font-weight: bold;
`;

const ReviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ReviewItem = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 15px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const ReviewHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
`;

const ReviewTitle = styled.h4`
    font-size: 1rem;
    color: white;
    margin: 0;
`;

const ReviewRating = styled.span`
    font-size: 0.9rem;
    color: #ffd700;
`;

const ReviewContent = styled.p`
    font-size: 0.9rem;
    color: #ccc;
    line-height: 1.5;
    margin: 0;
`;

const LoadingMessage = styled.div`
    text-align: center;
    color: #999;
    padding: 40px;
    font-size: 1.1rem;
`;

const ErrorMessage = styled.div`
    text-align: center;
    color: #ff6b6b;
    padding: 40px;
    font-size: 1.1rem;
`;