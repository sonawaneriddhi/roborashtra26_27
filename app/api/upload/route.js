/**
 * app/api/upload/route.js
 * ─────────────────────────
 * Server-side Next.js App Router route for signed Cloudinary uploads.
 * API keys and secrets NEVER reach the client — they stay server-side here.
 *
 * Usage (future admin UI):
 *   POST /api/upload
 *   Body: { publicId: "roborashtra/team/lead/newperson", folder: "roborashtra/team/lead" }
 *   Returns: { signature, timestamp, cloudName, apiKey, uploadUrl }
 *
 * The client then sends the file directly to Cloudinary using the signed parameters:
 *   POST https://api.cloudinary.com/v1_1/<cloud_name>/image/upload
 *   FormData: { file, signature, timestamp, api_key, public_id }
 *
 * To activate, install the Cloudinary Node SDK:
 *   npm install cloudinary
 * Then uncomment the cloudinary import and signing logic below.
 */

import { NextResponse } from 'next/server'

// ── Uncomment when ready to activate uploads ────────────────────────────────
// import { v2 as cloudinary } from 'cloudinary'
//
// cloudinary.config({
//   cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
//   secure: true,
// })
// ────────────────────────────────────────────────────────────────────────────

/**
 * POST /api/upload
 * Returns a signed upload payload so the client can upload directly to Cloudinary.
 */
export async function POST(request) {
  try {
    // Guard: require server-side env vars
    if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json(
        {
          error: 'Cloudinary API credentials are not configured. ' +
            'Add CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET to your server environment.',
        },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { publicId, folder = 'roborashtra' } = body || {}

    if (!publicId) {
      return NextResponse.json(
        { error: 'publicId is required in the request body.' },
        { status: 400 }
      )
    }

    // ── Uncomment when cloudinary SDK is installeds ───────────────────────────
    // const timestamp = Math.round(Date.now() / 1000)
    //
    // const paramsToSign = {
    //   folder,
    //   public_id: publicId,
    //   timestamp,
    // }
    //
    // const signature = cloudinary.utils.api_sign_request(
    //   paramsToSign,
    //   process.env.CLOUDINARY_API_SECRET
    // )
    //
    // return NextResponse.json({
    //   signature,
    //   timestamp,
    //   cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    //   apiKey: process.env.CLOUDINARY_API_KEY,
    //   uploadUrl: `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    //   folder,
    //   publicId,
    // })
    // ────────────────────────────────────────────────────────────────────────

    // Placeholder response until SDK is installed
    return NextResponse.json(
      {
        message: 'Upload API scaffold ready. Install "cloudinary" npm package and uncomment the signing logic to activate.',
        publicId,
        folder,
      },
      { status: 200 }
    )
  } catch (err) {
    console.error('[/api/upload] Unexpected error:', err)
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/upload — returns available Cloudinary folder structure for reference.
 */
export async function GET() {
  return NextResponse.json({
    status: 'ready',
    folderStructure: {
      gallery: 'roborashtra/gallery/<filename>',
      team: {
        lead: 'roborashtra/team/lead/<firstname>',
        workshop: 'roborashtra/team/workshop/<firstname>',
        pr: 'roborashtra/team/pr/<firstname>',
        event: 'roborashtra/team/event/<firstname>',
        ps: 'roborashtra/team/ps/<firstname>',
        design: 'roborashtra/team/design/<firstname>',
        web: 'roborashtra/team/web/<firstname>',
        content: 'roborashtra/team/content/<firstname>',
        docs: 'roborashtra/team/docs/<firstname>',
        cad: 'roborashtra/team/cad/<firstname>',
      },
    },
  })
}
