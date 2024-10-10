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

export function DeleteMatch({
  team1_name,
  team2_name,
  team1_score,
  team2_score,
}: {
  team1_name: string;
  team2_name: string;
  team1_score: number;
  team2_score: number;
}) {
  const [state, formAction] = useFormState(deleteMatch, initialState);

  return (
    <form action={formAction}>
      <input type="hidden" name="team1_name" value={team1_name} />
      <input type="hidden" name="team2_name" value={team2_name} />
      <input type="hidden" name="team1_score" value={team1_score} />
      <input type="hidden" name="team2_score" value={team2_score} />
      <DeleteButton />
      <p aria-live="polite" role="status">
        {state?.message}
      </p>
    </form>
  );
}
