# Environment Configuration Guide

## Setting up your environment variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Configure your environment variables in `.env.local`:

### Required Variables:

- **NEXT_PUBLIC_SUPABASE_URL**: Your Supabase project URL
- **NEXT_PUBLIC_SUPABASE_ANON_KEY**: Your Supabase anonymous key
- **NEXT_PUBLIC_SITE_URL**: Your site's base URL

### Site URL Configuration:

**For Development:**
```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**For Production:**
```
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### Important Notes:

- The `NEXT_PUBLIC_SITE_URL` is crucial for proper metadata generation
- It resolves the Next.js warning about missing `metadataBase`
- This URL is used for Open Graph and Twitter card images
- Make sure to update it when deploying to production

### Social Media Images:

The app expects these social media images in the `public` folder:
- `/og-image.jpg` (1200x630px) - For Open Graph sharing
- `/twitter-image.jpg` (1200x600px) - For Twitter cards

You can create these images or update the metadata configuration in `src/app/layout.tsx` to point to your custom images.

## Fixing the Metadata Warning:

The warning you saw:
```
⚠ metadata.metadataBase is not set for resolving social open graph or twitter images
```

Is now fixed by:
1. Setting `metadataBase` in the metadata configuration
2. Using the `NEXT_PUBLIC_SITE_URL` environment variable
3. Providing fallback to localhost for development

This ensures proper URL resolution for social media sharing and SEO.