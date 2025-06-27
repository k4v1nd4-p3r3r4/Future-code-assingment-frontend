import { Card, Button, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <>
      <div className="text-center mb-5">
        <h1>Welcome to Product Management System</h1>
        <p className="lead">Manage your products with ease</p>
      </div>

      <Row className="g-4">
        <Col md={6}>
          <Card className="h-100">
            <Card.Body className="text-center">
              <Card.Title>View Products</Card.Title>
              <Card.Text>
                Browse through all available products in our system.
              </Card.Text>
              <Button as={Link} to="/products" variant="primary">
                View All Products
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="h-100">
            <Card.Body className="text-center">
              <Card.Title>Manage Your Products</Card.Title>
              <Card.Text>
                Add, edit or delete your own products (requires login).
              </Card.Text>
              <Button as={Link} to="/my-products" variant="success">
                My Products
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default Home