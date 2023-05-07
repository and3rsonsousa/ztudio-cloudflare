import type { LoaderArgs, LoaderFunction } from "@remix-run/cloudflare";
import type { AuthError } from "@supabase/supabase-js";
import type { ContextType } from "~/lib/models";

import { redirect } from "@remix-run/cloudflare";
import { Form, useNavigate, useOutletContext } from "@remix-run/react";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { Lock, Unlock } from "lucide-react";
import React, { useEffect, useState } from "react";
import useMeasure from "react-use-measure";
import Button from "~/components/Button";
import Exclamation from "~/components/Exclamation";
import Field from "~/components/Forms/InputField";
import { scaleUp } from "~/lib/animations";
import { getUser } from "~/lib/auth.server";

const quotes: Array<{ quote: string; author: string }> = [
  {
    quote:
      "A melhor maneira de persuadir as pessoas é com os ouvidos – ouvindo a elas",
    author: "Dean Rusk, ex-Secretário de Estado dos Estados Unidos.",
  },
  {
    quote:
      "Satisfazer os clientes não é mais o suficiente: é preciso encantá-los",
    author: "Philip Kotler",
  },
  {
    quote:
      "Faça aquilo que você faz tão bem que eles vão desejar ver novamente e trazer seus amigos.",
    author: "Walt Disney",
  },
  {
    quote:
      "Seus clientes mais insatisfeitos são sua maior fonte de aprendizado",
    author: "Bill Gates",
  },
  {
    quote:
      "Se você não está falhando de vez em quando, é um sinal de que você não está fazendo nada de inovador.",
    author: "Woody Allen",
  },
  {
    quote:
      "A falha é simplesmente a oportunidade de começar novamente, desta vez de forma mais inteligente.",
    author: "Henry Ford",
  },
  {
    quote: "Se você não entende as pessoas, você não entenderá os negócios.",
    author: "Simon Sinek",
  },
];

export const loader: LoaderFunction = async ({ request }: LoaderArgs) => {
  const {
    data: { session },
    response,
  } = await getUser(request);

  if (session) {
    throw redirect("/dashboard", { headers: response.headers });
  }

  return { session };
};

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<AuthError | null>(null);
  const { supabase } = useOutletContext<ContextType>();
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState({ quote: "", author: "" });
  const navigate = useNavigate();

  async function signIn() {
    setLoading(true);
    setError(null);
    const {
      error,
      data: { session },
    } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (session) {
      navigate("/dashboard");
    }

    setLoading(false);
    setError(error);
  }

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="w-full max-w-md grid-cols-2 place-items-center p-8 md:grid  md:max-w-3xl">
        <div className="w-full p-8">
          <div className="mb-8 w-32">
            <img src="/logo.png" alt="ZTUDIO" />
          </div>

          <ResizeblePanel duration={0.3}>
            {error?.message && (
              <motion.div {...scaleUp(0.5)}>
                <Exclamation type="error" icon>
                  {error.message}
                </Exclamation>
              </motion.div>
            )}
          </ResizeblePanel>
          <Form
            className="mt-8"
            onSubmit={(event) => {
              event.preventDefault();
              signIn();
            }}
          >
            <Field
              name="email"
              label="E-mail"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <Field
              name="password"
              label="Senha"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              suffix={
                <Button
                  icon
                  isPreffix
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <Lock /> : <Unlock />}
                </Button>
              }
            />
            <input type="hidden" name="action" value="login" />

            <div className="space-x-2 text-right">
              <Button primary type="submit" loading={loading}>
                Entrar
              </Button>
            </div>
          </Form>
        </div>
        <div className="relative w-full p-8">
          <div className="absolute -top-12 right-0  text-[120px] font-bold text-gray-200 dark:text-gray-700">
            ”
          </div>
          <div className="relative text-xl leading-normal">{quote.quote}</div>
          <div className="mt-8 text-xs font-medium uppercase tracking-widest text-gray-400">
            {quote.author}
          </div>
        </div>
      </div>
    </div>
  );
}

function ResizeblePanel({
  children,
  duration = 0.5,
}: {
  children: React.ReactNode;
  duration?: number;
}) {
  const [ref, { height }] = useMeasure();

  return (
    <MotionConfig transition={{ duration }}>
      <motion.div
        initial={{ height: 0 }}
        animate={{ height }}
        className="overflow-hidden"
      >
        <AnimatePresence mode="popLayout">
          <motion.div
            key={JSON.stringify(children, ignoreCircularReferences())}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div ref={ref}>{children}</div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </MotionConfig>
  );
}

const ignoreCircularReferences = () => {
  const seen = new WeakSet();
  return (key: string, value: string) => {
    if (key.startsWith("_")) return; // Don't compare React's internal props.
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) return;
      seen.add(value);
    }
    return value;
  };
};
