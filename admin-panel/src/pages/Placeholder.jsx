
export default function Placeholder({ title = "Page" }) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-gray-800">
        {title}
      </h1>

      <p className="mt-2 text-gray-500">
        Welcome to the {title} page.
      </p>
    </div>
  );
}
