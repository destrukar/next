"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [influencers, setInfluencers] = useState([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const fetchInfluencers = async () => {
    try {
      const response = await fetch("/api/influencers");
      const data = await response.json();
      setInfluencers(data);
    } catch (error) {
      console.error("Erro ao buscar os influencers:", error);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchInfluencers();
    }
  }, [status]);

  const criarInfluencer = async () => {
    const conteudo = prompt("Digite o nome do novo influencer:");
    if (!conteudo) return;

    try {
      const response = await fetch("/api/influencers/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conteudo }), // Removido avaliacao
      });

      if (response.ok) {
        fetchInfluencers();
      } else {
        console.error("Erro ao criar influencer");
      }
    } catch (error) {
      console.error("Erro ao criar influencer:", error);
    }
  };

  const excluirInfluencer = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este influencer?")) return;

    try {
      const response = await fetch(`/api/influencers/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        fetchInfluencers();
      } else {
        console.error("Erro ao excluir influencer");
      }
    } catch (error) {
      console.error("Erro ao excluir influencer:", error);
    }
  };

  const [avaliarId, setAvaliarId] = useState<number | null>(null);
  const [nota, setNota] = useState<number>(0);

  const enviarAvaliacao = async (id: number) => {
    try {
      const response = await fetch(`/api/influencers/${id}/avaliar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avaliacao: nota }),
      });

      if (response.ok) {
        fetchInfluencers();
        setAvaliarId(null);
        setNota(0);
      } else {
        console.error("Erro ao enviar avaliação");
      }
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error);
    }
  };

  if (status === "loading") {
    return <p className="text-center text-gray-600">Carregando...</p>;
  }

  const userImage = session?.user?.image || "/default-profile.jpg";

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md text-center">
        <img
          src={userImage}
          alt="User Profile"
          className="w-24 h-24 rounded-full mx-auto border-2 border-gray-300"
        />
        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          Bem-vindo, {session?.user?.name}
        </h1>
        <p className="text-gray-600">{session?.user?.email}</p>
        <button
          onClick={() => signOut()}
          className="mt-6 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          Sair
        </button>

        <h1 className="mt-4 text-xl font-bold text-gray-900">Cadastro de influencers</h1>
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={criarInfluencer}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Adicionar nova pessoa
          </button>
        </div>
      </div>

      <div className="max-w-3xl w-full mx-auto p-6 mt-8">
        <h1 className="text-2xl font-semibold text-center text-blue-600 mb-4">
          Lista de Influencers
        </h1>

        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">ID</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Conteúdo</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Avaliação</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Data de cadastro</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Ações</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Comentários</th>
              </tr>
            </thead>
            <tbody>
              {influencers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-600">
                    Nenhum cadastro encontrado.
                  </td>
                </tr>
              ) : (
                influencers.map((influencer) => (
                  <tr key={influencer.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="py-3 px-4 text-sm text-gray-800">{influencer.id}</td>
                    <td className="py-3 px-4 text-sm text-gray-800">{influencer.conteudo}</td>
                    <td className="py-3 px-4 text-sm text-gray-800">
                      {influencer.mediaAvaliacao !== null
                        ? influencer.mediaAvaliacao.toFixed(1)
                        : "Sem avaliações"}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-800">
                      {new Date(influencer.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-800">
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => excluirInfluencer(influencer.id)}
                            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded-lg transition"
                          >
                            Excluir
                          </button>
                          <button
                            onClick={() =>
                              setAvaliarId(avaliarId === influencer.id ? null : influencer.id)
                            }
                            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-3 rounded-lg transition"
                          >
                            Avaliar
                          </button>
                        </div>

                        {avaliarId === influencer.id && (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="0"
                              max="10"
                              step="0.1"
                              value={nota}
                              onChange={(e) => setNota(parseFloat(e.target.value))}
                              className="p-1 border border-gray-300 rounded w-20 text-center"
                              placeholder="Nota"
                            />
                            <button
                              onClick={() => enviarAvaliacao(influencer.id)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                            >
                              Confirmar
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-800">Em breve...</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}