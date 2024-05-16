export const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5172",
    "http://localhost:5174",
    process.env.CLIENT_URL,
    "https://chatgram-git-master-vinitparmar03s-projects.vercel.app",
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

export const CHATGRAM_TOKEN = "chatgram-token";
