"use client";

import { useFormState } from "react-dom";
import { useFormStatus } from "react-dom";
import { signOut } from "@/app/actions";

const initialState = {
  message: "",
};

function SignOutButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      aria-disabled={pending}
      className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
    >
      {pending ? "Signing out..." : "Sign out"}
    </button>
  );
}

export function CurrentUser({ username }: { username: string }) {
  const [state, formAction] = useFormState(signOut, initialState);

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <form action={formAction}>
        <h1 className="text-2xl font-semibold mb-4 text-gray-700">
          Hi, {username}!
        </h1>
        <div className="mt-6">
          <SignOutButton />
        </div>

        {/* Status Message */}
        <p className="mt-4 text-gray-500" aria-live="polite" role="status">
          {state?.message}
        </p>
      </form>
    </div>
  );
}
