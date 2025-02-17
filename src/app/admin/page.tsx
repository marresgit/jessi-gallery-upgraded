'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { uploadImageAction } from '../actions';
import { useRouter } from 'next/navigation';

interface ImageData {
  id: string;
  name: string;
  description: string;
  tags: string[];
  url: string;
}

interface UploadForm {
  name: string;
  description: string;
  tags: string[];
  file: File | null;
  preview: string;
}

export default function Admin() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    tags: [] as string[],
  });
  const [uploadForm, setUploadForm] = useState<UploadForm>({
    name: '',
    description: '',
    tags: [],
    file: null,
    preview: '',
  });
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [editTagInput, setEditTagInput] = useState('');
  const router = useRouter();

  // Clean up preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (uploadForm.preview) {
        URL.revokeObjectURL(uploadForm.preview);
      }
    };
  }, [uploadForm.preview]);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/images');
      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }
      const data = await response.json();
      setImages(data);
    } catch (err) {
      setError('Failed to load images');
      console.error('Error fetching images:', err);
    } finally {
      setLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setUploadForm(prev => ({
          ...prev,
          file,
          preview: URL.createObjectURL(file),
          name: file.name.split('.')[0], // Set default name as file name
        }));
        setShowUploadForm(true);
      }
    },
  });

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.file || !uploadForm.name || !uploadForm.description || !uploadForm.tags.length) {
      setError('Please fill in all fields');
      return;
    }

    setUploading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', uploadForm.file);
      
      const url = await uploadImageAction(formData);
      const response = await fetch('/api/images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: uploadForm.name,
          description: uploadForm.description,
          tags: uploadForm.tags,
          url,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create image record');
      }

      // Reset form and close modal
      setUploadForm({
        name: '',
        description: '',
        tags: [],
        file: null,
        preview: '',
      });
      setTagInput('');
      setShowUploadForm(false);
      fetchImages();
    } catch (err) {
      console.error('Error uploading image:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        const response = await fetch(`/api/images/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete image');
        }

        setImages((prev) => prev.filter((img) => img.id !== id));
      } catch (err) {
        console.error('Error deleting image:', err);
        setError('Failed to delete image');
      }
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage) return;

    try {
      const response = await fetch(`/api/images/${selectedImage.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        throw new Error('Failed to update image');
      }

      const updatedImage = await response.json();
      setImages((prev) =>
        prev.map((img) =>
          img.id === updatedImage.id ? updatedImage : img
        )
      );
      setSelectedImage(null);
      setEditTagInput('');
    } catch (err) {
      console.error('Error updating image:', err);
      setError('Failed to update image');
    }
  };

  const handleTagsChange = (value: string, formType: 'upload' | 'edit') => {
    if (formType === 'upload') {
      setTagInput(value);
      const tagsArray = value.split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '');
      setUploadForm(prev => ({ ...prev, tags: tagsArray }));
    } else {
      setEditTagInput(value);
      const tagsArray = value.split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '');
      setEditForm(prev => ({ ...prev, tags: tagsArray }));
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="h-32 bg-gray-200 rounded mb-12"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-square bg-gray-200 rounded-lg"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-thin mb-8 text-gray-900">Admin Dashboard</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-8">
          {error}
        </div>
      )}

      {/* Upload Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-thin mb-4 text-gray-900">Upload Images</h2>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-gray-400 bg-gray-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          <p className="text-gray-700 font-thin">
            {uploading
              ? 'Uploading...'
              : isDragActive
              ? 'Drop the image here...'
              : 'Drag & drop an image here, or click to select'}
          </p>
        </div>
      </div>

      {/* Image Management Section */}
      <div>
        <h2 className="text-2xl font-thin mb-4 text-gray-900">Manage Images</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((image) => (
            <div
              key={image.id}
              className="border rounded-lg overflow-hidden"
            >
              <div className="relative aspect-square">
                <Image
                  src={image.url}
                  alt={image.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-thin text-lg mb-2 text-gray-800 dark:text-gray-200">{image.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-3 font-thin">
                  {image.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {image.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full text-sm font-thin"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedImage(image);
                      setEditForm({
                        name: image.name,
                        description: image.description,
                        tags: image.tags,
                      });
                      setEditTagInput(image.tags.join(', '));
                    }}
                    className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-thin"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteImage(image.id)}
                    className="flex-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-3 py-1 rounded hover:bg-red-200 dark:hover:bg-red-800 transition-colors font-thin"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Form Modal */}
      {showUploadForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full">
            <h2 className="text-2xl font-thin mb-4 text-gray-900 dark:text-white">Upload Image</h2>
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {uploadForm.preview && (
                <div className="relative aspect-square w-full mb-4">
                  <Image
                    src={uploadForm.preview}
                    alt="Preview"
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-thin text-gray-800 dark:text-gray-200 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={uploadForm.name}
                  onChange={(e) =>
                    setUploadForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-3 py-2 border rounded-md text-gray-800 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-thin text-gray-800 dark:text-gray-200 mb-1">
                  Description *
                </label>
                <textarea
                  value={uploadForm.description}
                  onChange={(e) =>
                    setUploadForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                  className="w-full px-3 py-2 border rounded-md text-gray-800 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-thin text-gray-800 dark:text-gray-200 mb-1">
                  Tags * (separate with commas)
                </label>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => handleTagsChange(e.target.value, 'upload')}
                  className="w-full px-3 py-2 border rounded-md text-gray-800 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600"
                  placeholder="landscape, nature, abstract"
                  required
                />
                {/* Display current tags */}
                <div className="mt-2 flex flex-wrap gap-2">
                  {uploadForm.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-2 py-1 rounded-full text-sm font-thin"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors font-thin disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadForm(false);
                    setUploadForm({
                      name: '',
                      description: '',
                      tags: [],
                      file: null,
                      preview: '',
                    });
                    setTagInput('');
                  }}
                  className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-thin"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full">
            <h2 className="text-2xl font-thin mb-4 text-gray-900 dark:text-white">Edit Image</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="relative aspect-square w-full mb-4">
                <Image
                  src={selectedImage.url}
                  alt={selectedImage.name}
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-thin text-gray-800 dark:text-gray-200 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-3 py-2 border rounded-md text-gray-800 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-thin text-gray-800 dark:text-gray-200 mb-1">
                  Description
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={4}
                  className="w-full px-3 py-2 border rounded-md text-gray-800 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-thin text-gray-800 dark:text-gray-200 mb-1">
                  Tags (separate with commas)
                </label>
                <input
                  type="text"
                  value={editTagInput}
                  onChange={(e) => handleTagsChange(e.target.value, 'edit')}
                  className="w-full px-3 py-2 border rounded-md text-gray-800 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600"
                  placeholder="landscape, nature, abstract"
                />
                {/* Display current tags */}
                <div className="mt-2 flex flex-wrap gap-2">
                  {editForm.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-2 py-1 rounded-full text-sm font-thin"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors font-thin"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-thin"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 