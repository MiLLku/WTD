import styled from 'styled-components';
import { useWishlist } from '../hooks/useWishlist';

const Wishlist = () => {
    const { wishlist, toggleWishlist } = useWishlist();

    return (
        <Container>
            <Title>내가 찜한 리스트 ({wishlist.length})</Title>

            {wishlist.length === 0 ? (
                <EmptyMessage>아직 찜한 콘텐츠가 없습니다. 🥺</EmptyMessage>
            ) : (
                <MovieGrid>
                    {wishlist.map((movie) => (
                        <MovieCard key={movie.id} onClick={() => toggleWishlist(movie)}>
                            {movie.poster_path ? (
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                    alt={movie.title || movie.name}
                                />
                            ) : (
                                <NoImage>No Image</NoImage>
                            )}
                            <Overlay>
                                <h3>{movie.title || movie.name}</h3>
                                <DeleteButton>🗑 삭제하기</DeleteButton>
                            </Overlay>
                        </MovieCard>
                    ))}
                </MovieGrid>
            )}
        </Container>
    );
};

export default Wishlist;

// --- Styled Components (Search 페이지와 유사한 그리드 스타일) ---
const Container = styled.div`
  padding: 100px 40px;
  min-height: 100vh;
  background-color: #111;
  color: white;
`;

const Title = styled.h1`
  margin-bottom: 30px;
  text-align: center;
`;

const EmptyMessage = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: #777;
  margin-top: 50px;
`;

const MovieGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 25px;
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
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
`;

const DeleteButton = styled.span`
  background-color: #e50914;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  margin-top: 5px;
`;

const NoImage = styled.div`
  width: 100%;
  height: 300px;
  background-color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
`;