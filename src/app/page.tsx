'use client';

import ContactForm from '@/components/ContactForm';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface GalleryImage {
  id: string;
  name: string;
  url: string;
}

export default function Home() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  useEffect(() => {
    async function fetchImages() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/images', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          cache: 'no-store'
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(
            errorData?.error || `HTTP error! status: ${response.status}`
          );
        }

        const data = await response.json();
        
        if (!Array.isArray(data)) {
          console.error('Invalid data format:', data);
          throw new Error('Invalid data format received from server');
        }

        setImages(data);
      } catch (err) {
        console.error('Error fetching images:', err);
        setError(
          err instanceof Error 
            ? err.message 
            : 'An unexpected error occurred while loading images'
        );
        setImages([]);
      } finally {
        setLoading(false);
      }
    }

    fetchImages();
  }, []);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 350; // Slightly more than image width + gap
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="flex flex-col">
      {/* Home Section */}
      <section id="home" className="min-h-screen flex flex-col bg-white dark:bg-gray-900 pt-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-32">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-thin mb-4 text-gray-900 dark:text-white">
            Tranquility on Canvas: Where Serenity Meets Art
          </h1>
          <h2 className="text-base sm:text-lg md:text-xl font-thin text-gray-800 dark:text-gray-200">
            Made by {process.env.NEXT_PUBLIC_ARTIST_NAME}
          </h2>
        </div>

        {/* Horizontal Scrollable Gallery */}
        <div className="w-full relative">
          {error && (
            <div className="max-w-[90%] mx-auto mb-4 px-4 py-3 bg-red-50 dark:bg-red-900/50 text-red-700 dark:text-red-200 rounded-md">
              {error}
            </div>
          )}
          
          {loading ? (
            <div className="max-w-[90%] mx-auto">
              <div className="flex space-x-8 pb-4 px-4">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="flex-none">
                    <div className="relative w-[300px] h-[450px] bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {showLeftButton && (
                <button
                  onClick={() => scroll('left')}
                  className="absolute left-8 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 p-2 rounded-full shadow-lg transition-all"
                  aria-label="Scroll left"
                >
                  <FiChevronLeft size={24} className="text-gray-800 dark:text-gray-200" />
                </button>
              )}
              {showRightButton && (
                <button
                  onClick={() => scroll('right')}
                  className="absolute right-8 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 p-2 rounded-full shadow-lg transition-all"
                  aria-label="Scroll right"
                >
                  <FiChevronRight size={24} className="text-gray-800 dark:text-gray-200" />
                </button>
              )}
              <div 
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="max-w-[90%] mx-auto overflow-x-auto scrollbar-hide"
              >
                <div className="flex space-x-8 pb-4 px-4">
                  {images.map((image) => (
                    <Link key={image.id} href={`/gallery/${image.id}`} className="flex-none group">
                      <div className="relative w-[300px] h-[450px] overflow-hidden rounded-lg 
                        shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.07)]
                        group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] dark:group-hover:shadow-[0_20px_40px_rgba(255,255,255,0.1)]
                        group-hover:-translate-y-1
                        transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <Image
                          src={image.url}
                          alt={image.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-3xl sm:text-4xl font-thin mb-8 text-center text-gray-900 dark:text-white">
            About
          </h2>
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 font-thin">
              Welcome to my artistic journey. I am {process.env.NEXT_PUBLIC_ARTIST_NAME}, an artist dedicated to capturing
              the essence of tranquility through my work. My pieces reflect the serene moments in
              life, translated onto canvas with careful attention to detail and emotion.
            </p>
            <p className="text-gray-800 dark:text-gray-200">
              Each artwork is a unique exploration of peace and harmony, created to bring a sense
              of calm and reflection to any space. Through my art, I aim to create windows into
              moments of pure serenity, allowing viewers to find their own peaceful connection
              with each piece.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: 'url("/contact-bg.jpg")' }}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
