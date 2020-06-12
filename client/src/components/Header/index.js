import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Navbar, Nav, NavDropdown } from 'react-bootstrap'

const Header = ({ token, userData }) => (
  <Navbar expand="lg">
    <Nav className="justify-content-between">
      { token && userData && (
        <>
          <div className="d-flex flex-row">
            <Nav.Item>
              <Nav.Link>
                <Link to="/admin">
                  Home
                </Link>
              </Nav.Link>
            </Nav.Item>
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
            {userData
            && userData.role !== 'cooperator'
            && (
              <Nav.Item>
                <Nav.Link>
                  <Link to="/admin-users">
                    Users
                  </Link>
                </Nav.Link>
              </Nav.Item>
            )}
          </div>
          <div>
            <NavDropdown title={userData.username} id="user-nav-dropdown">
              <NavDropdown.Item as={Link} to="/admin-profile">
                Profile
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/logout" className="text-danger">
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </div>
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
  token: PropTypes.string,
  userData: PropTypes.shape({
    id: PropTypes.number,
    username: PropTypes.string,
    role: PropTypes.string
  })
}

Header.defaultProps = {
  token: undefined,
  userData: PropTypes.shape({
    id: undefined,
    username: undefined,
    role: undefined
  })
}

export default Header
