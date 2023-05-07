import { Link } from "@remix-run/react";

export default function UsersIndex() {
  return (
    <div className="h-full border-l p-4 dark:border-gray-800 lg:px-8">
      <div>Escolha um usuário ao lado ou</div>
      <Link to={`./new`} className="link">
        Cadastre um novo usuário
      </Link>
    </div>
  );
}
