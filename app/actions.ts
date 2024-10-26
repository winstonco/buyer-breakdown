"use server";

import {
  isFormatOption,
  getCardList,
  getReprints,
  getSetBreakdown,
  init,
  FormatOption,
} from "@/lib/scryfall";

export async function handleSubmit(data: FormData) {
  const cardNames = ((data.get("cards") ?? "") as string).split("\n");
  const dateLimit = new Date((data.get("oldestYear") ?? "0") as string);
  const dataFormat = (data.get("format") ?? "") as string;
  let format: FormatOption = "all";
  if (isFormatOption(dataFormat)) {
    format = dataFormat;
  }
  const excludedSets = ((data.get("excludedSets") ?? "") as string).split("\n");

  init();
  const cards = await getCardList(cardNames);
  // console.log(cards);
  const prints = await getReprints(
    cards,
    (card) =>
      !card.booster ||
      !card.games.includes("paper") ||
      card.digital ||
      card.promo ||
      (format !== "all" && !card.isLegal(format)) ||
      excludedSets.includes(card.set) ||
      card.set.length !== 3 ||
      card.set_type === "memorabilia" ||
      new Date(card.released_at) < dateLimit
  );

  const breakdown = await getSetBreakdown(prints);
  console.log("Breakdown:");
  console.log(breakdown);
  return breakdown;
}
