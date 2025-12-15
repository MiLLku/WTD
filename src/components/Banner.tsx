import { useState, useEffect, useRef } from 'react'; // ✅ useRef 추가
import styled from 'styled-components';
import axios from '../api/axios';
import requests from '../api/requests';
import type { Movie, TMDBResponse } from '../types/types';

const Banner = () => {
    const [movie, setMovie] = useState<Movie | null>(null);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

    // ✅ useRef를 활용한 DOM 접근
    const bannerRef = useRef<HTMLElement>(null);
    const descriptionRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            const request = await axios.get<TMDBResponse>(requests.fetchNowPlaying);
            const randomMovie = request.data.results[
                Math.floor(Math.random() * request.data.results.length)
                ];
            setMovie(randomMovie);
        };
        fetchData();
    }, []);

    // ✅ 설명 토글 함수
    const toggleDescription = () => {
        setIsDescriptionExpanded(!isDescriptionExpanded);

        // ✅ 설명이 펼쳐질 때 해당 영역으로 스크롤
        if (!isDescriptionExpanded && descriptionRef.current) {
            setTimeout(() => {
                descriptionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        }
    };

    const truncate = (str: string | undefined, n: number) => {
        return str && str.length > n ? str.substr(0, n - 1) + "..." : str;
    };

    if (!movie) return null;

    return (
        <Header
            ref={bannerRef} // ✅ ref 연결
            style={{
                backgroundImage: `url("https://image.tmdb.org/t/p/original/${movie.backdrop_path}")`,
            }}
        >
            <BannerContents>
                <Title>{movie.title || movie.name || movie.original_name}</Title>
                <Buttons>
                    <Button>재생</Button>
                    <Button onClick={toggleDescription}>
                        {isDescriptionExpanded ? '간략히 보기' : '상세 정보'}
                    </Button>
                </Buttons>
                <Description
                    ref={descriptionRef} // ✅ ref 연결
                    $expanded={isDescriptionExpanded}
                >
                    {isDescriptionExpanded
                        ? movie.overview
                        : truncate(movie.overview, 150)
                    }
                </Description>
            </BannerContents>
            <FadeBottom />
        </Header>
    );
};

export default Banner;

// Styled Components
const Header = styled.header`
    color: white;
    object-fit: contain;
    height: 448px;
    background-size: cover;
    background-position: center center;
    position: relative;
`;

const BannerContents = styled.div`
    margin-left: 30px;
    padding-top: 140px;
    height: 190px;
`;

const Title = styled.h1`
    font-size: 3rem;
    font-weight: 800;
    padding-bottom: 0.3rem;
`;

interface DescriptionProps {
    $expanded: boolean;
}

const Description = styled.h1<DescriptionProps>`
    width: ${props => props.$expanded ? '80%' : '45rem'};
    line-height: 1.3;
    padding-top: 1rem;
    font-size: 0.8rem;
    max-width: ${props => props.$expanded ? '800px' : '360px'};
    height: ${props => props.$expanded ? 'auto' : '80px'};
    transition: all 0.3s ease-in-out; // ✅ 부드러운 전환 효과
    overflow: hidden;

    @media (max-width: 768px) {
        width: 90%;
        max-width: 100%;
    }
`;

const Buttons = styled.div`
    display: flex;
    gap: 10px;
`;

const Button = styled.button`
    cursor: pointer;
    color: #fff;
    outline: none;
    border: none;
    font-weight: 700;
    border-radius: 0.2vw;
    padding-left: 2rem;
    padding-right: 2rem;
    margin-right: 1rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    background-color: rgba(51, 51, 51, 0.5);

    &:hover {
        color: #000;
        background-color: #e6e6e6;
        transition: all 0.2s;
    }
`;

const FadeBottom = styled.div`
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 7.4rem;
    background-image: linear-gradient(
            180deg,
            transparent,
            rgba(37, 37, 37, 0.61),
            #111
    );
`;