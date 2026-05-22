import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import axios from "axios"
import LOGO_LOCAL from "./assets/imagenes/BRAVELOGO.png"

// ─── TOKENS DE DISEÑO POR ÁREA ────────────────────────────────────────────────
const TEMAS = {
  c: {
    acento: '#00ffc3',
    acentoRGB: '0,255,195',
    fondoTarjeta:  { dark: '#0d0d12', light: '#ffffff'  },
    fondoImagen:   { dark: '#13131a', light: '#f7f5f2'  },
    fondoPagina:   { dark: '#050507', light: '#f9f7f4'  },
    bordeTarjeta:  { dark: 'rgba(255,255,255,0.07)', light: 'rgba(0,0,0,0.09)' },
    bordeHover:    { dark: 'rgba(0,255,195,0.3)',    light: 'rgba(0,180,130,0.35)' },
    fondoBuscador: { dark: 'rgba(255,255,255,0.04)', light: 'rgba(0,0,0,0.04)' },
    bordeBuscador: { dark: 'rgba(255,255,255,0.09)', light: 'rgba(0,0,0,0.12)' },
    radiusTarjeta: '20px',
    radiusBoton: '10px',
  },
  z: {
    acento: '#00e1ff',
    acentoRGB: '0,225,255',
    fondoTarjeta:  { dark: '#080c10', light: '#f8fbff'  },
    fondoImagen:   { dark: '#0a0f18', light: '#e8f4ff'  },
    fondoPagina:   { dark: '#030508', light: '#f4f8fc'  },
    bordeTarjeta:  { dark: 'rgba(0,225,255,0.08)', light: 'rgba(0,150,200,0.1)' },
    bordeHover:    { dark: 'rgba(0,225,255,0.35)', light: 'rgba(0,150,200,0.4)' },
    fondoBuscador: { dark: 'rgba(0,225,255,0.04)', light: 'rgba(0,150,200,0.05)' },
    bordeBuscador: { dark: 'rgba(0,225,255,0.12)', light: 'rgba(0,150,200,0.15)' },
    radiusTarjeta: '6px',
    radiusBoton: '4px',
  }
}

// ─── Adorno de esquina tipo marco editorial ────────────────────────────────────
function CornerMark({ pos = 'tl', color = '#00ffc3', size = 14, thickness = 1.5 }) {
  const isTop    = pos.startsWith('t')
  const isLeft   = pos.endsWith('l')
  return (
    <div style={{
      position: 'absolute',
      [isTop ? 'top' : 'bottom']: 0,
      [isLeft ? 'left' : 'right']: 0,
      width: size, height: size,
      borderTop:    isTop    ? `${thickness}px solid ${color}` : 'none',
      borderBottom: !isTop   ? `${thickness}px solid ${color}` : 'none',
      borderLeft:   isLeft   ? `${thickness}px solid ${color}` : 'none',
      borderRight:  !isLeft  ? `${thickness}px solid ${color}` : 'none',
      pointerEvents: 'none',
    }} />
  )
}

function App() {
  const [productos, setProductos] = useState([])
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null)
  const [busqueda, setBusqueda] = useState("")
  const [modoOscuro, setModoOscuro] = useState(true)
  const [cargando, setCargando] = useState(true)
  const [errorStatus, setErrorStatus] = useState(null)
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [seccion, setSeccion] = useState(null)

  useEffect(() => {
    axios
      .get("https://opensheet.elk.sh/1CuA_hzHEYS-3w70jBcWyI-0VyYevrqAJV32hwNO4sqw/Productos")
      .then((respuesta) => {
        if (Array.isArray(respuesta.data)) setProductos(respuesta.data)
        setCargando(false)
      })
      .catch(() => setCargando(false))
  }, [])

  const productosFiltrados = productos.filter(p => {
    if (!p.categoria || !p.nombre) return false
    const cat = p.categoria.toString().trim().toLowerCase()
    const sec = seccion?.toString().trim().toLowerCase()
    return cat === sec && p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  })

  const obtenerEstilosSeccion = () => {
    if (seccion === 'c') return {
      claseContenedor: "font-['-apple-system',BlinkMacSystemFont,'Segoe_UI',Roboto,Helvetica,Arial,sans-serif]",
      claseTitulo:     "font-extrabold tracking-tight normal-case",
      claseTarjeta:    "font-semibold normal-case"
    }
    if (seccion === 'z') return {
      claseContenedor: "font-['Impact','Arial_Black',sans-serif] tracking-wider uppercase",
      claseTitulo:     "font-normal italic tracking-wide uppercase",
      claseTarjeta:    "font-normal italic uppercase tracking-normal"
    }
    return {
      claseContenedor: "font-['-apple-system',BlinkMacSystemFont,'Segoe_UI',sans-serif]",
      claseTitulo:     "font-bold",
      claseTarjeta:    "font-normal"
    }
  }

  const estilos = obtenerEstilosSeccion()
  const tema    = seccion ? TEMAS[seccion] : null
  const acento  = tema?.acento ?? '#ffffff'
  const modo    = modoOscuro ? 'dark' : 'light'

  // ── Variables adaptativas globales ──────────────────────────────────────────
  const bgPagina     = tema ? tema.fondoPagina[modo]              : (modoOscuro ? '#030303' : '#f4f4f2')
  const textPrimario = modoOscuro ? '#ececec'                     : '#0f0f0f'
  const textSutil    = modoOscuro ? 'rgba(255,255,255,0.36)'      : 'rgba(0,0,0,0.42)'
  const bgNav        = modoOscuro ? 'rgba(5,5,7,0.94)'            : 'rgba(249,247,244,0.94)'
  const bordeNav     = modoOscuro ? 'rgba(255,255,255,0.06)'      : 'rgba(0,0,0,0.09)'
  const bgMenu       = modoOscuro ? 'rgba(12,12,18,0.97)'         : 'rgba(255,255,255,0.98)'
  const bordeMenu    = modoOscuro ? 'rgba(255,255,255,0.09)'      : 'rgba(0,0,0,0.1)'

  // Color de acento adaptado al modo claro para que tenga contraste visible
  const acentoVisible = seccion === 'c'
    ? (modoOscuro ? '#00ffc3' : '#009e78')
    : (modoOscuro ? '#00e1ff' : '#007aad')

  return (
    <div
      className={`${estilos.claseContenedor} min-h-screen transition-colors duration-500`}
      style={{ backgroundColor: bgPagina, color: textPrimario }}
    >
      <AnimatePresence mode="wait">

        {/* ══════════════════════════════════════════
            ÁREA 1 — PANTALLA DE SELECCIÓN
        ══════════════════════════════════════════ */}
        {!seccion ? (
          <motion.div
            key="seleccion"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.5 }}
            className="h-screen w-full flex flex-col md:flex-row relative overflow-hidden"
            style={{ backgroundColor: '#030303' }}
          >

            {/* Panel izquierdo — Chaquetas */}
            <div
              onClick={() => setSeccion('c')}
              className="group relative flex-1 flex items-center overflow-hidden cursor-pointer"
              style={{ backgroundColor: '#0a0a0a' }}
            >
              <img
                src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000"
                className="absolute inset-0 w-full h-full object-cover grayscale opacity-25 group-hover:scale-105 group-hover:grayscale-0 group-hover:opacity-45 transition-all duration-1000"
                alt="Chaquetas"
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 100%)' }} />
              <div className="absolute left-0 top-0 bottom-0 w-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: 'linear-gradient(to bottom, transparent, #00ffc3, transparent)' }} />

              <div className="relative z-10 pl-10 md:pl-14 lg:pl-20 pr-4">
                <div className="inline-flex items-center gap-2 mb-5 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <span style={{ width: 20, height: 1, background: '#00ffc3', display: 'inline-block' }} />
                  <span className="text-[10px] font-bold tracking-[0.4em] uppercase" style={{ color: '#00ffc3' }}>
                    Colección Urbana
                  </span>
                </div>
                <h2 className="text-white text-5xl md:text-6xl lg:text-7xl font-black italic tracking-tighter leading-none"
                  style={{ textShadow: '0 0 50px rgba(0,255,195,0.12)' }}>
                  CHAQUETAS
                </h2>
                <div className="mt-5 h-[1px] w-0 group-hover:w-28 transition-all duration-700"
                  style={{ background: 'linear-gradient(to right, #00ffc3, transparent)' }} />
                <p className="mt-4 text-xs tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100 font-sans normal-case"
                  style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Explorar catálogo →
                </p>
              </div>
            </div>

            {/* Panel derecho — Zapatillas */}
            <div
              onClick={() => setSeccion('z')}
              className="group relative flex-1 flex items-center justify-end overflow-hidden cursor-pointer"
              style={{ backgroundColor: '#060a0e' }}
            >
              <img
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000"
                className="absolute inset-0 w-full h-full object-cover grayscale opacity-25 group-hover:scale-105 group-hover:grayscale-0 group-hover:opacity-45 transition-all duration-1000"
                alt="Zapatillas"
              />
              <div className="absolute inset-0"
                style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(0,20,35,0.7) 60%, rgba(0,0,0,0.92) 100%)' }} />
              <div className="absolute right-0 top-0 bottom-0 w-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: 'linear-gradient(to bottom, transparent, #00e1ff 40%, #0066ff, transparent)' }} />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                {[20, 40, 60, 80].map(p => (
                  <div key={p} className="absolute top-0 bottom-0"
                    style={{ left: `${p}%`, width: '1px', background: 'linear-gradient(to bottom, transparent, rgba(0,225,255,0.04), transparent)' }} />
                ))}
              </div>
              <div className="relative z-10 pr-10 md:pr-14 lg:pr-20 pl-4 text-right">
                <div className="flex justify-end items-center gap-2 mb-5 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <span className="text-[10px] font-bold tracking-[0.4em] uppercase" style={{ color: '#00e1ff' }}>Línea Performance</span>
                  <span style={{ width: 20, height: 2, background: 'linear-gradient(to right, #00e1ff, #0066ff)', display: 'inline-block' }} />
                </div>
                <h2 className="text-white text-5xl md:text-6xl lg:text-7xl font-black italic tracking-tighter leading-none"
                  style={{ textShadow: '0 0 50px rgba(0,225,255,0.18), 0 0 100px rgba(0,80,255,0.08)' }}>
                  ZAPATILLAS
                </h2>
                <div className="mt-5 h-[2px] w-0 ml-auto group-hover:w-28 transition-all duration-700"
                  style={{ background: 'linear-gradient(to left, #00e1ff, #0044cc, transparent)' }} />
                <p className="mt-4 text-xs tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100 font-sans normal-case"
                  style={{ color: 'rgba(0,225,255,0.6)' }}>
                  Ver colección →
                </p>
              </div>
            </div>

            {/* Divisor central */}
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] z-20"
              style={{ background: 'linear-gradient(to bottom, transparent 5%, rgba(255,255,255,0.07) 30%, rgba(255,255,255,0.07) 70%, transparent 95%)' }} />

            {/* Logo central */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
              <motion.img
                initial={{ scale: 0.75, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                src={LOGO_LOCAL}
                className="h-44 w-44 md:h-64 md:w-64 lg:h-80 lg:w-80 rounded-full object-cover"
                style={{ border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 0 0 10px rgba(255,255,255,0.02), 0 0 70px rgba(255,255,255,0.06)' }}
                alt="Logo Brave"
              />
            </div>
          </motion.div>

        ) : (

          /* ══════════════════════════════════════════
              ÁREA 2 — TIENDA
          ══════════════════════════════════════════ */
          <motion.div
            key="tienda"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            style={{ backgroundColor: bgPagina, minHeight: '100vh' }}
          >

            {/* ── NAV ── */}
            <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md transition-all duration-500"
              style={{ backgroundColor: bgNav, borderBottom: `1px solid ${bordeNav}` }}>
              {/* Línea de acento dinámica */}
              <div style={{
                height: seccion === 'z' ? '2px' : '1px',
                background: seccion === 'z'
                  ? `linear-gradient(to right, transparent, ${acentoVisible}, #0055ff88, transparent)`
                  : `linear-gradient(to right, transparent, ${acentoVisible}80, transparent)`,
              }} />
              <div className="max-w-7xl mx-auto px-6 py-4 grid grid-cols-3 items-center">

                {/* Contacto */}
                <div className="relative">
                  <button onClick={() => setMenuAbierto(!menuAbierto)}
                    className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase transition-opacity hover:opacity-60"
                    style={{ color: textPrimario }}>
                    Contacto
                    <span className="text-[9px]" style={{ color: textSutil }}>{menuAbierto ? '▲' : '▼'}</span>
                  </button>
                  <AnimatePresence>
                    {menuAbierto && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 8 }} exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 mt-4 p-5 min-w-[240px]"
                        style={{
                          backgroundColor: bgMenu, border: `1px solid ${bordeMenu}`,
                          borderRadius: '12px', backdropFilter: 'blur(24px)',
                          boxShadow: modoOscuro ? '0 24px 60px rgba(0,0,0,0.6)' : '0 12px 40px rgba(0,0,0,0.14)',
                        }}>
                        <a href="https://wa.me/59164216409" target="_blank" rel="noreferrer"
                          className="block pb-4 mb-4 transition-all"
                          style={{ borderBottom: `1px solid ${modoOscuro ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.07)'}` }}>
                          <span className="block text-[9px] font-bold tracking-[0.3em] uppercase mb-1" style={{ color: modoOscuro ? TEMAS.c.acento : '#009e78' }}>
                            Línea Chaquetas
                          </span>
                          <span className="text-sm font-semibold" style={{ color: textPrimario }}>64216409</span>
                        </a>
                        <a href="https://wa.me/59177538126" target="_blank" rel="noreferrer" className="block transition-all">
                          <span className="block text-[9px] font-bold tracking-[0.3em] uppercase mb-1" style={{ color: modoOscuro ? TEMAS.z.acento : '#007aad' }}>
                            Línea Zapatillas
                          </span>
                          <span className="text-sm font-semibold" style={{ color: textPrimario }}>77538126</span>
                        </a>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Logo */}
                <div className="flex justify-center">
                  <img src={LOGO_LOCAL} onClick={() => setSeccion(null)}
                    className="h-14 w-14 md:h-16 md:w-16 rounded-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                    style={{
                      border: `1px solid ${modoOscuro ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.14)'}`,
                      boxShadow: `0 0 20px rgba(${tema?.acentoRGB ?? '255,255,255'},0.07)`,
                    }}
                    alt="Inicio" />
                </div>

                {/* Modo */}
                <div className="flex justify-end">
                  <button onClick={() => setModoOscuro(!modoOscuro)}
                    className="text-[9px] font-bold tracking-widest uppercase px-4 py-2 transition-all hover:opacity-70"
                    style={{
                      border: `1px solid ${modoOscuro ? 'rgba(255,255,255,0.13)' : 'rgba(0,0,0,0.16)'}`,
                      borderRadius: seccion === 'z' ? '4px' : '6px',
                      color: textPrimario,
                      backgroundColor: modoOscuro ? 'transparent' : 'rgba(0,0,0,0.03)',
                    }}>
                    {modoOscuro ? 'Modo Claro' : 'Modo Oscuro'}
                  </button>
                </div>
              </div>
            </nav>

            <div className="p-6 md:p-10 pt-36 md:pt-44 max-w-7xl mx-auto">

              {/* ══ HEADER — bifurcado por sección ══════════════════════════════ */}
              <header className="mb-14 text-center relative">

                {seccion === 'c' ? (
                  /* ─── HEADER CHAQUETAS: estética editorial de revista de moda ─── */
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55 }}
                  >
                    {/* Marco decorativo de esquinas alrededor de todo el header */}
                    <div className="relative inline-block px-12 py-8 md:px-20 md:py-10">
                      {/* Esquinas del marco */}
                      <CornerMark pos="tl" color={acentoVisible} size={18} thickness={1.5} />
                      <CornerMark pos="tr" color={acentoVisible} size={18} thickness={1.5} />
                      <CornerMark pos="bl" color={acentoVisible} size={18} thickness={1.5} />
                      <CornerMark pos="br" color={acentoVisible} size={18} thickness={1.5} />

                      {/* Etiqueta superior */}
                      <div className="flex items-center justify-center gap-3 mb-5">
                        <span style={{ width: 24, height: '1px', background: acentoVisible, display: 'block', opacity: 0.7 }} />
                        <span className="text-[9px] font-bold tracking-[0.5em] uppercase" style={{ color: acentoVisible }}>
                          Temporada Actual
                        </span>
                        <span style={{ width: 24, height: '1px', background: acentoVisible, display: 'block', opacity: 0.7 }} />
                      </div>

                      {/* Título principal */}
                      <h1
                        className={`${estilos.claseTitulo} leading-none`}
                        style={{
                          fontSize: 'clamp(3rem, 10vw, 6.5rem)',
                          color: textPrimario,
                          letterSpacing: '-0.03em',
                        }}
                      >
                        Chaquetas
                      </h1>

                      {/* Subtítulo editorial */}
                      <p
                        className="mt-3 text-[11px] tracking-[0.35em] uppercase font-sans normal-case"
                        style={{ color: textSutil }}
                      >
                        Colección Urbana · Diseño Premium
                      </p>
                    </div>

                    {/* Divisor inferior del header */}
                    <div className="flex items-center justify-center gap-4 mt-4 mb-6">
                      <span style={{ flex: 1, maxWidth: 80, height: '1px', background: `linear-gradient(to right, transparent, ${acentoVisible}60)` }} />
                      <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: acentoVisible, opacity: 0.6 }} />
                      <span style={{ width: 24, height: '1px', backgroundColor: acentoVisible, opacity: 0.4, display: 'block' }} />
                      <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: acentoVisible, opacity: 0.6 }} />
                      <span style={{ flex: 1, maxWidth: 80, height: '1px', background: `linear-gradient(to left, transparent, ${acentoVisible}60)` }} />
                    </div>
                  </motion.div>

                ) : (
                  /* ─── HEADER ZAPATILLAS: sport/performance ─── */
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
                      style={{ fontSize: 'clamp(8rem, 25vw, 18rem)', fontFamily: 'Impact, Arial Black, sans-serif', fontStyle: 'italic',
                        color: modoOscuro ? 'rgba(0,225,255,0.03)' : 'rgba(0,150,200,0.05)', lineHeight: 1, letterSpacing: '-0.05em', top: '-2rem' }}>
                      RUN
                    </div>
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <span style={{ flex: 1, maxWidth: 60, height: 2, background: `linear-gradient(to right, transparent, ${acentoVisible})` }} />
                      <span className="text-[9px] font-bold tracking-[0.45em] uppercase" style={{ color: acentoVisible }}>Performance Collection</span>
                      <span style={{ flex: 1, maxWidth: 60, height: 2, background: `linear-gradient(to left, transparent, ${modoOscuro ? '#0055ff' : '#007aad'})` }} />
                    </div>
                    <h1 className={`${estilos.claseTitulo} leading-none mb-6 relative z-10`}
                      style={{ fontSize: 'clamp(3.5rem, 12vw, 8rem)', color: textPrimario,
                        textShadow: modoOscuro ? `0 0 60px rgba(0,225,255,0.12)` : 'none', letterSpacing: '-0.03em' }}>
                      ZAPATILLAS
                    </h1>
                    <div className="flex items-center justify-center gap-8 mt-2 mb-6 font-sans normal-case" style={{ color: textSutil }}>
                      {['Tenis', 'Running', 'Lifestyle', 'Basketball'].map((tag, i) => (
                        <span key={i} className="text-[9px] tracking-widest uppercase hidden md:block">{tag}</span>
                      ))}
                    </div>
                  </motion.div>
                )}

                <button onClick={() => setSeccion(null)}
                  className="text-[9px] font-bold tracking-widest uppercase transition-opacity hover:opacity-100 font-sans normal-case"
                  style={{ opacity: 0.35, borderBottom: '1px solid currentColor', paddingBottom: '2px', color: textPrimario }}>
                  Volver al menú principal
                </button>
              </header>

              {/* ══ BUSCADOR ══════════════════════════════════════════════════ */}
              <div className="flex justify-center mb-14">
                {seccion === 'z' ? (
                  <div className="relative w-full md:w-[500px]">
                    <div className="absolute left-0 top-0 bottom-0 w-[3px]"
                      style={{ background: `linear-gradient(to bottom, ${acentoVisible}, ${modoOscuro ? '#0055ff' : '#007aad'})` }} />
                    <input type="text" placeholder="Buscar modelo, marca, estilo..."
                      value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
                      className="w-full text-sm outline-none font-sans normal-case"
                      style={{ padding: '14px 18px 14px 22px', backgroundColor: tema.fondoBuscador[modo],
                        color: textPrimario, border: `1px solid ${tema.bordeBuscador[modo]}`,
                        borderLeft: 'none', borderRadius: '0 4px 4px 0', letterSpacing: '0.02em' }}
                      onFocus={e => { e.target.style.borderColor = acentoVisible + '55'; e.target.style.boxShadow = `0 0 0 3px rgba(${tema.acentoRGB},0.07)` }}
                      onBlur={e => { e.target.style.borderColor = tema.bordeBuscador[modo]; e.target.style.boxShadow = 'none' }} />
                  </div>
                ) : (
                  /* Buscador Chaquetas: con marco de esquinas */
                  <div className="relative w-full md:w-[480px]">
                    <CornerMark pos="tl" color={acentoVisible} size={10} thickness={1} />
                    <CornerMark pos="tr" color={acentoVisible} size={10} thickness={1} />
                    <CornerMark pos="bl" color={acentoVisible} size={10} thickness={1} />
                    <CornerMark pos="br" color={acentoVisible} size={10} thickness={1} />
                    <input type="text" placeholder="Buscar artículo..."
                      value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
                      className="w-full text-sm outline-none font-sans normal-case transition-all duration-300"
                      style={{ padding: '14px 20px', backgroundColor: tema.fondoBuscador[modo],
                        color: textPrimario, border: `1px solid ${tema.bordeBuscador[modo]}`,
                        borderRadius: '10px' }}
                      onFocus={e => { e.target.style.borderColor = acentoVisible + '50'; e.target.style.boxShadow = `0 0 0 3px rgba(${tema.acentoRGB},0.07)` }}
                      onBlur={e => { e.target.style.borderColor = tema.bordeBuscador[modo]; e.target.style.boxShadow = 'none' }} />
                  </div>
                )}
              </div>

              {/* ══ GRID DE PRODUCTOS ════════════════════════════════════════ */}
              {!cargando && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                  {productosFiltrados.map((producto, index) => {
                    const numeroDestino = seccion === 'c' ? "59164216409" : "59177538126"

                    return seccion === 'z' ? (

                      /* ═══ TARJETA ZAPATILLAS (sport) ═══════════════════════ */
                      <motion.div key={index}
                        initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: index * 0.05, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                        className="group overflow-hidden relative"
                        style={{
                          backgroundColor: tema.fondoTarjeta[modo],
                          border: `1px solid ${tema.bordeTarjeta[modo]}`,
                          borderLeft: `3px solid ${acentoVisible}`,
                          borderRadius: tema.radiusTarjeta,
                          transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = tema.bordeHover[modo]
                          e.currentTarget.style.borderLeftColor = acentoVisible
                          e.currentTarget.style.boxShadow = modoOscuro
                            ? `0 0 0 1px rgba(0,225,255,0.1), 0 16px 50px rgba(0,0,0,0.5)`
                            : `0 8px 30px rgba(0,150,200,0.18)`
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = tema.bordeTarjeta[modo]
                          e.currentTarget.style.borderLeftColor = acentoVisible
                          e.currentTarget.style.boxShadow = 'none'
                        }}>
                        <div className="w-full overflow-hidden relative" style={{ height: '300px', backgroundColor: tema.fondoImagen[modo] }}>
                          <img src={producto.imagen} onClick={() => setImagenSeleccionada(producto.imagen)}
                            className="w-full h-full object-cover cursor-pointer transition-transform duration-700"
                            style={{ transform: 'scale(1)' }}
                            onMouseEnter={e => e.target.style.transform = 'scale(1.07)'}
                            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                            alt={producto.nombre} />
                          <div className="absolute bottom-0 left-0 right-0" style={{ height: '60px',
                            background: modoOscuro ? 'linear-gradient(to top, rgba(8,12,16,1), transparent)' : 'linear-gradient(to top, rgba(248,251,255,0.95), transparent)' }} />
                          <div className="absolute top-0 right-0 font-black italic text-white flex items-center gap-1"
                            style={{ backgroundColor: '#000', padding: '8px 13px', fontSize: '1rem',
                              borderLeft: `2px solid ${acentoVisible}`, borderBottom: `2px solid ${acentoVisible}`, borderBottomLeftRadius: '6px' }}>
                            {producto.precio}
                          </div>
                          <div className="absolute top-3 left-3 font-bold uppercase tracking-widest"
                            style={{ fontSize: '8px', padding: '3px 8px',
                              backgroundColor: `rgba(${tema.acentoRGB},0.12)`,
                              border: `1px solid rgba(${tema.acentoRGB},0.25)`,
                              borderRadius: '3px', color: acentoVisible }}>
                            Performance
                          </div>
                        </div>
                        <div className="p-6">
                          <h2 className={`${estilos.claseTarjeta} text-xl mb-1 leading-tight`} style={{ color: textPrimario }}>
                            {producto.nombre}
                          </h2>
                          <p className="text-xs mb-5 h-8 line-clamp-2 font-sans normal-case" style={{ color: textSutil }}>
                            {producto.descripcion}
                          </p>
                          <div className="flex items-center justify-between mb-6 font-sans normal-case">
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-bold tracking-widest uppercase" style={{ color: textSutil }}>TALLA</span>
                              <span className="text-xs font-black italic" style={{ color: acentoVisible }}>{producto.talla}</span>
                            </div>
                            <div className="flex gap-[3px]">
                              {[1,2,3,4,5].map(b => (
                                <div key={b} style={{ width: 12, height: 4, backgroundColor: b <= 4 ? acentoVisible : `rgba(${tema.acentoRGB},0.15)`, borderRadius: '1px', opacity: b <= 4 ? (1 - b * 0.08) : 1 }} />
                              ))}
                            </div>
                          </div>
                          <a href={`https://wa.me/${numeroDestino}?text=Hola! Me interesa el siguiente artículo: ${producto.nombre}`}
                            target="_blank" rel="noreferrer"
                            className="block w-full text-center font-black tracking-widest text-xs uppercase font-sans normal-case transition-all duration-300"
                            style={{ padding: '13px', borderRadius: tema.radiusBoton,
                              border: `1px solid ${acentoVisible}`,
                              backgroundColor: `rgba(${tema.acentoRGB},0.08)`, color: acentoVisible, letterSpacing: '0.12em' }}
                            onMouseEnter={e => { e.currentTarget.style.backgroundColor = acentoVisible; e.currentTarget.style.color = '#000'; e.currentTarget.style.boxShadow = `0 0 20px rgba(${tema.acentoRGB},0.3)` }}
                            onMouseLeave={e => { e.currentTarget.style.backgroundColor = `rgba(${tema.acentoRGB},0.08)`; e.currentTarget.style.color = acentoVisible; e.currentTarget.style.boxShadow = 'none' }}>
                            Pedir vía WhatsApp
                          </a>
                        </div>
                      </motion.div>

                    ) : (

                      /* ═══ TARJETA CHAQUETAS (editorial premium) ════════════ */
                      <motion.div key={index}
                        initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: index * 0.05, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                        className="group relative overflow-visible"
                        style={{
                          backgroundColor: tema.fondoTarjeta[modo],
                          border: `1px solid ${tema.bordeTarjeta[modo]}`,
                          borderRadius: tema.radiusTarjeta,
                          transition: 'border-color 0.35s ease, box-shadow 0.35s ease',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = tema.bordeHover[modo]
                          e.currentTarget.style.boxShadow = modoOscuro
                            ? `0 2px 0 0 ${acentoVisible}40, 0 16px 50px rgba(0,0,0,0.45)`
                            : `0 2px 0 0 ${acentoVisible}50, 0 10px 36px rgba(0,0,0,0.1)`
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = tema.bordeTarjeta[modo]
                          e.currentTarget.style.boxShadow = 'none'
                        }}>

                        {/* Marco de esquinas decorativo en la tarjeta */}
                        <div style={{ position: 'absolute', inset: '-1px', borderRadius: tema.radiusTarjeta, pointerEvents: 'none', overflow: 'hidden' }}>
                          <CornerMark pos="tl" color={acentoVisible} size={16} thickness={1.5} />
                          <CornerMark pos="tr" color={acentoVisible} size={16} thickness={1.5} />
                          <CornerMark pos="bl" color={acentoVisible} size={16} thickness={1.5} />
                          <CornerMark pos="br" color={acentoVisible} size={16} thickness={1.5} />
                        </div>

                        {/* Imagen editorial */}
                        <div className="w-full overflow-hidden relative"
                          style={{ height: '320px', backgroundColor: tema.fondoImagen[modo],
                            borderRadius: `${tema.radiusTarjeta} ${tema.radiusTarjeta} 0 0` }}>
                          <img src={producto.imagen}
                            onClick={() => setImagenSeleccionada(producto.imagen)}
                            className="w-full h-full object-cover cursor-pointer transition-transform duration-700"
                            style={{ transform: 'scale(1)' }}
                            onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                            alt={producto.nombre} />

                          {/* Overlay gradiente en imagen — más limpio en modo claro */}
                          <div className="absolute bottom-0 left-0 right-0" style={{ height: '80px',
                            background: modoOscuro
                              ? 'linear-gradient(to top, rgba(13,13,18,0.95), transparent)'
                              : 'linear-gradient(to top, rgba(255,255,255,0.85), transparent)' }} />

                          {/* Precio editorial chaquetas */}
                          <div className="absolute top-0 right-0"
                            style={{
                              backgroundColor: modoOscuro ? '#000' : '#111',
                              padding: '7px 14px',
                              fontStyle: 'italic',
                              fontWeight: 900,
                              fontSize: '1rem',
                              color: '#fff',
                              borderBottomLeftRadius: '12px',
                              borderLeft: `2px solid ${acentoVisible}70`,
                              borderBottom: `2px solid ${acentoVisible}70`,
                              letterSpacing: '-0.02em',
                            }}>
                            {producto.precio}
                          </div>

                          {/* Badge editorial "Urbano" */}
                          <div className="absolute bottom-4 left-5"
                            style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.3em',
                              textTransform: 'uppercase', color: acentoVisible, opacity: 0.9,
                              fontFamily: 'system-ui, sans-serif' }}>
                            Urban Collection
                          </div>
                        </div>

                        {/* Info editorial chaqueta */}
                        <div className="p-7">
                          {/* Línea de acento tenue sobre el nombre */}
                          <div style={{ width: 28, height: 2, backgroundColor: acentoVisible, opacity: 0.5, marginBottom: '10px', borderRadius: '2px' }} />

                          <h2 className={`${estilos.claseTarjeta} text-xl mb-2 leading-tight`} style={{ color: textPrimario }}>
                            {producto.nombre}
                          </h2>
                          <p className="text-sm mb-5 h-10 line-clamp-2 font-sans normal-case" style={{ color: textSutil }}>
                            {producto.descripcion}
                          </p>

                          {/* Fila de talla con separador visual */}
                          <div className="flex justify-between items-center mb-7 font-sans normal-case pb-5"
                            style={{ borderBottom: `1px solid ${modoOscuro ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.07)'}` }}>
                            <div className="flex items-center gap-3">
                              <span className="text-[9px] font-bold tracking-widest uppercase" style={{ color: textSutil }}>Talla</span>
                              {/* Talla como chip */}
                              <span className="font-bold text-xs"
                                style={{
                                  padding: '2px 10px',
                                  border: `1px solid ${acentoVisible}40`,
                                  borderRadius: '20px',
                                  color: modoOscuro ? '#e0e0e0' : '#111',
                                  backgroundColor: modoOscuro ? `rgba(${tema.acentoRGB},0.06)` : `rgba(${tema.acentoRGB},0.08)`,
                                  fontFamily: 'system-ui, sans-serif',
                                }}>
                                {producto.talla}
                              </span>
                            </div>
                          </div>

                          {/* Botón Chaquetas: outline fino con hover sólido */}
                          <a href={`https://wa.me/${numeroDestino}?text=Hola! Me interesa el siguiente artículo: ${producto.nombre}`}
                            target="_blank" rel="noreferrer"
                            className="block w-full text-center font-bold tracking-widest text-xs uppercase font-sans normal-case transition-all duration-300"
                            style={{
                              padding: '14px',
                              borderRadius: tema.radiusBoton,
                              border: `1px solid ${modoOscuro ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.18)'}`,
                              backgroundColor: 'transparent',
                              color: textPrimario,
                              letterSpacing: '0.1em',
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.backgroundColor = acentoVisible
                              e.currentTarget.style.borderColor = acentoVisible
                              e.currentTarget.style.color = '#000'
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.backgroundColor = 'transparent'
                              e.currentTarget.style.borderColor = modoOscuro ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.18)'
                              e.currentTarget.style.color = textPrimario
                            }}>
                            Pedir vía WhatsApp
                          </a>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}

              {/* Estado vacío */}
              {!cargando && productosFiltrados.length === 0 && (
                <div className="text-center py-32" style={{ color: textSutil }}>
                  <p className="text-xs tracking-widest uppercase font-sans normal-case">
                    Sin resultados para tu búsqueda
                  </p>
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════
          ÁREA 3 — MODAL DE IMAGEN
      ══════════════════════════════════════════ */}
      <AnimatePresence>
        {imagenSeleccionada && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 flex justify-center items-center z-[100] p-4 cursor-zoom-out"
            style={{ backgroundColor: 'rgba(0,0,0,0.96)' }}
            onClick={() => setImagenSeleccionada(null)}>
            <motion.img
              initial={{ scale: 0.88, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              src={imagenSeleccionada}
              className="max-w-full max-h-[90vh] object-contain"
              style={{ borderRadius: '4px' }}
              alt="Vista ampliada" />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}

export default App