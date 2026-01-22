interface AlertBoxProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: React.ReactNode;
}

const AlertBox = ({ type = 'info', title, children }: AlertBoxProps) => {
  const colors = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800',
  };

  const icons = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌',
  };

  return (
    <div className={`p-4 rounded-lg border-2 ${colors[type]} my-4`}>
      <div className="flex items-start gap-3">
        <span className="text-2xl">{icons[type]}</span>
        <div className="flex-1">
          {title && <h4 className="font-bold mb-2">{title}</h4>}
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AlertBox;
