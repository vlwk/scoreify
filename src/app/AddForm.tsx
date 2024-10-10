"use client";

import { Form } from "./Form";
import { addTeams } from "@/app/actions";

export function AddForm() {
  return (
    <Form
      action={addTeams}
      id="teams_info"
      label="Enter Team Information"
      hint={"<Team name> <Team registration date in DD/MM> <Team group number>"}
    />
  );
}
