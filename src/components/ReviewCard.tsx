import styled from 'styled-components';
import { motion } from 'framer-motion';
import type { Review } from '../types/types';
import { useAuth } from '../hooks/useAuth';

interface ReviewCardProps {
    review: Review;
    onEdit?: (review: Review) => void;
    onDelete?: (reviewId: string) => void;
    onLike?: (reviewId: string) => void;
}

const ReviewCard = ({ review, onEdit, onDelete, onLike }: ReviewCardProps) => {
    const { user } = useAuth();
    const isMyReview = user?.uid === review.userId;
    const hasLiked = user ? review.likes?.includes(user.uid) : false;

    const formatDate = (timestamp: any) => {
        if (!timestamp) return '';
        const reviewDate = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return reviewDate.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <Card
            as={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
        >
            <CardHeader>
                <UserInfo>
                    <Avatar src={review.userPhoto || '/default-avatar.png'} alt={review.userName} />
                    <div>
                        <UserName>{review.userName}</UserName>
                        <DateText>{formatDate(review.createdAt)}</DateText>
                    </div>
                </UserInfo>
                <Rating>
                    <Star>⭐</Star>
                    <RatingText>{review.rating}/10</RatingText>
                </Rating>
            </CardHeader>

            {review.spoiler && <SpoilerWarning>⚠️ 스포일러 포함</SpoilerWarning>}

            <Content $spoiler={review.spoiler || false}>
                {review.content || review.comment}
            </Content>

            <CardFooter>
                <LikeButton
                    onClick={() => onLike?.(review.id)}
                    $liked={hasLiked || false}
                    disabled={!user}
                >
                    {hasLiked ? '❤️' : '🤍'} {review.likes?.length || 0}
                </LikeButton>

                {isMyReview && (
                    <ButtonGroup>
                        <EditButton onClick={() => onEdit?.(review)}>수정</EditButton>
                        <DeleteButton onClick={() => onDelete?.(review.id)}>삭제</DeleteButton>
                    </ButtonGroup>
                )}
            </CardFooter>
        </Card>
    );
};

export default ReviewCard;

// Styled Components
const Card = styled.div`
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 15px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.3s;

    &:hover {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(229, 9, 20, 0.3);
    }
`;

const CardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
`;

const UserInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

const Avatar = styled.img`
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 2px solid #e50914;
`;

const UserName = styled.div`
    font-weight: bold;
    font-size: 1rem;
    color: white;
`;

const DateText = styled.div`
    font-size: 0.85rem;
    color: #999;
    margin-top: 2px;
`;

const Rating = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
    background: linear-gradient(135deg, #e50914 0%, #831010 100%);
    padding: 8px 16px;
    border-radius: 20px;
`;

const Star = styled.span`
    font-size: 1.2rem;
`;

const RatingText = styled.span`
    font-weight: bold;
    font-size: 1.1rem;
    color: white;
`;

const SpoilerWarning = styled.div`
    background: rgba(255, 193, 7, 0.2);
    border: 1px solid rgba(255, 193, 7, 0.5);
    color: #ffc107;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 0.85rem;
    margin-bottom: 12px;
    text-align: center;
`;

interface ContentProps {
    $spoiler: boolean;
}

const Content = styled.p<ContentProps>`
    color: ${(props) => (props.$spoiler ? '#999' : '#e5e5e5')};
    line-height: 1.6;
    font-size: 0.95rem;
    margin-bottom: 15px;
    white-space: pre-wrap;
    word-break: break-word;
`;

const CardFooter = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

interface LikeButtonProps {
    $liked: boolean;
}

const LikeButton = styled.button<LikeButtonProps>`
    background: ${(props) => (props.$liked ? 'rgba(229, 9, 20, 0.2)' : 'rgba(255, 255, 255, 0.1)')};
    border: 1px solid ${(props) => (props.$liked ? '#e50914' : 'rgba(255, 255, 255, 0.2)')};
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.2s;

    &:hover:not(:disabled) {
        background: rgba(229, 9, 20, 0.3);
        transform: scale(1.05);
    }

    &:disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 10px;
`;

const EditButton = styled.button`
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    padding: 6px 14px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.85rem;
    transition: all 0.2s;

    &:hover {
        background: rgba(255, 255, 255, 0.2);
    }
`;

const DeleteButton = styled.button`
    background: rgba(229, 9, 20, 0.2);
    border: 1px solid rgba(229, 9, 20, 0.5);
    color: #e50914;
    padding: 6px 14px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.85rem;
    transition: all 0.2s;

    &:hover {
        background: rgba(229, 9, 20, 0.3);
    }
`;
