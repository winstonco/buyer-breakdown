import * as Scry from "scryfall-sdk";

export type FormSubmissionData = {
  excludedSets: Scry.Set[];
  format: keyof typeof Scry.Format | "all";
  cards: Scry.Card[];
};

export type SetBreakdown = {
  [cardName: string]: {
    [setName: string]: number;
  };
};

export async function getSetBreakdown({
  excludedSets,
  format,
  cards,
}: FormSubmissionData) {
  const output: SetBreakdown = {};

  for (let i = 0; i < cards.length; i++) {
    console.log(output);
    const card = cards[i];
    let prints: Scry.Card[];
    try {
      prints = await card.getPrints();
    } catch (e) {
      console.error(`Error getting printings for ${card.name}: ${e}`);
      prints = [];
    }
    let filterLegalInFormat: Scry.Card[] = prints;
    if (format !== "all") {
      filterLegalInFormat = prints.filter((p) => p.isLegal(format));
    }
    let filterExcludedSets: Scry.Card[];
    try {
      if (excludedSets.length === 0) {
        filterExcludedSets = filterLegalInFormat;
      } else {
        const excludedSetCodes = excludedSets.map((set) => set.id);
        filterExcludedSets = filterLegalInFormat.filter(
          (card) => !excludedSetCodes.includes(card.set_id)
        );
      }
    } catch (e) {
      console.error(`Error filtering excluded sets: ${e}`);
      filterExcludedSets = [];
    }

    const filteredSets = filterExcludedSets;
    const setBreakdown: { [setName: string]: number } = {};
    for (let j = 0; j < filteredSets.length; j++) {
      if (!setBreakdown[filteredSets[j].set_name]) {
        setBreakdown[filteredSets[j].set_name] = 1;
      } else {
        setBreakdown[filteredSets[j].set_name]++;
      }
    }

    output[card.name] = setBreakdown;
  }
  console.log(output);
  return output;
}
