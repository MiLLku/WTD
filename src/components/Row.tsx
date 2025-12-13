import styled from 'styled-components';
import { useFetch } from '../hooks/useFetch';
import { useWishlist } from '../hooks/useWishlist';
import type { Movie } from '../types/tmdb';

interface RowProps {
    title: string;
    fetchUrl: string;
    isLargeRow?: boolean;
    id: string;
    onMovieClick?: (movie: Movie) => void; // ✅ 부모로 이벤트 전달을 위한 콜백
}

const Row = ({ title, fetchUrl, isLargeRow = false, id, onMovieClick }: RowProps) => {
    const { data: movies } = useFetch(fetchUrl);
    const { toggleWishlist } = useWishlist();

    // ✅ 영화 클릭 핸들러 (찜하기 + 부모 컴포넌트로 이벤트 전달)
    const handleMovieClick = (movie: Movie) => {
        toggleWishlist(movie);
        // 부모 컴포넌트로 이벤트 전달
        if (onMovieClick) {
            onMovieClick(movie);
        }
    };

    return (
        <Container>
            <Title>{title}</Title>
            <Posters id={id}>
                {movies.map((movie) => (
                    <Poster
                        key={movie.id}
                        $isLarge={isLargeRow}
                        src={`https://image.tmdb.org/t/p/w500${
                            isLargeRow ? movie.poster_path : movie.backdrop_path
                        }`}
                        alt={movie.title || movie.name}
                        onClick={() => handleMovieClick(movie)} // ✅ 개선된 클릭 핸들러
                    />
                ))}
            </Posters>
        </Container>
    );
};

export default Row;

// Styled Components (기존 유지)
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

interface PosterProps {
    $isLarge: boolean;
}

const Poster = styled.img<PosterProps>`
    object-fit: contain;
    width: 100%;
    max-height: ${(props) => (props.$isLarge ? '250px' : '100px')};
    margin-right: 10px;
    transition: transform 450ms;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        transform: scale(1.08);
    }
`;