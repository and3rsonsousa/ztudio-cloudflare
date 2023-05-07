import { HandMetal, ThumbsDown, ThumbsUp, Wrench } from "lucide-react";

export default function Roadmap() {
  const functions: Array<{
    title: string;
    description: string;
    state: 1 | 2 | 3 | 4;
  }> = [
    {
      title: "Login",
      description: "Entrar / Sair / Autenticação",
      state: 4,
    },
    {
      title: "Menu de Contexto",
      description:
        "Menu com opções mais rápidas de serem acessadas no calendário",
      state: 1,
    },
    {
      title: "Busca",
      description:
        "Combobox com a função de busca e também inciar micro ações, como criar nova ação, data celebrativa ou campanha.",
      state: 2,
    },
    {
      title: "Campanha",
      description: "Criar todo esquema de campanhas.",
      state: 1,
    },
  ];

  const icons = [
    {
      title: "Não iniciado / Sem planos",
      icon: <ThumbsDown className="sq-4" />,
    },
    {
      title: "Iniciado / Em Planos",
      icon: <HandMetal className="sq-4" />,
    },
    {
      title: "Em desenvolvimento",
      icon: <Wrench className="sq-4" />,
    },
    {
      title: "Finalizado",
      icon: <ThumbsUp className="sq-4" />,
    },
  ];

  return (
    <div>
      <div className="flex h-screen flex-col">
        <div className="flex justify-between border-b p-4 dark:border-gray-800">
          <h2 className="mb-0 dark:text-gray-200">Roadmap</h2>
        </div>
        <div className="max-w-2xl divide-y p-4">
          {functions.map((func, index) => (
            <div
              key={index}
              className="max-w-3xl grid-cols-7 gap-4 py-4 lg:grid"
            >
              <div className="col-span-2 font-semibold">{func.title}</div>
              <div className="col-span-4 text-gray-500">{func.description}</div>
              <div title={icons[func.state - 1].title} className="col-span-1">
                {icons[func.state - 1].icon}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
