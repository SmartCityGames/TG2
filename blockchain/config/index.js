const { config } = require("dotenv-safe");

config();

module.exports = {
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_KEY: process.env.SUPABASE_KEY,
  SUPABASE_EMAIL: process.env.SUPABASE_EMAIL,
  SUPABASE_PASSWORD: process.env.SUPABASE_PASSWORD,
  GOERLI_ALCHEMY_URL: process.env.GOERLI_ALCHEMY_URL,
  GOERLI_WALLET_PRIVATE_KEY: process.env.GOERLI_WALLET_PRIVATE_KEY,
};
