const express = require("express")
const cors = require("cors")
const scrape = require("./scrape")


const app = express()

const PORT = process.env.PORT || 5000

// Dynamically allow Vercel URLs or any specific domain you want
const allowedOrigins = [
    'https://amazon-product-scraper.vercel.app',
    'https://amazon-product-scraper-30pnwnqxb-rahul-rais-projects-be2ba330.vercel.app' // add the current URL
  ];
  
  // CORS options
  const corsOptions = {
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST'],
    credentials: true, // Allow credentials like cookies, auth headers if needed
  };
  
  // Apply CORS
  app.use(cors(corsOptions));

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