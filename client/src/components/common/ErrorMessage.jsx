import { BsExclamationTriangle } from 'react-icons/bs';

const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3">
      <BsExclamationTriangle className="text-red-500 flex-shrink-0 mt-0.5" />
      <p className="text-red-400 text-sm">{message}</p>
    </div>
  );
};

export default ErrorMessage;
