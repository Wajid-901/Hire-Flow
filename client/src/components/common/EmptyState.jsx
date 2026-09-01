import Button from "./Button";

const EmptyState = ({ 
  icon = "📭", 
  title = "No data available", 
  description = "Get started by adding your first item",
  actionLabel,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {/* Icon */}
      <div className="text-6xl mb-6 animate-bounce">
        {icon}
      </div>

      {/* Content */}
      <h3 className="text-xl font-bold text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-neutral-400 max-w-md mb-8">
        {description}
      </p>

      {/* Action Button */}
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
