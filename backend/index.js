const express = require("express")
const cors = require("cors")
const scrape = require("./scrape")


const app = express()

const PORT = process.env.PORT || 5000

// Configure CORS to allow requests from your frontend
const corsOptions = {
    origin: 'https://amazon-product-scraper.vercel.app', // Replace with your actual frontend URL
    optionsSuccessStatus: 200, // Some legacy browsers choke on 204
  };
  
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