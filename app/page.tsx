export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">

      <header className="bg-blue-700 text-white p-5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">

          <h1 className="text-3xl font-bold">
            JobID AI Aguesta
          </h1>

          <div className="space-x-3">

  <a
    href="/login"
    className="bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold"
  >
    Login
  </a>

  <a
    href="/register"
    className="bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold"
  >
    Daftar
  </a>

</div>

        </div>
      </header>

      <section className="max-w-7xl mx-auto py-20 text-center">

        <h2 className="text-5xl font-bold mb-6">
          Cari Kerja Lebih Cepat Dengan AI
        </h2>

        <p className="text-xl text-gray-600 mb-10">
          Upload CV • AI Mencocokkan Lowongan • Interview AI • Lamaran Otomatis
        </p>

        <button className="bg-blue-700 text-white px-8 py-4 rounded-xl text-xl">
          Mulai Sekarang
        </button>

      </section>

    </main>
  );
}