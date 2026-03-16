// Volunteer page — users can sign up for a volunteering spot
import { useState, useEffect } from 'react';
import { getAll, getLevel, createRegistration } from '../../services/volunteerRegistrationService';
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
        const [registrations, level] = await Promise.all([getAll(), getLevel()]);
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
  
    await createRegistration(selectedDate, time_from, time_to);

    const [registrations, level] = await Promise.all([getAll(), getLevel()]);
    setVolunteerRegistrations(registrations);
    setVolunteerLevel(level);

  } catch (error) {
    console.error("Registration creation failed", error);
  }
 };

  return (
    <>
      <Navbar />
      <main className="volunteer-page">
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

        {LoggedIn && (
          <>
            {volunteerRegistrations.length === 0 ? (
            <p className="volunteer-page__empty">No volunteer registrations found.</p>
            ) : (
          <section className="volunteer-page__grid" aria-label="Volunteer Registrations cards">
            {volunteerRegistrations.map((volunteerRegistration) => (
              <VolunteerRegistrationCard key={volunteerRegistration.id}
              volunteerRegistration={volunteerRegistration} onAbout={(v) =>
              setSelectedVolunteerRegistration(v)} />
            ))}
          </section>
        )}
        <h1>Make a registration</h1>
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
            </div>
            <button
            type="button"
            className="volunteer-card__details-btn"
            onClick={handleCreateRegistration}
            >
            Create registration
            </button>
          </>
        )}
        
      </main>

      <VolunteerRegistrationModal volunteerRegistration={selectedVolunteerRegistration}
       onClose={() => setSelectedVolunteerRegistration(null)} />
    </>
  );
}