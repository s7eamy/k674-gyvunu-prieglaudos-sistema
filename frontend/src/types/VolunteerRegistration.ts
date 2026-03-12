// Volunteer registration type — TypeScript interface mirroring the backend Volunteer registration model
export interface VolunteerRegistration {
    id: number;
    user_id: number; // asssigned to user
    date: Date;
    time_from: string; // volunteering start time
    time_to: string; // volunteering end time
    approved: boolean; // admin approval
    attended: boolean; // confirmed attendance
    created_at: Date; // default = now()  
}