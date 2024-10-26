import * as Scry from "scryfall-sdk";

let ready = false;

export function init() {
  if (!ready) {
    Scry.setAgent("BuyerBreakdown", "1.0.0");
    Scry.setTimeout(50);
    ready = true;
  }
}

const formats = Object.keys(Scry.Format).filter((v) =>
  Number.isNaN(Number.parseInt(v))
);

export type FormatOption = keyof typeof Scry.Format | "all";

export function isFormatOption(v: string): v is FormatOption {
  if (v === "all") return true;
  return formats.includes(v);
}

export async function getCardList(cardNames: string[]) {
  const collection = cardNames.map((name) => Scry.CardIdentifier.byName(name));
  const cards = await Scry.Cards.collection(...collection).waitForAll();
  return cards;
}

export async function getReprints(
  cards: Scry.Card[],
  filterOut?: (card: Scry.Card) => boolean
) {
  const out: Scry.Card[] = [];
  for (const card of cards) {
    let prints: Scry.Card[] = [];
    try {
      prints = await card.getPrints();
    } catch (e) {
      console.error(`Error getting printings for ${card.name}: ${e}`);
      continue;
    }
    if (filterOut) {
      out.push(...prints.filter((v) => !filterOut(v)));
    } else {
      out.push(...prints);
    }
  }
  return out;
}

export type SetBreakdown = {
  [setName: string]: {
    cards: Set<string>;
    ogPrints: number;
    reprints: number;
  };
};

export async function getSetBreakdown(
  cards: Scry.Card[]
): Promise<SetBreakdown> {
  init();
  const output: SetBreakdown = {};
  for (const card of cards) {
    const set = `${card.set_name} [${card.set}]`;
    if (!output[set]) {
      output[set] = {
        cards: new Set([card.name]),
        ogPrints: card.reprint ? 0 : 1,
        reprints: card.reprint ? 1 : 0,
      };
    } else {
      output[set].cards.add(card.name);
      if (card.reprint) {
        output[set].reprints++;
      } else {
        output[set].ogPrints++;
      }
    }
  }
  return output;
}
