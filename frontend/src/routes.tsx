import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Companions } from './pages/Companions';
import { AnimalDetail } from './pages/AnimalDetail';
import { Placeholder } from './pages/Placeholder';

const QuestionnaireRoute = () => <Placeholder title="Questionnaire" />;
const DonationRoute = () => <Placeholder title="Donation" />;
const VolunteerRoute = () => <Placeholder title="Volunteer" />;
const PostsRoute = () => <Placeholder title="Posts" />;
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
