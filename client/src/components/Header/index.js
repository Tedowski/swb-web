import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Navbar, Nav } from 'react-bootstrap'

const Header = ({ token }) => (
  <Navbar expand="lg">
    <Nav>
      { token && (
        <>
          <Nav.Item>
            <Nav.Link>
              <Link to="/admin-blog">
                Blog
              </Link>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link>
              <Link to="/admin-gallery">
                Gallery
              </Link>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link>
              <Link to="/admin-users">
                Users
              </Link>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link>
              <Link to="/logout" className="text-danger">
                Logout
              </Link>
            </Nav.Link>
          </Nav.Item>
        </>
      )}
      { !token && (
        <>
          <Nav.Item>
            <Nav.Link>
              <Link to="/">
                Home
              </Link>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link>
              <Link to="/admin">
                Admin
              </Link>
            </Nav.Link>
          </Nav.Item>
        </>
      )}
    </Nav>
  </Navbar>
)

Header.propTypes = {
  token: PropTypes.string
}

Header.defaultProps = {
  token: undefined
}

export default Header
