"use client";

import { useFormState } from "react-dom";
import { useFormStatus } from "react-dom";
import { signup } from "./actions";


const initialState = {
  message: "",
};

function SignUpButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      aria-disabled={pending}
      className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
    >
      {pending ? "Signing up..." : "Sign up"}
    </button>
  );
}


export function SignUp() {
  const [state, formAction] = useFormState(signup, initialState);
  

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <form action={formAction}>
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Sign Up</h2>

        {/* Username Field */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            name="username"
            id={"username"}
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        {/* Password Field */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            name="password"
            id={"password"}
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div className="mt-6">
          <SignUpButton />
        </div>

        {/* Status Message */}
        <p className="mt-4 text-gray-500" aria-live="polite" role="status">
          {state?.message}
        </p>
      </form>
    </div>
  );
}
