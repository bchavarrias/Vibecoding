"use client"

import { useState } from "react"
import { Pencil, Trash2, X, Check } from "lucide-react"
import { updateMateria, deleteMateria } from "../actions"

export default function MateriaList({ materias, labels }) {
  const [editingId, setEditingId] = useState(null)

  if (!materias.length) {
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
            <th>{labels.columns.codigo}</th>
            <th>{labels.columns.classroom}</th>
            <th className="w-28 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {materias.map((m) =>
            editingId === m.id ? (
              <tr key={m.id}>
                <td colSpan={4}>
                  <form
                    action={async (fd) => {
                      await updateMateria(fd)
                      setEditingId(null)
                    }}
                    className="flex flex-wrap items-end gap-2 p-2"
                  >
                    <input type="hidden" name="id" value={m.id} />
                    <input name="nombre" required defaultValue={m.nombre} className="input input-bordered input-sm flex-1" />
                    <input name="codigo" defaultValue={m.codigo || ""} className="input input-bordered input-sm w-32" />
                    <button type="submit" className="btn btn-primary btn-sm btn-square"><Check className="size-4" /></button>
                    <button type="button" className="btn btn-ghost btn-sm btn-square" onClick={() => setEditingId(null)}><X className="size-4" /></button>
                  </form>
                </td>
              </tr>
            ) : (
              <tr key={m.id}>
                <td className="font-medium">{m.nombre}</td>
                <td className="text-base-content/60">{m.codigo || "—"}</td>
                <td className="text-sm">
                  {m.classroom_course_name ? (
                    <span className="badge badge-success badge-sm">{m.classroom_course_name}</span>
                  ) : (
                    <span className="text-base-content/40">{labels.sinClassroom}</span>
                  )}
                </td>
                <td className="text-right">
                  <div className="flex justify-end gap-1">
                    <button type="button" className="btn btn-ghost btn-sm btn-square" onClick={() => setEditingId(m.id)}>
                      <Pencil className="size-4" />
                    </button>
                    <form action={deleteMateria}>
                      <input type="hidden" name="id" value={m.id} />
                      <button type="submit" className="btn btn-ghost btn-sm btn-square text-error">
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
