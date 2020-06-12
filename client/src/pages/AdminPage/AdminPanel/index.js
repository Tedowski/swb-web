import React from 'react'

import { Row, Col, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom/'

import { FaBlog, FaImages, FaUserCog } from 'react-icons/fa'

import BaseSection from '../../../components/BaseSection'

const AdminPanel = () => (
  <BaseSection fullScreen>
    <Col lg={12}>
      <div className="mx-auto d-flex flex-column align-items-center">
        <h2>Skate World Better dashboard</h2>
      </div>
    </Col>
    <Col lg={12} className="my-5 py-5">
      <Row>
        <Col lg={4}>
          <Link to="/admin-blog">
            <Button variant="dark-blue" className="d-flex flex-column align-items-center mx-auto w-100">
              <FaBlog size={60} className="my-2" />
              <p className="m-4">
                Manage Blog
              </p>
            </Button>
          </Link>
        </Col>
        <Col lg={4}>
          <Link to="/admin-gallery">
            <Button variant="dark-blue" className="d-flex flex-column align-items-center mx-auto w-100">
              <FaImages size={60} className="my-2" />
              <p className="m-4">
                Manage Gallery
              </p>
            </Button>
          </Link>
        </Col>
        <Col lg={4}>
          <Link to="/admin-users">
            <Button variant="dark-blue" className="d-flex flex-column align-items-center mx-auto w-100">
              <FaUserCog size={60} className="my-2" />
              <p className="m-4">
                Manage Users
              </p>
            </Button>
          </Link>
        </Col>
      </Row>
    </Col>
  </BaseSection>
)

export default AdminPanel
