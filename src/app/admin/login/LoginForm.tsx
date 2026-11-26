"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Notice } from "@/components/ui/Notice";
import { loginAction, type LoginState } from "@/app/admin/login/actions";

interface LoginFormProps {
  next: string;
  notice?: { tone: "error" | "info"; text: string };
}

export function LoginForm({ next, notice }: LoginFormProps) {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, {});
  const [show, setShow] = useState(false);

  return (
    <form action={action} noValidate className="space-y-5">
      <input type="hidden" name="next" value={next} />

      {state.error ? (
        <Notice>{state.error}</Notice>
      ) : notice ? (
        <Notice tone={notice.tone}>{notice.text}</Notice>
      ) : null}

      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="username"
        defaultValue={state.email}
        error={state.fieldErrors?.email}
        placeholder="you@servenest.app"
        autoFocus
      />

      <Field
        label="Password"
        name="password"
        type={show ? "text" : "password"}
        autoComplete="current-password"
        error={state.fieldErrors?.password}
        trailing={
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            className="rounded-md p-1.5 text-muted hover:text-ink"
          >
            {show ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
          </button>
        }
      />

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : null}
        {pending ? "Signing in" : "Sign in"}
      </Button>
    </form>
  );
}