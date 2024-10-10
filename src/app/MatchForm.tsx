"use client";

import { Form } from "./Form";
import { addMatches } from "@/app/actions";

export function MatchForm() {
  return (
    <Form
      action={addMatches}
      id="matches_info"
      label="Enter Match Information"
      hint={
        "<Team A name> <Team B name> <Team A goals scored> <Team B goals scored>"
      }
    />
  );
}
