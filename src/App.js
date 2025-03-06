import "./styles.css";
import { ProductCard } from "./ProductCard";
import React, { useState, useEffect, useRef, useCallback } from "react";

const BASE_URL = "https://dummyjson.com";
const LIMIT = 10;

export default function App() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  // Setup initial load
  useEffect(() => {
    // Fetch data function
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const skip = (page - 1) * LIMIT;

        // Make API call to fetch items
        const response = await fetch(
          `${BASE_URL}/products?limit=${LIMIT}&skip=${skip}&delay=2000`
        );
        const data = await response.json();
        console.log("Fetch products data: ", page, data);

        // Stop infinite scrolling after page 5
        if (page > 5) {
          console.log("---setHasMore---");
          setHasMore(false);
        }

        setProducts((prevProducts) => [...prevProducts, ...data.products]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page]);

  // Setup intersection observer for infinite scroll
  const lastItemRef = useCallback(
    (node) => {
      if (loading) return;
      console.log("Inside intersection observer");
      if (observer.current) {
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1); // trigger loading of new products by chaging page no
        }
      });

      if (node) {
        observer.current.observe(node);
      }
    },
    [loading, hasMore, page]
  );

  return (
    <div className="App">
      <h1>Infinite Scroll List</h1>
      <div>
        {products.map((product, index) => {
          const isLastItem = index === products.length - 1;
          console.log(`Product ${product.title} is last: ${isLastItem}`);

          // Add ref to last item
          return (
            <ProductCard
              ref={isLastItem ? lastItemRef : null}
              key={product.id}
              title={product.title}
              description={product.description}
              price={product.price}
              imgUrl={product.images[0]}
            />
          );
        })}
      </div>

      {loading && (
        <div className="load-more">
          <p>Loading more products...</p>
        </div>
      )}

      {!hasMore && !loading && (
        <div style={{ color: "gray", textAlign: "center" }}>
          No more items to load
        </div>
      )}
    </div>
  );
}
