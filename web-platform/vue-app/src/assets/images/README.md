# Image Assets

This directory contains all image assets used in the BiasBuster web application.

## Directory Structure

```
images/
├── team/           # Team member photos
├── certifications/ # Compliance and certification badges
├── screenshots/    # UI and feature screenshots
└── icons/          # UI icons and logos
```

## Image Types and Requirements

### Team Photos
- Format: JPG or PNG
- Size: 400x400px minimum
- Style: Professional headshots
- Location: `team/` directory

### Certification Badges
- Format: SVG
- Size: 100x100px
- Style: Consistent with brand colors
- Location: `certifications/` directory
- Current badges:
  - GDPR Compliance
  - CCPA Compliance
  - ISO 27001

### UI Screenshots
- Format: SVG (placeholders) / PNG (final)
- Size: 1920x1080px
- Style: Clean, modern interface
- Location: `screenshots/` directory
- Current screenshots:
  - Extension Installation
  - Content Browsing
  - Analysis View
  - Learning Interface

## Usage Guidelines

1. **Import Paths**
   ```javascript
   // Use the @ alias for imports
   import teamPhoto from '@/assets/images/team/amar.jpg'
   import gdprBadge from '@/assets/images/certifications/gdpr.svg'
   ```

2. **Vue Component Usage**
   ```vue
   <template>
     <img :src="teamPhoto" alt="Team Member Name" />
     <img :src="gdprBadge" alt="GDPR Compliance Badge" />
   </template>
   ```

3. **Accessibility**
   - Always provide meaningful alt text
   - Use appropriate ARIA labels when needed
   - Ensure sufficient color contrast

4. **Performance**
   - Use SVG for icons and badges
   - Optimize PNG/JPG images
   - Implement lazy loading for large images

## Temporary Placeholders

Until final images are available, use these placeholder services:
- Team photos: `https://via.placeholder.com/400`
- UI screenshots: `https://via.placeholder.com/1920x1080`
- Icons: Material Icons or Font Awesome

## Brand Colors

- Primary Blue: #2A5C8A
- Accent Teal: #2EC4B6
- Gold: #FFD700
- Neutral Gray: #F5F5F5 