# Photography Website

A modern, full-featured photography website built with Next.js 15, TypeScript, and Tailwind CSS. This website showcases photography collections and provides a comprehensive booking system with Google Calendar and Zoom integration.

## 🚀 Features

### Core Functionality
- **Modern Design**: Clean, professional design optimized for photography portfolios
- **Responsive Layout**: Mobile-first design that works on all devices
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **App Router**: Next.js 15 App Router for modern routing
- **ESLint**: Code quality and consistency

### Photography Portfolio
- **Dynamic Collections**: Photo collections stored in Firebase Firestore
- **Lightbox Gallery**: Full-screen image viewing with navigation
- **Search & Filter**: Fuzzy search functionality using Fuse.js
- **Infinite Scroll**: Progressive loading of collections
- **Image Optimization**: WebP conversion and compression for fast loading
- **Collection Management**: Admin interface for adding/removing collections

### Booking System
- **Dual Booking Options**:
  - **Scheduled Consultations**: Book specific time slots on Wednesdays (9 AM - 5 PM)
  - **Consultation Requests**: Submit requests for custom scheduling
- **Interactive Calendar**: Custom calendar component for date/time selection
- **Real-time Availability**: Dynamic time slot management
- **Booking Confirmation**: Automatic confirmation emails and calendar invites

### Admin Dashboard
- **Authentication**: Secure admin login system
- **Booking Management**: View and manage upcoming bookings
- **Consultation Requests**: Review and respond to client requests
- **Collection Management**: Add, edit, and delete photo collections
- **Manual Booking Creation**: Create bookings on behalf of clients

### Integrations
- **Google Calendar**: Automatic event creation and calendar invites
- **Zoom Meetings**: Automatic Zoom meeting creation for consultations
- **Email Notifications**: Confirmation emails to clients and photographers
- **Firebase**: Firestore for data storage and Firebase Storage for images

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage with collection grid
│   ├── booking/
│   │   └── page.tsx       # Booking page with calendar
│   ├── collection/
│   │   └── [id]/
│   │       └── page.tsx   # Individual collection view
│   ├── admin/
│   │   └── page.tsx       # Admin dashboard
│   ├── api/               # API routes
│   │   ├── admin/         # Admin API endpoints
│   │   ├── book-session/  # Booking API
│   │   └── consultation-request/ # Request API
│   ├── layout.tsx         # Root layout with navigation
│   └── globals.css        # Global styles
├── components/            # Reusable React components
│   ├── CollectionCard.tsx     # Collection preview card
│   ├── CollectionGrid.tsx     # Grid layout for collections
│   ├── CustomCalendar.tsx     # Interactive booking calendar
│   ├── Lightbox.tsx           # Full-screen image viewer
│   ├── Navigation.tsx         # Site navigation
│   └── OptimizedImage.tsx     # Optimized image component
├── lib/                   # Utility functions and integrations
│   ├── firebase.ts            # Firebase configuration
│   ├── firebase-admin.ts      # Firebase Admin SDK
│   ├── firestore.ts           # Firestore operations
│   ├── google-calendar.ts     # Google Calendar integration
│   ├── zoom.ts                # Zoom API integration
│   ├── bookings.ts            # Booking utilities
│   ├── consultation-requests.ts # Request utilities
│   ├── useSearchStore.ts      # Search state management
│   └── utils.ts               # Common utilities
└── public/                # Static assets
    └── images/            # Image files
```

## 🛠️ Technologies Used

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS framework
- **React Hook Form** - Form handling and validation
- **Fuse.js** - Fuzzy search functionality
- **Zustand** - State management
- **Heroicons** - Icon library

### Backend & Integrations
- **Firebase** - Backend as a Service
  - **Firestore** - NoSQL database
  - **Firebase Storage** - File storage
  - **Firebase Admin SDK** - Server-side operations
- **Google APIs**
  - **Google Calendar API** - Event creation and management
  - **Google Service Account** - Authentication
- **Zoom API** - Meeting creation and management
- **NextAuth.js** - Authentication system

### Development Tools
- **ESLint** - Code linting and formatting
- **Turbopack** - Fast bundler for development
- **PostCSS** - CSS processing
- **clsx & tailwind-merge** - Conditional styling utilities

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project
- Google Cloud project with Calendar API
- Zoom Developer account

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

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables (see Configuration section below)

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK
FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key\n-----END PRIVATE KEY-----"
FIREBASE_ADMIN_CLIENT_EMAIL=your_service_account@project.iam.gserviceaccount.com

# Google Calendar Integration
GOOGLE_CALENDAR_CLIENT_EMAIL=your_service_account@project.iam.gserviceaccount.com
GOOGLE_CALENDAR_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key\n-----END PRIVATE KEY-----"
GOOGLE_CALENDAR_ID=your_calendar_id@gmail.com

# Zoom Integration
ZOOM_ACCOUNT_ID=your_zoom_account_id
ZOOM_CLIENT_ID=your_zoom_client_id
ZOOM_CLIENT_SECRET=your_zoom_client_secret

# Email Configuration
PHOTOGRAPHER_EMAIL=photographer@example.com

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

### Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database and Storage
3. Create a service account and download the JSON key
4. Set up security rules for Firestore and Storage

### Google Calendar Setup

See [GOOGLE_CALENDAR_SETUP.md](./GOOGLE_CALENDAR_SETUP.md) for detailed setup instructions.

### Zoom Setup

1. Create a Zoom Developer account
2. Create a Server-to-Server OAuth app
3. Get your Account ID, Client ID, and Client Secret
4. Add them to your environment variables

## 📖 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 Customization

### Adding Collections

1. **Via Admin Dashboard**:
   - Log in to `/admin`
   - Go to "Add Collection" tab
   - Upload images (automatically optimized to WebP)
   - Add name, description, and tags
   - Select cover image

2. **Via API**:
   - Use the `/api/admin/upload-collection` endpoint
   - Images are automatically compressed and converted to WebP

### Modifying Booking System

- **Time Slots**: Edit `CustomCalendar.tsx` to change available times
- **Booking Days**: Modify the Wednesday-only logic in the calendar component
- **Email Templates**: Customize templates in `google-calendar.ts`

### Styling

The project uses Tailwind CSS. You can customize the design by:
- Modifying `src/app/globals.css` for global styles
- Updating Tailwind classes in components
- Extending the Tailwind config in `tailwind.config.js`

## 🔧 API Endpoints

### Public APIs
- `POST /api/book-session` - Create a scheduled booking
- `POST /api/consultation-request` - Submit a consultation request
- `GET /api/available-dates` - Get available booking dates

### Admin APIs (Protected)
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/bookings` - Get upcoming bookings
- `GET /api/admin/consultation-requests` - Get consultation requests
- `POST /api/admin/create-booking` - Manually create booking
- `POST /api/admin/upload-collection` - Upload new collection
- `DELETE /api/admin/delete-collection` - Delete collection
- `GET /api/admin/collections` - Get all collections
- `POST /api/admin/block-time` - Block time slots
- `GET /api/admin/blocked-times` - Get blocked time slots

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

This project can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- DigitalOcean App Platform
- Railway

## 🔒 Security Features

- **Admin Authentication**: Secure admin login system
- **API Protection**: Protected admin routes with session validation
- **Image Optimization**: Automatic image compression and format conversion
- **Input Validation**: Form validation using React Hook Form
- **Environment Variables**: Secure configuration management

## 📱 Features Overview

### For Visitors
- Browse photography collections with search and filtering
- View full-screen images in lightbox gallery
- Book consultations with interactive calendar
- Submit consultation requests for custom scheduling
- Responsive design for all devices

### For Photographers (Admin)
- Secure admin dashboard
- Manage photo collections (add, edit, delete)
- View and manage bookings
- Review consultation requests
- Create manual bookings
- Block/unblock time slots
- Automatic Google Calendar and Zoom integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

For support and questions:
- Check the [Google Calendar Setup Guide](./GOOGLE_CALENDAR_SETUP.md)
- Review the Firebase and Zoom documentation
- Open an issue on GitHub

## 🔄 Recent Updates

### Latest Features Added
- **WebP Image Optimization**: Automatic conversion and compression
- **Fuzzy Search**: Enhanced collection search with Fuse.js
- **Infinite Scroll**: Progressive loading for better performance
- **Admin Collection Management**: Full CRUD operations for collections
- **Google Calendar Integration**: Automatic event creation and invites
- **Zoom Meeting Integration**: Automatic meeting creation
- **Email Notifications**: Confirmation emails for bookings
- **Responsive Design**: Mobile-first approach with dark mode support
- **TypeScript Migration**: Full type safety throughout the application
- **Next.js 15 Upgrade**: Latest features and performance improvements

### Performance Improvements
- **Turbopack**: Faster development builds
- **Image Optimization**: WebP conversion and compression
- **Lazy Loading**: Progressive image loading
- **Code Splitting**: Automatic route-based code splitting
- **Caching**: Optimized caching strategies

This photography website is now a comprehensive, production-ready platform with modern features, excellent performance, and a great user experience for both visitors and photographers.
