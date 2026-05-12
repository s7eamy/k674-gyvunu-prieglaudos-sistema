// Volunteer page — users can sign up for a volunteering spot
import { useState, useEffect } from 'react';
import { getUserVolunteerRegistrations, getLevel, createRegistration } from '../../services/volunteerRegistrationService';
import type { VolunteerRegistration } from '../../types/VolunteerRegistration';
import type { VolunteerLevel } from '../../types/VolunteerLevel';
import Navbar from '../../components/layout/Navbar';
import VolunteerLevelCard from '../../components/common/VolunteerLevelCard';
import VolunteerRegistrationCard from '../../components/common/VolunteerRegistrationCard';
import VolunteerRegistrationModal from '../../components/common/VolunteerRegistrationModal';
import './VolunteerRegistrationspage.css';


export default function VolunteerRegistrationsPage() {
   // needed for registrations to be made for tomorrow and later only
  const today = new Date();
  const tomorrowObj = new Date(today);
  tomorrowObj.setDate(today.getDate() + 1);
  const tomorrowString = tomorrowObj.toISOString().split('T')[0];

  const [volunteerRegistrations, setVolunteerRegistrations] = useState<VolunteerRegistration[]>([]);
  const [volunteerLevel, setVolunteerLevel] = useState<VolunteerLevel | null>(null);
  const [selectedVolunteerRegistration, setSelectedVolunteerRegistration] = useState<VolunteerRegistration | null>(null);
  const [LoggedIn, setLoggedIn] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>(tomorrowString);
  const [time_from, setTimeFrom] = useState("10:00");
  const [time_to, setTimeTo] = useState("14:00");
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  const volunteerTasks = [
    'Walk dogs',
    'Feed animals',
    'Clean cages',
    'Play & socialize',
    'Groom animals',
    'Photography',
    'Event support'
  ];

  const handleTaskToggle = (task: string) => {
    setSelectedTasks(prev =>
      prev.includes(task)
        ? prev.filter(t => t !== task)
        : [...prev, task]
    );
  };

  // needed for bad time selection fixes
  const adjustTimeByHour = (timeStr: string, offset: number): string => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const newHour = (hours + offset + 24) % 24; 
  return `${String(newHour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};
  const handleEndTimeChange = (value: string) => {
    if (value < time_from) {
      setTimeTo(adjustTimeByHour(time_from,1)); 
    } else {
      setTimeTo(value);
    }
  };

  const handleStartTimeChange = (value: string) => {
    if (value > time_to) {
      setTimeFrom(adjustTimeByHour(time_to,-1)); 
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
        if(error instanceof Error && error.message === "NOT_LOGGED_IN"){
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
    console.error("Registration creation failed", error);
  }
 };

  return (
    <>
      <Navbar />
      
      {/* Hero Section - Outside main for full width */}
      <section className="volunteer-page__registration-hero">
        <div className="volunteer-page__hero-wrapper">
          <div className="volunteer-page__hero-content">
            <h1>Volunteer sign-Up</h1>
            <p>Choose what you'd like to help with, pick your available dates, and we'll confirm your slots. Every hour makes a difference.</p>
            <div className="volunteer-page__hero-steps">
              <div className="volunteer-page__steps">
                <div className="volunteer-page__step">
                  <div className="volunteer-page__step-number">1</div>
                  <span className="volunteer-page__step-text">Choose Tasks</span>
                </div>
                <div className="volunteer-page__step">
                  <div className="volunteer-page__step-number">2</div>
                  <span className="volunteer-page__step-text">Schedule</span>
                </div>
              </div>
            </div>
            <div className="volunteer-page__hero-stats">
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Hours Volunteered</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">50+</span>
                <span className="stat-label">Active Volunteers</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">1000+</span>
                <span className="stat-label">Animals Helped</span>
              </div>
            </div>
          </div>
          
          <div className="volunteer-page__hero-right-section">
            <div className="volunteer-page__hero-quotes">
              <div className="quote-bubble quote-bubble--green">
                <p>"Helping animals has been the most rewarding experience of my life!"</p>
                <span className="quote-author">— Sarah M.</span>
              </div>
              <div className="quote-bubble quote-bubble--orange">
                <p>"Every moment with the animals makes it all worth it."</p>
                <span className="quote-author">— James T.</span>
              </div>
              <div className="quote-bubble quote-bubble--blue">
                <p>"I've made such wonderful friends here!"</p>
                <span className="quote-author">— Emma K.</span>
              </div>
              <div className="quote-bubble quote-bubble--teal">
                <p>"The best decision I made was to volunteer here!"</p>
                <span className="quote-author">— Michael R.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="volunteer-page">
        {/* Form and Tasks Section - Combined Pink Section */}
        <div className="volunteer-page__form-wrapper">
          {/* Form Controls Section */}
          <section className="volunteer-page__form-section">
            <h2>What time works for you?</h2>
            <div className="registration-controls">
            <div className="input-group">
              <label htmlFor="registrationDate" className="date-input-label">Date</label>
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
              <label htmlFor="registrationFrom" className="date-input-label">Start Hour</label>
              <input
                type="time"
                id="registrationFrom"
                className="custom-input"
                value={time_from}
                onChange={(e) => handleStartTimeChange(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="registrationTo" className="date-input-label">End Hour</label>
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
              Create registration
            </button>
            </div>
          </section>

          {/* Tasks Selection */}
          <section className="volunteer-page__tasks-section">
            <h2>What can you help with?</h2>
            <div className="volunteer-page__tasks-grid">
              {volunteerTasks.map((task) => (
                <button
                  key={task}
                  className={`volunteer-page__task-button ${selectedTasks.includes(task) ? 'volunteer-page__task-button--selected' : ''}`}
                  onClick={() => handleTaskToggle(task)}
                >
                  <div className="volunteer-page__task-checkbox">
                    {selectedTasks.includes(task) && <span>✓</span>}
                  </div>
                  <span className="volunteer-page__task-label">{task}</span>
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Registrations Section */}
        <div className="volunteer-page__registrations-wrapper">
          <header className="volunteer-page__header">
            <h1>Your volunteering registrations</h1>
            {!LoggedIn && (
              <p className="volunteer-page__empty">
                Please log in to see your volunteer registrations.
              </p>
            )}
            
            {LoggedIn && (
              <>
                {volunteerLevel && (
                  <VolunteerLevelCard volunteerLevel={volunteerLevel} />
                )}
                <p>Found {volunteerRegistrations.length} of your registrations</p>
              </>
            )}
          </header>

          {/* Registrations Grid */}
          {LoggedIn && (
            <>
              {volunteerRegistrations.length === 0 ? (
                <p className="volunteer-page__empty">No volunteer registrations found.</p>
              ) : (
                <section className="volunteer-page__grid" aria-label="Volunteer Registrations cards">
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