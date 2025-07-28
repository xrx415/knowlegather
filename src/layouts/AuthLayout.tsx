import { Outlet } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="rounded-full bg-primary-100 p-3 mb-4">
            <BookOpen className="h-8 w-8 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Knowlegathor</h1>
          <p className="text-gray-500 text-center mt-2">
            Twój osobisty asystent do gromadzenia i organizowania wiedzy
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 animate-fade-in">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;