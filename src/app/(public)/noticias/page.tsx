"use client"

import Link from "next/link";
import { prisma } from "../../lib/prisma";
import { useEffect, useState } from "react";


export default function InfluencerList() {
  const [influencers, setInfluencers] = useState([]);
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
        fetchInfluencers();
    },[]);

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow p-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-indigo-700 tracking-tight">INFLUGRADES</h1>
          <p className="text-sm text-gray-600 mt-1">Ranking de Influencers Cadastrados</p>
        </div>
      </header>

      {/* Tabela */}
      <main className="flex-grow mt-10 px-4 sm:px-6 lg:px-8">
        <div className="overflow-x-auto mx-auto max-w-6xl">
          <table className="min-w-full divide-y divide-gray-200 bg-white shadow-md rounded-lg">
            <thead className="bg-indigo-100">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-indigo-800">ID</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-indigo-800">Conteúdo</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-indigo-800">Avaliação</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-indigo-800">Data de cadastro</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-indigo-800">Ações</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-indigo-800">Comentários</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {influencers.map((inf) => (
                <tr key={inf.id}>
                  <td className="py-3 px-4 text-sm text-gray-700">{inf.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-700 break-words max-w-xs">{inf.conteudo}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{inf.mediaAvaliacao.toFixed(1)}</td>
                  
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {new Date(inf.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <Link href={`/influencer/${inf.id}`} className="text-indigo-600 hover:underline">
                      Ver
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">{inf.comentarios.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
