const express = require("express")
const cors = require("cors")
const scrape = require("./scrape")


const app = express()

const PORT = process.env.PORT || 5000

const allowedOrigins = [
    "https://amazon-product-scraper.vercel.app", // Your Vercel frontend URL
    // You can add more origins if needed
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true // Allow credentials
}));

app.use(express.json())


app.post('/scrape', async (req,res)=>{
    const { urls } = req.body

    if(!urls || !Array.isArray(urls)) {
      return res.status(400).json({ error: "Array of URLs is required! " })
    }

    try {
        const results = await Promise.all(urls.map(url => scrape(url)));
        res.json(results); 
    } 
    
    catch (error) {
     console.error("Error scraping data:", error)
     res.status(500).json({ error: "Failed to scrape the product :(" })   
    }
})

app.listen(PORT,()=>{
    console.log("Server is Running...")
})