const Input = ({
  label,
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  icon,
  error,
  className = "",
  ...props
}) => {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-white mb-2">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
            {icon}
          </div>
        )}
        
        <input
          type={type}
          id={name}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`w-full ${icon ? 'pl-11' : 'pl-4'} pr-4 py-3 rounded-xl bg-zinc-900 border ${
            error ? 'border-red-500' : 'border-zinc-800'
          } text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
          {...props}
        />
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
};

export default Input;
