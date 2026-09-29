import { existsSync, readdirSync, statSync, unlinkSync, rmSync } from 'fs'
import { join } from 'path'

const outDir = join(process.cwd(), 'out')

if (!existsSync(outDir)) {
  console.log('No out directory found.')
  process.exit(0)
}

function removeHeavyImages(dir) {
  if (!existsSync(dir)) return
  const files = readdirSync(dir)
  for (const file of files) {
    const fullPath = join(dir, file)
    const stat = statSync(fullPath)
    if (stat.isDirectory()) {
      removeHeavyImages(fullPath)
    } else {
      // Remove raw heavy photos from out/ since images are served via Cloudinary
      if (
        file.endsWith('.JPG.jpeg') ||
        (dir.includes('gallery') && (file.endsWith('.jpeg') || file.endsWith('.jpg') || file.endsWith('.png'))) ||
        (dir.includes('team') && (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')))
      ) {
        unlinkSync(fullPath)
      }
    }
  }
}

console.log('Pruning heavy image files from out directory (images are hosted on Cloudinary)...')
removeHeavyImages(join(outDir, 'gallery'))
removeHeavyImages(join(outDir, 'team'))
console.log('Done pruning out directory!')
