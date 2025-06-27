import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Card, Button, Spinner, Alert, Badge } from 'react-bootstrap'
import { toast } from 'react-toastify'
import productService from '../api/products'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productService.getProduct(id)
        setProduct(data)
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to fetch product')
        toast.error('Failed to fetch product')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  if (isLoading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    )
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>
  }

  if (!product) {
    return <Alert variant="warning">Product not found</Alert>
  }

  return (
    <Card className="my-4">
      <Card.Body>
        <Card.Title>{product.name}</Card.Title>
        <Card.Text>
          <strong>Price:</strong> ${isNaN(Number(product.price)) ? 'N/A' : Number(product.price).toFixed(2)}<br />
          <strong>Quantity:</strong> <Badge bg={product.quantity > 0 ? 'success' : 'danger'}>
            {product.quantity}
          </Badge><br />
          <strong>Created At:</strong> {new Date(product.created_at).toLocaleString()}
        </Card.Text>
        {user && (
          <div className="d-flex gap-2">
            <Button 
              as={Link} 
              to={`/my-products/edit/${product.id}`} 
              variant="warning"
            >
              Edit
            </Button>
            <Button 
              variant="danger"
              onClick={async () => {
                if (window.confirm('Are you sure you want to delete this product?')) {
                  try {
                    await productService.deleteProduct(product.id, user.token)
                    toast.success('Product deleted successfully')
                    navigate('/my-products')
                  } catch (error) {
                    toast.error(error.response?.data?.message || 'Failed to delete product')
                  }
                }
              }}
            >
              Delete
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  )
}

export default ProductDetail