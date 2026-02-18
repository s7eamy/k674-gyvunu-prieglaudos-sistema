// Animal type — TypeScript interface mirroring the backend Animal model
export interface Animal {
    id: number;
    name: string;
    type: string;
    breed: string;
    size: string;  // small, medium, large
    age: number;
    vaccinated: boolean;  // 0 = false, 1 = true
    temperament: string;  // calm, energetic, friendly
    description: string; 
    adopted: boolean;  // 0 = available, 1 = adopted
    created_at: Date; // default = now()
}