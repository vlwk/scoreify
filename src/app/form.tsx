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
    <div className="bg-white shadow-lg rounded-lg p-6">
      <form action={formAction}>
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">{label}</h2>
        <textarea
          id={id}
          name={id}
          rows={6} 
          required
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
        />
        <p className="mt-4 text-sm text-gray-500">{hint}</p> 
        <div className="mt-4">
          <SubmitButton />
        </div>
        <p className="mt-4" aria-live="polite" role="status">
          {state?.message}
        </p>
      </form>
    </div>
  );
}
