// Merchandise Order type — TypeScript interface mirroring the backend Merchandise model
export interface Merchandise {
    id: number;
    user_id: number;
    color: string;  // black, white
    size: string;  // XS, S, M, L, XL, XXL
    design: string;  // design name/id
    quantity: number;
    price: number;  // price in euros
    donation_points: number;  // points earned from order
    order_status: string;  // pending, paid, shipped, delivered, cancelled
    created_at: string;
    updated_at: string;
}

export interface CreateMerchandiseRequest {
    color: string;
    size: string;
    design: string;
    quantity: number;
    price: number;
}
