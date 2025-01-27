export type MovieReview = {
    id: string;
    rating: number;
    content: string;
}

export type MovieReviewResponse = {
    reviews: MovieReview[];
    meta: {
        hasNext: boolean;
    }
}