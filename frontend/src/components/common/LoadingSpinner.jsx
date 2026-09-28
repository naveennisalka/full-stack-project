const LoadingSpinner = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex justify-center items-center p-4">
      <div className={`${sizes[size]} rounded-full border-gray-200 border-t-primary-600 animate-spin`}></div>
    </div>
  );
};

export default LoadingSpinner;
