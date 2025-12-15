export interface Review {
    id: string;
    movieId: number;
    userId: string;
    userName: string;
    userPhoto: string | null;
    rating: number;
    comment: string;
    createdAt: number;
}