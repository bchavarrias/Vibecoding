/**
 * Inserta materias de demostración para probar extracción con IA.
 * Uso: node scripts/seed-materias-demo.mjs
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

const DEMO_MATERIAS = [
  { nombre: "Programación Web", codigo: "PW-401" },
  { nombre: "Bases de Datos", codigo: "BD-302" },
  { nombre: "Cálculo Diferencial", codigo: "CD-201" },
  { nombre: "Ingeniería de Software", codigo: "IS-403" },
  { nombre: "Redes de Computadoras", codigo: "RC-304" },
  { nombre: "Administración de Proyectos", codigo: "AP-305" },
  { nombre: "Sistemas Operativos", codigo: "SO-303" },
  { nombre: "Estructuras de Datos", codigo: "ED-301" },
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
    .from("materias")
    .select("nombre")
    .eq("user_id", user.id)

  const nombresExistentes = new Set((existentes ?? []).map((m) => m.nombre))
  const nuevas = DEMO_MATERIAS.filter((m) => !nombresExistentes.has(m.nombre))

  if (!nuevas.length) {
    console.log(`Usuario ${user.email ?? user.id}: ya tiene las materias demo.`)
    continue
  }

  const { error } = await supabase.from("materias").insert(
    nuevas.map((m) => ({
      user_id: user.id,
      nombre: m.nombre,
      codigo: m.codigo,
    }))
  )

  if (error) {
    console.error(`Error insertando para ${user.email ?? user.id}:`, error.message)
    process.exit(1)
  }

  console.log(`Usuario ${user.email ?? user.id}: ${nuevas.length} materia(s) agregada(s).`)
  nuevas.forEach((m) => console.log(`  · ${m.nombre}`))
}

console.log("Listo.")
