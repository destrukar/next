import Link from "next/link";

export default async function PageHome() {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Lado esquerdo - imagem */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-blue-100">
        <img
          src="https://th.bing.com/th/id/R.e8d4d12ff88334fc7ad5082fd6025299?rik=BDuU%2fq0BVsQi%2fQ&pid=ImgRaw&r=0"
          alt="Logo"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Lado direito - conteúdo */}
      <div className="flex w-full lg:w-1/2 flex-col justify-center px-6 py-12 lg:px-16">
        <div className="mx-auto w-full max-w-md">
        <h2 className="text-left text-4xl font-extrabold tracking-tight text-blue-900 mb-4">
          <span className="text-indigo-600">Portal INFLUGRADES</span>
        </h2>
            <p className="text-left text-base text-gray-600 mb-8">
                Conectando você às maiores tendências e influencers do momento.
            </p>
          <div className="flex flex-col gap-4">
            <Link
              href="/login"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Login
            </Link>
            <Link
              href="/noticias"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Ranking de Influencers
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
