// TODO: Implement Avatar component
export default function Avatar({ src, alt, size = 40 }) {
  return <img src={src} alt={alt} width={size} height={size} className="rounded-full" />;
}
