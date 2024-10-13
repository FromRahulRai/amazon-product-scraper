const axios = require("axios")
const cheerio = require("cheerio")

// const url = "https://www.amazon.in/Skybags-Brat-Black-Casual-Backpack/dp/B08Z1HHHTD/ref=pd_sbs_d_sccl_2_1/262-6725751-7724842?psc=1"



async function scrape(url) {

    const product = { name: "", price: "", rating: "", thumbnailImg: [], productImg: "" }
    try {
        // Fetch the HTML content from the URL
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        // Extract the product information
        const item = $("div#dp");

        product.name = $(item).find("h1 span#productTitle").text().trim();
        product.price = $(item).find("span .a-price-whole").first().text().trim();
        product.rating = $(item).find("span.a-icon-alt").first().text().trim();
        product.productImg = $(item).find("div#imgTagWrapperId img").attr('src')

        // Extract the thumbnail images from the provided structure
        $('#altImages ul.a-unordered-list li img').each((index, element) => {
            // Find the img tag and get its src attribute
            const imgSrc = $(element).attr('src');

            // Push the src (URL) to product.thumbnailimg array if it exists
            if (imgSrc) {
                product.thumbnailImg.push(imgSrc);
            }
        });

        // Log the product object with all image URLs
        console.log(product);
    } catch (error) {
        console.error("Error scraping the data: ", error);
    }

    return product
}



module.exports = scrape 