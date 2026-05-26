import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getMatches } from '../../services/matchService';
import { getUserAdoptionRequests, createAdoptionRequest } from '../../services/adoptionRequestService';
import type { QuestionnaireAnswers, AnimalMatch } from '../../types/Match';
import Navbar from '../../components/layout/Navbar';
import { useEnumLabel } from '../../i18n/useEnumLabel';
import { translateApiError } from '../../i18n/errorMap';

type QuestionId =
  | 'animal_type'
  | 'living_space'
  | 'activity_level'
  | 'experience'
  | 'time_at_home'
  | 'children'
  | 'other_pets'
  | 'preferred_size'
  | 'preferred_age'
  | 'energy_match';

const QUESTIONS: { id: QuestionId; hasSubtitle?: boolean; optionValues: string[] }[] = [
  { id: 'animal_type', optionValues: ['dog', 'cat', 'cat_or_dog', 'other', 'any'] },
  { id: 'living_space', hasSubtitle: true, optionValues: ['apartment', 'house_no_yard', 'house_yard'] },
  { id: 'activity_level', hasSubtitle: true, optionValues: ['low', 'moderate', 'high'] },
  { id: 'experience', optionValues: ['first_time', 'some_experience', 'experienced'] },
  { id: 'time_at_home', optionValues: ['rarely', 'sometimes', 'often'] },
  { id: 'children', optionValues: ['yes_young', 'yes_older', 'no'] },
  { id: 'other_pets', optionValues: ['yes', 'no'] },
  { id: 'preferred_size', optionValues: ['small', 'medium', 'large', 'no_preference'] },
  { id: 'preferred_age', optionValues: ['young', 'adult', 'senior', 'no_preference'] },
  { id: 'energy_match', optionValues: ['calm', 'moderate', 'energetic'] },
];

export default function MatchPage() {
  const { t } = useTranslation('match');
  const enumLabel = useEnumLabel();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuestionnaireAnswers>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<AnimalMatch[] | null>(null);
  const [adoptionStatusMap, setAdoptionStatusMap] = useState<Record<number, 'pending' | 'approved'>>({});

  useEffect(() => {
    if (!results) return;
    const fetchAdoptionRequests = async () => {
      try {
        const requests = await getUserAdoptionRequests();
        const statusMap: Record<number, 'pending' | 'approved'> = {};
        for (const req of requests) {
          if (req.status === 'pending' || req.status === 'approved') {
            if (!statusMap[req.animal_id]) {
              statusMap[req.animal_id] = req.status;
            }
          }
        }
        setAdoptionStatusMap(statusMap);
      } catch {
        // Not logged in — no statuses to show
      }
    };
    fetchAdoptionRequests();
  }, [results]);

  const handleAdopt = async (animalId: number) => {
    try {
      await createAdoptionRequest(animalId);
      setAdoptionStatusMap((prev) => ({ ...prev, [animalId]: 'pending' }));
    } catch (err: unknown) {
      if (err instanceof Error && err.message === 'NOT_LOGGED_IN') {
        alert(t('alerts.loginToAdopt'));
      } else {
        alert(translateApiError(err));
      }
    }
  };

  const currentQuestion = QUESTIONS[step];
  const totalSteps = QUESTIONS.length;
  const progressPercent = ((step + 1) / totalSteps) * 100;

  const handleOptionClick = async (value: string) => {
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);

    if (step === totalSteps - 1) {
      setLoading(true);
      setError(null);
      try {
        const matches = await getMatches(newAnswers as QuestionnaireAnswers);
        setResults(matches);
      } catch (err) {
        setError(translateApiError(err));
      } finally {
        setLoading(false);
      }
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(Math.max(0, step - 1));
  };

  const restart = () => {
    setStep(0);
    setAnswers({});
    setLoading(false);
    setError(null);
    setResults(null);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          gap: '20px',
          fontSize: '48px',
        }}>
          <div>🐾</div>
          <div>{t('loading')}</div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          gap: '20px',
        }}>
          <div style={{ color: 'red', fontSize: '18px' }}>{error}</div>
          <button
            onClick={() => {
              setError(null);
              setStep(0);
              setAnswers({});
            }}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              cursor: 'pointer',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
            }}
          >
            {t('tryAgain')}
          </button>
        </div>
      </>
    );
  }

  if (results !== null) {
    const medals = ['🥇', '🥈', '🥉'];

    return (
      <>
        <Navbar />
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '40px 20px',
          color: '#1f2937',
        }}>
          <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>{t('results.title')}</h1>

          {results.length === 0 ? (
            <div style={{
              textAlign: 'center',
              fontSize: '18px',
              color: '#666',
              marginBottom: '40px',
            }}>
              {t('results.empty')}
            </div>
          ) : (
            <div style={{ marginBottom: '40px' }}>
              {results.map((match, index) => {
                const matchPercent = Math.min(Math.round((match.match_score / 100) * 100), 100);
                const ageLabel = t('results.ageLabel', { count: match.age });

                return (
                  <div
                    key={match.id}
                    style={{
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      padding: '20px',
                      marginBottom: '20px',
                      backgroundColor: '#f9f9f9',
                      color: '#1f2937',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '24px', marginRight: '10px' }}>{medals[index] || ''}</span>
                      <span style={{ fontWeight: 'bold', fontSize: '18px' }}>{match.name}</span>
                    </div>

                    <div style={{ color: '#666', marginBottom: '15px', fontSize: '14px' }}>
                      {match.breed || enumLabel('animal_type', match.type)} · {enumLabel('animal_size', match.size)} · {match.age} {ageLabel}
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                      <div style={{ marginBottom: '5px', fontWeight: 'bold' }}>
                        {t('results.matchPercent', { percent: matchPercent })}
                      </div>
                      <div style={{ width: '100%', height: '12px', backgroundColor: '#e0e0e0', borderRadius: '6px', overflow: 'hidden' }}>
                        <div style={{ width: `${matchPercent}%`, height: '100%', backgroundColor: '#4caf50', transition: 'width 0.3s ease' }} />
                      </div>
                    </div>

                    <div style={{ marginBottom: '15px', lineHeight: '1.6' }}>{match.description}</div>

                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px' }}>
                      <span style={{ display: 'inline-block', backgroundColor: '#e3f2fd', padding: '4px 12px', borderRadius: '20px', fontSize: '14px' }}>
                        {enumLabel('animal_temperament', match.temperament)}
                      </span>
                      {match.vaccinated && (
                        <span style={{ display: 'inline-block', backgroundColor: '#c8e6c9', padding: '4px 12px', borderRadius: '20px', fontSize: '14px' }}>
                          {t('results.vaccinatedBadge')}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleAdopt(match.id)}
                      disabled={adoptionStatusMap[match.id] === 'pending'}
                      style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        cursor: adoptionStatusMap[match.id] === 'pending' ? 'not-allowed' : 'pointer',
                        backgroundColor: adoptionStatusMap[match.id] === 'pending' ? '#ccc' : '#ff9800',
                        color: adoptionStatusMap[match.id] === 'pending' ? '#777' : 'white',
                        border: 'none',
                        borderRadius: '4px',
                      }}
                    >
                      {adoptionStatusMap[match.id] === 'pending' ? t('results.adoptPending') : t('results.adopt')}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <button
            onClick={restart}
            style={{
              display: 'block',
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              cursor: 'pointer',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
            }}
          >
            {t('startOver')}
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '40px 20px',
        color: '#1f2937',
      }}>
        <div style={{ width: '100%', height: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px', marginBottom: '40px', overflow: 'hidden' }}>
          <div style={{ width: `${progressPercent}%`, height: '100%', backgroundColor: '#4caf50', transition: 'width 0.3s ease' }} />
        </div>

        <h2 style={{ marginBottom: '10px', fontSize: '24px' }}>
          {t(`questions.${currentQuestion.id}.title` as never)}
        </h2>
        {currentQuestion.hasSubtitle && (
          <p style={{ color: '#666', marginBottom: '30px', fontSize: '16px' }}>
            {t(`questions.${currentQuestion.id}.subtitle` as never, { defaultValue: '' })}
          </p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px' }}>
          {currentQuestion.optionValues.map((value) => (
            <button
              key={value}
              onClick={() => handleOptionClick(value)}
              style={{
                padding: '16px',
                fontSize: '16px',
                cursor: 'pointer',
                backgroundColor: '#f0f0f0',
                color: '#1f2937',
                border: '2px solid #ddd',
                borderRadius: '8px',
                textAlign: 'left',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e8e8e8';
                e.currentTarget.style.borderColor = '#999';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f0f0f0';
                e.currentTarget.style.borderColor = '#ddd';
              }}
            >
              {t(`questions.${currentQuestion.id}.options.${value}` as never)}
            </button>
          ))}
        </div>

        {step > 0 && (
          <button
            onClick={handleBack}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              cursor: 'pointer',
              backgroundColor: '#ccc',
              color: '#1f2937',
              border: 'none',
              borderRadius: '4px',
            }}
          >
            {t('back')}
          </button>
        )}
      </div>
    </>
  );
}
