import { Link, useLocation } from 'react-router';
import { Heart } from 'lucide-react';

export function Navigation() {
  const location = useLocation();
  
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Companions', path: '/companions' },
    { name: 'Questionnaire', path: '/questionnaire' },
    { name: 'Donation', path: '/donation' },
    { name: 'Volunteer', path: '/volunteer' },
    { name: 'Posts', path: '/posts' },
    { name: 'Profile', path: '/profile' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <Heart className="size-8 text-orange-500 fill-orange-500" />
            <span className="text-xl font-semibold text-gray-900">PawFinder</span>
          </Link>
          
          <div className="flex gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive(item.path)
                    ? 'bg-orange-100 text-orange-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
