import styled from 'styled-components';
import { useFetch } from '../hooks/useFetch';
import { useWishlist } from '../hooks/useWishlist';
import requests from '../api/requests';

const Popular = () => {
    const { data: movies, loading, error } = useFetch(requests.fetchPopular);
    const { toggleWishlist } = useWishlist();

    if (loading) return <Message>Loading...</Message>;
    if (error) return <Message>Error: {error}</Message>;

    return (
        <Container>
            <Title>대세 콘텐츠 (Popular Movies)</Title>
            <MovieGrid>
                {movies.map((movie) => (
                    <MovieCard key={movie.id} onClick={() => toggleWishlist(movie)}>
                        {movie.poster_path ? (
                            <img
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.title}
                            />
                        ) : (
                            <NoImage>No Image</NoImage>
                        )}
                        <Overlay>
                            <h3>{movie.title || movie.name}</h3>
                            <p>⭐ {movie.vote_average.toFixed(1)}</p>
                            <WishText>❤️ 클릭하여 찜하기</WishText>
                        </Overlay>
                    </MovieCard>
                ))}
            </MovieGrid>
        </Container>
    );
};

export default Popular;

// --- Styled Components (반응형 적용됨) ---

const Container = styled.div`
    padding: 100px 40px; /* PC 기본 패딩 */
    min-height: 100vh;
    background-color: #111;
    color: white;

    /* 📱 모바일 화면: 패딩 줄이기 */
    @media (max-width: 768px) {
        padding: 80px 15px;
    }
`;

const Title = styled.h1`
    margin-bottom: 30px;
    text-align: center;

    @media (max-width: 768px) {
        font-size: 1.5rem; /* 제목 크기도 조금 작게 */
    }
`;

const Message = styled.div`
    padding-top: 100px;
    text-align: center;
    color: white;
    font-size: 1.5rem;
`;

const MovieGrid = styled.div`
    display: grid;
    /* PC: 최소 200px 너비 유지 */
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 25px;

    /* 📱 모바일: 카드를 더 작게 (최소 140px) 해서 한 줄에 2개씩 나오게 조정 */
    @media (max-width: 768px) {
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: 15px;
    }
`;

const MovieCard = styled.div`
    position: relative;
    border-radius: 5px;
    overflow: hidden;
    transition: transform 0.3s;
    cursor: pointer;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    &:hover {
        transform: scale(1.05);
        z-index: 1;
        div { opacity: 1; }
    }
`;

const Overlay = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.8);
    padding: 10px;
    opacity: 0;
    transition: opacity 0.3s;
    text-align: center;

    h3 {
        font-size: 14px;
        margin-bottom: 5px;
    }
`;

const WishText = styled.p`
    font-size: 12px;
    color: #e50914;
    margin-top: 5px;
    font-weight: bold;
`;

const NoImage = styled.div`
    width: 100%;
    height: 300px;
    background-color: #333;
    display: flex;
    align-items: center;
    justify-content: center;
`;