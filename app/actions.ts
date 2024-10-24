"use server";

import {
  getCardList,
  getReprints,
  getSetBreakdown,
  init,
} from "@/lib/scryfall";

export async function doStuffWithCards(cardNames: string[]) {
  init();
  console.log("Doing stuff");
  const cards = await getCardList(cardNames);
  console.log(cards);
  const prints = await getReprints(
    cards,
    (card) =>
      !card.booster ||
      !card.games.includes("paper") ||
      card.digital ||
      card.promo ||
      card.set.length !== 3 ||
      card.set_type === "memorabilia"
  );
  console.log("Reprints:");
  console.log(prints);
  const breakdown = await getSetBreakdown(prints);
  console.log("Breakdown:");
  console.log(breakdown);
  return breakdown;
}

export async function handleSubmit(data: FormData) {
  const cards = (data.get("cards") as string).split("\n");
  const breakdown = await doStuffWithCards(cards);
  return breakdown;
}
