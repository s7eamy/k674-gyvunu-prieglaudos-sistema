import { useState, useMemo, useEffect } from 'react';
import { getAll } from '../services/animalService';
import { mockAnimals } from '../data/animals';
import { AnimalCard } from '../components/AnimalCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import type { Animal } from '../types/Animal';

export function Companions() {
  const [animals, setAnimals] = useState<Animal[]>(mockAnimals);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sizeFilter, setSizeFilter] = useState<string>('all');
  const [temperamentFilter, setTemperamentFilter] = useState<string>('all');
  const [vaccinatedFilter, setVaccinatedFilter] = useState<string>('all');
  const [adoptionFilter, setAdoptionFilter] = useState<string>('available');

  // Fetch animals from backend on mount
  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const backendAnimals = await getAll();
        setAnimals(backendAnimals);
      } catch (error) {
        console.log('Using mock animals as fallback');
        setAnimals(mockAnimals);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimals();
  }, []);

  const filteredAnimals = useMemo(() => {
    return animals.filter((animal) => {
      if (typeFilter !== 'all' && animal.type.toLowerCase() !== typeFilter) return false;
      if (sizeFilter !== 'all' && animal.size !== sizeFilter) return false;
      if (temperamentFilter !== 'all' && animal.temperament !== temperamentFilter) return false;
      if (vaccinatedFilter !== 'all' && animal.vaccinated !== (vaccinatedFilter === 'yes')) return false;
      if (adoptionFilter === 'available' && animal.adopted) return false;
      if (adoptionFilter === 'adopted' && !animal.adopted) return false;
      return true;
    });
  }, [animals, typeFilter, sizeFilter, temperamentFilter, vaccinatedFilter, adoptionFilter]);

  const handleClearFilters = () => {
    setTypeFilter('all');
    setSizeFilter('all');
    setTemperamentFilter('all');
    setVaccinatedFilter('all');
    setAdoptionFilter('available');
  };

  const activeFilterCount = [typeFilter, sizeFilter, temperamentFilter, vaccinatedFilter].filter(
    (filter) => filter !== 'all'
  ).length;

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading companions...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl mb-2 text-gray-900">Find Your Companion</h1>
          <p className="text-lg text-gray-600">
            Browse our available animals and find your perfect match
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg text-gray-900">Filters</h2>
            {activeFilterCount > 0 && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{activeFilterCount} active</Badge>
                <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                  Clear All
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="dog">Dog</SelectItem>
                  <SelectItem value="cat">Cat</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="size">Size</Label>
              <Select value={sizeFilter} onValueChange={setSizeFilter}>
                <SelectTrigger id="size">
                  <SelectValue placeholder="All sizes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sizes</SelectItem>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="temperament">Temperament</Label>
              <Select value={temperamentFilter} onValueChange={setTemperamentFilter}>
                <SelectTrigger id="temperament">
                  <SelectValue placeholder="All temperaments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Temperaments</SelectItem>
                  <SelectItem value="calm">Calm</SelectItem>
                  <SelectItem value="energetic">Energetic</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vaccinated">Vaccinated</Label>
              <Select value={vaccinatedFilter} onValueChange={setVaccinatedFilter}>
                <SelectTrigger id="vaccinated">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="yes">Vaccinated</SelectItem>
                  <SelectItem value="no">Not Vaccinated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="adoption">Status</Label>
              <Select value={adoptionFilter} onValueChange={setAdoptionFilter}>
                <SelectTrigger id="adoption">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="adopted">Adopted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing {filteredAnimals.length} {filteredAnimals.length === 1 ? 'companion' : 'companions'}
          </p>
        </div>

        {/* Animal Grid */}
        {filteredAnimals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAnimals.map((animal) => (
              <AnimalCard key={animal.id} animal={animal} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-4">
              No companions match your current filters
            </p>
            <Button onClick={handleClearFilters}>Clear Filters</Button>
          </div>
        )}
      </div>
    </div>
  );
}
