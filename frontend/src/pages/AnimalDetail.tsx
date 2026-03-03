import { useParams, Link, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { getById } from '../services/animalService';
import { mockAnimals } from '../data/animals';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { CheckCircle2, XCircle, Calendar, ArrowLeft, Heart } from 'lucide-react';
import type { Animal } from '../types/Animal';

export function AnimalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnimal = async () => {
      try {
        if (id) {
          const backendAnimal = await getById(Number(id));
          setAnimal(backendAnimal);
        }
      } catch (error) {
        console.log('Using mock data as fallback');
        // Fall back to mock data
        if (id) {
          const mockAnimal = mockAnimals.find(a => a.id === Number(id));
          setAnimal(mockAnimal || null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAnimal();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!animal) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl mb-4 text-gray-900">Animal Not Found</h1>
          <p className="text-lg text-gray-600 mb-8">
            Sorry, we couldn't find the companion you're looking for.
          </p>
          <Link to="/companions">
            <Button>Back to Companions</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate('/companions')}
        >
          <ArrowLeft className="mr-2 size-4" />
          Back to Companions
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Image Section */}
          <div>
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 shadow-lg">
              <img 
                src={animal.imageUrl} 
                alt={animal.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Details Section */}
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-4xl mb-2 text-gray-900">{animal.name}</h1>
                <p className="text-xl text-gray-600">{animal.breed}</p>
              </div>
              <Badge 
                variant={animal.adopted ? "secondary" : "default"}
                className="text-lg px-4 py-2"
              >
                {animal.adopted ? 'Adopted' : 'Available'}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              <Badge variant="outline" className="text-base capitalize px-3 py-1">
                {animal.type}
              </Badge>
              <Badge variant="outline" className="text-base capitalize px-3 py-1">
                {animal.size}
              </Badge>
              <Badge variant="outline" className="text-base capitalize px-3 py-1">
                {animal.temperament}
              </Badge>
            </div>

            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="size-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Age</p>
                      <p className="text-lg text-gray-900">
                        {animal.age} {animal.age === 1 ? 'year' : 'years'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {animal.vaccinated ? (
                      <CheckCircle2 className="size-5 text-green-600" />
                    ) : (
                      <XCircle className="size-5 text-red-600" />
                    )}
                    <div>
                      <p className="text-sm text-gray-600">Vaccination</p>
                      <p className="text-lg text-gray-900">
                        {animal.vaccinated ? 'Up to date' : 'Not vaccinated'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mb-6">
              <h2 className="text-2xl mb-3 text-gray-900">About {animal.name}</h2>
              <p className="text-gray-700 leading-relaxed">{animal.description}</p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg mb-2 text-gray-900">Listed Since</h3>
              <p className="text-gray-600">
                {new Date(animal.created_at).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>

            <div className="flex gap-4">
              <Button 
                size="lg" 
                className="flex-1 bg-orange-500 hover:bg-orange-600"
                disabled={animal.adopted}
              >
                <Heart className="mr-2 size-5" />
                {animal.adopted ? 'Already Adopted' : 'Start Adoption Process'}
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/companions')}
              >
                Keep Browsing
              </Button>
            </div>

            {!animal.adopted && (
              <div className="mt-6 p-4 bg-orange-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Ready to adopt?</strong> Fill out our{' '}
                  <Link to="/questionnaire" className="text-orange-600 hover:underline">
                    questionnaire
                  </Link>{' '}
                  to get started with the adoption process.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
