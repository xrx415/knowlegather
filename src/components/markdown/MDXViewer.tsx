import { useEffect, useState } from 'react';
import { evaluate } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import { MDXProvider } from '@mdx-js/react';
import remarkGfm from 'remark-gfm';

interface MDXViewerProps {
  content: string;
  components?: Record<string, React.ComponentType<any>>;
}

/**
 * MDXViewer - Dynamiczny renderer dla MDX contentu
 * 
 * Alternatywa dla react-markdown z możliwością używania React komponentów
 * bezpośrednio w markdown (tzw. "Klocki").
 * 
 * @example
 * ```tsx
 * <MDXViewer 
 *   content="# Hello\n<CustomButton />" 
 *   components={{ CustomButton: MyButton }}
 * />
 * ```
 */
const MDXViewer = ({ content, components = {} }: MDXViewerProps) => {
  const [MDXContent, setMDXContent] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const compileMDX = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Kompilacja MDX do React komponentu
        const { default: Content } = await evaluate(content, {
          ...runtime,
          remarkPlugins: [remarkGfm],
          development: false,
        });
        
        // Wrapper który przekazuje komponenty jako props
        const WrappedContent = () => <Content components={components} />;
        setMDXContent(() => WrappedContent);
      } catch (err: any) {
        console.error('MDX compilation error:', err);
        setError(err.message || 'Nie udało się skompilować MDX');
      } finally {
        setIsLoading(false);
      }
    };

    compileMDX();
  }, [content, components]);

  if (isLoading) {
    return (
      <div className="prose prose-sm max-w-none animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-error-50 border border-error-200 rounded text-error-700">
        <strong>Błąd kompilacji MDX:</strong>
        <pre className="mt-2 text-xs overflow-x-auto">{error}</pre>
        <details className="mt-2">
          <summary className="cursor-pointer text-sm font-medium">Pokaż surowy content</summary>
          <pre className="mt-2 text-xs bg-white p-2 rounded border border-error-200 overflow-x-auto">
            {content}
          </pre>
        </details>
      </div>
    );
  }

  if (!MDXContent) {
    return (
      <div className="prose prose-sm max-w-none text-gray-500 italic">
        Brak zawartości do wyświetlenia
      </div>
    );
  }

  return (
    <MDXProvider components={components}>
      <div className="prose prose-sm max-w-none">
        <MDXContent />
      </div>
    </MDXProvider>
  );
};

export default MDXViewer;
