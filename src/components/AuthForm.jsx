import { Form, Button, Alert } from 'react-bootstrap'

const AuthForm = ({ formData, handleChange, handleSubmit, isLoading, isLogin }) => {
  return (
    <Form onSubmit={handleSubmit} className="form-container">
      <h2 className="text-center mb-4">{isLogin ? 'Login' : 'Register'}</h2>
      
      {!isLogin && (
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>
      )}

      <Form.Group className="mb-3">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Button variant="primary" type="submit" disabled={isLoading} className="w-100">
        {isLoading ? 'Processing...' : isLogin ? 'Login' : 'Register'}
      </Button>

      <div className="text-center mt-3">
        {isLogin ? (
          <p>
            Don't have an account? <a href="/register">Register</a>
          </p>
        ) : (
          <p>
            Already have an account? <a href="/login">Login</a>
          </p>
        )}
      </div>
    </Form>
  )
}

export default AuthForm