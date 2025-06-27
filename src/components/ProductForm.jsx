import { Form, Button, FloatingLabel, Alert } from 'react-bootstrap'

const ProductForm = ({ product, handleChange, handleSubmit, isLoading, isEdit }) => {
  return (
    <Form onSubmit={handleSubmit} className="form-container">
      <h2 className="text-center mb-4">{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
      
      <FloatingLabel controlId="name" label="Product Name" className="mb-3">
        <Form.Control
          type="text"
          name="name"
          value={product.name}
          onChange={handleChange}
          required
        />
      </FloatingLabel>

      <FloatingLabel controlId="price" label="Price" className="mb-3">
        <Form.Control
          type="number"
          name="price"
          value={product.price}
          onChange={handleChange}
          step="0.01"
          min="0"
          required
        />
      </FloatingLabel>

      <FloatingLabel controlId="quantity" label="Quantity" className="mb-3">
        <Form.Control
          type="number"
          name="quantity"
          value={product.quantity}
          onChange={handleChange}
          min="0"
          required
        />
      </FloatingLabel>

      <Button variant="primary" type="submit" disabled={isLoading} className="w-100">
        {isLoading ? 'Processing...' : isEdit ? 'Update Product' : 'Add Product'}
      </Button>
    </Form>
  )
}

export default ProductForm