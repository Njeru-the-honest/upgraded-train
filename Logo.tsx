import React from "react";
import logoImage from "../assets/gofoods-logo.png";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const Logo: React.FC<LogoProps> = ({ className = "", size = "md" }) => {
  const sizeClasses = {
    sm: "h-8",
    md: "h-10",
    lg: "h-16",
  };

  return (
    <img
      src={logoImage}
      alt="GoFoods Logo"
      className={`${sizeClasses[size]} w-auto object-contain ${className}`}
    />
  );
};

export default Logo;
