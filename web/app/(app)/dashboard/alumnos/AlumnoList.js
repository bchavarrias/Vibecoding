"use client"

import { useState } from "react"
import { Pencil, Trash2, X, Check } from "lucide-react"
import { updateAlumno, deleteAlumno } from "../actions"

export default function AlumnoList({ alumnos, labels }) {
  const [editingId, setEditingId] = useState(null)

  if (!alumnos.length) {
    return (
      <div className="rounded-box border border-dashed border-base-300 bg-base-100 px-4 py-12 text-center text-base-content/60">
        {labels.empty}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-box border border-base-200 bg-base-100">
      <h2 className="border-b border-base-200 px-4 py-3 text-sm font-semibold">{labels.title}</h2>
      <table className="table">
        <thead>
          <tr>
            <th>{labels.columns.nombre}</th>
            <th>{labels.columns.celular}</th>
            <th>{labels.columns.correo}</th>
            <th className="w-28 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {alumnos.map((alumno) =>
            editingId === alumno.id ? (
              <tr key={alumno.id}>
                <td colSpan={4}>
                  <form
                    action={async (formData) => {
                      await updateAlumno(formData)
                      setEditingId(null)
                    }}
                    className="flex flex-col gap-3 p-2 sm:flex-row sm:items-end"
                  >
                    <input type="hidden" name="id" value={alumno.id} />
                    <label className="form-control flex-1">
                      <span className="label-text text-xs">{labels.columns.nombre}</span>
                      <input
                        name="nombre"
                        required
                        maxLength={120}
                        defaultValue={alumno.nombre}
                        className="input input-bordered input-sm"
                      />
                    </label>
                    <label className="form-control flex-1">
                      <span className="label-text text-xs">{labels.columns.celular}</span>
                      <input
                        name="celular"
                        required
                        maxLength={20}
                        defaultValue={alumno.celular}
                        className="input input-bordered input-sm"
                      />
                    </label>
                    <label className="form-control flex-1">
                      <span className="label-text text-xs">{labels.columns.correo}</span>
                      <input
                        name="correo"
                        type="email"
                        required
                        maxLength={120}
                        defaultValue={alumno.correo}
                        className="input input-bordered input-sm"
                      />
                    </label>
                    <div className="flex gap-1">
                      <button type="submit" className="btn btn-primary btn-sm btn-square" aria-label={labels.save}>
                        <Check className="size-4" />
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm btn-square"
                        aria-label={labels.cancel}
                        onClick={() => setEditingId(null)}
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  </form>
                </td>
              </tr>
            ) : (
              <tr key={alumno.id}>
                <td className="font-medium">{alumno.nombre}</td>
                <td>{alumno.celular}</td>
                <td>
                  <a href={`mailto:${alumno.correo}`} className="link link-primary">
                    {alumno.correo}
                  </a>
                </td>
                <td className="text-right">
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm btn-square"
                      aria-label={`${labels.edit} ${alumno.nombre}`}
                      onClick={() => setEditingId(alumno.id)}
                    >
                      <Pencil className="size-4" />
                    </button>
                    <form action={deleteAlumno}>
                      <input type="hidden" name="id" value={alumno.id} />
                      <button
                        type="submit"
                        className="btn btn-ghost btn-sm btn-square text-error"
                        aria-label={`${labels.delete} ${alumno.nombre}`}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  )
}
