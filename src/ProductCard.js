export function ProductCard({ title, description, price, imgUrl }) {
  return (
    <div className="product-card">
      <img src={imgUrl} alt="product image" />
      <div className="product-details">
        <h3>{title}</h3>
        <div>{description}</div>
        <h4>$ {price}</h4>
      </div>
    </div>
  );
}
