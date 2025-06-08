import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';  // Thay đổi import
import { checkIsLoggedIn } from '../../utils/auth';

interface TopBarProps {
  className?: string;
}

export default function TopBar({ className = '' }: TopBarProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(checkIsLoggedIn());
  }, []);

  return (
    <div className={`bg-[#7bb12b] text-white text-xs flex justify-between items-center px-6 py-1 ${className}`}>
      <span>Welcome To Our Pet Store</span>
      <div className="flex items-center gap-2">
        <span className="mr-4">Currency: $USD</span>
        <span>|</span>
        {isLoggedIn ? (
          <span className="ml-2">A<sup>+</sup></span>
        ) : (
          <span className="ml-2">Acc</span>
        )}
      </div>
    </div>
  );
}
