"use client"

import { useState } from "react"
import { Sparkles } from "lucide-react"
import { createTarea } from "../actions"

function normalize(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
}

function matchMateriaId(nombre, materias) {
  if (!nombre) return ""
  const busqueda = normalize(nombre)
  const exact = materias.find((m) => normalize(m.nombre) === busqueda)
  if (exact) return exact.id
  const parcial = materias.find((m) => {
    const mn = normalize(m.nombre)
    return mn.includes(busqueda) || busqueda.includes(mn)
  })
  return parcial?.id ?? ""
}

function toDatetimeLocal(fecha, hora) {
  const h = hora && /^\d{2}:\d{2}$/.test(hora) ? hora : "23:59"
  return `${fecha}T${h}`
}

export default function TareaForm({ alumnos, materias, labels, iaLabels, iaEnabled }) {
  const [aviso, setAviso] = useState("")
  const [iaLoading, setIaLoading] = useState(false)
  const [iaMessage, setIaMessage] = useState(null)
  const [iaError, setIaError] = useState(null)

  const [titulo, setTitulo] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [fechaEntrega, setFechaEntrega] = useState("")
  const [materiaId, setMateriaId] = useState("")
  const [prioridad, setPrioridad] = useState("")

  async function parseAviso() {
    setIaLoading(true)
    setIaMessage(null)
    setIaError(null)
    try {
      const res = await fetch("/api/ai/parse-aviso", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto: aviso }),
      })
      const body = await res.json()
      if (!res.ok) throw new Error(body.error || iaLabels.error)

      const t = body.tarea
      setTitulo(t.titulo || "")
      setDescripcion(
        [t.descripcion, t.tipo_entrega ? `Tipo: ${t.tipo_entrega}` : ""]
          .filter(Boolean)
          .join(" · ")
      )
      setFechaEntrega(toDatetimeLocal(t.fecha_entrega, t.hora_limite))
      setMateriaId(matchMateriaId(t.materia, materias))
      setPrioridad(t.prioridad || "")
      setIaMessage(
        `${iaLabels.success} Recordatorios sugeridos: ${(t.dias_antes_recordatorio || []).join(", ")} días antes.`
      )
    } catch (err) {
      setIaError(err.message)
    } finally {
      setIaLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {iaEnabled && (
        <div className="rounded-box border border-primary/25 bg-primary/5 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary">
            <Sparkles className="size-4" />
            {iaLabels.title}
          </div>
          <textarea
            value={aviso}
            onChange={(e) => setAviso(e.target.value)}
            placeholder={iaLabels.placeholder}
            rows={4}
            className="textarea textarea-bordered w-full text-sm"
          />
          <button
            type="button"
            onClick={parseAviso}
            disabled={iaLoading || !aviso.trim()}
            className="btn btn-primary btn-sm mt-3"
          >
            {iaLoading && <span className="loading loading-spinner loading-sm" />}
            {iaLoading ? iaLabels.loading : iaLabels.button}
          </button>
          {iaMessage && (
            <p role="status" className="mt-2 text-sm text-success">
              {iaMessage}
            </p>
          )}
          {iaError && (
            <p role="alert" className="mt-2 text-sm text-error">
              {iaError}
            </p>
          )}
        </div>
      )}

      <form action={createTarea} className="rounded-box border border-base-200 bg-base-100 p-4">
        <h2 className="mb-4 text-sm font-semibold">{labels.title}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="form-control">
            <span className="label-text mb-1">{labels.alumno.label}</span>
            <select name="alumno_id" required className="select select-bordered" defaultValue="">
              <option value="" disabled>
                Selecciona alumno
              </option>
              {alumnos.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nombre}
                </option>
              ))}
            </select>
          </label>
          <label className="form-control">
            <span className="label-text mb-1">{labels.materia.label}</span>
            <select
              name="materia_id"
              className="select select-bordered"
              value={materiaId}
              onChange={(e) => setMateriaId(e.target.value)}
            >
              <option value="">Sin materia</option>
              {materias.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nombre}
                </option>
              ))}
            </select>
          </label>
          <label className="form-control sm:col-span-2">
            <span className="label-text mb-1">{labels.titulo.label}</span>
            <input
              name="titulo"
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder={labels.titulo.placeholder}
              className="input input-bordered"
            />
          </label>
          <label className="form-control sm:col-span-2">
            <span className="label-text mb-1">{labels.descripcion.label}</span>
            <input
              name="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder={labels.descripcion.placeholder}
              className="input input-bordered"
            />
          </label>
          {prioridad && (
            <p className="sm:col-span-2 text-xs text-base-content/60">
              Prioridad detectada:{" "}
              <span className="badge badge-ghost badge-sm capitalize">{prioridad}</span>
            </p>
          )}
          <label className="form-control">
            <span className="label-text mb-1">{labels.fecha.label}</span>
            <input
              name="fecha_entrega"
              type="datetime-local"
              required
              value={fechaEntrega}
              onChange={(e) => setFechaEntrega(e.target.value)}
              className="input input-bordered"
            />
          </label>
          <div className="flex items-end">
            <button type="submit" className="btn btn-primary w-full">
              {labels.submit}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
