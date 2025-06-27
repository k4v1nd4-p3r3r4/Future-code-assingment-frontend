import { Container } from 'react-bootstrap'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <>
      <Navbar />
      <Container className="my-4">
        <Outlet />
      </Container>
    </>
  )
}

export default Layout