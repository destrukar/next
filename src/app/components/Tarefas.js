import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export default function Tarefas() {
  const queryClient = useQueryClient();
  const [novaTarefa, setNovaTarefa] = useState('');

  // Buscar tarefas
  const { data: tarefas, isLoading } = useQuery({
    queryKey: ['tarefas'],
    queryFn: async () => {
      const res = await fetch('/api/tarefas');
      return res.json();
    },
  });

  // Criar nova tarefa
  const criarTarefa = useMutation({
    mutationFn: async (conteudo) => {
      await fetch('/api/tarefas/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conteudo, usuarioId: 1 }), // Trocar pelo usuário autenticado
      });
    },
    onSuccess: () => queryClient.invalidateQueries(['tarefas']),
  });

  // Excluir tarefa
  const excluirTarefa = useMutation({
    mutationFn: async (id) => {
      await fetch('/api/tarefas/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
    },
    onSuccess: () => queryClient.invalidateQueries(['tarefas']),
  });

  // Marcar tarefa como concluída
  const toggleConcluida = useMutation({
    mutationFn: async ({ id, concluida }) => {
      await fetch('/api/tarefas/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, concluida: !concluida }),
      });
    },
    onSuccess: () => queryClient.invalidateQueries(['tarefas']),
  });

  if (isLoading) return <p>Carregando tarefas...</p>;

  return (
    <div>
      <h2>Lista de Tarefas</h2>

      {/* Criar nova tarefa */}
      <input
        type="text"
        value={novaTarefa}
        onChange={(e) => setNovaTarefa(e.target.value)}
        placeholder="Nova tarefa"
      />
      <button onClick={() => criarTarefa.mutate(novaTarefa)}>Adicionar</button>

      {/* Lista de tarefas */}
      <ul>
        {tarefas?.map((tarefa) => (
          <li key={tarefa.id}>
            <span style={{ textDecoration: tarefa.concluida ? 'line-through' : 'none' }}>
              {tarefa.conteudo}
            </span>
            <button onClick={() => toggleConcluida.mutate(tarefa)}>
              {tarefa.concluida ? 'Desmarcar' : 'Concluir'}
            </button>
            <button onClick={() => excluirTarefa.mutate(tarefa.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
