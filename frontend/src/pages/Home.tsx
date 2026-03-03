import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Heart, Search, Users } from 'lucide-react';

export function Home() {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <div className="relative h-[500px] overflow-hidden bg-gradient-to-r from-orange-50 to-orange-100">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1683744579737-bc47bb7edbb3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGZhbWlseSUyMGRvZyUyMGNhdCUyMHRvZ2V0aGVyfGVufDF8fHx8MTc3MjU0MjkwM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Happy pets"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl mb-4 text-gray-900">
              Find Your Perfect Companion
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Give a loving home to a pet in need. Browse our available companions and start your journey to pet parenthood today.
            </p>
            <div className="flex gap-4">
              <Link to="/companions">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                  <Search className="mr-2 size-5" />
                  Browse Companions
                </Button>
              </Link>
              <Link to="/donation">
                <Button size="lg" variant="outline">
                  <Heart className="mr-2 size-5" />
                  Support Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl text-center mb-12 text-gray-900">
          How PawFinder Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mb-4">
              <Search className="size-8 text-orange-600" />
            </div>
            <h3 className="text-xl mb-2 text-gray-900">Browse</h3>
            <p className="text-gray-600">
              Explore our database of lovable animals looking for their forever homes. Filter by type, size, and temperament.
            </p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mb-4">
              <Heart className="size-8 text-orange-600" />
            </div>
            <h3 className="text-xl mb-2 text-gray-900">Connect</h3>
            <p className="text-gray-600">
              Fill out our questionnaire to help us match you with the perfect companion based on your lifestyle and preferences.
            </p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mb-4">
              <Users className="size-8 text-orange-600" />
            </div>
            <h3 className="text-xl mb-2 text-gray-900">Adopt</h3>
            <p className="text-gray-600">
              Complete the adoption process and welcome your new family member home. We provide support every step of the way.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-orange-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl mb-4 text-gray-900">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            Every adoption saves a life. Whether you're looking to adopt, volunteer, or donate, your support helps us continue our mission.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/companions">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                Start Your Search
              </Button>
            </Link>
            <Link to="/volunteer">
              <Button size="lg" variant="outline">
                Become a Volunteer
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
