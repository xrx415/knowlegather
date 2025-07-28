import { useState, useEffect, useRef } from 'react';
import { X, Copy, Trash2, AlertCircle, Info, CheckCircle } from 'lucide-react';
import Button from './Button';

interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'error' | 'warn' | 'debug';
  message: string;
  details?: any;
}

interface LogViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

const LogViewer = ({ isOpen, onClose }: LogViewerProps) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [autoScroll, setAutoScroll] = useState(true);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Override console methods to capture logs
  useEffect(() => {
    if (!isOpen) return;

    const originalConsole = {
      log: console.log,
      error: console.error,
      warn: console.warn,
      info: console.info,
      debug: console.debug
    };

    const addLog = (level: LogEntry['level'], ...args: any[]) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      
      const logEntry: LogEntry = {
        id: Date.now().toString(),
        timestamp: new Date(),
        level,
        message,
        details: args.length > 1 ? args : undefined
      };
      
      setLogs(prev => [...prev, logEntry]);
    };

    console.log = (...args) => {
      originalConsole.log(...args);
      addLog('info', ...args);
    };

    console.error = (...args) => {
      originalConsole.error(...args);
      addLog('error', ...args);
    };

    console.warn = (...args) => {
      originalConsole.warn(...args);
      addLog('warn', ...args);
    };

    console.info = (...args) => {
      originalConsole.info(...args);
      addLog('info', ...args);
    };

    console.debug = (...args) => {
      originalConsole.debug(...args);
      addLog('debug', ...args);
    };

    return () => {
      console.log = originalConsole.log;
      console.error = originalConsole.error;
      console.warn = originalConsole.warn;
      console.info = originalConsole.info;
      console.debug = originalConsole.debug;
    };
  }, [isOpen]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (autoScroll && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  const clearLogs = () => {
    setLogs([]);
  };

  const copyLogs = () => {
    const logText = logs.map(log => 
      `[${log.timestamp.toISOString()}] ${log.level.toUpperCase()}: ${log.message}`
    ).join('\n');
    
    navigator.clipboard.writeText(logText);
  };

  const getLevelIcon = (level: LogEntry['level']) => {
    switch (level) {
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'warn':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'debug':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getLevelColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warn':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'debug':
        return 'bg-green-50 border-green-200 text-green-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-3/4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Logi Aplikacji</h2>
          <div className="flex items-center space-x-2">
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={autoScroll}
                onChange={(e) => setAutoScroll(e.target.checked)}
                className="mr-2"
              />
              Auto-scroll
            </label>
            <Button
              variant="outline"
              size="sm"
              onClick={copyLogs}
              icon={<Copy size={16} />}
            >
              Kopiuj
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearLogs}
              icon={<Trash2 size={16} />}
            >
              Wyczyść
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              icon={<X size={16} />}
            >
              Zamknij
            </Button>
          </div>
        </div>

        {/* Logs */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {logs.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Brak logów. Spróbuj wykonać jakąś akcję w aplikacji.
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className={`border rounded-md p-3 ${getLevelColor(log.level)}`}
              >
                <div className="flex items-start space-x-2">
                  {getLevelIcon(log.level)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="font-mono text-xs opacity-75">
                        {log.timestamp.toLocaleTimeString()}
                      </span>
                      <span className="font-medium uppercase text-xs">
                        {log.level}
                      </span>
                    </div>
                    <p className="text-sm mt-1 break-words">{log.message}</p>
                    {log.details && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-xs opacity-75">
                          Szczegóły
                        </summary>
                        <pre className="mt-2 text-xs bg-black bg-opacity-10 p-2 rounded overflow-x-auto">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={logsEndRef} />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 text-sm text-gray-500">
          {logs.length} logów • Ostatnia aktualizacja: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default LogViewer; 