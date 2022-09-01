const { createClient } = require("@supabase/supabase-js");
const config = require("../config");
const fs = require("fs/promises");
const path = require("path");

const client = createClient(config.SUPABASE_URL, config.SUPABASE_KEY, {
  autoRefreshToken: true,
});

async function main() {
  const smartContract = await fs.readFile(
    path.join(
      __dirname,
      "..",
      "artifacts",
      "contracts",
      "SmartCityGames.sol",
      "SmartCityGames.json"
    )
  );

  await client.auth.signIn({
    email: config.SUPABASE_EMAIL,
    password: config.SUPABASE_PASSWORD,
  });

  const { data, error } = await client.storage
    .from("assets")
    .upload("contract_abi.json", smartContract, {
      contentType: "application/json",
      upsert: true,
    });

  if (error) {
    console.error({ error });
  } else {
    console.log("uploaded", { data });
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
