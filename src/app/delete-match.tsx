"use client";

import { useFormState } from "react-dom";
import { useFormStatus } from "react-dom";
import { deleteMatch } from "@/app/actions";

const initialState = {
  message: "",
};

function DeleteButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      aria-disabled={pending}
      className="bg-red-500 text-white font-medium py-2 px-4 rounded-full shadow-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition ease-in-out duration-200"
    >
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}

export function DeleteMatch({ team1, team2, score1, score2 }: { team1: string; team2: string; score1: string; score2: string }) {
  // useActionState is available with React 19 (Next.js App Router)
  const [state, formAction] = useFormState(deleteMatch, initialState);

  return (
    <form action={formAction}>
      <input type="hidden" name="team1" value={team1} />
      <input type="hidden" name="team2" value={team2} />
      <input type="hidden" name="score1" value={score1} />
      <input type="hidden" name="score2" value={score2} />
      <DeleteButton />
      <p aria-live="polite" role="status">
        {state?.message}
      </p>
    </form>
  );
}