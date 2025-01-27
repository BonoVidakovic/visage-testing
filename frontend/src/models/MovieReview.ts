export type MovieReview = {
    id: string;
    rating: number;
    text: string;
}

export type MovieReviewResponse = {
    reviews: MovieReview[];
    meta: {
        hasNext: boolean;
    }
}