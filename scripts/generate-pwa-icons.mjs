import { deflateSync } from "node:zlib"
import { mkdirSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "icons")

function crc32(buffer) {
  let crc = ~0
  for (let i = 0; i < buffer.length; i++) {
    crc ^= buffer[i]
    for (let bit = 0; bit < 8; bit++) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1))
    }
  }
  return ~crc >>> 0
}

function chunk(type, data) {
  const typeBuffer = Buffer.from(type)
  const length = Buffer.alloc(4)
  length.writeUInt32BE(data.length)
  const body = Buffer.concat([typeBuffer, data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([length, body, crc])
}

function png(size, paint) {
  const stride = size * 4 + 1
  const raw = Buffer.alloc(stride * size)
  for (let y = 0; y < size; y++) {
    const row = y * stride
    raw[row] = 0
    for (let x = 0; x < size; x++) {
      const [r, g, b, a] = paint(x, y, size)
      const index = row + 1 + x * 4
      raw[index] = r
      raw[index + 1] = g
      raw[index + 2] = b
      raw[index + 3] = a
    }
  }

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8
  ihdr[9] = 6

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ])
}

function distanceToSegment(x, y, x1, y1, x2, y2) {
  const dx = x2 - x1
  const dy = y2 - y1
  const lengthSquared = dx * dx + dy * dy
  const t =
    lengthSquared === 0
      ? 0
      : Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / lengthSquared))
  return Math.hypot(x - (x1 + t * dx), y - (y1 + t * dy))
}

function paintIcon(x, y, size, inset) {
  const center = (size - 1) / 2
  const radius = size * (0.5 - inset)
  const distance = Math.hypot(x - center, y - center)
  const stroke = Math.max(2, size * 0.045)
  const background = [23, 23, 23, 255]
  const foreground = [255, 255, 255, 255]

  const ringOuter = radius * 0.78
  const ringInner = ringOuter - stroke
  if (distance <= ringOuter && distance >= ringInner) return foreground

  const handEnd = {
    x: center + Math.cos(-Math.PI / 2) * ringInner * 0.78,
    y: center + Math.sin(-Math.PI / 2) * ringInner * 0.78,
  }
  if (distanceToSegment(x, y, center, center, handEnd.x, handEnd.y) <= stroke * 0.55) {
    return foreground
  }

  if (distance <= stroke * 0.85) return foreground
  return background
}

mkdirSync(root, { recursive: true })

const files = [
  ["icon-192.png", 192, 0.08],
  ["icon-512.png", 512, 0.08],
  ["icon-maskable-512.png", 512, 0.22],
  ["apple-touch-icon.png", 180, 0.08],
]

for (const [name, size, inset] of files) {
  writeFileSync(join(root, name), png(size, (x, y, canvas) => paintIcon(x, y, canvas, inset)))
}
