import Stripe from 'stripe';

export interface Genre {
    id: string;
    title: string;
}

export interface GenreTrack {
    track_id: string;
    genre_id: string;
    genres: Genre[];
}

export interface Key {
    id: string;
    title: string;
}

export interface UserDetails {
    id: string;
    first_name: string;
    last_name: string;
    full_name: string;
    avatar_url?: string;
    billing_address?: Stripe.Address;
    payment_method?: Stripe.PaymentMethod[Stripe.PaymentMethod.Type];
    is_admin: boolean;
    favorited_tracks?: Track[];
}

export interface LimitedUserDetails {
    id: any;
    full_name: any;
    avatar_url: any;
}

export interface Track {
    id: string;
    user_id: string;
    author: string;
    title: string;
    track_path: string;
    image_path: string;
    key: string;
    bpm: number;
    users?: UserDetails;
    genre_tracks?: GenreTrack[];
    keys?: Key;
    genres?: Genre[];
}

export interface Product {
    id: string;
    active?: boolean;
    name?: string;
    description?: string;
    image?: string;
    metadata?: Stripe.Metadata;
}

export interface Price {
    id: string;
    product_id?: string;
    active?: boolean;
    description?: string;
    unit_amount?: number;
    currency?: string;
    type?: Stripe.Price.Type;
    interval?: Stripe.Price.Recurring.Interval;
    interval_count?: number;
    trial_period_days?: number | null;
    metadata?: Stripe.Metadata;
    products?: Product;
}

export interface Subscription {
    id: string;
    user_id: string;
    status?: Stripe.Subscription.Status;
    metadata?: Stripe.Metadata;
    price_id?: string;
    quantity?: number;
    cancel_at_period_end?: boolean;
    created: string;
    current_period_start: string;
    current_period_end: string;
    ended_at?: string;
    cancel_al?: string;
    canceled_at?: string;
    trial_start?: string;
    trial_end?: string;
    prices?: Price;
}

export interface ProductWithPrice extends Product {
    prices?: Price[];
}

export interface SearchParams {
    title: string;
    key: number;
    min: number;
    max: number;
    genres: Genre[];
}

export interface AvailableDate {
    id: number;
    service_id: number;
    users: LimitedUserDetails;
    start_time: string;
    end_time: string;
}

export interface Service {
    id: string;
    title: string;
    price: number;
}

export interface Time {
    hour: number;
    minute: number;
}