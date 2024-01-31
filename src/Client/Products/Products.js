import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Products.css';
import { FaEye } from "react-icons/fa6";
import Loading from '../Loading/Loading';
import { useNavigate } from 'react-router-dom';


function Products() {
  const [products, setProducts] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch products from the API
        const response = await axios.get('https://ecommerce-api-k87g.onrender.com/api/products');
        const fetchedProducts = response.data;

        // Save products to local storage
        localStorage.setItem('products', JSON.stringify(fetchedProducts));

        // Set products in the state
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

      // If products are not in local storage, fetch them
      fetchProducts();
    
  }, []);


  const handleCardClick = (product) => {
    navigate(`/product/${product._id}`);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products && products.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const StarRating = ({ rate, count }) => {
    const stars = Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={index < rate ? 'star-filled' : 'star-empty'}>
        ★
      </span>
    ));

    return (
      <div className="star-rating">
        {stars}
        <span className="rating-text">
          {rate > 0 ? `${rate} (${count} reviews)` : 'Rating: 0'}
        </span>
      </div>
    );
  };

  return (
    <div className="product-container">
      <div>
        
      </div>
      {currentProducts ? (
        <div className=" product-list">
          {currentProducts.map((product) => (
            <div key={product._id} className="products" onClick={() => handleCardClick(product)}>
              <div className="product-card">
                {product.images && product.images.length > 0 ? (
                  <img src={product.images[0]} alt={product.title} className="card-img  product-image" />
                ) : (
                  <div className="placeholder-image">No Image</div>
                )}
                <div className='content-section'>
                  <div className="card-body">
                    <div className='body-content'>
                      <h3 className="card-title product-title">{product.title}</h3>
                      <p className="card-text product-category">{product.category.name}</p>
                      {product.rating ? (
                        <StarRating rate={Math.round(product.rating.rate)} count={product.rating.count} />
                      ) : (
                        <p className="card-text product-rating">Rating: 0</p>
                      )}
                    </div>
                    <div className='card-footer'>
                      <p className="card-text product-price">${product.price}</p>
                      <button className="btn "  onClick={() => handleCardClick(product)}>
                        <FaEye className='cart-icon'/>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div ><Loading/></div>
      )}

      <div className="shadow-lg p-3  bg-white rounded pagination">
        {products && (
          <ul>
            {Array.from({ length: Math.ceil(products.length / itemsPerPage) }, (_, index) => (
              <li key={index} onClick={() => paginate(index + 1)} className={currentPage === index + 1 ? 'active' : ''}>
                {index + 1}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Products;
