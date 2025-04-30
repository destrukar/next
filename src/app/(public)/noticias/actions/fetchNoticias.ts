import { useMutation, useQuery } from "@tanstack/react-query";
import { stringify } from "querystring";
import { json } from "stream/consumers";

async function getNoticias() {
    const res = await fetch('/api/noticias')
    if (!res.ok) {
        throw new Error("Erro na busca de noticias")
    }
    return res.json();
}

async function updateNoticia(data: any) {
    const res = await fetch('/api/noticias')
    if (!res.ok || !data.sucesso) {
        throw new Error("Erro na busca de noticias")
    }
    return res.json();
}

export function useNoticias() {
    return useQuery({
      queryKey: ["noticias"],
      queryFn: getNoticias,
      refetchOnWindowFocus: false
    });
  }

  
export function useUpdateNoticias() {
    return useMutation({
        mutationFn: (data) => updateNoticia(data)
    });
  }

export function useCreateNoticia() {
    return useMutation({
        mutationFn: (data) => createNoticia(data)
    });
}

async function createNoticia(data: any) {
    const res = await fetch('/api/noticias', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    if (!res.ok) {
        throw new Error("Erro ao criar noticia")
    }
    return res.json();
}

export function useDeleteNoticia() {
    return useMutation({
        mutationFn: (data: any) => deleteNoticia(data.id)
    });
}

async function deleteNoticia(id: number) {
    const res = await fetch(`/api/noticias/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    if (!res.ok) {
        throw new Error("Erro ao deletear noticia")
    }
    return res.json();
}