import Tarefas from '../components/Tarefas';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <h1>Gerenciador de Tarefas</h1>
        <Tarefas />
      </div>
    </QueryClientProvider>
  );
}
