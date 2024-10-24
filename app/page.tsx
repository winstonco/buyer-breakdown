"use client";

import styles from "./page.module.css";
import { handleSubmit } from "./actions";
import { useState } from "react";
import { SetBreakdown } from "@/lib/scryfall";
import MyChart from "./Chart";

const cards = [
  "Barkchannel Pathway",
  "Beast Whisperer",
  "Birds of Paradise",
  "Breeding Pool",
  "Careening Mine Cart",
  "Command Tower",
  "Copy Enchantment",
  "Counterspell",
  "Cryptolith Rite",
  "Cultivate",
  "Doubling Season",
  "Enduring Curiosity",
  "Enduring Vitality",
  "Explore",
  "Fabled Passage",
  "Faerie Mastermind",
  "Flooded Strand",
  "Glittermonger",
  "Gretchen Titchwillow",
  "Growing Rites of Itlimoc",
  "Growth Spiral",
  "Hedge Maze",
  "Heroic Intervention",
  "Hornswoggle",
  "Imperious Perfect",
  "Intruder Alarm",
  "Irenicus's Vile Duplication",
  "Koma, Cosmos Serpent",
  "Krosan Grip",
  "Lotus Cobra",
  "Mind's Eye",
  "Negate",
  "Parallel Lives",
  "Pest Infestation",
  "Polluted Delta",
  "Primal Vigor",
  "Reliquary Tower",
  "Rhystic Study",
  "Scute Swarm",
  "Springheart Nantuko",
  "Swan Song",
  "Tatyova, Benthic Druid",
  "Tireless Provisioner",
  "Tireless Tracker",
  "Uro, Titan of Nature's Wrath",
  "Waterlogged Grove",
  "Windswept Heath",
  "Wooded Foothills",
  "Yavimaya Coast",
];
export default function Home() {
  // const isConnected = await testDatabaseConnection();

  // const handleSubmit: FormEventHandler<HTMLFormElement> = () => {
  //   doStuffWithCards(cardNames).then((v) => console.log(v));
  // };

  const [breakdown, setBreakdown] = useState<SetBreakdown>();

  const formAction = (formData: FormData) => {
    handleSubmit(formData)
      .then((v) => setBreakdown(v))
      .catch((e) => console.error(e));
  };

  return (
    <>
      <form action={formAction}>
        <h1>Buyer Breakdown</h1>
        <p>
          Want cards but don&apos;t want to buy singles for some reason? Find
          out which set has the most cards you want.
        </p>
        <div className={styles.fieldBlock}>
          <label htmlFor="excludedSets">Excluded Sets</label>
          {/* <SetSelector
            id="excludedSets"
            name="excludedSets"
            onChange={(set) => setFields("excludedSets", set)}
          />
          <Show when={errors.excludedSets}>
            <ErrorMessage error={errors.excludedSets} />
          </Show> */}
        </div>
        <div className={styles.fieldBlock}>
          <label htmlFor="format">Format</label>
          {/* <FormatSelector
            id="format"
            onChange={(format) => setFields("format", format)}
          />
          <Show when={errors.format}>
            <ErrorMessage error={errors.format} />
          </Show> */}
        </div>
        <div className={styles.fieldBlock}>
          <label htmlFor="cards">Card List</label>
          <div>
            <textarea
              id="cards"
              className={styles.field + styles.fieldTextarea}
              name="cards"
              cols={30}
              rows={15}
              placeholder="Paste card list here"
              defaultValue={cards.join("\n")}
              required
              // use:validate
            ></textarea>
          </div>
          {/* <Show when={errors.cards}>
            <ErrorMessage error={errors.cards} />
          </Show> */}
        </div>

        <button type="submit">Submit</button>
      </form>
      {breakdown && <MyChart data={breakdown} />}
    </>
  );
}
