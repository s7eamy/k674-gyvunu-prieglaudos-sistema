import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Companions } from './pages/Companions';
import { AnimalDetail } from './pages/AnimalDetail';
import { Placeholder } from './pages/Placeholder';

// eslint-disable-next-line react-refresh/only-export-components
const QuestionnaireRoute = () => <Placeholder title="Questionnaire" />;
// eslint-disable-next-line react-refresh/only-export-components
const DonationRoute = () => <Placeholder title="Donation" />;
// eslint-disable-next-line react-refresh/only-export-components
const VolunteerRoute = () => <Placeholder title="Volunteer" />;
// eslint-disable-next-line react-refresh/only-export-components
const PostsRoute = () => <Placeholder title="Posts" />;
// eslint-disable-next-line react-refresh/only-export-components
const ProfileRoute = () => <Placeholder title="Profile" />;

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: 'companions',
        Component: Companions,
      },
      {
        path: 'companions/:id',
        Component: AnimalDetail,
      },
      {
        path: 'questionnaire',
        Component: QuestionnaireRoute,
      },
      {
        path: 'donation',
        Component: DonationRoute,
      },
      {
        path: 'volunteer',
        Component: VolunteerRoute,
      },
      {
        path: 'posts',
        Component: PostsRoute,
      },
      {
        path: 'profile',
        Component: ProfileRoute,
      },
    ],
  },
]);
