"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { editMatch } from "@/app/actions"; // Import the editMatch action

const initialState = {
  message: "",
};

function EditMatchButton({ onClick }) {
  return (
    <button 
      onClick={onClick} 
      className="bg-blue-500 text-white font-medium py-2 px-4 rounded-full shadow-lg hover:bg-blue-600 transition ease-in-out duration-200"
    >
      Edit
    </button>
  );
}

function SubmitButton() {
    const { pending } = useFormStatus();
  
    return (
      <button 
        type="submit" 
        className="bg-blue-500 text-white font-medium py-2 px-4 rounded-full hover:bg-blue-600 transition ease-in-out duration-200" 
        aria-disabled={pending}
      >
        {pending ? "Submitting..." : "Submit"}
      </button>
    );
  }

export function EditMatchModal({ isOpen, onClose, team1_name, team2_name, team1_score, team2_score }) {
  const [state, formAction] = useFormState(editMatch, initialState);

  if (!isOpen) return null; // If the modal is not open, return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Edit Match</h2>
        <form action={formAction}>
          <input type="hidden" name="team1_name" value={team1_name} />
          <input type="hidden" name="team2_name" value={team2_name} />
          <input type="hidden" name="team1_score" value={team1_score} />
          <input type="hidden" name="team2_score" value={team2_score} />
          <div className="mb-4">
            <label htmlFor="team1_score" className="block text-sm font-medium text-gray-700">Team 1 Score</label>
            <input
              type="number"
              id="team1_score_new"
              name="team1_score_new"
              defaultValue={team1_score}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="team2_score" className="block text-sm font-medium text-gray-700">Team 2 Score</label>
            <input
              type="number"
              id="team2_score_new"
              name="team2_score_new"
              defaultValue={team2_score}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="mr-2 bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-full hover:bg-gray-400 transition ease-in-out duration-200"
            >
              Cancel
            </button>
            <SubmitButton />
          </div>
          <p className="mt-4" aria-live="polite" role="status">
            {state?.message}
          </p>
        </form>
      </div>
    </div>
  );
}

// EditMatch component
export function EditMatch({ team1_name, team2_name, team1_score, team2_score }) {
  const [isEditing, setEditing] = useState(false);

  return (
    <div>
      <EditMatchButton onClick={() => setEditing(true)} />
      <EditMatchModal 
        isOpen={isEditing} 
        onClose={() => setEditing(false)} 
        team1_name={team1_name} 
        team2_name={team2_name} 
        team1_score={team1_score} 
        team2_score={team2_score} 
      />
    </div>
  );
}
