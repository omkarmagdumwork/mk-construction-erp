export default function PhotoImg({ name, alt, className }) {
  return (
    <img
      src={`/images/${name}.png`} 
      alt={alt}
      className={className}
      loading="lazy"
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = `/images/${name}.jpg`;
      }}
    />
  );
}