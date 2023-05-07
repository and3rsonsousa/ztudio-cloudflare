import { Link } from "@remix-run/react";

export default function AdminIndex() {
  return (
    <div className="grid h-full w-full place-items-center">
      <div className="text-center">
        <h1>Admin</h1>
        <div className="text-xl">Escolha qual área quer gerenciar</div>
        <div className="mt-4 flex justify-center gap-4">
          <Link to={`/dashboard/admin/users`} className="button button-large">
            Usuários
          </Link>
          <Link
            to={`/dashboard/admin/accounts`}
            className="button button-large"
          >
            Clientes
          </Link>
        </div>
      </div>
    </div>
  );
}
