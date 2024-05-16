export const corsOptions = {
  origin: true,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
  },
  optionSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

export const CHATGRAM_TOKEN = "chatgram-token";

// [
//   "http://localhost:5173",
//   "http://localhost:5172",
//   "http://localhost:5174",
//   "https://chatgram-1v1udvpsa-vinitparmar03s-projects.vercel.app",
//   "https://chatgram-git-master-vinitparmar03s-projects.vercel.app",
// ],
