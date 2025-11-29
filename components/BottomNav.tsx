import React from 'react';
// FIX: Corrected import from 'react-router-dom' instead of 'react-outer-dom'
import { NavLink } from 'react-router-dom';
import { HomeIcon, ClockIcon, BellIcon, UserCircleIcon } from './icons/Icons';
import { useAppContext } from '../contexts/AppContext';

const BottomNav: React.FC = () => {
  const { getUnreadAlertsCount } = useAppContext();
  const unreadCount = getUnreadAlertsCount();

  const navItems = [
    { path: '/', label: 'Home', icon: HomeIcon },
    { path: '/history', label: 'History', icon: ClockIcon },
    { path: '/alerts', label: 'Alerts', icon: BellIcon, badge: unreadCount },
    { path: '/profile', label: 'Profile', icon: UserCircleIcon },
  ];
  
  const activeLinkClass = 'text-blue-500';
  const inactiveLinkClass = 'text-gray-400 dark:text-gray-500';

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 shadow-t-lg">
      <div className="flex justify-around items-center h-16">
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex flex-col items-center justify-center w-full text-xs transition-colors duration-200 ${isActive ? activeLinkClass : inactiveLinkClass} hover:text-blue-500`
            }
          >
            <div className="relative">
              <item.icon className="w-6 h-6 mb-1" />
              {item.badge > 0 && (
                <span className="absolute -top-1 -right-2 flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
                  {item.badge}
                </span>
              )}
            </div>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;