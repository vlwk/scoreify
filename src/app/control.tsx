"use client";

import { useFormState } from "react-dom";
import { useFormStatus } from "react-dom";
import { clearAllData } from "@/app/actions";

const initialState = {
  message: "",
};

function ClearAllButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      aria-disabled={pending}
      className="bg-red-500 text-white font-medium py-2 px-4 rounded-full shadow-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition ease-in-out duration-200"
    >
      {pending ? "Clearing all data..." : "Clear all data"}
    </button>
  );
}

export function Control({  }) {
  const [, formAction] = useFormState(clearAllData, initialState);

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
        <form action={formAction}>
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Control</h2>
        <div className="mt-4">
          <ClearAllButton />
        </div>
        </form>
    </div>
  );
}