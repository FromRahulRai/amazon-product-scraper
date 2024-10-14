const express = require("express")
const cors = require("cors")
const scrape = require("./scrape")
const Papa = require('papaparse')

const app = express()

const PORT = process.env.PORT || 5000

const allowedOrigins = [
    "https://amazon-product-scraper.vercel.app/", // Your Vercel frontend URL
    // "http://localhost:5173/", Localhost URL 
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


// For localhost 
// app.use(cors());

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


// CSV download endpoint
app.get('/download', async (req, res) => {
    const { urls } = req.query; // Get URLs from query string
    if (!urls) {
      return res.status(400).send('No URLs provided');
    }
    try {
      const urlsArray = urls.split(',').map(url => url.trim()); // Ensure we handle spaces
      const productsData = await Promise.all(urlsArray.map(url => scrape(url))); // Scrape data based on the provided URLs
      const csv = Papa.unparse(productsData); // Convert data to CSV format
      res.header('Content-Type', 'text/csv');
      res.attachment('products_data.csv'); // Set the file name
      res.send(csv);
    } catch (error) {
      console.error('CSV generation error:', error);
      res.status(500).send('Error generating CSV');
    }
});

app.listen(PORT,()=>{
    console.log("Server is Running...")
})