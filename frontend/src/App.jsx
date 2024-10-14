import { useState } from 'react';
import './index.css';

function App() {
  const [urls, setUrls] = useState(''); 
  const [productsData, setProductsData] = useState([]); // To store the fetched products data
  const [loading, setLoading] = useState(false); // To handle loading state
  const [error, setError] = useState(null);

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


   // Function to download the scraped data as CSV
   const downloadAsCSV = async () => {
    setLoading(true);
    setError(''); // Initialize error state if applicable
    
    try {
      // Ensure the URLs are properly formatted for the request
      const urlsArray = urls.split(',').map(url => url.trim()).join(',');
      
      const response = await fetch(`https://amazon-product-scraper.onrender.com/download?urls=${encodeURIComponent(urlsArray)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to generate CSV');
      }
  
      const blob = await response.blob(); // Get the response as a Blob
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'products_data.csv'); // Set the file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to download CSV. Please try again.');
    } finally {
      setLoading(false);
    }
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
          disabled={loading}
        >
          {loading ? 'Scraping...' : 'Scrape'}
        </button>

        <button
          className='px-4 py-2 bg-green-500 border rounded-lg border-transparent text-center text-white transition-all shadow-md hover:shadow-lg focus:bg-green-700 focus:shadow-none font-medium'
          onClick={downloadAsCSV}
          disabled={loading || productsData.length === 0} // Disable if loading or no data
        >
          {loading ? 'Downloading...' : 'Download CSV'}
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
        <div className='mt-10 px-8 '>


          {productsData.map((productData, index) => (
            <div className='bg-blue-200 bg-opacity-50 backdrop-blur-md border border-transparent rounded-lg p-6 shadow-lg mt-10'>
              <div className='flex items-center justify-center text-2xl font-semibold mt-9'>
                <h2 className='text-slate-600'>{index + 1} Product Details</h2>
              </div>

              <div className='grid grid-cols-2 gap-8 '>

                <div id='right' className='py-[15%]'>

                  <div key={index} className='mt-8'>
                    <p className='text-md pt-6 pb-6'>
                      <span className='text-xl font-medium text-blue-400'>Name:</span> {productData.name}
                    </p>
                    <p className='text-md pt-6 pb-6'>
                      <span className='text-xl font-medium text-blue-400'>Price:</span> ₹{productData.price}
                    </p>
                    <p className='text-md pt-6 pb-6'>
                      <span className='text-xl font-medium text-blue-400'>Ratings:</span> {productData.rating}
                    </p>
                  </div>
                </div>
                <div id='left'>
                  <div className='flex flex-col text-2xl font-semibold mt-9'>
                    <div className='h-[80%]'>
                    <p className='text-md pt-2 pb-2'>
                      
                      <img src={productData.productImg} alt="product image" width={10} height={10} className='w-[75%] h-auto' />
                    </p>
                    </div>
                    <div className='h-[20%]'>
                    <ul className='flex items-center gap-6'>
                      {productData.thumbnailImg && productData.thumbnailImg.map((img, imgIndex) => (
                        <li key={imgIndex}>
                          <img src={img} alt={`Thumbnail ${imgIndex}`} width={80} height={80} />
                        </li>
                      ))}
                    </ul>
                    </div>
                    
                   
                   
                  </div>
                </div>

              </div>


            </div>

          ))}
        </div>
      )}


    </div>
  );
}

export default App;
