import { useState } from 'react';

interface CounterProps {
  initialValue?: number;
  step?: number;
  label?: string;
}

const Counter = ({ initialValue = 0, step = 1, label = 'Kliknięć' }: CounterProps) => {
  const [count, setCount] = useState(initialValue);

  return (
    <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg p-4 my-4">
      <button
        onClick={() => setCount(count - step)}
        className="w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 text-white font-bold text-xl transition-colors"
      >
        −
      </button>
      <div className="text-center">
        <div className="text-3xl font-bold text-purple-700">{count}</div>
        <div className="text-sm text-gray-600">{label}</div>
      </div>
      <button
        onClick={() => setCount(count + step)}
        className="w-10 h-10 rounded-full bg-green-500 hover:bg-green-600 text-white font-bold text-xl transition-colors"
      >
        +
      </button>
    </div>
  );
};

export default Counter;
