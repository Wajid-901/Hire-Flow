const PageContainer = ({ children, className = "" }) => {
  return (
    <div className={`mx-auto w-full max-w-7xl space-y-6 ${className}`.trim()}>
      {children}
    </div>
  );
};

export default PageContainer;