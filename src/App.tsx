import { createSignal, Show } from "solid-js";
import type { Component } from "solid-js";
import { createStore } from "solid-js/store";
import * as Scry from "scryfall-sdk";
import { useForm } from "./validation";
import { FormSubmissionData, getSetBreakdown } from "./data";
import type { SetBreakdown } from "./data";
import "./App.css";
import SetSelector from "./SetSelector";
import FormatSelector from "./FormatSelector";
import MyChart from "./Chart";

const ErrorMessage: Component<{ error: string }> = (props) => (
  <span class="error-message">{props.error}</span>
);

export type FormModel = {
  excludedSets: Scry.Set[];
  format: keyof typeof Scry.Format | "all";
  cards: string;
};

function App() {
  // @ts-ignore
  const { validate, validationOptions, formSubmit, errors } = useForm({
    errorClass: "error-input",
  });
  const [fields, setFields] = createStore<FormModel>({
    excludedSets: [],
    format: "commander",
    cards: "",
  });

  const [breakdown, setBreakdown] = createSignal<SetBreakdown | undefined>(
    undefined
  );
  const fn = async (_: HTMLFormElement) => {
    console.log("Submit");
    const cards = await Promise.all(
      fields.cards
        .split("\n")
        .map(async (name: string) => await Scry.Cards.byName(name, true))
    );
    const data: FormSubmissionData = {
      excludedSets: fields.excludedSets,
      cards: cards,
      format: "commander",
    };
    console.log(data);
    try {
      const bd = await getSetBreakdown(data);
      console.log(bd);
      setBreakdown(bd);
    } catch (e) {
      console.error(`Error getting set breakdown: ${e}`);
    }
  };

  return (
    <>
      <form use:formSubmit={fn}>
        <h1>Buyer Breakdown</h1>
        <p>
          Want cards but don&apos;t want to buy singles for some reason? Find
          out which set has the most cards you want.
        </p>
        <div class="field-block">
          <label for="excludedSets">Excluded Sets</label>
          <SetSelector
            id="excludedSets"
            name="excludedSets"
            onChange={(set) => setFields("excludedSets", set)}
          />
          <Show when={errors.excludedSets}>
            <ErrorMessage error={errors.excludedSets} />
          </Show>
        </div>
        <div class="field-block">
          <label for="format">Format</label>
          <FormatSelector
            id="format"
            onChange={(format) => setFields("format", format)}
          />
          <Show when={errors.format}>
            <ErrorMessage error={errors.format} />
          </Show>
        </div>
        <div class="field-block">
          <label for="cards">Card List</label>
          <div>
            <textarea
              id="cards"
              name="cards"
              cols="30"
              rows="15"
              placeholder="Paste card list here"
              onInput={(e) => setFields("cards", e.target.value)}
              required
              use:validate
            ></textarea>
          </div>
          <Show when={errors.cards}>
            <ErrorMessage error={errors.cards} />
          </Show>
        </div>

        <button type="submit">Submit</button>
      </form>
      <Show when={breakdown()}>
        <MyChart data={breakdown() ?? {}} />
      </Show>
    </>
  );
}

export default App;
