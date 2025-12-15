// TMDB API 관련 타입
export interface Movie {
    id: number;
    title?: string;
    name?: string;
    original_name?: string;
    poster_path?: string;
    backdrop_path?: string;
    overview?: string;
    vote_average?: number;  // ✅ optional로 변경 (undefined 허용)
    release_date?: string;
    first_air_date?: string;
    genre_ids?: number[];
}

// 리뷰 관련 타입
export interface Review {
    id: string;
    movieId: number;
    userId: string;
    userName: string;
    userPhoto: string | null;
    rating: number;
    comment: string;
    content: string; // ReviewCard에서 사용
    createdAt: number;
    spoiler: boolean; // 스포일러 여부
    likes: string[]; // 좋아요 누른 사용자 ID 배열
    movieTitle?: string; // 영화 제목 (Profile에서 사용)
}

export interface Genre {
    id: number;
    name: string;
}

export interface MovieDetail {
    id: number;
    title: string;
    name?: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    vote_average: number;
    release_date: string;
    runtime: number | null;
    genres: Genre[];
}

// TMDB API 응답 타입
export interface TMDBResponse {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
}

// 채팅 메시지 타입
export interface ChatMessage {
    id: string;
    message: string;
    userId: string;
    userName: string;
    userPhoto: string | null;
    timestamp: number;
}

// 사용자 프로필 타입
export interface UserProfile {
    uid: string;
    displayName: string;
    email: string;
    photoURL: string | null;
    bio: string;
    favoriteGenres: string[];
    createdAt: number;
}