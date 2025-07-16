# Photography Website

A modern, responsive photography website built with Next.js 14+, TypeScript, and Tailwind CSS. This website showcases photography services and provides a booking system for clients.

## Features

- **Modern Design**: Clean, professional design optimized for photography portfolios
- **Responsive Layout**: Mobile-first design that works on all devices
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **App Router**: Next.js 14+ App Router for modern routing
- **ESLint**: Code quality and consistency

## Pages

- **Homepage (`/`)**: Landing page with hero section, about, services, and featured work
- **Gallery (`/gallery`)**: Photo gallery with filtering and lightbox functionality
- **Booking (`/booking`)**: Contact form for booking photography sessions
- **Admin (`/admin`)**: Dashboard for managing the photography business

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage
│   ├── gallery/
│   │   └── page.tsx       # Gallery page
│   ├── booking/
│   │   └── page.tsx       # Booking page
│   ├── admin/
│   │   └── page.tsx       # Admin dashboard
│   ├── layout.tsx         # Root layout with navigation
│   └── globals.css        # Global styles
├── components/            # Reusable React components
│   └── Navigation.tsx     # Navigation component
├── data/                  # Static data files
│   ├── gallery.ts         # Gallery images data
│   └── services.ts        # Services data
├── lib/                   # Utility functions
│   └── utils.ts           # Common utility functions
└── public/                # Static assets
    └── images/            # Image files
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd photographysite
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Customization

### Adding Images

1. Place your images in the `public/images/` directory
2. Update the gallery data in `src/data/gallery.ts`
3. Use the image paths in your components

### Modifying Services

Edit the services data in `src/data/services.ts` to update pricing, descriptions, and included features.

### Styling

The project uses Tailwind CSS. You can customize the design by:
- Modifying `src/app/globals.css` for global styles
- Updating Tailwind classes in components
- Extending the Tailwind config in `tailwind.config.ts`

## Technologies Used

- **Next.js 14+** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **ESLint** - Code linting and formatting
- **clsx** - Conditional className utility
- **tailwind-merge** - Tailwind class merging utility

## Deployment

This project can be deployed to Vercel, Netlify, or any other hosting platform that supports Next.js.

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
