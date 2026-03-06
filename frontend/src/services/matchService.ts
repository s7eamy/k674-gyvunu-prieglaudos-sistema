// Match service — API calls for finding animal matches
import api from './api';
import type { QuestionnaireAnswers, AnimalMatch } from '../types/Match';

export const getMatches = async (answers: QuestionnaireAnswers): Promise<AnimalMatch[]> => {
    const response = await api.post<{ matches: AnimalMatch[] }>(
        '/api/animals/match',
        { answers }
    );
    return response.data.matches;
};
