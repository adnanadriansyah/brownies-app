import { NextResponse } from 'next/server'
import { readdirSync } from 'fs'
import { join } from 'path'

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg']

export async function GET() {
  const publicDir = join(process.cwd(), 'public')
  const files = readdirSync(publicDir).filter((f) =>
    IMAGE_EXTENSIONS.some((ext) => f.toLowerCase().endsWith(ext))
  )
  const images = files.map((f) => ({ name: f, url: `/${f}` }))
  return NextResponse.json(images)
}
