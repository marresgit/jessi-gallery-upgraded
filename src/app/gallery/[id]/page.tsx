'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
}

interface ImageData {
  id: string;
  name: string;
  description: string;
  tags: string[];
  url: string;
  comments: Comment[];
}

function GalleryItemContent({ 
  image, 
  isZoomed, 
  setIsZoomed, 
  newComment, 
  setNewComment,
  submittingComment,
  handleSubmitComment,
  handleDownload 
}: { 
  image: ImageData;
  isZoomed: boolean;
  setIsZoomed: (value: boolean) => void;
  newComment: string;
  setNewComment: (value: string) => void;
  submittingComment: boolean;
  handleSubmitComment: (e: React.FormEvent) => void;
  handleDownload: () => void;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div className="relative">
        <div
          className={`relative ${
            isZoomed ? 'fixed inset-0 z-50 flex items-center justify-center' : ''
          }`}
          onClick={() => setIsZoomed(!isZoomed)}
        >
          <div
            className={`relative ${
              isZoomed
                ? 'w-screen h-screen flex items-center justify-center'
                : 'aspect-square'
            }`}
          >
            <Image
              src={image.url}
              alt={image.name}
              fill={!isZoomed}
              width={isZoomed ? 1920 : undefined}
              height={isZoomed ? 1080 : undefined}
              className={`${
                isZoomed 
                  ? 'max-h-[95vh] max-w-[95vw] h-auto w-auto object-contain'
                  : 'object-cover rounded-lg'
              } cursor-pointer transition-transform duration-200`}
              priority
            />
          </div>
          {isZoomed && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomed(false);
              }}
              className="absolute top-4 right-4 text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 p-2 bg-white/10 backdrop-blur-sm rounded-full"
            >
              ✕
            </button>
          )}
        </div>
        {!isZoomed && (
          <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400 font-thin">
            Click image to zoom
          </div>
        )}
      </div>

      <div>
        <h1 className="text-4xl font-thin mb-4 text-gray-900 dark:text-white">{image.name}</h1>
        <div className="flex flex-wrap gap-2 mb-6">
          {image.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-full text-sm font-thin"
            >
              {tag}
            </span>
          ))}
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-8 font-thin">{image.description}</p>
        <button
          onClick={handleDownload}
          className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition-colors font-thin mb-12"
        >
          Download Image
        </button>

        <div>
          <h2 className="text-2xl font-thin mb-6 text-gray-900 dark:text-white">Comments</h2>
          <form onSubmit={handleSubmitComment} className="mb-8">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
              rows={3}
            />
            <button
              type="submit"
              disabled={submittingComment || !newComment.trim()}
              className="mt-2 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors font-thin disabled:opacity-50"
            >
              {submittingComment ? 'Posting...' : 'Post Comment'}
            </button>
          </form>

          <div className="space-y-4">
            {image.comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
              >
                <p className="text-gray-700 dark:text-gray-200 font-thin">{comment.content}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-thin mt-2">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
            {image.comments.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 font-thin">No comments yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GalleryItem({ params }: { params: { id: string } }) {
  const [image, setImage] = useState<ImageData | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function fetchImage() {
      if (!mounted) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/images/${params.id}`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.error || `Failed to fetch image: ${response.status}`);
        }
        
        const data = await response.json();
        if (!data || !data.id) {
          throw new Error('Invalid image data received');
        }
        
        if (mounted) {
          setImage(data);
        }
      } catch (err) {
        console.error('Error fetching image:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load image');
          setImage(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchImage();

    return () => {
      mounted = false;
    };
  }, [params.id]);

  const handleDownload = () => {
    if (image) {
      window.open(image.url, '_blank');
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !image) return;

    setSubmittingComment(true);
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment,
          imageId: image.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit comment');
      }

      const comment = await response.json();
      setImage((prev) => 
        prev ? {
          ...prev,
          comments: [...prev.comments, comment],
        } : null
      );
      setNewComment('');
    } catch (err) {
      console.error('Error submitting comment:', err);
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !image) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-200 px-4 py-3 rounded-md">
          {error || 'Image not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link
          href="/gallery"
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-thin"
        >
          ← Back to Gallery
        </Link>
      </div>

      <GalleryItemContent
        image={image}
        isZoomed={isZoomed}
        setIsZoomed={setIsZoomed}
        newComment={newComment}
        setNewComment={setNewComment}
        submittingComment={submittingComment}
        handleSubmitComment={handleSubmitComment}
        handleDownload={handleDownload}
      />
    </div>
  );
} 