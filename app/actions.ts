"use server";

import client from "@/lib/mongodb";
import {
  getCardList,
  getReprints,
  getSetBreakdown,
  init,
} from "@/lib/scryfall";

export async function testDatabaseConnection() {
  let isConnected = false;
  try {
    const mongoClient = await client.connect();
    // Send a ping to confirm a successful connection
    await mongoClient.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    ); // because this is a server action, the console.log will be outputted to your terminal not in the browser
    return !isConnected;
  } catch (e) {
    console.error(e);
    return isConnected;
  }
}

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
