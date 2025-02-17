'use client';

import { useState } from 'react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission logic
    console.log('Form submitted:', formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm max-w-lg mx-auto w-full">
      <h2 className="text-2xl font-medium text-gray-600 dark:text-gray-300 mb-6 text-center">Frågor eller funderingar</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="name"
            className="block text-sm mb-1.5 text-gray-500 dark:text-gray-400"
          >
            Namn
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:border-gray-300 dark:focus:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
          />
        </div>

        <div>
          <label
            htmlFor="subject"
            className="block text-sm mb-1.5 text-gray-500 dark:text-gray-400"
          >
            Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            required
            value={formData.subject}
            onChange={handleChange}
            className="w-full px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:border-gray-300 dark:focus:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm mb-1.5 text-gray-500 dark:text-gray-400"
          >
            Meddelande
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            value={formData.message}
            onChange={handleChange}
            className="w-full px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:border-gray-300 dark:focus:border-gray-600 dark:bg-gray-800 dark:text-gray-200 resize-none"
          />
        </div>

        <div className="flex justify-center pt-2">
          <button
            type="submit"
            className="px-8 py-2 bg-[#E67E22] hover:bg-[#D35400] text-white text-lg font-thin rounded-md transition-colors"
          >
            Skicka
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm; 