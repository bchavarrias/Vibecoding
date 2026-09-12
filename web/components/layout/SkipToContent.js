export default function SkipToContent({ targetId = "main-content" }) {
  return (
    <a href={`#${targetId}`} className="skip-to-content">
      Saltar al contenido principal
    </a>
  )
}
