import api from './api';
import type { User } from '../types/User';


export const getLeaderboard = async (): Promise<User[]> => {
    try{
        const response = await api.get<{ leaderboardUsers: User[] }>("/api/leaderboard", {});
        return response.data.leaderboardUsers;
    }
        catch (error) {
        console.error("Failure", error);
        throw error;
        }     
};