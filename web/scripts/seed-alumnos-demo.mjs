/**
 * Inserta alumnos de demostración para probar el dashboard localmente.
 * Uso: node scripts/seed-alumnos-demo.mjs
 */

import { createClient } from "@supabase/supabase-js"
import { readFileSync } from "fs"
import { dirname, join } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath = join(__dirname, "..", ".env.local")

function loadEnv() {
  const raw = readFileSync(envPath, "utf8")
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const eq = trimmed.indexOf("=")
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    const value = trimmed.slice(eq + 1).trim()
    if (!process.env[key]) process.env[key] = value
  }
}

const DEMO_ALUMNOS = [
  {
    nombre: "Ana García López",
    celular: "8711234567",
    correo: "ana.garcia@utch.edu.mx",
  },
  {
    nombre: "Carlos Mendoza Ruiz",
    celular: "8712345678",
    correo: "carlos.mendoza@utch.edu.mx",
  },
  {
    nombre: "María Fernanda Torres",
    celular: "8713456789",
    correo: "maria.torres@utch.edu.mx",
  },
  {
    nombre: "Luis Eduardo Chavarría",
    celular: "8714567890",
    correo: "luis.chavarria@utch.edu.mx",
  },
  {
    nombre: "Diego Ramírez Soto",
    celular: "8715678901",
    correo: "diego.ramirez@utch.edu.mx",
  },
]

loadEnv()

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceRoleKey) {
  console.error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en web/.env.local")
  process.exit(1)
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers()
if (usersError) {
  console.error("No se pudieron listar usuarios:", usersError.message)
  process.exit(1)
}

const users = usersData?.users ?? []
if (!users.length) {
  console.error("No hay usuarios registrados. Inicia sesión con Google al menos una vez.")
  process.exit(1)
}

for (const user of users) {
  const { data: existentes } = await supabase
    .from("core_items")
    .select("nombre")
    .eq("user_id", user.id)

  const nombresExistentes = new Set((existentes ?? []).map((a) => a.nombre))
  const nuevos = DEMO_ALUMNOS.filter((a) => !nombresExistentes.has(a.nombre))

  if (!nuevos.length) {
    console.log(`Usuario ${user.email ?? user.id}: ya tiene los alumnos demo.`)
    continue
  }

  const { error } = await supabase.from("core_items").insert(
    nuevos.map((a) => ({
      user_id: user.id,
      nombre: a.nombre,
      celular: a.celular,
      correo: a.correo,
    }))
  )

  if (error) {
    console.error(`Error insertando para ${user.email ?? user.id}:`, error.message)
    process.exit(1)
  }

  console.log(`Usuario ${user.email ?? user.id}: ${nuevos.length} alumno(s) agregado(s).`)
  nuevos.forEach((a) => console.log(`  · ${a.nombre}`))
}

console.log("Listo.")
