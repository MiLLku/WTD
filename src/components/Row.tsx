import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { useWishlist } from '../hooks/useWishlist';
import type { Movie } from '../types/types';

interface RowProps {
    title: string;
    fetchUrl: string;
    isLargeRow?: boolean;
    id: string;
    onMovieClick?: (movie: Movie) => void;
}

const Row = ({ title, fetchUrl, isLargeRow = false, id, onMovieClick }: RowProps) => {
    const navigate = useNavigate();
    const { data: movies } = useFetch(fetchUrl);
    const { toggleWishlist } = useWishlist();

    // ✅ 영화 클릭 시 올바른 ID로 리뷰 페이지 이동
    const handleMovieClick = (movie: Movie, e: React.MouseEvent) => {
        e.stopPropagation();
        // Shift 키를 누르고 클릭하면 찜하기
        if (e.shiftKey) {
            toggleWishlist(movie);
            if (onMovieClick) {
                onMovieClick(movie);
            }
        } else {
            // 일반 클릭은 리뷰 페이지로 이동 (올바른 movie.id 사용)
            console.log('영화 클릭:', movie.title || movie.name, 'ID:', movie.id);
            navigate(`/movie/${movie.id}/reviews`);
        }
    };

    const handleReviewClick = (e: React.MouseEvent, movieId: number) => {
        e.stopPropagation();
        console.log('리뷰 버튼 클릭 - 영화 ID:', movieId);
        navigate(`/movie/${movieId}/reviews`);
    };

    const handleWishlistClick = (e: React.MouseEvent, movie: Movie) => {
        e.stopPropagation();
        toggleWishlist(movie);
        if (onMovieClick) {
            onMovieClick(movie);
        }
    };

    return (
        <Container>
            <Title>{title}</Title>
            <Posters id={id}>
                {movies.map((movie) => (
                    <PosterWrapper key={movie.id}>
                        <Poster
                            $isLarge={isLargeRow}
                            src={`https://image.tmdb.org/t/p/w500${
                                isLargeRow ? movie.poster_path : movie.backdrop_path
                            }`}
                            alt={movie.title || movie.name}
                            onClick={(e) => handleMovieClick(movie, e)}
                        />
                        {/* ✅ 호버 시 버튼 표시 */}
                        <HoverOverlay>
                            <OverlayTitle>{movie.title || movie.name}</OverlayTitle>
                            <ButtonGroup>
                                <ActionButton onClick={(e) => handleReviewClick(e, movie.id)}>
                                    💬 리뷰/채팅
                                </ActionButton>
                                <ActionButton onClick={(e) => handleWishlistClick(e, movie)}>
                                    ❤️ 찜하기
                                </ActionButton>
                            </ButtonGroup>
                            <RatingInfo>⭐ {movie.vote_average?.toFixed(1)}</RatingInfo>
                        </HoverOverlay>
                    </PosterWrapper>
                ))}
            </Posters>
        </Container>
    );
};

export default Row;

// Styled Components
const Container = styled.div`
    margin-left: 20px;
    color: white;
    margin-bottom: 20px;
`;

const Title = styled.h2`
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 10px;
`;

const Posters = styled.div`
    display: flex;
    overflow-y: hidden;
    overflow-x: scroll;
    padding: 20px;
    &::-webkit-scrollbar {
        display: none;
    }
`;

const PosterWrapper = styled.div`
    position: relative;
    margin-right: 10px;
    flex-shrink: 0;
`;

interface PosterProps {
    $isLarge: boolean;
}

const Poster = styled.img<PosterProps>`
    object-fit: contain;
    width: 100%;
    max-height: ${(props) => (props.$isLarge ? '250px' : '100px')};
    transition: transform 450ms;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        transform: scale(1.08);
    }
`;

const HoverOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: opacity 0.3s;
    border-radius: 4px;
    padding: 10px;

    ${PosterWrapper}:hover & {
        opacity: 1;
    }
`;

const OverlayTitle = styled.h3`
    font-size: 0.9rem;
    text-align: center;
    margin-bottom: 10px;
    color: white;
`;

const ButtonGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    padding: 0 10px;
`;

const ActionButton = styled.button`
    background: linear-gradient(135deg, #e50914 0%, #831010 100%);
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.85rem;
    font-weight: bold;
    transition: all 0.2s;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(229, 9, 20, 0.4);
    }
`;

const RatingInfo = styled.div`
    margin-top: 10px;
    font-size: 0.9rem;
    color: #ffd700;
`;
