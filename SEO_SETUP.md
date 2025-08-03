# SEO Setup Guide for Photography Website

This guide documents all the SEO optimizations implemented for the photography website to improve search engine visibility and rankings.

## 🎯 SEO Features Implemented

### 1. **Comprehensive Metadata System**
- **Root Layout**: Enhanced with complete Open Graph, Twitter Cards, and structured data
- **Page-Specific Metadata**: Each page has optimized title, description, and keywords
- **Dynamic Metadata**: Collection pages generate metadata based on content
- **Template System**: Consistent branding with `%s | Cynthia's Photography` format

### 2. **Open Graph & Social Media Optimization**
- **Facebook/LinkedIn**: Open Graph tags for rich link previews
- **Twitter**: Twitter Cards for enhanced tweet previews
- **Image Optimization**: 1200x630px social media images
- **Dynamic Content**: Collection-specific OG images and descriptions

### 3. **Structured Data (Schema.org)**
- **Organization Schema**: Business information for local SEO
- **ImageGallery Schema**: Collection pages with proper image markup
- **PhotographyBusiness Schema**: Business type and service information
- **Contact Information**: Phone, email, and address structured data

### 4. **Technical SEO**
- **Sitemap Generation**: Dynamic XML sitemap with all pages
- **Robots.txt**: Proper crawling instructions
- **Canonical URLs**: Prevent duplicate content issues
- **Meta Robots**: Proper indexing directives
- **Search Console Verification**: Ready for Google Search Console setup

### 5. **Performance & Core Web Vitals**
- **Image Optimization**: WebP conversion and compression
- **Lazy Loading**: Progressive image loading
- **Code Splitting**: Route-based code splitting
- **Turbopack**: Faster development builds

## 📁 Files Modified/Added

### Core SEO Files
```
src/app/
├── layout.tsx              # Enhanced root metadata
├── sitemap.ts              # Dynamic sitemap generation
├── robots.ts               # Robots.txt configuration
├── metadata.ts             # Page-specific metadata
└── collection/[id]/
    └── layout.tsx          # Collection-specific metadata
```

### Page-Specific SEO
- **Homepage**: Portfolio-focused metadata
- **Booking Page**: Service-focused metadata
- **Collection Pages**: Dynamic metadata based on content
- **Admin Pages**: No-index for security

## 🔧 Configuration Required

### 1. **Domain Configuration**
Update these files with your actual domain:
- `src/app/layout.tsx` - Replace `cynthiasphotography.com`
- `src/app/sitemap.ts` - Update baseUrl
- `src/app/robots.ts` - Update baseUrl

### 2. **Business Information**
Update in `src/app/layout.tsx`:
```typescript
// Replace with your actual business information
"name": "Cynthia's Photography",
"url": "https://cynthiasphotography.com",
"telephone": "+1-555-123-4567",
"email": "hello@cynthiasphotography.com",
"address": {
  "addressLocality": "Your City",
  "addressRegion": "Your State",
  "addressCountry": "US"
}
```

### 3. **Social Media Links**
Update in `src/app/layout.tsx`:
```typescript
"sameAs": [
  "https://instagram.com/cynthiasphotography",
  "https://facebook.com/cynthiasphotography"
]
```

### 4. **Search Console Verification**
Add your verification codes in `src/app/layout.tsx`:
```typescript
verification: {
  google: 'your-google-verification-code',
  // yandex: 'your-yandex-verification-code',
  // yahoo: 'your-yahoo-verification-code',
}
```

## 🖼️ Image Requirements

### Open Graph Images
Create these images in `public/images/`:
- `og-image.jpg` (1200x630px) - Main site image
- `portfolio-og.jpg` (1200x630px) - Portfolio page image
- `booking-og.jpg` (1200x630px) - Booking page image
- `default-collection-og.jpg` (1200x630px) - Default collection image

### Logo
- `logo.png` - Business logo for structured data

## 📊 SEO Monitoring Setup

### 1. **Google Search Console**
1. Add your domain to Google Search Console
2. Verify ownership using the meta tag in layout.tsx
3. Submit your sitemap: `https://yourdomain.com/sitemap.xml`
4. Monitor Core Web Vitals and search performance

### 2. **Google Analytics**
1. Set up Google Analytics 4
2. Add tracking code to your layout
3. Monitor user behavior and conversion tracking

### 3. **Social Media Analytics**
1. Set up Facebook Pixel for conversion tracking
2. Monitor social media referral traffic
3. Track engagement with Open Graph content

## 🎨 Content Optimization

### 1. **Collection Descriptions**
- Write unique, descriptive content for each collection
- Include relevant keywords naturally
- Use proper heading structure (H1, H2, H3)

### 2. **Image Alt Text**
- All images have descriptive alt text
- Include relevant keywords naturally
- Describe the image content accurately

### 3. **URL Structure**
- Clean, SEO-friendly URLs: `/collection/collection-name`
- Descriptive slugs for collections
- Consistent URL structure across the site

## 🔍 Keyword Strategy

### Primary Keywords
- "photography portfolio"
- "professional photographer"
- "portrait photography"
- "wedding photography"
- "photography consultation"

### Long-tail Keywords
- "book photography consultation"
- "professional portrait photographer"
- "wedding photography services"
- "family photography sessions"
- "maternity photography"

### Local SEO Keywords
- "[City] photographer"
- "[State] wedding photography"
- "[Location] portrait photographer"

## 📈 Performance Optimization

### 1. **Image Optimization**
- Automatic WebP conversion
- Responsive images with proper sizes
- Lazy loading for better performance
- Optimized image dimensions

### 2. **Code Optimization**
- Next.js 15 with App Router
- Turbopack for faster builds
- Code splitting for better loading
- Minimal JavaScript bundles

### 3. **Caching Strategy**
- Static generation where possible
- Proper cache headers
- CDN-ready image optimization

## 🚀 Deployment Checklist

### Pre-Launch
- [ ] Update all domain references
- [ ] Add business information
- [ ] Create Open Graph images
- [ ] Set up Google Search Console
- [ ] Configure Google Analytics
- [ ] Test all meta tags
- [ ] Verify structured data

### Post-Launch
- [ ] Submit sitemap to search engines
- [ ] Monitor Core Web Vitals
- [ ] Track search rankings
- [ ] Monitor organic traffic
- [ ] Optimize based on analytics

## 🔧 Advanced SEO Features

### 1. **Dynamic Metadata**
Collection pages automatically generate:
- Title: `"Collection Name | Photography Collection"`
- Description: Based on collection content
- Keywords: Collection tags and relevant terms
- Open Graph: Collection-specific images and descriptions

### 2. **Structured Data**
- Organization schema for business information
- ImageGallery schema for collections
- Contact information for local SEO
- Service area and pricing information

### 3. **Social Media Integration**
- Facebook/LinkedIn Open Graph tags
- Twitter Cards for enhanced sharing
- Pinterest-friendly image dimensions
- Instagram-ready content structure

## 📱 Mobile SEO

### Responsive Design
- Mobile-first approach
- Touch-friendly navigation
- Fast loading on mobile devices
- Optimized images for mobile

### Mobile Performance
- Core Web Vitals optimization
- Minimal JavaScript on mobile
- Optimized image loading
- Fast navigation and interactions

## 🌐 International SEO (Future)

### Multi-language Support
- Language-specific metadata
- Hreflang tags for multiple languages
- Localized content and keywords
- Region-specific business information

### Local SEO
- Google My Business integration
- Local business schema markup
- Service area definitions
- Local keyword optimization

## 📊 Analytics & Monitoring

### Key Metrics to Track
- Organic search traffic
- Search rankings for target keywords
- Core Web Vitals scores
- Page load times
- Bounce rate and engagement
- Conversion rates from organic traffic

### Tools for Monitoring
- Google Search Console
- Google Analytics
- PageSpeed Insights
- Lighthouse audits
- SEMrush or Ahrefs for keyword tracking

This comprehensive SEO setup ensures your photography website is optimized for search engines, social media sharing, and provides the best possible user experience for both visitors and search engines. 