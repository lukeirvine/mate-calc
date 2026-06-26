'use client'

import { useState, useEffect } from 'react'

type Method = 'gourd' | 'french_press' | 'tea_bag' | 'terere' | 'cocido'
type TempPreset = 'hot' | 'warm' | 'cold'
type TempUnit = 'C' | 'F'
type Theme = 'island-light' | 'island-dark'

const TEMP_FACTORS: Record<TempPreset, number> = {
  hot: 1.0,
  warm: 0.85,
  cold: 0.70,
}

const METHODS: Array<{ id: Method; label: string; icon: string; desc: string; rate: string }> = [
  { id: 'gourd',        label: 'Gourd',        icon: '🧉', desc: 'Traditional loose leaf with bombilla', rate: 'variable' },
  { id: 'french_press', label: 'French Press', icon: '☕', desc: '5-minute full immersion steep',        rate: '65%' },
  { id: 'tea_bag',      label: 'Tea Bag',      icon: '🍵', desc: 'Short steep, fine particle cut',       rate: '45%' },
  { id: 'terere',       label: 'Tereré',       icon: '🧊', desc: 'Cold water — less extraction',         rate: '50%' },
  { id: 'cocido',       label: 'Cocido',       icon: '🫖', desc: 'Boiled single brew',                   rate: '55%' },
]

const TEMP_OPTS: Array<{ id: TempPreset; emoji: string; label: string; tempC: number; tempF: number }> = [
  { id: 'hot',  emoji: '🔥', label: 'Hot',  tempC: 90,  tempF: 194 },
  { id: 'warm', emoji: '♨️', label: 'Warm', tempC: 70,  tempF: 158 },
  { id: 'cold', emoji: '🧊', label: 'Cold', tempC: 20,  tempF: 68  },
]

const INTENSITY: Record<string, { label: string; badge: string; progress: string; text: string }> = {
  low:       { label: 'Light Buzz',   badge: 'badge-success', progress: 'progress-success', text: 'text-success' },
  moderate:  { label: 'Moderate',     badge: 'badge-warning', progress: 'progress-warning', text: 'text-warning' },
  high:      { label: 'Strong',       badge: 'badge-error',   progress: 'progress-error',   text: 'text-error'   },
  'very-high': { label: 'Very Strong', badge: 'badge-error',  progress: 'progress-error',   text: 'text-error'   },
}

function calculateGourdExtraction(refills: number): number {
  let total = 0
  for (let i = 1; i <= refills; i++) {
    total += 0.15 * Math.pow(0.85, i - 1)
  }
  return Math.min(total, 0.90)
}

function getExtractionRate(method: Method, refills: number): number {
  if (method === 'gourd') return calculateGourdExtraction(refills)
  const rates: Record<Exclude<Method, 'gourd'>, number> = {
    french_press: 0.65,
    tea_bag: 0.45,
    terere: 0.50,
    cocido: 0.55,
  }
  return rates[method]
}

function calculateCaffeine(method: Method, grams: number, refills: number, tempFactor: number): number {
  const baseCaffeine = grams * 12
  return baseCaffeine * getExtractionRate(method, refills) * tempFactor
}

function getIntensityKey(mg: number): string {
  if (mg < 100) return 'low'
  if (mg < 200) return 'moderate'
  if (mg < 300) return 'high'
  return 'very-high'
}

export function MateCalc() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'island-light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'island-dark' : 'island-light'
  })
  const [method, setMethod] = useState<Method>('gourd')
  const [grams, setGrams] = useState(50)
  const [refills, setRefills] = useState(6)
  const [tempPreset, setTempPreset] = useState<TempPreset>('hot')
  const [tempUnit, setTempUnit] = useState<TempUnit>('C')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const caffeineMg       = calculateCaffeine(method, grams, refills, TEMP_FACTORS[tempPreset])
  const extractionRate   = getExtractionRate(method, refills)
  const intensityKey     = getIntensityKey(caffeineMg)
  const ui               = INTENSITY[intensityKey]
  const progressPct      = Math.min((caffeineMg / 400) * 100, 100)
  const coffeeEquiv      = (caffeineMg / 95).toFixed(1)
  const dailyLimitPct    = Math.min(Math.round((caffeineMg / 400) * 100), 999)
  const roundedMg        = Math.round(caffeineMg)
  const numberSize       = roundedMg >= 1000 ? 'text-5xl' : 'text-6xl md:text-7xl'
  const activeMethod     = METHODS.find(m => m.id === method)!

  function toggleTheme() {
    setTheme(t => t === 'island-light' ? 'island-dark' : 'island-light')
  }

  return (
    <div className="min-h-screen">

      {/* ── Header ─────────────────────────────────── */}
      <header className="max-w-xl mx-auto px-4 pt-8 pb-4 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-3xl leading-none select-none">🧉</span>
            <h1 className="text-2xl font-black text-base-content tracking-tight">
              Mate Calc
            </h1>
          </div>
          <p className="text-[10px] text-base-content/40 uppercase tracking-[0.25em] mt-1.5 pl-11">
            Caffeine in every sip
          </p>
        </div>

        <button
          onClick={toggleTheme}
          suppressHydrationWarning
          className="btn btn-ghost btn-circle mt-0.5 text-xl transition-all duration-300 hover:scale-110 active:scale-95"
          aria-label="Toggle theme"
        >
          {theme === 'island-dark' ? '🌙' : '☀️'}
        </button>
      </header>

      {/* ── Main content ───────────────────────────── */}
      <main className="max-w-xl mx-auto px-4 pb-12 flex flex-col gap-4">

        {/* ── Brew Method Card ───────────────────── */}
        <section className="card bg-base-100/85 backdrop-blur-sm shadow-lg">
          <div className="card-body p-5 gap-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-base-content/40">Brew Method</h2>

            <div className="grid grid-cols-5 gap-1.5">
              {METHODS.map(m => {
                const active = method === m.id
                return (
                  <button
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    className={[
                      'flex flex-col items-center gap-1.5 py-3 px-1 rounded-2xl border-2 transition-all duration-200 cursor-pointer',
                      active
                        ? 'border-primary bg-primary/10 shadow-sm'
                        : 'border-transparent bg-base-200 hover:border-primary/30 hover:bg-primary/5',
                    ].join(' ')}
                  >
                    <span className="text-xl leading-none select-none">{m.icon}</span>
                    <span className={[
                      'text-[10px] font-bold leading-tight text-center transition-colors',
                      active ? 'text-primary' : 'text-base-content/55',
                    ].join(' ')}>
                      {m.label}
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="flex items-center justify-between text-xs text-base-content/35 bg-base-200 rounded-xl px-3 py-2">
              <span className="italic">{activeMethod.desc}</span>
              <span className="font-mono font-medium tabular-nums">
                {method === 'gourd'
                  ? `${Math.round(extractionRate * 100)}% extracted`
                  : `${activeMethod.rate} extracted`}
              </span>
            </div>
          </div>
        </section>

        {/* ── Parameters Card ────────────────────── */}
        <section className="card bg-base-100/85 backdrop-blur-sm shadow-lg">
          <div className="card-body p-5 gap-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-base-content/40">Parameters</h2>

            {/* Yerba grams */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-baseline justify-between">
                <label className="text-sm font-semibold text-base-content/65">
                  Yerba Amount
                </label>
                <span className="text-2xl font-black text-primary tabular-nums leading-none">
                  {grams}<span className="text-base font-semibold text-primary/60">g</span>
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={150}
                step={1}
                value={grams}
                onChange={e => setGrams(Number(e.target.value))}
                className="range range-primary range-xs w-full"
              />
              <div className="flex justify-between text-[10px] text-base-content/30 font-mono">
                <span>5g</span>
                <span>50g</span>
                <span>100g</span>
                <span>150g</span>
              </div>
            </div>

            {/* Refills — gourd only */}
            {method === 'gourd' && (
              <div className="flex items-center justify-between gap-4 rounded-2xl bg-base-200 px-4 py-3">
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-sm font-semibold text-base-content/65">Refills</span>
                  <span className="text-xs text-base-content/35 truncate">
                    Each refill extracts less
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => setRefills(r => Math.max(1, r - 1))}
                    className="btn btn-circle btn-sm btn-ghost border-2 border-primary/25 hover:border-primary text-primary font-bold"
                  >
                    −
                  </button>
                  <span className="text-2xl font-black text-primary tabular-nums w-8 text-center leading-none">
                    {refills}
                  </span>
                  <button
                    onClick={() => setRefills(r => Math.min(20, r + 1))}
                    className="btn btn-circle btn-sm btn-ghost border-2 border-primary/25 hover:border-primary text-primary font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Water temperature */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-base-content/65">
                  Water Temperature
                </label>
                <div className="flex rounded-lg overflow-hidden border border-base-300 text-[10px] font-bold">
                  {(['C', 'F'] as TempUnit[]).map((u, i) => (
                    <button
                      key={u}
                      onClick={() => setTempUnit(u)}
                      className={[
                        'px-2 py-0.5 transition-colors duration-150',
                        i > 0 ? 'border-l border-base-300' : '',
                        tempUnit === u
                          ? 'bg-primary text-primary-content'
                          : 'text-base-content/40 hover:text-base-content/60',
                      ].join(' ')}
                    >
                      °{u}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex rounded-[var(--radius-field)] overflow-hidden border-2 border-base-300">
                {TEMP_OPTS.map((t, i) => (
                  <button
                    key={t.id}
                    onClick={() => setTempPreset(t.id)}
                    className={[
                      'flex-1 flex flex-col items-center gap-0.5 py-2.5 px-1 transition-colors duration-200 cursor-pointer',
                      i > 0 ? 'border-l-2 border-base-300' : '',
                      tempPreset === t.id
                        ? 'bg-primary text-primary-content'
                        : 'bg-transparent hover:bg-primary/8 text-base-content/60',
                    ].join(' ')}
                  >
                    <span className="text-sm leading-none select-none">{t.emoji}</span>
                    <span className="text-xs font-bold">{t.label}</span>
                    <span className="text-[9px] opacity-60 font-mono">
                      ~{tempUnit === 'C' ? t.tempC : t.tempF}°{tempUnit} · ×{TEMP_FACTORS[t.id].toFixed(2)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Result Card ────────────────────────── */}
        <section className="card bg-base-100/85 backdrop-blur-sm shadow-lg">
          <div className="card-body p-5 gap-5">
            <h2 className="text-xs font-bold uppercase tracking-widest text-base-content/40">Estimated Caffeine</h2>

            {/* Big number */}
            <div className="flex flex-col items-center gap-3 py-2">
              <div className="flex items-end justify-center gap-1.5 leading-none">
                <span className={`${numberSize} font-black text-base-content tabular-nums leading-none`}>
                  {roundedMg}
                </span>
                <span className="text-xl font-semibold text-base-content/40 pb-1.5 leading-none">
                  mg
                </span>
              </div>
              <span className={`badge ${ui.badge} badge-lg font-bold px-4`}>
                {ui.label}
              </span>
            </div>

            {/* Progress bar */}
            <div className="flex flex-col gap-1.5">
              <progress
                className={`progress ${ui.progress} w-full h-2.5 rounded-full`}
                value={progressPct}
                max={100}
              />
              <div className="flex justify-between text-[10px] text-base-content/30 font-mono">
                <span>0 mg</span>
                <span>200 mg</span>
                <span>400 mg daily max</span>
              </div>
            </div>

            {/* Context stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-base-200 rounded-2xl p-4 flex flex-col gap-0.5">
                <span className="text-[10px] font-medium text-base-content/40 uppercase tracking-wide">
                  Coffee equiv.
                </span>
                <span className="text-2xl font-black text-base-content tabular-nums leading-tight">
                  {coffeeEquiv}
                </span>
                <span className="text-xs text-base-content/35">cups @ 95 mg</span>
              </div>
              <div className="bg-base-200 rounded-2xl p-4 flex flex-col gap-0.5">
                <span className="text-[10px] font-medium text-base-content/40 uppercase tracking-wide">
                  Daily limit
                </span>
                <span className={`text-2xl font-black tabular-nums leading-tight ${ui.text}`}>
                  {dailyLimitPct}%
                </span>
                <span className="text-xs text-base-content/35">of 400 mg max</span>
              </div>
            </div>

            {/* Science note */}
            <p className="text-center text-[10px] text-base-content/25 leading-relaxed mt-1">
              Average caffeine content ~12 mg/g dry yerba
              <br />
              Algorithm via{' '}
              <a
                href="https://dev.to/botanica_andina/yerba-mate-caffeine-i-analyzed-47-studies-to-build-a-calculator-that-actually-works-2601"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-base-content/50 transition-colors"
              >
                Botanica Andina · 47-study analysis
              </a>
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
