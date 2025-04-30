"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  useCreateNoticia,
  useDeleteNoticia,
  useNoticias,
  useUpdateNoticias,
} from "../actions/fetchNoticias";

export default function NoticiasSection() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { isLoading, data, isFetching } = useNoticias();

  const { mutateAsync: update, isPending } = useUpdateNoticias();
  const { mutateAsync: create, isPending: isLoadingCriacao } =
    useCreateNoticia();
  const { mutateAsync: deletaNoticia, isPending: isLoadingDelete } =
    useDeleteNoticia();

  function onSubmit(data: any) {
    console.log(data);
    create(data, {
      onSuccess: () => {
        console.log("Sucesso");
        queryClient.invalidateQueries({ queryKey: ["noticias"] });
      },
      onError: () => {
        console.log("Erro");
      },
    });
  }

  return (
    <>
      {isLoadingCriacao && <span>Criando noticia ...</span>}
      <div className="flex justify-center">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            onSubmit({
              titulo: formData.get("titulo"),
              conteudo: formData.get("conteudo"),
            });
          }}
        >
          <input name="titulo" placeholder="titulo" />
          <input name="conteudo" placeholder="conteudo" />
          <button type="submit">Criar</button>
        </form>
        {isLoadingDelete && <span>Deletando noticia ...</span>}
      </div>
      {!isFetching ? (
        <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {data?.map((post: any) => (
            <article
              key={post.id}
              className="flex max-w-xl flex-col items-start justify-between"
            >
              <div className="flex items-center gap-x-4 text-xs">
                <time className="text-gray-500">2025-03-15</time>
                <span className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100">
                  Tecnologia
                </span>
              </div>
              <div className="group relative">
                <h3 className="mt-3 text-lg/6 font-semibold text-gray-900 group-hover:text-gray-600">
                  <Link href={`/noticias/${post.id}`}>
                    <span className="absolute inset-0" />
                    {post.titulo}
                  </Link>
                </h3>
                <p className="mt-5 line-clamp-3 text-sm/6 text-gray-600">
                  {post.conteudo}
                </p>
              </div>

              <button
                className="text-red-500"
                onClick={() => {
                  deletaNoticia(
                    {
                      id: post.id,
                    },
                    {
                      onSuccess: () => {
                        queryClient.invalidateQueries({
                          queryKey: ["noticias"],
                        });
                      },
                    }
                  );
                }}
              >
                Deletar
              </button>
              <div className="relative mt-8 flex items-center gap-x-4">
                <div className="text-sm/6">
                  <p className="font-semibold text-gray-900">
                    <span>
                      <span className="absolute inset-0" />
                      {post.usuario.nome}
                    </span>
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <>Carregando noticias ....</>
      )}
    </>
  );
}
