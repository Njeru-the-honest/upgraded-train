import React from "react";

interface SkeletonProps {
  variant?: "card" | "text" | "avatar" | "image";
  width?: string;
  height?: string;
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({
  variant = "text",
  width,
  height,
  className = "",
}) => {
  const baseClasses = "bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded";

  const variantClasses = {
    card: "w-full h-64 rounded-lg",
    text: "h-4 rounded",
    avatar: "w-12 h-12 rounded-full",
    image: "w-full h-48 rounded-lg",
  };

  const style = {
    width: width || undefined,
    height: height || undefined,
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
};

export default Skeleton;

// Skeleton variants for common use cases
export const RestaurantCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Skeleton variant="image" className="h-48" />
      <div className="p-4 space-y-3">
        <Skeleton width="60%" height="24px" />
        <Skeleton width="40%" height="16px" />
        <div className="flex justify-between items-center mt-4">
          <Skeleton width="80px" height="20px" />
          <Skeleton width="100px" height="20px" />
        </div>
      </div>
    </div>
  );
};

export const MenuItemCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Skeleton variant="image" className="h-40" />
      <div className="p-3 space-y-2">
        <Skeleton width="70%" height="20px" />
        <Skeleton width="90%" height="14px" />
        <Skeleton width="50%" height="14px" />
        <div className="flex justify-between items-center mt-3">
          <Skeleton width="60px" height="24px" />
          <Skeleton width="80px" height="36px" className="rounded-md" />
        </div>
      </div>
    </div>
  );
};
