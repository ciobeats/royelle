import { useState } from 'react'
import { useRouter } from 'next/router'
import Papa from 'papaparse'
import { createClient } from '@/lib/supabase/client'

type CsvRow = Record<string, string>

function getValue(row: CsvRow, keys: string[]) {
  for (const key of keys) {
    const match = Object.keys(row).find(
      (k) => k.trim().toLowerCase() === key.trim().toLowerCase()
    )
    if (match && row[match] !== undefined && row[match] !== '') {
      return row[match]
    }
  }
  return ''
}

function parseNumber(value: string | undefined) {
  if (!value) return 0
  const cleaned = value.replace(/[$,]/g, '').trim()
  const parsed = Number(cleaned)
  return Number.isFinite(parsed) ? parsed : 0
}

export default function UploadPage() {
  const supabase = createClient()
  const router = useRouter()

  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [previewCount, setPreviewCount] = useState(0)

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please choose a CSV file first.')
      return
    }

    setLoading(true)
    setMessage('')

    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const rows = results.data || []

          if (!rows.length) {
            setMessage('No rows found in the CSV.')
            setLoading(false)
            return
          }

          const mappedRows = rows
            .map((row) => {
              const songTitle = getValue(row, [
                'song_title',
                'song title',
                'title',
                'track title',
                'song',
              ])

              const artist = getValue(row, [
                'artist',
                'artist name',
                'primary artist',
              ])

              const units = parseNumber(
                getValue(row, ['units', 'quantity', 'streams', 'unit count'])
              )

              const revenue = parseNumber(
                getValue(row, [
                  'revenue',
                  'amount',
                  'net amount',
                  'royalty',
                  'earnings',
                ])
              )

              return {
                song_title: songTitle || null,
                artist: artist || null,
                units,
                revenue,
              }
            })
            .filter((row) => row.song_title || row.artist || row.units || row.revenue)

          if (!mappedRows.length) {
            setMessage('No usable rows were found after mapping.')
            setLoading(false)
            return
          }

          const { error } = await supabase.from('statement_lines').insert(mappedRows)

          if (error) {
            setMessage(`Upload failed: ${error.message}`)
            setLoading(false)
            return
          }

          setPreviewCount(mappedRows.length)
          setMessage(`Success. Imported ${mappedRows.length} rows.`)
          setLoading(false)
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Unexpected upload error.'
          setMessage(`Upload failed: ${msg}`)
          setLoading(false)
        }
      },
      error: (error) => {
        setMessage(`CSV parse error: ${error.message}`)
        setLoading(false)
      },
    })
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">
              Statements
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Import statement
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-zinc-400">
              Upload a royalty CSV to populate Royelle with song, unit, and earnings data.
            </p>
          </div>

          <button
            onClick={() => router.push('/dashboard')}
            className="rounded-full border border-zinc-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-900"
          >
            Back to dashboard
          </button>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-950/90 p-8">
          <div className="rounded-2xl border border-dashed border-zinc-700 bg-black/30 p-8">
            <label className="block text-sm font-medium text-white">
              Select royalty statement CSV
            </label>

            <input
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="mt-4 block w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-300"
            />

            {file ? (
              <p className="mt-3 text-sm text-zinc-400">
                Selected file: <span className="text-white">{file.name}</span>
              </p>
            ) : null}

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={handleUpload}
                disabled={loading || !file}
                className="rounded-xl bg-purple-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'Importing...' : 'Import statement'}
              </button>

              <button
                onClick={() => {
                  setFile(null)
                  setMessage('')
                  setPreviewCount(0)
                }}
                className="rounded-xl border border-zinc-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-900"
              >
                Clear
              </button>
            </div>

            {message ? (
              <div className="mt-6 rounded-2xl border border-zinc-800 bg-black/40 px-4 py-3 text-sm text-zinc-300">
                {message}
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/90 p-6">
            <h2 className="text-lg font-semibold text-white">Expected columns</h2>
            <p className="mt-3 text-sm text-zinc-400">
              Royelle will try to detect common column names automatically.
            </p>
            <div className="mt-4 space-y-2 text-sm text-zinc-300">
              <p>Song title: song_title, song title, title, track title</p>
              <p>Artist: artist, artist name, primary artist</p>
              <p>Units: units, quantity, streams, unit count</p>
              <p>Revenue: revenue, amount, net amount, royalty, earnings</p>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/90 p-6">
            <h2 className="text-lg font-semibold text-white">Import summary</h2>
            <p className="mt-3 text-sm text-zinc-400">
              Imported rows from your most recent upload:
            </p>
            <p className="mt-4 text-4xl font-semibold text-white">{previewCount}</p>
          </div>
        </div>
      </div>
    </main>
  )
}