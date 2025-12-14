import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AnimatePresence } from 'framer-motion';
import axios from '../api/axios';
import { useReviews, type Review } from '../hooks/useReviews';
import { useAuth } from '../hooks/useAuth';
import ReviewCard from '../components/ReviewCard';
import ChatRoom from '../components/ChatRoom';
import type { Movie } from '../types/tmdb';

const MovieReview = () => {
    const { movieId } = useParams<{ movieId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const {
        reviews,
        loading,
        addReview,
        updateReview,
        deleteReview,
        toggleLike,
        getAverageRating,
    } = useReviews(Number(movieId));

    const [movie, setMovie] = useState<Movie | null>(null);
    const [rating, setRating] = useState(5);
    const [content, setContent] = useState('');
    const [spoiler, setSpoiler] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingReviewId, setEditingReviewId] = useState<string>('');

    // 영화 정보 가져오기
    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const response = await axios.get(`/movie/${movieId}`);
                setMovie(response.data);
            } catch (error) {
                console.error('영화 정보 로드 실패:', error);
            }
        };

        if (movieId) {
            fetchMovie();
        }
    }, [movieId]);

    // 리뷰 제출 핸들러
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            alert('로그인이 필요합니다!');
            navigate('/signin');
            return;
        }

        if (!movie) return;

        if (isEditing && editingReviewId) {
            // 수정
            const result = await updateReview(editingReviewId, rating, content, spoiler);
            if (result.success) {
                alert(result.message);
                resetForm();
            } else {
                alert(result.message);
            }
        } else {
            // 신규 작성
            const result = await addReview(movie.id, movie.title || movie.name || '', rating, content, spoiler);
            if (result.success) {
                alert(result.message);
                resetForm();
            } else {
                alert(result.message);
            }
        }
    };

    // 폼 초기화
    const resetForm = () => {
        setRating(5);
        setContent('');
        setSpoiler(false);
        setIsEditing(false);
        setEditingReviewId('');
    };

    // 수정 버튼 클릭
    const handleEdit = (review: Review) => {
        setRating(review.rating);
        setContent(review.content);
        setSpoiler(review.spoiler);
        setIsEditing(true);
        setEditingReviewId(review.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // 삭제 버튼 클릭
    const handleDelete = async (reviewId: string) => {
        if (window.confirm('정말 삭제하시겠습니까?')) {
            const result = await deleteReview(reviewId);
            alert(result.message);
        }
    };

    if (!movie) {
        return (
            <Container>
                <LoadingMessage>영화 정보를 불러오는 중...</LoadingMessage>
            </Container>
        );
    }

    return (
        <Container>
            {/* 영화 정보 헤더 */}
            <MovieHeader
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9)), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
                }}
            >
                <BackButton onClick={() => navigate(-1)}>← 뒤로가기</BackButton>
                <MovieInfo>
                    <Poster
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title || movie.name}
                    />
                    <div>
                        <MovieTitle>{movie.title || movie.name}</MovieTitle>
                        <MovieMeta>평균 평점: ⭐ {getAverageRating()}/10</MovieMeta>
                        <MovieMeta>리뷰 {reviews.length}개</MovieMeta>
                    </div>
                </MovieInfo>
            </MovieHeader>

            {/* 2컬럼 레이아웃 */}
            <ContentWrapper>
                {/* 왼쪽: 리뷰 섹션 */}
                <ReviewSection>
                    {/* 리뷰 작성 폼 */}
                    {user && (
                        <ReviewForm onSubmit={handleSubmit}>
                            <FormTitle>{isEditing ? '리뷰 수정하기' : '리뷰 작성하기'}</FormTitle>

                            <RatingSection>
                                <Label>평점</Label>
                                <RatingSlider
                                    type="range"
                                    min="1"
                                    max="10"
                                    value={rating}
                                    onChange={(e) => setRating(Number(e.target.value))}
                                />
                                <RatingValue>⭐ {rating}/10</RatingValue>
                            </RatingSection>

                            <Label>리뷰 내용 (최소 10자)</Label>
                            <Textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="이 영화에 대한 당신의 생각을 들려주세요..."
                                rows={6}
                                required
                                minLength={10}
                            />

                            <CheckboxWrapper>
                                <Checkbox
                                    type="checkbox"
                                    id="spoiler"
                                    checked={spoiler}
                                    onChange={(e) => setSpoiler(e.target.checked)}
                                />
                                <CheckboxLabel htmlFor="spoiler">스포일러 포함</CheckboxLabel>
                            </CheckboxWrapper>

                            <ButtonGroup>
                                <SubmitButton type="submit">
                                    {isEditing ? '수정 완료' : '리뷰 등록'}
                                </SubmitButton>
                                {isEditing && (
                                    <CancelButton type="button" onClick={resetForm}>
                                        취소
                                    </CancelButton>
                                )}
                            </ButtonGroup>
                        </ReviewForm>
                    )}

                    {!user && (
                        <LoginPrompt>
                            <p>리뷰를 작성하려면 로그인이 필요합니다.</p>
                            <LoginButton onClick={() => navigate('/signin')}>로그인하기</LoginButton>
                        </LoginPrompt>
                    )}

                    {/* 리뷰 목록 */}
                    <ReviewsSection>
                        <SectionTitle>전체 리뷰 ({reviews.length})</SectionTitle>
                        {loading ? (
                            <LoadingMessage>리뷰를 불러오는 중...</LoadingMessage>
                        ) : reviews.length === 0 ? (
                            <EmptyMessage>아직 작성된 리뷰가 없습니다. 첫 리뷰를 남겨보세요! 🎬</EmptyMessage>
                        ) : (
                            <AnimatePresence>
                                {reviews.map((review) => (
                                    <ReviewCard
                                        key={review.id}
                                        review={review}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        onLike={toggleLike}
                                    />
                                ))}
                            </AnimatePresence>
                        )}
                    </ReviewsSection>
                </ReviewSection>

                {/* 오른쪽: 채팅 섹션 */}
                <ChatSection>
                    <ChatRoom movieId={movie.id} movieTitle={movie.title || movie.name || ''} />
                </ChatSection>
            </ContentWrapper>
        </Container>
    );
};

export default MovieReview;

// Styled Components
const Container = styled.div`
  padding-top: 68px;
  min-height: 100vh;
  background-color: #111;
  color: white;
`;

const MovieHeader = styled.div`
  padding: 60px 40px;
  background-size: cover;
  background-position: center;
  position: relative;
`;

const BackButton = styled.button`
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: 20px;
  transition: all 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.9);
  }
`;

const MovieInfo = styled.div`
  display: flex;
  gap: 30px;
  align-items: flex-start;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

const Poster = styled.img`
  width: 200px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
`;

const MovieTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 10px;
  font-weight: bold;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const MovieMeta = styled.p`
  font-size: 1.1rem;
  color: #ccc;
  margin: 5px 0;
`;

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 30px;
  padding: 30px 40px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const ReviewSection = styled.div`
  min-width: 0;
`;

const ChatSection = styled.div`
  position: sticky;
  top: 100px;
  height: fit-content;

  @media (max-width: 1200px) {
    position: static;
  }
`;

const ReviewForm = styled.form`
  background: rgba(255, 255, 255, 0.05);
  padding: 30px;
  margin-bottom: 30px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const FormTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #e50914;
`;

const RatingSection = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
  font-size: 1rem;
`;

const RatingSlider = styled.input`
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.2);
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #e50914;
    cursor: pointer;
  }
`;

const RatingValue = styled.div`
  text-align: center;
  font-size: 1.5rem;
  margin-top: 10px;
  color: #ffd700;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  margin-bottom: 15px;

  &:focus {
    outline: none;
    border-color: #e50914;
  }
`;

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  cursor: pointer;
  font-size: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #e50914 0%, #831010 100%);
  color: white;
  padding: 12px 30px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(229, 9, 20, 0.5);
  }
`;

const CancelButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  color: white;
  padding: 12px 30px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const LoginPrompt = styled.div`
  background: rgba(229, 9, 20, 0.1);
  border: 1px solid rgba(229, 9, 20, 0.3);
  padding: 30px;
  margin-bottom: 30px;
  border-radius: 12px;
  text-align: center;

  p {
    font-size: 1.1rem;
    margin-bottom: 15px;
  }
`;

const LoginButton = styled.button`
  background: #e50914;
  color: white;
  padding: 12px 30px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: all 0.2s;

  &:hover {
    background: #f40612;
  }
`;

const ReviewsSection = styled.div`
  margin-top: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 20px;
  color: #e50914;
`;

const LoadingMessage = styled.div`
  text-align: center;
  color: #999;
  font-size: 1.1rem;
  padding: 40px;
`;

const EmptyMessage = styled.div`
  text-align: center;
  color: #666;
  font-size: 1.1rem;
  padding: 60px 20px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 1px dashed rgba(255, 255, 255, 0.1);
`;