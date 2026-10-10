/**
 * lib/cloudinary.js
 * ------------------
 * Client-safe Cloudinary URL builder for Roborashtra.
 *
 * Reads NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME from environment variables.
 * Never exposes API keys or secrets..
 *
 * Usage:
 *   import { getCloudinaryUrl, getCloudinaryPlaceholder } from '@/lib/cloudinary'
 *
 *   getCloudinaryUrl('roborashtra/team/lead/shivrajpatil', {
 *     width: 400, height: 400, crop: 'fill', gravity: 'auto'
 *   })
 *   // => https://res.cloudinary.com/<cloud>/image/upload/c_fill,g_auto,w_400,h_400,f_auto,q_auto/roborashtra/team/lead/shivrajpatil
 */

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

/**
 * Build an optimized Cloudinary delivery URL.
 *
 * @param {string} publicId  - The Cloudinary public_id, e.g. "roborashtra/gallery/DSC00753"
 * @param {object} [opts]    - Transformation options
 * @param {number} [opts.width]    - Pixel width for delivery
 * @param {number} [opts.height]   - Pixel height for delivery
 * @param {string} [opts.crop]     - Crop mode (fill, fit, thumb, etc.)
 * @param {string} [opts.gravity]  - Gravity for crop (auto, face, center, etc.)
 * @param {string} [opts.format]   - Image format override (webp, jpg, auto)
 * @param {string} [opts.quality]  - Quality (auto, 80, etc.)
 * @param {boolean} [opts.dpr]     - Whether to add dpr_auto (default: true)
 * @returns {string}  Fully-qualified Cloudinary URL, or '' if cloud name missing.
 */
export function getCloudinaryUrl(publicId, opts = {}) {
  if (!CLOUD_NAME) {
    // During local development without .env.local set, return empty string.
    // Existing fallbacks in PhotoCard (procedural texture) and HeadCard (CSS avatar)
    // will kick in gracefully.
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        '[cloudinary] NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set. ' +
        'Images will use fallbacks. Add it to .env.local to load Cloudinary images.'
      )
    }
    return ''
  }

  const {
    width,
    height,
    crop = 'fill',
    gravity = 'auto',
    format = 'auto',
    quality = 'auto',
    dpr = true,
  } = opts

  // Build transformation string
  const transforms = []

  if (crop && (width || height)) transforms.push(`c_${crop}`)

  // Cloudinary only permits gravity on specific crop modes
  const gravityCrops = ['crop', 'fill', 'thumb', 'lfill', 'fill_pad', 'auto', 'auto_pad']
  if (gravity && (width || height) && gravityCrops.includes(crop)) {
    transforms.push(`g_${gravity}`)
  }

  if (width) transforms.push(`w_${width}`)
  if (height) transforms.push(`h_${height}`)
  if (dpr) transforms.push('dpr_auto')
  if (format) transforms.push(`f_${format}`)
  if (quality) transforms.push(`q_${quality}`)

  const transformStr = transforms.length > 0 ? transforms.join(',') + '/' : ''

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformStr}${publicId}`
}

/**
 * Get a lightweight placeholder URL for a given public_id.
 * Uses a tiny blurred preview (w_20,blur:400) for a blur-up effect.
 *
 * @param {string} publicId
 * @returns {string}
 */
export function getCloudinaryPlaceholder(publicId) {
  return getCloudinaryUrl(publicId, {
    width: 20,
    height: 20,
    crop: 'fill',
    gravity: 'auto',
    quality: '30',
    dpr: false,
  })
}

/**
 * Get a responsive srcSet string for an image.
 * Useful for standard <img> tags or <Image> components.
 *
 * @param {string} publicId
 * @param {number[]} widths  - Array of widths, e.g. [600, 1000, 1600]
 * @param {object}  [opts]   - Same as getCloudinaryUrl opts (except width)
 * @returns {string}  srcSet string, e.g. "...url 600w, ...url 1000w"
 */
export function getCloudinarySrcSet(publicId, widths = [600, 1000, 1600], opts = {}) {
  return widths
    .map((w) => `${getCloudinaryUrl(publicId, { ...opts, width: w })} ${w}w`)
    .join(', ')
}
