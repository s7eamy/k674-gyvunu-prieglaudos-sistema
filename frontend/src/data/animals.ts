import type { Animal } from '../types/Animal';

export const mockAnimals: Animal[] = [
  {
    id: 1,
    name: "Max",
    type: "Dog",
    breed: "Golden Retriever",
    size: "large",
    age: 3,
    vaccinated: true,
    temperament: "friendly",
    description: "Max is a loving and gentle Golden Retriever who adores children and other pets. He's well-trained and loves to play fetch.",
    adopted: false,
    created_at: new Date('2024-01-15'),
    imageUrl: "https://images.unsplash.com/photo-1734966213753-1b361564bab4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjByZXRyaWV2ZXIlMjBkb2d8ZW58MXx8fHwxNzcyNDQxNTY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: 2,
    name: "Whiskers",
    type: "Cat",
    breed: "Tabby",
    size: "small",
    age: 2,
    vaccinated: true,
    temperament: "calm",
    description: "Whiskers is a sweet and quiet tabby cat who enjoys lounging in sunny spots and gentle petting sessions.",
    adopted: false,
    created_at: new Date('2024-02-20'),
    imageUrl: "https://images.unsplash.com/photo-1670739088209-64414249354b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWJieSUyMGNhdCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MjQ4OTczMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: 3,
    name: "Buddy",
    type: "Dog",
    breed: "Beagle",
    size: "medium",
    age: 1,
    vaccinated: true,
    temperament: "energetic",
    description: "Buddy is a playful Beagle puppy with lots of energy! He loves going on adventures and making new friends.",
    adopted: false,
    created_at: new Date('2024-03-10'),
    imageUrl: "https://images.unsplash.com/photo-1647097298829-e41dd4d8f92f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFnbGUlMjBkb2clMjBwdXBweXxlbnwxfHx8fDE3NzI0Njk3MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: 4,
    name: "Fluffy",
    type: "Cat",
    breed: "Persian",
    size: "medium",
    age: 4,
    vaccinated: true,
    temperament: "calm",
    description: "Fluffy is a beautiful Persian cat with a luxurious coat. She's independent but loves attention on her own terms.",
    adopted: true,
    created_at: new Date('2023-12-05'),
    imageUrl: "https://images.unsplash.com/photo-1599907370836-939f2d59b897?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzaWFuJTIwY2F0JTIwZmx1ZmZ5fGVufDF8fHx8MTc3MjQ4NjY3Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: 5,
    name: "Rex",
    type: "Dog",
    breed: "German Shepherd",
    size: "large",
    age: 5,
    vaccinated: true,
    temperament: "friendly",
    description: "Rex is a loyal and intelligent German Shepherd. He's great with families and has excellent obedience training.",
    adopted: false,
    created_at: new Date('2024-01-25'),
    imageUrl: "https://images.unsplash.com/photo-1605725657590-b2cf0d31b1a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnZXJtYW4lMjBzaGVwaGVyZCUyMGRvZ3xlbnwxfHx8fDE3NzI0MTg0ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: 6,
    name: "Luna",
    type: "Cat",
    breed: "Siamese",
    size: "small",
    age: 1,
    vaccinated: true,
    temperament: "energetic",
    description: "Luna is a stunning Siamese kitten with bright blue eyes. She's playful, vocal, and loves interactive toys.",
    adopted: false,
    created_at: new Date('2024-02-28'),
    imageUrl: "https://images.unsplash.com/photo-1636898057788-62419a43964c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWFtZXNlJTIwY2F0JTIwYmx1ZSUyMGV5ZXN8ZW58MXx8fHwxNzcyNTA5NTczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: 7,
    name: "Shadow",
    type: "Dog",
    breed: "Labrador Retriever",
    size: "large",
    age: 6,
    vaccinated: true,
    temperament: "calm",
    description: "Shadow is a mature and mellow Black Lab. He's the perfect companion for relaxed walks and quiet evenings at home.",
    adopted: false,
    created_at: new Date('2023-11-10'),
    imageUrl: "https://images.unsplash.com/photo-1611224753578-421fb912f1ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYWJyYWRvciUyMHJldHJpZXZlciUyMGJsYWNrfGVufDF8fHx8MTc3MjU0Mjg0MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  }
];

// Mapping to assign mock images to backend animals that don't have images
const mockImagePool = mockAnimals.map(a => a.imageUrl).filter((url): url is string => !!url);

export function getImageForAnimal(animal: Animal, index: number): string {
  if (animal.imageUrl) {
    return animal.imageUrl;
  }
  // Cycle through mock images based on animal index
  return mockImagePool[index % mockImagePool.length];
}
