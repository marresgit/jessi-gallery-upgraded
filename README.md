# Dynamic Art Gallery

A modern, responsive art gallery website built with Next.js 13+, featuring dynamic content management, dark mode support, and a beautiful UI for showcasing artwork.

## Features

- 🎨 Dynamic artist name and content through environment variables
- 🌓 Dark mode support with persistent user preference
- 📱 Fully responsive design
- 🖼️ Image gallery with zoom functionality
- 💬 Comment system for artwork
- 🔐 Admin panel for content management
- 🔄 Real-time image updates
- 🏷️ Tag-based image categorization
- 📝 Contact form for inquiries

## Tech Stack

- **Framework**: Next.js 13+ (App Router)
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Storage**: Supabase Storage
- **Authentication**: Supabase Auth
- **Deployment**: [Your deployment platform]

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Supabase account

### Environment Setup

1. Clone the repository:
```bash
git clone [your-repo-url]
cd [your-repo-name]
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
DATABASE_URL="your-postgresql-url"
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-key"
NEXT_PUBLIC_ARTIST_NAME="Your Artist Name"
```

4. Initialize the database:
```bash
npx prisma generate
npx prisma db push
```

### Development

Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                    # Next.js 13+ app directory
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   ├── gallery/           # Gallery pages
│   └── page.tsx           # Home page
├── components/            # Reusable components
├── context/              # React context providers
├── lib/                  # Utility functions and configurations
└── scripts/              # Database scripts and utilities
```

## Features in Detail

### Dynamic Content
- Set the artist name and other content through environment variables
- Easy to customize for different artists or galleries

### Gallery Management
- Upload, edit, and delete images
- Add descriptions and tags
- Organize images with categories
- Comment system for visitor engagement

### Admin Dashboard
- Secure admin access
- Content management interface
- Image upload with preview
- Tag management system

### User Experience
- Smooth image loading and transitions
- Responsive design for all devices
- Dark mode support
- Intuitive navigation

## Contributing

[Your contribution guidelines]

## License

[Your chosen license]

## Contact

[Your contact information]

---
Built with ❤️ using Next.js and Tailwind CSS
