import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', quantity: '' });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const navigate = useNavigate();


  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/products/all');
      setProducts(res.data);
    } catch (err) {
      setMessage({ type: 'danger', text: 'Error fetching products' });
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await axios.put(`/api/products/${editId}`, form);
        setMessage({ type: 'success', text: 'Product updated successfully!' });
        setEditId(null);
      } else {
        await axios.post('/api/products', form);
        setMessage({ type: 'success', text: 'Product added successfully!' });
      }
      setForm({ name: '', price: '', quantity: '' });
      fetchProducts();
    } catch (err) {
      setMessage({ 
        type: 'danger', 
        text: err.response?.data?.message || 'Error saving product' 
      });
      console.error('Error saving product:', err);
    } finally {
      setLoading(false);
    }
  };

  // Edit product
  const handleEdit = (product) => {
    setForm({ 
      name: product.name, 
      price: product.price, 
      quantity: product.quantity 
    });
    setEditId(product.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    setLoading(true);
    try {
      await axios.delete(`/api/products/${id}`);
      setMessage({ type: 'success', text: 'Product deleted successfully!' });
      fetchProducts();
    } catch (err) {
      setMessage({ 
        type: 'danger', 
        text: err.response?.data?.message || 'Error deleting product' 
      });
      console.error('Error deleting product:', err);
    } finally {
      setLoading(false);
    }
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

 
  const getFilteredAndSortedProducts = () => {
    let filteredProducts = products;
    
    
    if (searchTerm) {
      filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      ); 
    }
    
    // Sort products
    if (sortConfig.key) {
      filteredProducts.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return filteredProducts;
  };

  const filteredProducts = getFilteredAndSortedProducts();

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR'
    }).format(amount);
  };

  return (
    <div className="dashboard-container">
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div className="container">
          <span className="navbar-brand fw-bold">Product Management</span>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <button
                  className="nav-link btn btn-link text-white"
                  onClick={() => navigate('/dashboard')}
                >
                  Dashboard
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link btn btn-link text-white"
                  onClick={() => {
                    localStorage.removeItem('token');
                    navigate('/login');
                  }}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Product Dashboard</h2>
          <span className="badge bg-primary rounded-pill">
            Total Products: {products.length}
          </span>
        </div>

        {message && (
          <div className={`alert alert-${message.type} alert-dismissible fade show`}>
            {message.text}
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setMessage(null)}
            />
          </div>
        )}

        {/* Product Form */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5 className="card-title">
              {editId ? 'Edit Product' : 'Add New Product'}
            </h5>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Product Name</label>
                  <input
                    className="form-control"
                    placeholder="Enter product name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Price</label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input
                      className="form-control"
                      placeholder="0.00"
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Quantity</label>
                  <input
                    className="form-control"
                    placeholder="0"
                    type="number"
                    min="0"
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-2 d-flex align-items-end">
                  <button 
                    className="btn btn-primary w-100"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm me-2" />
                    ) : (
                      editId ? 'Update' : 'Add'
                    )}
                  </button>
                </div>
              </div>
              {editId && (
                <div className="mt-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => {
                      setEditId(null);
                      setForm({ name: '', price: '', quantity: '' });
                    }}
                  >
                    Cancel Edit
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Products Table */}
        <div className="card shadow-sm">
          <div className="card-body">
            {loading && products.length === 0 ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading products...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-box-seam display-5 text-muted" />
                <p className="mt-3">
                  {searchTerm ? 'No matching products found' : 'No products available'}
                </p>
                {searchTerm && (
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => setSearchTerm('')}
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th 
                        onClick={() => requestSort('name')}
                        style={{ cursor: 'pointer' }}
                      >
                        Name
                        {sortConfig.key === 'name' && (
                          <i className={`bi bi-caret-${sortConfig.direction === 'asc' ? 'up' : 'down'}-fill ms-1`} />
                        )}
                      </th>
                      <th 
                        onClick={() => requestSort('price')}
                        style={{ cursor: 'pointer' }}
                      >
                        Price
                        {sortConfig.key === 'price' && (
                          <i className={`bi bi-caret-${sortConfig.direction === 'asc' ? 'up' : 'down'}-fill ms-1`} />
                        )}
                      </th>
                      <th 
                        onClick={() => requestSort('quantity')}
                        style={{ cursor: 'pointer' }}
                      >
                        Quantity
                        {sortConfig.key === 'quantity' && (
                          <i className={`bi bi-caret-${sortConfig.direction === 'asc' ? 'up' : 'down'}-fill ms-1`} />
                        )}
                      </th>
                      <th>Total Value</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>{formatCurrency(product.price)}</td>
                        <td>
                          <span className={product.quantity < 5 ? 'text-danger fw-bold' : ''}>
                            {product.quantity}
                          </span>
                        </td>
                        <td>{formatCurrency(product.price * product.quantity)}</td>
                        <td>
                          {product.quantity === 0 ? (
                            <span className="badge bg-danger">Out of Stock</span>
                          ) : product.quantity < 5 ? (
                            <span className="badge bg-warning text-dark">Low Stock</span>
                          ) : (
                            <span className="badge bg-success">In Stock</span>
                          )}
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <button 
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleEdit(product)}
                              title="Edit"
                            >
                              <i className="bi bi-pencil-fill" />
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(product.id)}
                              title="Delete"
                            >
                              <i className="bi bi-trash-fill" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .dashboard-container {
          min-height: 100vh;
          background-color: #f8f9fa;
        }
        .table-hover tbody tr:hover {
          background-color: rgba(13, 110, 253, 0.05);
        }
        .card {
          transition: transform 0.2s;
        }
        .card:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}