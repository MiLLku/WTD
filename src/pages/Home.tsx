import { useState } from 'react';
import styled from 'styled-components';
import requests from '../api/requests';
import Banner from '../components/Banner';
import Row from '../components/Row';
import type { Movie } from '../types/types';

const Home = () => {
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [lastClickedCategory, setLastClickedCategory] = useState<string>('');

    const handleMovieClick = (movie: Movie, category: string) => {
        setSelectedMovie(movie);
        setLastClickedCategory(category);
        console.log(`[Bottom-Up Event] ${category}에서 "${movie.title || movie.name}" 클릭됨`);
    };

    return (
        <HomeContainer>
            <Banner />

            {selectedMovie && (
                <SelectedMovieInfo>
                    <InfoTitle>🎬 최근 클릭한 영화</InfoTitle>
                    <InfoContent>
                        <strong>카테고리:</strong> {lastClickedCategory} <br />
                        <strong>제목:</strong> {selectedMovie.title || selectedMovie.name} <br />
                        <strong>평점:</strong> ⭐ {selectedMovie.vote_average?.toFixed(1)}
                    </InfoContent>
                </SelectedMovieInfo>
            )}

            <Row
                title="넷플릭스 오리지널"
                id="NO"
                fetchUrl={requests.fetchNetflixOriginals}
                isLargeRow
                onMovieClick={(movie) => handleMovieClick(movie, '넷플릭스 오리지널')}
            />
            <Row
                title="지금 뜨는 콘텐츠"
                id="TN"
                fetchUrl={requests.fetchTrending}
                onMovieClick={(movie) => handleMovieClick(movie, '지금 뜨는 콘텐츠')}
            />
            <Row
                title="다시보기 추천"
                id="TR"
                fetchUrl={requests.fetchTopRated}
                onMovieClick={(movie) => handleMovieClick(movie, '다시보기 추천')}
            />
            <Row
                title="액션 영화"
                id="AM"
                fetchUrl={requests.fetchActionMovies}
                onMovieClick={(movie) => handleMovieClick(movie, '액션 영화')}
            />
            <Row
                title="코미디 영화"
                id="CM"
                fetchUrl={requests.fetchComedyMovies}
                onMovieClick={(movie) => handleMovieClick(movie, '코미디 영화')}
            />
            <Row
                title="공포 영화"
                id="HM"
                fetchUrl={requests.fetchHorrorMovies}
                onMovieClick={(movie) => handleMovieClick(movie, '공포 영화')}
            />
            <Row
                title="로맨스 영화"
                id="RM"
                fetchUrl={requests.fetchRomanceMovies}
                onMovieClick={(movie) => handleMovieClick(movie, '로맨스 영화')}
            />
            <Row
                title="다큐멘터리"
                id="DM"
                fetchUrl={requests.fetchDocumentaries}
                onMovieClick={(movie) => handleMovieClick(movie, '다큐멘터리')}
            />
        </HomeContainer>
    );
};

export default Home;

const HomeContainer = styled.div`
    background-color: #111;
    min-height: 100vh;
`;

const SelectedMovieInfo = styled.div`
    background: linear-gradient(135deg, #e50914 0%, #831010 100%);
    color: white;
    padding: 20px 40px;
    margin: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(229, 9, 20, 0.3);
`;

const InfoTitle = styled.h3`
    font-size: 1.2rem;
    margin-bottom: 10px;
    font-weight: bold;
`;

const InfoContent = styled.p`
    font-size: 1rem;
    line-height: 1.6;
    strong {
        color: #ffd700;
    }
`;
