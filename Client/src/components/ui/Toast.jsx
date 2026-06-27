import { createContext, useContext, useState, useCallback } from 'react';
 
const ToastContext = createContext();
 
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
 
  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);
 
  const styles = {
    success: 'bg-gray-900 text-white',
    error:   'bg-red-600 text-white',
    info:    'bg-blue-600 text-white',
  };
 
  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`${styles[toast.type]} px-4 py-3 rounded-lg shadow-lg
                        text-sm max-w-xs animate-fade-in`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
 
export const useToast = () => useContext(ToastContext);