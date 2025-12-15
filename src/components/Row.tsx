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
    isTv?: boolean; // ✅ TV 여부 prop 추가
    onMovieClick?: (movie: Movie) => void;
}

const Row = ({ title, fetchUrl, isLargeRow = false, id, isTv = false, onMovieClick }: RowProps) => {
    const navigate = useNavigate();
    const { data: movies } = useFetch(fetchUrl);
    const { toggleWishlist } = useWishlist();

    const handleMovieClick = (movie: Movie) => {
        // ✅ 제목이 없고 이름만 있으면 TV쇼로 간주 (또는 props로 전달받은 값 사용)
        const isTvShow = isTv || (!movie.title && !!movie.name);

        navigate(`/movie/${movie.id}/reviews`, {
            state: { isTv: isTvShow } // ✅ 페이지 이동 시 TV 정보 전달
        });

        if (onMovieClick) onMovieClick(movie);
    };

    const handleReviewClick = (e: React.MouseEvent, movie: Movie) => {
        e.stopPropagation();
        handleMovieClick(movie);
    };

    const handleWishlistClick = (e: React.MouseEvent, movie: Movie) => {
        e.stopPropagation();
        toggleWishlist(movie);
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
                            onClick={() => handleMovieClick(movie)}
                        />
                        <HoverOverlay onClick={() => handleMovieClick(movie)}>
                            <OverlayTitle>{movie.title || movie.name}</OverlayTitle>
                            <ButtonGroup>
                                <ActionButton onClick={(e) => handleReviewClick(e, movie)}>
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
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: opacity 0.3s;
    border-radius: 4px;
    padding: 10px;
    cursor: pointer;

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