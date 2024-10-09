"use client";

import { Form } from "./form";
import { addMatches } from "@/app/actions";

const initialState = {
  message: "",
};

export function MatchForm() {

    return (
        <Form
            action={addMatches}
            id="matches_info"
            label="Enter Match Information"
            hint={"<Team A name> <Team B name> <Team A goals scored> <Team B goals scored>"}
        />
    );

}
  