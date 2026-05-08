export interface AdoptionRequest {
    id: number;
    user_id: number;
    animal_id: number;
    animal_name: string;
    animal_type: string;
    user_name: string;
    status: 'pending' | 'approved' | 'rejected' | 'cancelled';
    created_at: string;
}
