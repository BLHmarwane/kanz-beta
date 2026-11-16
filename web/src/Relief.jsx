import { useEffect, useRef, useState } from 'react'
import './relief.css'

// An illustrative month. These balances are independent of the visitor's budget.
const balances = [
  442, 415, 402, 572, 548, 491, 464, 948, 915, 874, 813, 759, 716, 1284, 1238, 1160,
  1124, 1080, 1004, 965, 1368, 1293, 1219, 1083, 1051, 936, 894, 817, 753, 698, 686,
]
const today = 16
const lastDay = balances.length - 1
const maximum = Math.max(...balances)
const money = new Intl.NumberFormat('fr-FR', {
  style: 'currency', currency: 'EUR', maximumFractionDigits: 0,
})
const colors = {
  bands: [[14, 14, 140], [31, 31, 230], [98, 98, 240], [168, 176, 246], [214, 222, 250]],
  light: [150, 156, 248],
  shade: [14, 14, 140],
  citron: [233, 242, 63],
  ridges: ['#e1e5fa', '#c6cef7'],
  ink: '#091128',
}
const dither = [
  [0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5],
]

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)
const ease = (progress) => 1 - (1 - progress) ** 3
const lerp = (from, to, amount) => from + (to - from) * amount
const mix = (from, to, amount) => from.map((channel, i) => Math.round(lerp(channel, to[i], amount)))
const rgb = (color) => 'rgb(' + color.join(',') + ')'
const dateLabel = (day) => (day === 0 ? '1er' : day + 1) + ' octobre'
const dayType = (day) => day <= today ? 'Réel' : 'Prévision'

function heightAt(day) {
  const lower = Math.floor(day)
  return lerp(balances[lower], balances[Math.min(lower + 1, lastDay)], day - lower) / maximum
}

function makeTerrain(width, height) {
  const inset = clamp(width * .034, 18, 36)
  const columns = Math.max(2, Math.floor((width - inset * 2) / clamp(width / 142, 5, 8)))
  const pitch = (width - inset * 2) / columns
  const size = Math.max(2, Math.floor(pitch * .76))
  const floor = height - 15
  const rows = Math.max(2, Math.floor((floor - 68) / pitch))
  const xAt = (column) => inset + column * pitch
  const yAt = (row) => floor - (row + 1) * pitch
  const dayAt = (column) => column / columns * lastDay
  const tops = Array.from({ length: columns + 1 }, (_, column) =>
    Math.max(1, Math.round(heightAt(dayAt(column)) * rows))
  )
  const tiles = []
  const ridges = []

  for (let ridge = 0; ridge < 2; ridge += 1) {
    const shift = ridge ? -.13 : .22
    const lift = ridge ? .10 : .20
    const density = ridge ? .60 : .42
    for (let column = 0; column <= columns; column += 1) {
      const place = column / columns
      let smoothed = 0
      for (let sample = -2; sample <= 2; sample += 1) {
        smoothed += heightAt(clamp(place + shift + sample * .03, 0, 1) * lastDay) / 5
      }
      const wave = .04 * Math.sin(place * (ridge ? 14 : 9) + ridge * 2.1)
      const top = Math.max(1, Math.round(Math.min(1, smoothed * .82 + lift + wave) * rows))
      for (let row = 0; row < top; row += 1) {
        const threshold = (dither[(row + ridge * 2) % 4][(column + ridge) % 4] + .5) / 16
        if (threshold < density * (1 - .55 * (row / top) ** 1.4)) {
          ridges.push({ x: xAt(column), y: yAt(row), color: colors.ridges[ridge] })
        }
      }
    }
  }

  for (let column = 0; column <= columns; column += 1) {
    const top = tops[column]
    const forecast = dayAt(column) >= today + .5
    const slope = (tops[Math.min(columns, column + 2)] - tops[Math.max(0, column - 2)]) / 4

    function addTile(row, tint, alpha) {
      tiles.push({
        x: xAt(column), y: yAt(row), column, tint, color: rgb(tint), alpha,
        delay: column / columns * 490 + row / rows * 355,
      })
    }

    for (let row = 0; row < top; row += 1) {
      if (forecast && (column + row) % 2 !== 0) continue
      const threshold = (dither[row % 4][column % 4] + .5) / 16
      const altitude = row / rows * 5.2 + (threshold - .5) * 1.1
      const band = clamp(Math.floor(altitude), 0, colors.bands.length - 1)
      const crest = row === top - 1
      if (!crest && threshold > 1 - .8 * (row / top) ** 1.6) continue
      const tint = mix(colors.bands[band], slope > 0 ? colors.light : colors.shade, Math.min(.55, Math.abs(slope) * .42))
      addTile(row, crest && !forecast ? colors.bands[0] : tint, forecast ? .46 : .91)
    }

    if (!forecast) {
      for (let dust = 1; dust <= 7; dust += 1) {
        const seed = Math.sin(column * 127.1 + dust * 311.7) * 43758.5453
        if (seed - Math.floor(seed) > .9 + dust * .012) {
          addTile(top + dust - 1, colors.bands[1], .54 - dust * .058)
        }
      }
    }
  }

  return { width, height, inset, pitch, size, floor, columns, tops, tiles, ridges, xAt, yAt }
}

function createDrawing(canvas, stage) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
  let terrain
  let pixelRatio
  let frame = 0
  let startedAt
  let lastTick
  let hover = 0
  let pointer = null
  let pointerLive = false
  let lastMove = -Infinity
  let targetDay = today
  let drawnColumn
  let disposed = false

  function schedule() {
    if (!frame && !disposed) frame = requestAnimationFrame(draw)
  }

  function resize() {
    const { width, height } = stage.getBoundingClientRect()
    if (!width || !height) return
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.round(width * pixelRatio)
    canvas.height = Math.round(height * pixelRatio)
    terrain = makeTerrain(width, height)
    drawnColumn = targetDay / lastDay * terrain.columns
    schedule()
  }

  function drawMarker(t, elapsed) {
    const { columns, tops, xAt, yAt, floor, width, size } = t
    const reveal = ease(clamp((elapsed - 885) / 290, 0, 1))
    if (!reveal) return

    const column = clamp(drawnColumn, 0, columns)
    const crest = lerp(tops[Math.floor(column)], tops[Math.ceil(column)], column % 1)
    const x = xAt(column)
    const lift = reduce.matches ? 0 : hover * 11
    const y = Math.max(27, yAt(crest - 1) - 32 - lift) - (1 - reveal) * 8

    ctx.globalAlpha = reveal * .77
    ctx.strokeStyle = colors.ink
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x, floor + 4)
    ctx.stroke()

    ctx.globalAlpha = reveal
    const markerSize = Math.max(8, size + 2)
    ctx.fillStyle = colors.ink
    ctx.fillRect(x - markerSize / 2 - 1, y - markerSize - 1, markerSize + 2, markerSize + 2)
    ctx.fillStyle = rgb(colors.citron)
    ctx.fillRect(x - markerSize / 2, y - markerSize, markerSize, markerSize)

    const date = dateLabel(targetDay)
    const value = money.format(balances[targetDay])
    ctx.font = '12px "Departure Mono", ui-monospace, monospace'
    const labelWidth = Math.max(99, Math.ceil(ctx.measureText(date).width) + 18)
    const labelX = x + labelWidth + 10 < width ? x + 8 : x - labelWidth - 8
    ctx.fillStyle = '#faf9f4'
    ctx.fillRect(labelX, y - 12, labelWidth, 42)
    ctx.fillStyle = colors.ink
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.fillText(date, labelX + 9, y - 1)
    ctx.font = '650 15px "Geist", system-ui, sans-serif'
    ctx.fillText(value, labelX + 9, y + 17)
  }

  function draw(now) {
    frame = 0
    if (!terrain) return
    const t = terrain
    const step = Math.min(64, now - (lastTick ?? now - 16))
    lastTick = now
    const elapsed = reduce.matches ? Infinity : now - (startedAt ?? now)
    const targetColumn = targetDay / lastDay * t.columns
    const glide = 1 - Math.exp(-step / 60)
    drawnColumn = reduce.matches ? targetColumn : lerp(drawnColumn, targetColumn, glide)
    hover = reduce.matches ? Number(pointerLive) : clamp(hover + (pointerLive ? step : -step) / 280, 0, 1)

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    ctx.clearRect(0, 0, t.width, t.height)
    ctx.globalAlpha = Math.min(1, elapsed / 580) * .86
    const ridgeSize = Math.max(2, t.size - 1)
    for (const tile of t.ridges) {
      ctx.fillStyle = tile.color
      ctx.fillRect(tile.x - ridgeSize / 2, tile.y, ridgeSize, ridgeSize)
    }

    const phase = (now - lastMove) / 570
    const ripple = reduce.matches ? 0 : Math.max(0, 1 - phase)
    const reach = clamp(t.width * .14, 66, 105)
    const activeColumn = Math.round(targetColumn)

    for (const tile of t.tiles) {
      const grown = ease(clamp((elapsed - tile.delay) / 330, 0, 1))
      if (!grown) continue
      let y = tile.y + (1 - grown) * 8
      let size = t.size
      let color = tile.color
      if (pointer && hover) {
        const distance = Math.hypot(tile.x - pointer.x, tile.y - pointer.y)
        const near = clamp(1 - distance / reach, 0, 1)
        const boost = hover * near * near * (3 - 2 * near)
        const columnHighlight = tile.column === activeColumn ? .29 * hover : 0
        if (boost > .015 || columnHighlight) {
          color = rgb(mix(tile.tint, colors.citron, Math.max(boost * .62, columnHighlight)))
        }
        if (!reduce.matches && boost > .02) {
          ctx.globalAlpha = .19 * boost * grown
          ctx.fillStyle = colors.ink
          ctx.fillRect(tile.x - size / 2 + 1, y + 2, size, size)
          y -= boost * 14
          size += boost * 1.35
        }
        if (ripple && distance < reach * 1.8) {
          const fade = 1 - distance / (reach * 1.8)
          y -= Math.sin(distance / reach * 9.5 - phase * 12) * ripple * fade * fade * hover * 5
        }
      }
      ctx.globalAlpha = grown * tile.alpha
      ctx.fillStyle = color
      ctx.fillRect(tile.x - size / 2, y, size, size)
    }

    drawMarker(t, elapsed)
    ctx.globalAlpha = 1

    if (!reduce.matches && startedAt !== undefined && (elapsed < 1240 ||
      Math.abs(drawnColumn - targetColumn) > .05 ||
      hover !== Number(pointerLive) || (pointerLive && ripple > 0))) schedule()
  }

  function position(event) {
    if (!terrain) return today
    const box = stage.getBoundingClientRect()
    const x = event.clientX - box.left
    const y = event.clientY - box.top
    const share = (x - terrain.inset) / (terrain.width - 2 * terrain.inset)
    pointer = { x, y }
    return clamp(Math.round(share * lastDay), 0, lastDay)
  }

  function begin() {
    if (startedAt !== undefined) return
    startedAt = performance.now()
    schedule()
  }

  function resetHover() {
    pointerLive = false
    schedule()
  }

  const observer = new ResizeObserver(resize)
  observer.observe(stage)
  resize()
  const intersection = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      begin()
      intersection.disconnect()
    }
  }, { threshold: .25 })
  intersection.observe(stage)
  reduce.addEventListener('change', schedule)
  document.fonts?.ready.then(schedule)

  return {
    move(event) {
      begin()
      pointerLive = true
      lastMove = performance.now()
      schedule()
      return position(event)
    },
    pick(event) {
      begin()
      const day = position(event)
      resetHover()
      return day
    },
    showDay(day) {
      targetDay = day
      schedule()
    },
    resetHover,
    cleanup() {
      disposed = true
      cancelAnimationFrame(frame)
      observer.disconnect()
      intersection.disconnect()
      reduce.removeEventListener('change', schedule)
    },
  }
}

export default function Relief() {
  const canvas = useRef(null)
  const stage = useRef(null)
  const drawing = useRef(null)
  const [selected, setSelected] = useState(today)
  const [hovered, setHovered] = useState(null)
  const day = hovered ?? selected

  useEffect(() => {
    const engine = createDrawing(canvas.current, stage.current)
    drawing.current = engine
    return () => {
      engine?.cleanup()
      drawing.current = null
    }
  }, [])

  useEffect(() => {
    drawing.current?.showDay(day)
  }, [day])

  function leave() {
    drawing.current?.resetHover()
    setHovered(null)
  }

  function pick(event) {
    if (event.button !== 0) return
    const picked = drawing.current?.pick(event)
    if (picked !== undefined) setSelected(picked)
    setHovered(null)
  }

  function choose(event) {
    leave()
    setSelected(Number(event.currentTarget.value))
  }

  return <figure className="kanz-relief">
    <figcaption className="relief-caption">
      <span className="relief-caption-title">Exemple fictif · Octobre</span>
      <span className="relief-legend">
        <span><i className="relief-real-key" aria-hidden="true" /> Réel</span>
        <span><i className="relief-forecast-key" aria-hidden="true" /> Prévision</span>
      </span>
    </figcaption>
    <div
      className="relief-stage"
      ref={stage}
      onPointerMove={(event) => {
        if (event.pointerType !== 'touch') setHovered(drawing.current?.move(event) ?? null)
      }}
      onPointerLeave={leave}
      onPointerCancel={leave}
      onPointerUp={pick}
    >
      <canvas ref={canvas} aria-hidden="true" />
    </div>
    <div className="relief-controls">
      <label className="relief-label">
        <span>Choisir un jour</span>
        <input
          type="range"
          min="0"
          max={lastDay}
          value={selected}
          aria-valuetext={dateLabel(selected) + ' · ' + money.format(balances[selected]) + ' · ' + dayType(selected)}
          onChange={choose}
        />
      </label>
      <p className="relief-selection">
        <span>{dateLabel(day)} · {dayType(day)}</span>
        <strong>{money.format(balances[day])}</strong>
      </p>
    </div>
  </figure>
}
