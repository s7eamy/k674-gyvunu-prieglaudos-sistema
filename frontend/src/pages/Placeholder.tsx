interface PlaceholderProps {
  title: string;
}

export function Placeholder({ title }: PlaceholderProps) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl mb-4 text-gray-900">{title}</h1>
        <p className="text-lg text-gray-600">This page is coming soon...</p>
      </div>
    </div>
  );
}
