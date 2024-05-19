export const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5172",
    "http://localhost:5174",
    "https://chatgram-drab.vercel.app",
    "https://chatgram-git-master-vinitparmar03s-projects.vercel.app",
    "https://chatgram-kj076rfyg-vinitparmar03s-projects.vercel.app/",
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

export const CHATGRAM_TOKEN = "chatgram-token";
