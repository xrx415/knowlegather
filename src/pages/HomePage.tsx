import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, FileText, BrainCircuit, Tags } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import Button from '../components/ui/Button';

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  
  useEffect(() => {
    // Only redirect if user didn't intentionally navigate to homepage
    // Check if there's a 'stay' parameter or if user came from navigation
    const searchParams = new URLSearchParams(location.search);
    const shouldStay = searchParams.get('stay') === 'true';
    
    if (user && !shouldStay) {
      navigate('/collections');
    }
  }, [user, navigate, location.search]);
  
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Hero section */}
      <section className="bg-gradient-to-br from-primary-700 to-primary-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Gromadź, Organizuj i Transformuj Wiedzę
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-100">
            Knowlegathor to narzędzie stworzone dla programistów i studentów, 
            które pozwala na efektywne gromadzenie i organizowanie wiedzy z różnych źródeł internetowych.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="accent"
              onClick={() => navigate('/register')}
            >
              Rozpocznij za darmo
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              onClick={() => {
                const featuresSection = document.getElementById('features');
                featuresSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Dowiedz się więcej
            </Button>
          </div>
        </div>
      </section>
      
      {/* Features section */}
      <section id="features" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Kluczowe funkcjonalności
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card flex flex-col items-center text-center p-6">
              <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Gromadzenie Wiedzy
              </h3>
              <p className="text-gray-600">
                Łatwe pobieranie treści ze stron internetowych z automatycznym czyszczeniem formatowania
              </p>
            </div>
            
            <div className="card flex flex-col items-center text-center p-6">
              <div className="h-12 w-12 rounded-full bg-secondary-100 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-secondary-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Notatki Użytkownika
              </h3>
              <p className="text-gray-600">
                Tworzenie i edytowanie własnych notatek powiązanych z zasobami
              </p>
            </div>
            
            <div className="card flex flex-col items-center text-center p-6">
              <div className="h-12 w-12 rounded-full bg-accent-100 flex items-center justify-center mb-4">
                <Tags className="h-6 w-6 text-accent-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                System Tagowania
              </h3>
              <p className="text-gray-600">
                Organizowanie wiedzy w logiczne kolekcje z rozbudowanym systemem tagowania
              </p>
            </div>
            
            <div className="card flex flex-col items-center text-center p-6">
              <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                <BrainCircuit className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Asystent AI
              </h3>
              <p className="text-gray-600">
                Wykorzystanie sztucznej inteligencji do podsumowywania treści i udzielania odpowiedzi
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">
            Gotów do uporządkowania swojej wiedzy?
          </h2>
          <p className="text-xl mb-8 text-gray-600">
            Dołącz już dziś i odkryj, jak Knowlegathor może usprawnić Twój proces nauki i rozwoju.
          </p>
          <Button
            size="lg"
            variant="primary"
            onClick={() => navigate('/register')}
          >
            Rozpocznij za darmo
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;