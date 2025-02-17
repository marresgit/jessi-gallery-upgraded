'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { FiMoon, FiSun } from 'react-icons/fi';

const Navbar = () => {
  const [activeSection, setActiveSection] = useState('home');
  const pathname = usePathname();
  const { isDarkMode, toggleDarkMode } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'contact'];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    if (pathname === '/') {
      window.addEventListener('scroll', handleScroll);
      handleScroll(); // Check initial position
      return () => window.removeEventListener('scroll', handleScroll);
    } else {
      setActiveSection(''); // Reset active section on other pages
    }
  }, [pathname]);

  const isHomePage = pathname === '/';
  const isGalleryPage = pathname.startsWith('/gallery');

  const linkClasses = (isActive: boolean) => `
    font-thin text-sm transition-all px-3 py-1.5 rounded-md
    ${isActive 
      ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800' 
      : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
    }
  `;

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="h-14 flex items-center">
          {/* Center container for navigation */}
          <div className="w-full flex items-center justify-center space-x-6">
            {/* Art link */}
            {isHomePage ? (
              <a href="#home" className={linkClasses(activeSection === 'home')}>
                Art
              </a>
            ) : (
              <Link href="/#home" className={linkClasses(false)}>
                Art
              </Link>
            )}

            {/* About link */}
            {isHomePage ? (
              <a href="#about" className={linkClasses(activeSection === 'about')}>
                About
              </a>
            ) : (
              <Link href="/#about" className={linkClasses(false)}>
                About
              </Link>
            )}

            {/* Logo/Home button */}
            <Link 
              href="/" 
              className="text-xl font-thin text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400"
            >
              {process.env.NEXT_PUBLIC_ARTIST_NAME}
            </Link>

            {/* Gallery link */}
            <Link
              href="/gallery"
              className={linkClasses(isGalleryPage)}
            >
              Gallery
            </Link>

            {/* Contact link */}
            {isHomePage ? (
              <a href="#contact" className={linkClasses(activeSection === 'contact')}>
                Contact
              </a>
            ) : (
              <Link href="/#contact" className={linkClasses(false)}>
                Contact
              </Link>
            )}
          </div>

          {/* Dark mode toggle - absolutely positioned on the right */}
          <button
            onClick={toggleDarkMode}
            className="absolute right-4 sm:right-6 lg:right-8 top-1/2 -translate-y-1/2 p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 