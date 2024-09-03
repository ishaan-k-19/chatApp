const corsOptions = {
    origin: ['http://localhost:5173', "http://localhost:4173", process.env.CLIENT_URL, "https://convocube.online", "https://www.convocube.online",  "http://10.0.0.144:5173", "*"],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}

const CHATAPP_TOKEN = "chatapp-token";

export { corsOptions, CHATAPP_TOKEN }