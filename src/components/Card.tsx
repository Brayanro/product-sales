interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`bg-white p-8 shadow-md rounded-lg ${className}`}>
      {children}
    </div>
  );
};