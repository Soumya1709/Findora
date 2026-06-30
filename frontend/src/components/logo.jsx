const Logo = ({ className = "" }) => {
  return (
    <span className={`font-bold text-xl tracking-tight ${className}`}>
      <span className="text-gray-900">Find</span>
      <span className="text-blue-500">ora</span>
    </span>
  );
};

export default Logo;