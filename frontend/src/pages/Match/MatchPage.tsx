// Match page — questionnaire and results page for finding best animal matches
import { useState } from 'react';
import { getMatches } from '../../services/matchService';
import type { QuestionnaireAnswers, AnimalMatch } from '../../types/Match';

const questions = [
  {
    id: 'animal_type' as const,
    question: 'What kind of companion are you looking for?',
    options: [
      { value: 'dog', label: '🐕 Dog' },
      { value: 'cat', label: '🐈 Cat' },
      { value: 'either', label: '🐾 Open to both' },
    ],
  },
  {
    id: 'living_space' as const,
    question: 'Where do you live?',
    subtitle: 'Your space shapes what animal will thrive with you.',
    options: [
      { value: 'apartment', label: '🏢 Apartment' },
      { value: 'house_no_yard', label: '🏠 House without a yard' },
      { value: 'house_yard', label: '🏡 House with a yard' },
    ],
  },
  {
    id: 'activity_level' as const,
    question: 'How active are you?',
    subtitle: 'Be honest — your match depends on it!',
    options: [
      { value: 'low', label: '🛋️ Homebody' },
      { value: 'moderate', label: '🚶 Balanced' },
      { value: 'high', label: '🏃 Always on the go' },
    ],
  },
  {
    id: 'experience' as const,
    question: 'Have you owned a pet before?',
    options: [
      { value: 'first_time', label: '🌱 First-time owner' },
      { value: 'some_experience', label: '🐾 I\'ve had a pet or two' },
      { value: 'experienced', label: '⭐ Very experienced' },
    ],
  },
  {
    id: 'time_at_home' as const,
    question: 'How much time are you typically at home?',
    options: [
      { value: 'rarely', label: '🏙️ Rarely — out most of the day' },
      { value: 'sometimes', label: '⏱️ Sometimes — a few hours a day' },
      { value: 'often', label: '🏠 Often — work from home or similar' },
    ],
  },
  {
    id: 'children' as const,
    question: 'Do you have children at home?',
    options: [
      { value: 'yes_young', label: '👶 Yes — young children (under 8)' },
      { value: 'yes_older', label: '🧒 Yes — older children (8+)' },
      { value: 'no', label: '🧑 No children' },
    ],
  },
  {
    id: 'other_pets' as const,
    question: 'Do you already have other pets?',
    options: [
      { value: 'yes', label: '🐶🐱 Yes, I have other pets' },
      { value: 'no', label: '🏡 No other pets' },
    ],
  },
  {
    id: 'preferred_size' as const,
    question: 'Any size preference?',
    options: [
      { value: 'small', label: '🐹 Small' },
      { value: 'medium', label: '🐕 Medium' },
      { value: 'large', label: '🐕‍🦺 Large' },
      { value: 'no_preference', label: '💛 No preference' },
    ],
  },
  {
    id: 'preferred_age' as const,
    question: 'What age range appeals to you?',
    options: [
      { value: 'young', label: '🐣 Young (0–2 yrs)' },
      { value: 'adult', label: '🐾 Adult (3–7 yrs)' },
      { value: 'senior', label: '🤍 Senior (8+ yrs)' },
      { value: 'no_preference', label: '💛 No preference' },
    ],
  },
  {
    id: 'energy_match' as const,
    question: 'What energy level suits your lifestyle?',
    options: [
      { value: 'calm', label: '😌 Calm & mellow' },
      { value: 'moderate', label: '😊 Playful but chill' },
      { value: 'energetic', label: '🤩 Energetic & adventurous' },
    ],
  },
];

export default function MatchPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuestionnaireAnswers>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<AnimalMatch[] | null>(null);

  const currentQuestion = questions[step];
  const totalSteps = questions.length;
  const progressPercent = ((step + 1) / totalSteps) * 100;

  const handleOptionClick = async (value: string) => {
    const newAnswers = {
      ...answers,
      [currentQuestion.id]: value,
    };
    setAnswers(newAnswers);

    if (step === totalSteps - 1) {
      // Final question — fetch matches
      setLoading(true);
      setError(null);
      try {
        const matches = await getMatches(newAnswers as QuestionnaireAnswers);
        setResults(matches);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to find matches');
      } finally {
        setLoading(false);
      }
    } else {
      // Move to next question
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

  // Render loading state
  if (loading) {
    return (
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
        <div>Finding your perfect match…</div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
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
          Try again
        </button>
      </div>
    );
  }

  // Render results state
  if (results !== null) {
    const medals = ['🥇', '🥈', '🥉'];

    return (
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '40px 20px',
        color: '#1f2937',
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
          Your Best Matches 🐾
        </h1>

        {results.length === 0 ? (
          <div style={{
            textAlign: 'center',
            fontSize: '18px',
            color: '#666',
            marginBottom: '40px',
          }}>
            No matches found right now — check back as new animals arrive!
          </div>
        ) : (
          <div style={{ marginBottom: '40px' }}>
            {results.map((match, index) => {
              const matchPercent = Math.min(Math.round((match.match_score / 100) * 100), 100);
              const ageLabel = match.age === 1 ? 'yr' : 'yrs';

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
                    <span style={{ fontSize: '24px', marginRight: '10px' }}>
                      {medals[index] || ''}
                    </span>
                    <span style={{ fontWeight: 'bold', fontSize: '18px' }}>
                      {match.name}
                    </span>
                  </div>

                  <div style={{ color: '#666', marginBottom: '15px', fontSize: '14px' }}>
                    {match.breed || match.type} · {match.size} · {match.age} {ageLabel}
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <div style={{ marginBottom: '5px', fontWeight: 'bold' }}>
                      Match: {matchPercent}%
                    </div>
                    <div
                      style={{
                        width: '100%',
                        height: '12px',
                        backgroundColor: '#e0e0e0',
                        borderRadius: '6px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${matchPercent}%`,
                          height: '100%',
                          backgroundColor: '#4caf50',
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '15px', lineHeight: '1.6' }}>
                    {match.description}
                  </div>

                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        backgroundColor: '#e3f2fd',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '14px',
                      }}
                    >
                      {match.temperament}
                    </span>
                    {match.vaccinated && (
                      <span
                        style={{
                          display: 'inline-block',
                          backgroundColor: '#c8e6c9',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '14px',
                        }}
                      >
                        Vaccinated ✓
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      // TODO: Handle adoption
                    }}
                    style={{
                      padding: '10px 20px',
                      fontSize: '16px',
                      cursor: 'pointer',
                      backgroundColor: '#ff9800',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                    }}
                  >
                    Adopt Me 🐾
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
          ↩ Start over
        </button>
      </div>
    );
  }

  // Render questionnaire state
  return (
    <div style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '40px 20px',
      color: '#1f2937',
    }}>
      {/* Progress bar */}
      <div style={{
        width: '100%',
        height: '8px',
        backgroundColor: '#e0e0e0',
        borderRadius: '4px',
        marginBottom: '40px',
        overflow: 'hidden',
      }}>
        <div
          style={{
            width: `${progressPercent}%`,
            height: '100%',
            backgroundColor: '#4caf50',
            transition: 'width 0.3s ease',
          }}
        />
      </div>

      {/* Question title and subtitle */}
      <h2 style={{ marginBottom: '10px', fontSize: '24px' }}>
        {currentQuestion.question}
      </h2>
      {currentQuestion.subtitle && (
        <p style={{ color: '#666', marginBottom: '30px', fontSize: '16px' }}>
          {currentQuestion.subtitle}
        </p>
      )}

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px' }}>
        {currentQuestion.options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleOptionClick(option.value)}
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
            {option.label}
          </button>
        ))}
      </div>

      {/* Back button */}
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
          Back
        </button>
      )}
    </div>
  );
}
