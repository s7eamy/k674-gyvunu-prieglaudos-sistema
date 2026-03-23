// Admin page — only admins can see the contents of this page and
// take admin exclusive actions in this page
import { useState, useEffect } from 'react';
import { getAll, getUsers } from '../../services/adminService';
import type { VolunteerRegistration } from '../../types/VolunteerRegistration';
import type { User } from '../../types/User';
import Navbar from '../../components/layout/Navbar';
import AdminRegistrationCard from '../../components/common/AdminRegistrationCard';
import VolunteerRegistrationModal from '../../components/common/VolunteerRegistrationModal';
import './AdminPage.css';


export default function AdminPage() {
  const [volunteerRegistrations, setVolunteerRegistrations] = useState<VolunteerRegistration[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedVolunteerRegistration, setSelectedVolunteerRegistration] = useState<VolunteerRegistration | null>(null);
  const [IsAdmin, setIsAdmin] = useState(true);
  const [LoggedIn, setLoggedIn] = useState(true);
 
    const groupedByUser = volunteerRegistrations.reduce((acc, registration) => {
        const userId = registration.user_id;

        if (!acc[userId]) {
            acc[userId] = [];
        }

        acc[userId].push(registration);
        return acc;
    }, {} as Record<string, VolunteerRegistration[]>);

    const handleRegistrationUpdate = (updatedReg: VolunteerRegistration) => {
      setVolunteerRegistrations((prev) => prev.map((reg) => (reg.id === updatedReg.id ? updatedReg : reg))
     );
    };

  useEffect(() => {
    const fetchVolunteerRegistrations = async () => {
      try {
        const [registrations, AllUsers] = await Promise.all([getAll(), getUsers()]);
        setVolunteerRegistrations(registrations);
        setUsers(AllUsers)    
      } catch (error) {
        if(error instanceof Error && error.message === "NOT_LOGGED_IN"){
          setLoggedIn(false);
        }
        else if(error instanceof Error && error.message === "USER_NOT_ADMIN"){
          setIsAdmin(false);
        }
         else {
          console.error('Registration fetch failed', error);
        }
      }
    };

    fetchVolunteerRegistrations();
  }, []);


  return (
    <>
      <Navbar />
      <main className="admin-page">
        <header className="admin-page__header">
          <h1>Volunteering registrations</h1>
          {(!IsAdmin || !LoggedIn) && (
        <p className="admin-page__empty">
        Please log in as admin to see volunteer registrations.
        </p>
        )}
          
          {IsAdmin && LoggedIn &&(
            <>
            <p>Found {volunteerRegistrations.length} user created registrations</p>
          </>
        )}
        </header>

        {IsAdmin && LoggedIn &&(
          <>
            {volunteerRegistrations.length === 0 ? (
            <p className="admin-page__empty"></p>
            ) : (
          <section aria-label="Volunteer Registrations cards">
             {Object.entries(groupedByUser).map(([userId, registrations]) => {
              const user = users.find((u) => String(u.id) === userId);

              return(
            <div key={userId} className="admin-page__user-section">
                <h2>User: {user? user.name : userId}</h2>
                <div className="admin-page__grid">
                {registrations.map((volunteerRegistration) => (
                <AdminRegistrationCard
                key={volunteerRegistration.id}
                volunteerRegistration={volunteerRegistration}
                onAbout={(v) => setSelectedVolunteerRegistration(v)}
                onUpdate={handleRegistrationUpdate}
                />
                ))}
               
                </div>
            </div>
            );
        })}
        </section>
        )}
          </>
        )}
        
      </main>

      <VolunteerRegistrationModal volunteerRegistration={selectedVolunteerRegistration}
       onClose={() => setSelectedVolunteerRegistration(null)} />
    </>
  );
}