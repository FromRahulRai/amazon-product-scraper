import { useState } from 'react';
import './index.css';

function App() {
  const [urls, setUrls] = useState(''); // Input for multiple URLs
  const [productsData, setProductsData] = useState([]); // To store the fetched products data
  const [loading, setLoading] = useState(false); // To handle loading state

  const handleScrape = async () => {
    const urlsArray = urls.split(',').map(url => url.trim()); // Split the input by comma and trim spaces

    // Set loading to true when scraping starts
    setLoading(true);
    try {
      const response = await fetch('https://amazon-product-scraper.onrender.com/scrape', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ urls: urlsArray }), // Send array of URLs
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      setProductsData(data); // Store the response in state to display
    } catch (error) {
      console.error('Error:', error);
    } finally {
      // Set loading to false when scraping finishes
      setLoading(false);
    }
  };


  // Function to download the data as CSV
  const downloadAsCSV = () => {
    const csvRows = [
      ['Name', 'Price', 'Rating', 'Product Image', 'Thumbnail Images'],
      ...productsData.map(product => [
        product.name,
        product.price,
        product.rating,
        product.productImg,
        product.thumbnailImg.join(', '), // Joining thumbnail images as a string
      ])
    ];

    const csvContent = `data:text/csv;charset=utf-8,${csvRows.map(row => row.join(',')).join('\n')}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'products_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className='w-auto min-h-screen bg-gradient-to-b from-indigo-100 to-blue-100'>
      <div className='flex items-center justify-center pt-6'>
        <h1 className='text-3xl font-medium text-blue-500'>Amazon Product Scrapper</h1>
      </div>

      <div className='flex items-center justify-center mt-10 gap-8'>
        <textarea
          className='h-full min-h-[100px] w-1/3 px-8 py-4 rounded-lg placeholder:text-gray-500 text-slate-700 text-sm border border-blue-200 transition duration-300 ease focus:outline-none focus:border-blue-400'
          type="text"
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          placeholder='Enter Amazon product URLs, separated by commas'
        />

        <button
          className='px-4 py-2 bg-blue-300 border rounded-lg border-transparent text-center text-white transition-all shadow-md hover:shadow-lg focus:bg-blue-700 focus:shadow-none font-medium'
          onClick={handleScrape}
        >
          Scrape
        </button>

        {/* <button
              className='px-4 py-2 bg-green-500 border rounded-lg border-transparent text-center text-white transition-all shadow-md hover:shadow-lg focus:bg-green-700 focus:shadow-none font-medium mr-4'
              onClick={downloadAsCSV}
            >
              Download CSV
            </button> */}
      </div>

      {loading && (
        <div className='flex justify-center mt-10'>
          <div className='loader'></div>
          <p className='ml-4 text-blue-500 text-lg'>Loading product details, please wait...</p>
        </div>
      )}

      {!loading && productsData.length > 0 && (
        <div className='mt-10 px-8'>
          

          {productsData.map((productData, index) => (
            <>
            <div className='flex items-center justify-center text-2xl font-semibold mt-9'>
            <h2>{index+1} Product Details:</h2>
          </div>
            <div key={index} className='mt-8'>
              <p className='text-md pt-2 pb-2'>
                <span className='text-xl font-medium text-blue-400'>Name:</span> {productData.name}
              </p>
              <p className='text-md pt-2 pb-2'>
                <span className='text-xl font-medium text-blue-400'>Price:</span> ₹{productData.price}
              </p>
              <p className='text-md pt-2 pb-2'>
                <span className='text-xl font-medium text-blue-400'>Ratings:</span> {productData.rating}
              </p>
              <p className='text-md pt-2 pb-2'>
                <span className='text-xl font-medium text-blue-400'>Product Default Image:</span>
                <img src={productData.productImg} alt="product image" width={100} height={100} />
              </p>
              <h3 className='text-md pt-2 pb-2'>
                <span className='text-xl font-medium text-blue-400'>Thumbnail Images:</span>
              </h3>
              <ul className='flex items-center gap-6'>
                {productData.thumbnailImg && productData.thumbnailImg.map((img, imgIndex) => (
                  <li key={imgIndex}>
                    <img src={img} alt={`Thumbnail ${imgIndex}`} width={80} height={80} />
                  </li>
                ))}
              </ul>
            </div>
            </>
            
          ))}
        </div>
      )}

      
    </div>
  );
}

export default App;
