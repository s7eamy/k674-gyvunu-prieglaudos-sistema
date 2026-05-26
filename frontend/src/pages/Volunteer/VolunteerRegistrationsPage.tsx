import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getUserVolunteerRegistrations, getLevel, createRegistration } from '../../services/volunteerRegistrationService';
import type { VolunteerRegistration } from '../../types/VolunteerRegistration';
import type { VolunteerLevel } from '../../types/VolunteerLevel';
import Navbar from '../../components/layout/Navbar';
import VolunteerLevelCard from '../../components/common/VolunteerLevelCard';
import VolunteerRegistrationCard from '../../components/common/VolunteerRegistrationCard';
import VolunteerRegistrationModal from '../../components/common/VolunteerRegistrationModal';
import { translateApiError } from '../../i18n/errorMap';
import './VolunteerRegistrationspage.css';

const VOLUNTEER_TASKS: { id: string; en: string }[] = [
  { id: 'walk_dogs', en: 'Walk dogs' },
  { id: 'feed_animals', en: 'Feed animals' },
  { id: 'clean_cages', en: 'Clean cages' },
  { id: 'play_socialize', en: 'Play & socialize' },
  { id: 'groom_animals', en: 'Groom animals' },
  { id: 'photography', en: 'Photography' },
  { id: 'event_support', en: 'Event support' },
];

export default function VolunteerRegistrationsPage() {
  const { t } = useTranslation('volunteer');
  const today = new Date();
  const tomorrowObj = new Date(today);
  tomorrowObj.setDate(today.getDate() + 1);
  const tomorrowString = tomorrowObj.toISOString().split('T')[0];

  const [volunteerRegistrations, setVolunteerRegistrations] = useState<VolunteerRegistration[]>([]);
  const [volunteerLevel, setVolunteerLevel] = useState<VolunteerLevel | null>(null);
  const [selectedVolunteerRegistration, setSelectedVolunteerRegistration] = useState<VolunteerRegistration | null>(null);
  const [LoggedIn, setLoggedIn] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>(tomorrowString);
  const [time_from, setTimeFrom] = useState('10:00');
  const [time_to, setTimeTo] = useState('14:00');
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  const handleTaskToggle = (taskEn: string) => {
    setSelectedTasks((prev) =>
      prev.includes(taskEn) ? prev.filter((t) => t !== taskEn) : [...prev, taskEn],
    );
  };

  const adjustTimeByHour = (timeStr: string, offset: number): string => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const newHour = (hours + offset + 24) % 24;
    return `${String(newHour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  const handleEndTimeChange = (value: string) => {
    if (value < time_from) {
      setTimeTo(adjustTimeByHour(time_from, 1));
    } else {
      setTimeTo(value);
    }
  };

  const handleStartTimeChange = (value: string) => {
    if (value > time_to) {
      setTimeFrom(adjustTimeByHour(time_to, -1));
    } else {
      setTimeFrom(value);
    }
  };

  useEffect(() => {
    const fetchVolunteerRegistrations = async () => {
      try {
        const [registrations, level] = await Promise.all([getUserVolunteerRegistrations(), getLevel()]);
        setVolunteerRegistrations(registrations);
        setVolunteerLevel(level);
      } catch (error) {
        if (error instanceof Error && error.message === 'NOT_LOGGED_IN') {
          setLoggedIn(false);
        } else {
          console.error('Registration fetch failed', error);
        }
      }
    };

    fetchVolunteerRegistrations();
  }, []);

  const handleCreateRegistration = async () => {
    try {
      await createRegistration(selectedDate, time_from, time_to, selectedTasks);
      const [registrations, level] = await Promise.all([getUserVolunteerRegistrations(), getLevel()]);
      setVolunteerRegistrations(registrations);
      setVolunteerLevel(level);
    } catch (error) {
      console.error('Registration creation failed', error);
      alert(translateApiError(error));
    }
  };

  return (
    <>
      <Navbar />

      <section className="volunteer-page__registration-hero">
        <div className="volunteer-page__hero-wrapper">
          <div className="volunteer-page__hero-content">
            <h1>{t('hero.title')}</h1>
            <p>{t('hero.subtitle')}</p>
            <div className="volunteer-page__hero-steps">
              <div className="volunteer-page__steps">
                <div className="volunteer-page__step">
                  <div className="volunteer-page__step-number">1</div>
                  <span className="volunteer-page__step-text">{t('hero.steps.tasks')}</span>
                </div>
                <div className="volunteer-page__step">
                  <div className="volunteer-page__step-number">2</div>
                  <span className="volunteer-page__step-text">{t('hero.steps.schedule')}</span>
                </div>
              </div>
            </div>
            <div className="volunteer-page__hero-stats">
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">{t('hero.stats.hours')}</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">50+</span>
                <span className="stat-label">{t('hero.stats.active')}</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">1000+</span>
                <span className="stat-label">{t('hero.stats.helped')}</span>
              </div>
            </div>
          </div>

          <div className="volunteer-page__hero-right-section">
            <div className="volunteer-page__hero-quotes">
              <div className="quote-bubble quote-bubble--green">
                <p>{t('hero.quotes.q1')}</p>
                <span className="quote-author">{t('hero.quotes.q1Author')}</span>
              </div>
              <div className="quote-bubble quote-bubble--orange">
                <p>{t('hero.quotes.q2')}</p>
                <span className="quote-author">{t('hero.quotes.q2Author')}</span>
              </div>
              <div className="quote-bubble quote-bubble--blue">
                <p>{t('hero.quotes.q3')}</p>
                <span className="quote-author">{t('hero.quotes.q3Author')}</span>
              </div>
              <div className="quote-bubble quote-bubble--teal">
                <p>{t('hero.quotes.q4')}</p>
                <span className="quote-author">{t('hero.quotes.q4Author')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="volunteer-page">
        <div className="volunteer-page__form-wrapper">
          <section className="volunteer-page__form-section">
            <h2>{t('form.timeHeading')}</h2>
            <div className="registration-controls">
              <div className="input-group">
                <label htmlFor="registrationDate" className="date-input-label">{t('form.date')}</label>
                <input
                  type="date"
                  id="registrationDate"
                  className="custom-input"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={tomorrowString}
                />
              </div>

              <div className="input-group">
                <label htmlFor="registrationFrom" className="date-input-label">{t('form.start')}</label>
                <input
                  type="time"
                  id="registrationFrom"
                  className="custom-input"
                  value={time_from}
                  onChange={(e) => handleStartTimeChange(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label htmlFor="registrationTo" className="date-input-label">{t('form.end')}</label>
                <input
                  type="time"
                  id="registrationTo"
                  className="custom-input"
                  value={time_to}
                  min={time_from}
                  onChange={(e) => handleEndTimeChange(e.target.value)}
                />
              </div>

              <button
                type="button"
                className="volunteer-card__details-btn"
                onClick={handleCreateRegistration}
              >
                {t('form.submit')}
              </button>
            </div>
          </section>

          <section className="volunteer-page__tasks-section">
            <h2>{t('form.tasksHeading')}</h2>
            <div className="volunteer-page__tasks-grid">
              {VOLUNTEER_TASKS.map((task) => (
                <button
                  key={task.id}
                  className={`volunteer-page__task-button ${selectedTasks.includes(task.en) ? 'volunteer-page__task-button--selected' : ''}`}
                  onClick={() => handleTaskToggle(task.en)}
                >
                  <div className="volunteer-page__task-checkbox">
                    {selectedTasks.includes(task.en) && <span>✓</span>}
                  </div>
                  <span className="volunteer-page__task-label">{t(`tasks.${task.id}` as never)}</span>
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="volunteer-page__registrations-wrapper">
          <header className="volunteer-page__header">
            <h1>{t('registrations.heading')}</h1>
            {!LoggedIn && <p className="volunteer-page__empty">{t('registrations.loginPrompt')}</p>}

            {LoggedIn && (
              <>
                {volunteerLevel && <VolunteerLevelCard volunteerLevel={volunteerLevel} />}
                <p>{t('registrations.count', { count: volunteerRegistrations.length })}</p>
              </>
            )}
          </header>

          {LoggedIn && (
            <>
              {volunteerRegistrations.length === 0 ? (
                <p className="volunteer-page__empty">{t('registrations.empty')}</p>
              ) : (
                <section className="volunteer-page__grid" aria-label={t('registrations.ariaGrid')}>
                  {volunteerRegistrations.map((volunteerRegistration) => (
                    <VolunteerRegistrationCard
                      key={volunteerRegistration.id}
                      volunteerRegistration={volunteerRegistration}
                      onAbout={(v) => setSelectedVolunteerRegistration(v)}
                    />
                  ))}
                </section>
              )}
            </>
          )}
        </div>
      </main>

      <VolunteerRegistrationModal
        volunteerRegistration={selectedVolunteerRegistration}
        onClose={() => setSelectedVolunteerRegistration(null)}
      />
    </>
  );
}
