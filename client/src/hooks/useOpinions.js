import { useState, useEffect } from 'react'

// Misma base que el resto de la app (VITE_API_URL): así en el deploy no
// queda apuntando a localhost.
const API_BASE = (import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api').replace(/\/+$/, '')
const API_URL = `${API_BASE}/opiniones`

export function useOpinions() {
  const [opiniones, setOpiniones] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  const fetchOpiniones = async () => {
    try {
      setCargando(true)
      setError(null)
      const res = await fetch(API_URL)
      if (!res.ok) throw new Error('Error al cargar las opiniones')
      setOpiniones(await res.json())
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    fetchOpiniones()
  }, [])

  return { opiniones, cargando, error, reintentar: fetchOpiniones }
}