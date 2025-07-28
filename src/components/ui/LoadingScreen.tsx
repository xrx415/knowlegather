import { BookOpen } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center">
        <div className="rounded-full bg-primary-100 p-4 mb-4 animate-pulse">
          <BookOpen className="h-12 w-12 text-primary-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Knowlegathor</h1>
        <div className="mt-4 flex space-x-2">
          <div className="h-2 w-2 rounded-full bg-primary-400 animate-pulse"></div>
          <div className="h-2 w-2 rounded-full bg-primary-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="h-2 w-2 rounded-full bg-primary-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;