import type { Animal } from '../types/Animal';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { CheckCircle2, XCircle, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router';

interface AnimalCardProps {
  animal: Animal;
}

export function AnimalCard({ animal }: AnimalCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img 
          src={animal.imageUrl} 
          alt={animal.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{animal.name}</CardTitle>
            <p className="text-sm text-gray-600">{animal.breed}</p>
          </div>
          <Badge variant={animal.adopted ? "secondary" : "default"}>
            {animal.adopted ? 'Adopted' : 'Available'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-2">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="capitalize">{animal.type}</Badge>
          <Badge variant="outline" className="capitalize">{animal.size}</Badge>
          <Badge variant="outline" className="capitalize">{animal.temperament}</Badge>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Calendar className="size-4" />
            <span>{animal.age} {animal.age === 1 ? 'year' : 'years'}</span>
          </div>
          <div className="flex items-center gap-1">
            {animal.vaccinated ? (
              <>
                <CheckCircle2 className="size-4 text-green-600" />
                <span>Vaccinated</span>
              </>
            ) : (
              <>
                <XCircle className="size-4 text-red-600" />
                <span>Not Vaccinated</span>
              </>
            )}
          </div>
        </div>
        
        <p className="text-sm text-gray-700 line-clamp-2">{animal.description}</p>
      </CardContent>
      
      <CardFooter>
        <Button 
          className="w-full" 
          disabled={animal.adopted}
          onClick={() => navigate(`/companions/${animal.id}`)}
        >
          {animal.adopted ? 'Already Adopted' : 'Learn More'}
        </Button>
      </CardFooter>
    </Card>
  );
}