import { useEffect, useState } from 'react'
import { Card, Button, Row, Col, Spinner, Alert, Table } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import productService from '../api/products'
import ProductForm from '../components/ProductForm'

const UserProducts = () => {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

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
  }, [user, navigate])

  const handleCreate = () => {
    setEditingProduct(null)
    setShowForm(true)
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleSubmit = async (productData) => {
    try {
      setIsLoading(true)
      if (editingProduct) {
        await productService.updateProduct(
          editingProduct.id,
          productData,
          user.token
        )
        toast.success('Product updated successfully')
      } else {
        await productService.createProduct(productData, user.token)
        toast.success('Product created successfully')
      }
      setShowForm(false)
      // Refresh products
      const data = await productService.getAllProducts()
      setProducts(data)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(productId, user.token)
        toast.success('Product deleted successfully')
        // Refresh products
        const data = await productService.getAllProducts()
        setProducts(data)
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete product')
      }
    }
  }

  if (isLoading && !showForm) {
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

  if (showForm) {
    return (
      <ProductForm
        product={editingProduct || { name: '', price: 0, quantity: 0 }}
        handleChange={() => {}}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        isEdit={!!editingProduct}
      />
    )
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>My Products</h1>
        <Button variant="primary" onClick={handleCreate}>
          Add New Product
        </Button>
      </div>

      {products.length === 0 ? (
        <Alert variant="info">You haven't added any products yet.</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>${isNaN(Number(product.price)) ? 'N/A' : Number(product.price).toFixed(2)}</td>
                <td>{product.quantity}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEdit(product)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    className="me-2"
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="info"
                    size="sm"
                    as={Link}
                    to={`/products/${product.id}`}
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  )
}

export default UserProducts