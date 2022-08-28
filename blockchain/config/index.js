const { config } = require("dotenv-safe");

config();

module.exports = {
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_KEY: process.env.SUPABASE_KEY,
  SUPABASE_EMAIL: process.env.SUPABASE_EMAIL,
  SUPABASE_PASSWORD: process.env.SUPABASE_PASSWORD,
};
