import React, { useState, useEffect, useRef } from 'react'; // ✅ useRef 추가
import styled from 'styled-components';
import axios from '../api/axios';
import requests from '../api/requests';
import type { Movie, Genre } from '../types/tmdb';
import { useWishlist } from '../hooks/useWishlist';

const Search = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [movies, setMovies] = useState<Movie[]>([]);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    const { toggleWishlist } = useWishlist();
    const [selectedGenre, setSelectedGenre] = useState<string>('all');
    const [selectedRating, setSelectedRating] = useState<string>('all');

    // ✅ useRef를 활용한 DOM 직접 접근
    const searchInputRef = useRef<HTMLInputElement>(null);
    const movieGridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            setError('');
            try {
                const [trendingRes, genreRes] = await Promise.all([
                    axios.get(requests.fetchTrending),
                    axios.get(requests.fetchGenres),
                ]);

                setMovies(Array.isArray(trendingRes.data.results) ? trendingRes.data.results : []);
                setGenres(Array.isArray(genreRes.data.genres) ? genreRes.data.genres : []);
            } catch (err) {
                console.error('초기 데이터 로딩 실패:', err);
                setError('데이터를 불러오는데 실패했습니다.');
                setMovies([]);
                setGenres([]);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();

        try {
            const storedSearches = localStorage.getItem('recent_searches');
            if (storedSearches) {
                const parsed = JSON.parse(storedSearches);
                if (Array.isArray(parsed)) {
                    setRecentSearches(parsed);
                }
            }
        } catch (e) {
            console.error("검색기록 파싱 에러:", e);
            localStorage.removeItem('recent_searches');
        }

        // ✅ 페이지 로드 시 검색창에 자동 포커스
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, []);

    const performSearch = async (query: string) => {
        const trimmedQuery = query.trim();
        if (!trimmedQuery) return;

        setLoading(true);
        try {
            const response = await axios.get(requests.fetchSearch, {
                params: { query: trimmedQuery },
            });

            setMovies(Array.isArray(response.data.results) ? response.data.results : []);
            setSearchTerm(trimmedQuery);

            const updatedSearches = [trimmedQuery, ...recentSearches.filter((t) => t !== trimmedQuery)].slice(0, 5);
            setRecentSearches(updatedSearches);
            localStorage.setItem('recent_searches', JSON.stringify(updatedSearches));

            // ✅ 검색 결과가 나오면 결과 영역으로 스크롤
            setTimeout(() => {
                movieGridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        } catch (err) {
            console.error('검색 실패:', err);
            setError('검색에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        performSearch(searchTerm);
    };

    const removeSearch = (e: React.MouseEvent, term: string) => {
        e.stopPropagation();
        const updated = recentSearches.filter((t) => t !== term);
        setRecentSearches(updated);
        localStorage.setItem('recent_searches', JSON.stringify(updated));
    };

    // ✅ 검색창 초기화 버튼
    const handleClearSearch = () => {
        setSearchTerm('');
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    };

    const getFilteredMovies = (): Movie[] => {
        if (!Array.isArray(movies) || movies.length === 0) {
            return [];
        }

        return movies.filter((movie) => {
            if (!movie) return false;

            const genreMatch =
                selectedGenre === 'all' ||
                (Array.isArray(movie.genre_ids) &&
                    movie.genre_ids.includes(Number(selectedGenre)));

            const ratingMatch =
                selectedRating === 'all' ||
                (typeof movie.vote_average === 'number' &&
                    movie.vote_average >= Number(selectedRating));

            return genreMatch && ratingMatch;
        });
    };

    const filteredMovies = getFilteredMovies();

    if (loading) {
        return (
            <Container>
                <Message>Loading...</Message>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <Message>{error}</Message>
            </Container>
        );
    }

    return (
        <Container>
            <SearchHeader>
                <SearchForm onSubmit={handleSearch}>
                    <SearchInputWrapper>
                        {/* ✅ useRef를 활용한 DOM 접근 */}
                        <SearchInput
                            ref={searchInputRef}
                            type="text"
                            placeholder="영화 제목을 입력하세요... (자동 포커스 적용)"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {/* ✅ 검색어 초기화 버튼 */}
                        {searchTerm && (
                            <ClearButton type="button" onClick={handleClearSearch}>
                                ✕
                            </ClearButton>
                        )}
                    </SearchInputWrapper>
                    <SearchButton type="submit">검색</SearchButton>
                </SearchForm>

                {recentSearches.length > 0 && (
                    <RecentSearches>
                        <span>최근 검색어: </span>
                        {recentSearches.map((term, index) => (
                            <HistoryTag key={index} onClick={() => performSearch(term)}>
                                {term}
                                <RemoveBtn onClick={(e) => removeSearch(e, term)}>×</RemoveBtn>
                            </HistoryTag>
                        ))}
                    </RecentSearches>
                )}

                <Filters>
                    <Select
                        value={selectedGenre}
                        onChange={(e) => setSelectedGenre(e.target.value)}
                    >
                        <option value="all">모든 장르</option>
                        {genres.map((genre) => (
                            <option key={genre.id} value={genre.id}>
                                {genre.name}
                            </option>
                        ))}
                    </Select>

                    <Select
                        value={selectedRating}
                        onChange={(e) => setSelectedRating(e.target.value)}
                    >
                        <option value="all">모든 평점</option>
                        <option value="9">9점 이상 ⭐⭐⭐⭐⭐</option>
                        <option value="8">8점 이상 ⭐⭐⭐⭐</option>
                        <option value="7">7점 이상 ⭐⭐⭐</option>
                        <option value="6">6점 이상 ⭐⭐</option>
                    </Select>
                </Filters>
            </SearchHeader>

            {/* ✅ ref를 통한 스크롤 타겟 */}
            <ResultsTitle ref={movieGridRef}>
                {searchTerm ? `"${searchTerm}" 검색 결과 (${filteredMovies.length}개)` : '🔥 지금 뜨는 콘텐츠'}
            </ResultsTitle>

            {filteredMovies.length === 0 ? (
                <Message>검색 결과가 없습니다.</Message>
            ) : (
                <MovieGrid>
                    {filteredMovies.map((movie) => (
                        <MovieCard key={movie.id} onClick={() => toggleWishlist(movie)}>
                            {movie.poster_path ? (
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                    alt={movie.title || movie.name || 'Movie'}
                                />
                            ) : (
                                <NoImage>No Image</NoImage>
                            )}
                            <Overlay>
                                <h3>{movie.title || movie.name || 'Unknown'}</h3>
                                <p>⭐ {movie.vote_average != null ? movie.vote_average.toFixed(1) : 'N/A'}</p>
                                <WishText>❤️ 클릭하여 찜하기</WishText>
                            </Overlay>
                        </MovieCard>
                    ))}
                </MovieGrid>
            )}
        </Container>
    );
};

export default Search;

// Styled Components
const Container = styled.div`
    padding: 100px 40px;
    min-height: 100vh;
    background-color: #111;
    color: white;

    @media (max-width: 768px) {
        padding: 80px 15px;
    }
`;

const SearchHeader = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    margin-bottom: 40px;
`;

const SearchForm = styled.form`
    display: flex;
    width: 100%;
    max-width: 600px;
    gap: 10px;
`;

// ✅ 검색 입력창 래퍼 (초기화 버튼 포함)
const SearchInputWrapper = styled.div`
    flex: 1;
    position: relative;
    display: flex;
    align-items: center;
`;

const SearchInput = styled.input`
    width: 100%;
    padding: 15px;
    padding-right: 45px; // 초기화 버튼 공간 확보
    border-radius: 4px 0 0 4px;
    border: none;
    font-size: 16px;
    outline: none;

    // ✅ 포커스 시 스타일
    &:focus {
        box-shadow: 0 0 0 2px #e50914;
    }
`;

// ✅ 검색어 초기화 버튼
const ClearButton = styled.button`
    position: absolute;
    right: 10px;
    background: none;
    border: none;
    color: #999;
    font-size: 20px;
    cursor: pointer;
    padding: 5px 10px;
    transition: color 0.2s;

    &:hover {
        color: #e50914;
    }
`;

const SearchButton = styled.button`
    padding: 15px 30px;
    background-color: #e50914;
    color: white;
    border: none;
    border-radius: 0 4px 4px 0;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;

    &:hover {
        background-color: #f40612;
    }
`;

const RecentSearches = styled.div`
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    color: #ccc;
`;

const HistoryTag = styled.span`
    background-color: rgba(255, 255, 255, 0.1);
    padding: 5px 10px;
    border-radius: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: background 0.2s;

    &:hover {
        background-color: rgba(255, 255, 255, 0.2);
        color: white;
    }
`;

const RemoveBtn = styled.span`
    font-size: 16px;
    line-height: 1;
    opacity: 0.7;
    &:hover {
        opacity: 1;
        color: #e50914;
    }
`;

const Filters = styled.div`
    display: flex;
    gap: 15px;
`;

const Select = styled.select`
    padding: 10px;
    border-radius: 4px;
    background-color: #333;
    color: white;
    border: 1px solid #555;
    cursor: pointer;
`;

const ResultsTitle = styled.h2`
    margin-bottom: 20px;
    font-size: 1.5rem;
    scroll-margin-top: 100px; // ✅ 스크롤 오프셋 조정
`;

const Message = styled.div`
    padding-top: 50px;
    text-align: center;
    color: #999;
    font-size: 1.2rem;
`;

const MovieGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 25px;

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
        div {
            opacity: 1;
        }
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
    color: #777;
`;