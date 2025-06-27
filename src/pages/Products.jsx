import { useEffect, useState } from 'react'
import { Card, Button, Row, Col, Spinner, Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import productService from '../api/products'

const Products = () => {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAllProducts()
        setProducts(data)
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to fetch products')
        toast.error('Failed to fetch products')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

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

  return (
    <>
      <h1 className="mb-4">All Products</h1>
      <Row xs={1} md={2} lg={3} className="g-4">
        {products.map((product) => (
          <Col key={product.id}>
            <Card className="h-100 product-card">
              <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>
                  <strong>Price:</strong> ${isNaN(Number(product.price)) ? 'N/A' : Number(product.price).toFixed(2)}<br />
                  <strong>Quantity:</strong> {product.quantity}
                </Card.Text>
              </Card.Body>
              <Card.Footer>
                <Button as={Link} to={`/products/${product.id}`} variant="primary" size="sm">
                  View Details
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  )
}

export default Products