import { useParams, useLocation } from 'react-router-dom'; // ✅ useLocation 추가
import styled from 'styled-components';
import { useMovieDetail } from '../hooks/useMovieDetail';
import { useReviews } from '../hooks/useReviews';
import { useAuth } from '../hooks/useAuth';
import ChatRoom from '../components/ChatRoom';
import { useState } from 'react';

const MovieReview = () => {
    const { movieId } = useParams<{ movieId: string }>();
    const location = useLocation(); // ✅ 위치 정보 가져오기
    // ✅ 전달받은 state에서 isTv 값을 확인 (기본값 false)
    const isTv = location.state?.isTv || false;

    const { user } = useAuth();
    // ✅ 훅에 isTv 정보 전달
    const { movie, loading: movieLoading, error: movieError } = useMovieDetail(movieId || '', isTv);
    const { reviews, loading: reviewsLoading, error: reviewsError, addReview } = useReviews(Number(movieId));

    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            alert('로그인이 필요합니다.');
            return;
        }
        if (!comment.trim()) {
            alert('리뷰 내용을 입력해주세요.');
            return;
        }

        setSubmitting(true);
        const result = await addReview(rating, comment, movie?.title || movie?.name);
        if (result.success) {
            setRating(5);
            setComment('');
            alert('리뷰가 등록되었습니다!');
        } else {
            alert(result.message || '리뷰 등록에 실패했습니다.');
        }
        setSubmitting(false);
    };

    if (movieLoading) {
        return (
            <LoadingContainer>
                <Spinner />
                <LoadingText>정보를 불러오는 중...</LoadingText>
            </LoadingContainer>
        );
    }

    if (movieError || !movie) {
        return (
            <ErrorContainer>
                <ErrorText>❌ {movieError || '정보를 찾을 수 없습니다.'}</ErrorText>
            </ErrorContainer>
        );
    }

    return (
        <Container>
            {/* 영화 배경 이미지 */}
            <BackdropSection
                style={{
                    backgroundImage: movie.backdrop_path
                        ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
                        : 'linear-gradient(to bottom, #1a1a1a, #000)',
                }}
            >
                <Overlay />
            </BackdropSection>

            {/* 영화 정보 섹션 */}
            <MovieInfoSection>
                <PosterImage
                    src={
                        movie.poster_path
                            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                            : '/no-image.png'
                    }
                    alt={movie.title}
                />
                <InfoContent>
                    <Title>{movie.title}</Title>
                    <MetaInfo>
                        <span>⭐ {movie.vote_average?.toFixed(1)}</span>
                        <span>• {movie.release_date?.split('-')[0]}</span>
                        {movie.runtime && <span>• {movie.runtime}분</span>}
                    </MetaInfo>
                    <Genres>
                        {movie.genres?.map((genre) => (
                            <GenreTag key={genre.id}>{genre.name}</GenreTag>
                        ))}
                    </Genres>
                    <Overview>{movie.overview || '줄거리 정보가 없습니다.'}</Overview>
                </InfoContent>
            </MovieInfoSection>

            {/* 리뷰 & 채팅 섹션 */}
            <ContentSection>
                {/* 왼쪽: 리뷰 작성 & 리뷰 목록 */}
                <ReviewSection>
                    <SectionTitle>📝 리뷰</SectionTitle>

                    {user ? (
                        <ReviewForm onSubmit={handleSubmit}>
                            <RatingContainer>
                                <label>평점:</label>
                                <StarRating>
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                                        <Star
                                            key={star}
                                            $active={star <= rating}
                                            onClick={() => setRating(star)}
                                        >
                                            ⭐
                                        </Star>
                                    ))}
                                </StarRating>
                                <span>{rating}/10</span>
                            </RatingContainer>

                            <CommentTextarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="이 콘텐츠에 대한 생각을 남겨주세요..."
                                maxLength={500}
                            />

                            <SubmitButton type="submit" disabled={submitting}>
                                {submitting ? '등록 중...' : '리뷰 등록'}
                            </SubmitButton>
                        </ReviewForm>
                    ) : (
                        <LoginPrompt>로그인하여 리뷰를 남겨보세요!</LoginPrompt>
                    )}

                    <ReviewList>
                        {reviewsLoading ? (
                            <LoadingText>리뷰를 불러오는 중...</LoadingText>
                        ) : reviewsError ? (
                            <ErrorReview>❌ {reviewsError}</ErrorReview>
                        ) : reviews.length === 0 ? (
                            <EmptyReview>아직 리뷰가 없습니다. 첫 리뷰를 남겨보세요!</EmptyReview>
                        ) : (
                            reviews.map((review) => (
                                <ReviewCard key={review.id}>
                                    <ReviewHeader>
                                        <UserInfo>
                                            <Avatar
                                                src={review.userPhoto || '/default-avatar.png'}
                                                alt={review.userName}
                                            />
                                            <UserName>{review.userName}</UserName>
                                        </UserInfo>
                                        <ReviewRating>⭐ {review.rating}/10</ReviewRating>
                                    </ReviewHeader>
                                    <ReviewComment>{review.comment}</ReviewComment>
                                    <ReviewDate>
                                        {new Date(review.createdAt).toLocaleDateString('ko-KR')}
                                    </ReviewDate>
                                </ReviewCard>
                            ))
                        )}
                    </ReviewList>
                </ReviewSection>

                {/* 오른쪽: 실시간 채팅 */}
                <ChatSection>
                    <ChatRoom movieId={Number(movieId)} movieTitle={movie.title} />
                </ChatSection>
            </ContentSection>
        </Container>
    );
};

export default MovieReview;

// Styled Components
const Container = styled.div`
    min-height: 100vh;
    background: #000;
    padding-top: 60px;
`;

const LoadingContainer = styled.div`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: linear-gradient(to bottom, #000, #1a1a1a);
`;

const Spinner = styled.div`
    width: 50px;
    height: 50px;
    border: 4px solid rgba(229, 9, 20, 0.1);
    border-top-color: #e50914;
    border-radius: 50%;
    animation: spin 1s linear infinite;

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
`;

const LoadingText = styled.p`
    color: #999;
    margin-top: 20px;
    font-size: 1rem;
`;

const ErrorContainer = styled.div`
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(to bottom, #000, #1a1a1a);
`;

const ErrorText = styled.p`
    color: #e50914;
    font-size: 1.2rem;
`;

const BackdropSection = styled.div`
    position: relative;
    height: 400px;
    background-size: cover;
    background-position: center;
`;

const Overlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.95));
`;

const MovieInfoSection = styled.div`
    display: flex;
    gap: 30px;
    padding: 30px 50px;
    margin-top: -100px;
    position: relative;
    z-index: 2;

    @media (max-width: 768px) {
        flex-direction: column;
        padding: 20px;
    }
`;

const PosterImage = styled.img`
    width: 250px;
    height: 375px;
    object-fit: cover;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);

    @media (max-width: 768px) {
        width: 150px;
        height: 225px;
    }
`;

const InfoContent = styled.div`
    flex: 1;
    color: white;
`;

const Title = styled.h1`
    font-size: 2.5rem;
    margin-bottom: 10px;

    @media (max-width: 768px) {
        font-size: 1.8rem;
    }
`;

const MetaInfo = styled.div`
    display: flex;
    gap: 15px;
    font-size: 1rem;
    color: #ccc;
    margin-bottom: 15px;
`;

const Genres = styled.div`
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
`;

const GenreTag = styled.span`
    background: rgba(229, 9, 20, 0.2);
    color: #e50914;
    padding: 5px 15px;
    border-radius: 20px;
    font-size: 0.9rem;
`;

const Overview = styled.p`
    font-size: 1rem;
    line-height: 1.6;
    color: #ddd;
`;

const ContentSection = styled.div`
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 30px;
    padding: 30px 50px;

    @media (max-width: 1024px) {
        grid-template-columns: 1fr;
    }

    @media (max-width: 768px) {
        padding: 20px;
    }
`;

const ReviewSection = styled.div``;

const SectionTitle = styled.h2`
    font-size: 1.5rem;
    color: white;
    margin-bottom: 20px;
`;

const ReviewForm = styled.form`
    background: rgba(255, 255, 255, 0.05);
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 30px;
`;

const RatingContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
    color: white;
`;

const StarRating = styled.div`
    display: flex;
    gap: 5px;
`;

interface StarProps {
    $active: boolean;
}

const Star = styled.span<StarProps>`
    cursor: pointer;
    font-size: 1.5rem;
    opacity: ${(props) => (props.$active ? 1 : 0.3)};
    transition: opacity 0.2s;

    &:hover {
        opacity: 0.8;
    }
`;

const CommentTextarea = styled.textarea`
    width: 100%;
    min-height: 100px;
    padding: 15px;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(0, 0, 0, 0.5);
    color: white;
    font-size: 1rem;
    resize: vertical;
    margin-bottom: 15px;

    &:focus {
        outline: none;
        border-color: #e50914;
    }
`;

const SubmitButton = styled.button`
    background: linear-gradient(135deg, #e50914 0%, #831010 100%);
    color: white;
    border: none;
    padding: 12px 30px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    font-size: 1rem;
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

const LoginPrompt = styled.div`
    text-align: center;
    padding: 40px;
    color: #999;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    margin-bottom: 30px;
`;

const ReviewList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const EmptyReview = styled.div`
    text-align: center;
    padding: 40px;
    color: #666;
`;

const ErrorReview = styled.div`
    text-align: center;
    padding: 40px;
    color: #e50914;
    background: rgba(229, 9, 20, 0.1);
    border-radius: 8px;
`;

const ReviewCard = styled.div`
    background: rgba(255, 255, 255, 0.05);
    padding: 20px;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
`;

const ReviewHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
`;

const UserInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const Avatar = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid #e50914;
`;

const UserName = styled.span`
    color: white;
    font-weight: bold;
`;

const ReviewRating = styled.span`
    color: #ffd700;
    font-weight: bold;
`;

const ReviewComment = styled.p`
    color: #ddd;
    line-height: 1.6;
    margin-bottom: 10px;
`;

const ReviewDate = styled.span`
    color: #666;
    font-size: 0.85rem;
`;

const ChatSection = styled.div`
    position: sticky;
    top: 80px;
    height: fit-content;
`;