import { useEffect, useState } from 'react'
import { SKY_HDRI } from '../constants/sky'
import { GRASS_PBR_TEXTURES } from '../utils/grassTexture'
import { PITCH_PBR_TEXTURES } from '../utils/pitchTexture'
import './TextureSizePanel.css'

type TexturePart = {
  id: string
  label: string
  bytes: number | null
}

const PARTS: { id: string; label: string; urls: readonly string[] }[] = [
  { id: 'grass', label: 'Grass', urls: Object.values(GRASS_PBR_TEXTURES) },
  { id: 'sky', label: 'Sky', urls: [SKY_HDRI] },
  { id: 'pitch', label: 'Pitch', urls: Object.values(PITCH_PBR_TEXTURES) },
  { id: 'stumps', label: 'Stumps', urls: [] },
]

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const mb = bytes / (1024 * 1024)
  if (mb >= 1) return `${mb.toFixed(1)} MB`
  const kb = bytes / 1024
  if (kb >= 1) return `${kb.toFixed(1)} KB`
  return `${bytes} B`
}

async function measureUrl(url: string): Promise<number> {
  const head = await fetch(encodeURI(url), { method: 'HEAD' })
  const length = head.headers.get('content-length')
  if (head.ok && length) return Number(length)

  const body = await fetch(encodeURI(url))
  if (!body.ok) throw new Error(`Failed to measure ${url}`)
  const buffer = await body.arrayBuffer()
  return buffer.byteLength
}

export function TextureSizePanel() {
  const [open, setOpen] = useState(false)
  const [parts, setParts] = useState<TexturePart[]>(() =>
    PARTS.map((part) => ({
      id: part.id,
      label: part.label,
      bytes: part.urls.length === 0 ? 0 : null,
    })),
  )
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const measured = await Promise.all(
          PARTS.map(async (part) => {
            const sizes = await Promise.all(part.urls.map(measureUrl))
            return {
              id: part.id,
              label: part.label,
              bytes: sizes.reduce((sum, size) => sum + size, 0),
            }
          }),
        )
        if (!cancelled) setParts(measured)
      } catch {
        if (!cancelled) setError(true)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  const known = parts.every((part) => part.bytes !== null)
  const total = parts.reduce((sum, part) => sum + (part.bytes ?? 0), 0)
  const totalLabel = error ? 'unavailable' : known ? formatBytes(total) : '…'

  return (
    <div className="texture-panel">
      <button
        type="button"
        className="texture-panel__toggle"
        aria-expanded={open}
        aria-controls="texture-size-details"
        onClick={() => setOpen((value) => !value)}
      >
        Textures {totalLabel}
      </button>
      {open && (
        <div id="texture-size-details" className="texture-panel__details">
          {parts.map((part) => (
            <div key={part.id} className="texture-panel__row">
              <span>{part.label}</span>
              <span>{part.bytes === null ? '…' : formatBytes(part.bytes)}</span>
            </div>
          ))}
          <div className="texture-panel__row texture-panel__total">
            <span>Total</span>
            <span>{totalLabel}</span>
          </div>
        </div>
      )}
    </div>
  )
}
