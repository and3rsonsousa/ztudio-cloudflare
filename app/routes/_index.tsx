import { User } from "lucide-react";
import Button from "~/components/Button";

export default function Index() {
  return (
    <div className="selection:bg-brand selection:text-white">
      <div className="grid min-h-screen place-content-center ">
        <div className="w-96 text-center">
          <div>
            <img src="/logo.png" alt="ZTUDIO" className="mx-auto mb-8 w-36" />
          </div>
          <p className="text-center font-normal">
            Sistema de gestão de ações criado
            <br /> e mantido pela{" "}
            <a
              href="https://agenciacanivete.com.br"
              target="_blank"
              rel="noreferrer"
              className="link"
            >
              aɢêɴᴄɪa ᴄaɴɪᴠeᴛe
            </a>
            .
          </p>
          <div className="mt-8">
            <Button primary icon asChild>
              <a href="/dashboard">
                <span>Entrar</span>
                <User />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
