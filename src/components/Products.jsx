{products.map((product) => (
  <div key={product.id}>
    <span>{product.name}</span>
    <span>
      {Number(product.price).toFixed(2)}
    </span>
  </div>
))}