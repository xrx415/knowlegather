import { useNavigate } from 'react-router-dom';
import { AlertCircle, ChevronLeft } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="rounded-full bg-error-100 p-4 inline-flex mb-6">
          <AlertCircle size={40} className="text-error-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Strona nie została znaleziona</h2>
        <p className="text-gray-600 mb-8">
          Przepraszamy, ale strona której szukasz nie istnieje lub została przeniesiona.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/')}
            icon={<ChevronLeft size={18} />}
          >
            Strona główna
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate(-1)}
          >
            Wróć do poprzedniej strony
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;