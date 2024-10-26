"use client";

import styles from "./page.module.css";
import { handleSubmit } from "./actions";
import { useState } from "react";
import * as Scry from "scryfall-sdk";
import { SetBreakdown } from "@/lib/scryfall";
import MyChart from "./Chart";
import SetSelect, { SetSelectOption } from "./SetSelect";
import { ActionMeta } from "react-select";

const cards = [
  "Green Sun's Zenith",
  "Uro, Titan of Nature's Wrath",
  "Imperious Perfect",
  "Aesi, Tyrant of Gyre Strait",
  "Pongify",
  "Careening Mine Cart",
  "Faerie Mastermind",
  "Rally the Galadhrim",
  "City of Death",
  "Glittermonger",
  "Pest Infestation",
  "Irenicus's Vile Duplication",
  "Hornswoggle",
  "Jaheira, Friend of the Forest",
  "Lotus Cobra",
  "Sprout Swarm",
  "Growing Rites of Itlimoc",
  "Scute Swarm",
  "Quantum Misalignment",
  "Springheart Nantuko",
  "Rite of Replication",
  "Tireless Provisioner",
  "Cryptolith Rite",
  "Walking Ballista",
  "Lightning Greaves",
  "Avenger of Zendikar",
  "Thrasios, Triton Hero",
  "Krosan Grip",
  "Beast Within",
  "Swan Song",
  "Parallel Lives",
  "Doubling Season",
  "Primal Vigor",
  "Fabled Passage",
  "Reflecting Pool",
  "Dryad Arbor",
  "Waterlogged Grove",
  "Flooded Strand",
  "Flooded Grove",
  "City of Brass",
  "Rejuvenating Springs",
  "Barkchannel Pathway // Tidechannel Pathway",
  "Polluted Delta",
  "Hedge Maze",
  "Breeding Pool",
  "Birds of Paradise",
  "Shadowspear",
  "Sword of Feast and Famine",
  "Sword of Forge and Frontier",
  "Scalding Tarn",
  "Smothering Tithe",
  "City of Brass",
  "Arcane Signet",
  "Mana Confluence",
  "Swan Song",
  "Faithless Looting",
  "Xander's Lounge",
  "Blood Crypt",
  "Ancient Silver Dragon",
  "Force of Negation",
  "Entomb",
  "Bojuka Bog",
  "Wooded Foothills",
  "Urborg, Tomb of Yawgmoth",
  "Ketria Triome",
  "Ancient Brass Dragon",
  "Savai Triome",
  "Ziatora's Proving Ground",
  "Indatha Triome",
  "Windfall",
  "Blasphemous Act",
  "Boseiju, Who Endures",
  "Misty Rainforest",
  "Exhume",
  "Assassin's Trophy",
  "Urza's Ruinous Blast",
  "Zagoth Triome",
  "Spara's Headquarters",
  "Bloodstained Mire",
  "Fierce Guardianship",
  "Verdant Catacombs",
  "Morophon, the Boundless",
  "Gemstone Caverns",
  "Ancient Tomb",
  "Rhythm of the Wild",
  "Temple Garden",
  "Flooded Strand",
  "Three Visits",
  "Old Gnawbone",
  "Stomping Ground",
  "Raffine's Tower",
  "Delighted Halfling",
  "Dance of the Dead",
  "Watery Grave",
  "Buried Alive",
  "Toxic Deluge",
  "Nature's Lore",
  "Ancient Copper Dragon",
];

export default function Home() {
  const [breakdown, setBreakdown] = useState<SetBreakdown>();
  const [excludedSets, setExcludedSets] = useState<string[]>([]);

  const onSetChange = (
    option: readonly SetSelectOption[],
    _: ActionMeta<SetSelectOption>,
  ) => {
    setExcludedSets(option.map((v) => v.value));
  };

  const formAction = (formData: FormData) => {
    formData.set("excludedSets", excludedSets.join("\n"));
    handleSubmit(formData)
      .then((v) => setBreakdown(v))
      .catch((e) => console.error(e));
  };

  const formatOptions: {
    label: string;
    value: keyof typeof Scry.Format | "all";
  }[] = [
    "all",
    ...Object.keys(Scry.Format).filter((v) => Number.isNaN(Number.parseInt(v))),
  ].map((v) => {
    let label = v.charAt(0).toUpperCase() + v.slice(1);
    switch (v) {
      case "historicbrawl":
        label = "Historic Brawl";
        break;
      case "paupercommander":
        label = "Pauper Commander";
        break;
    }
    return {
      value: v as keyof typeof Scry.Format,
      label: label,
    };
  });

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
          <SetSelect
            id="excludedSets"
            name="excludedSets"
            onChange={onSetChange}
          />
        </div>
        <div className={styles.fieldBlock}>
          <label htmlFor="format">Format</label>
          <select name="format" id="format" defaultValue={"commander"}>
            {formatOptions.map((v) => (
              <option key={v.value} value={v.value}>
                {v.label}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.fieldBlock}>
          <label htmlFor="oldestYear">Oldest Year</label>
          <input
            type="number"
            name="oldestYear"
            id="oldestYear"
            placeholder="Oldest year to include"
            defaultValue={2010}
          />
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
            ></textarea>
          </div>
        </div>

        <button type="submit">Submit</button>
      </form>
      {breakdown && <MyChart data={breakdown} />}
    </>
  );
}
