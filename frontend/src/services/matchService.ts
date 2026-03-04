// Match service — API calls for finding animal matches
import axios from 'axios';
import type { QuestionnaireAnswers, AnimalMatch } from '../types/Match';

const API_URL = "http://localhost:8081/api/animals";

export const getMatches = async (answers: QuestionnaireAnswers): Promise<AnimalMatch[]> => {
    const response = await axios.post<{ matches: AnimalMatch[] }>(
        `${API_URL}/match`,
        { answers }
    );
    return response.data.matches;
};
