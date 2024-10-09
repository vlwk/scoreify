"use client";

import { useFormState } from "react-dom";
import { useFormStatus } from "react-dom";

const initialState = {
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300" aria-disabled={pending}>
      {pending ? "Submitting..." : "Submit" }
    </button>
  );
}

export function Form({ action, id, label, hint }) {
    const [state, formAction] = useFormState(action, initialState);
  
    return (
      <form action={formAction} className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6 space-y-4">
        <label htmlFor={id} className="block text-gray-700 font-medium">
          {label}
        </label>
        {/* <input
          type="text"
          id={id}
          name={id}
          required
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
        /> */}
        <textarea
          id={id}
          name={id}
          rows={6}  // Set rows for the height of the textarea
          required
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
        />
        <p className="text-sm text-gray-500">{hint}</p>
        <SubmitButton />
        <p aria-live="polite" role="status">
          {state?.message}
        </p>
      </form>
    );
  }
  