export interface Movie {
    id: number;
    title?: string;          // 영화 제목
    name?: string;           // TV 프로그램 제목 (넷플릭스 오리지널 등)
    original_name?: string;
    genre_ids?: number[];
    poster_path: string;     // 포스터 이미지 경로
    backdrop_path: string;   // 배경 이미지 경로
    overview: string;        // 줄거리
    vote_average: number;    // 평점
    release_date?: string;
    first_air_date?: string;
}

export interface TMDBResponse {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
}

export interface Genre {
    id: number;
    name: string;
}