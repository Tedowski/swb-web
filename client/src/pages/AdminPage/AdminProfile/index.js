import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { useToasts } from 'react-toast-notifications'

import { Col, Form, Button } from 'react-bootstrap'

import BaseSection from '../../../components/BaseSection'

import AuthService from '../../../services/AuthService'


const AdminProfile = ({ saveUserData, userData, token }) => {
  const [username, setUsername] = useState()
  const [password, setPassword] = useState()

  const { addToast } = useToasts()

  const handleChange = (event) => {
    if (event.target.name === 'username') {
      setUsername(event.target.value)
    }
    if (event.target.name === 'password') {
      setPassword(event.target.value)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const data = {
      username,
      password
    }
    try {
      const response = await AuthService.update(token, userData.id, data)
      addToast('Your profile has been successfully updated.', {
        appearance: 'success',
        autoDismiss: false
      })
      const newUsername = JSON.parse(response.config.data)
      const newUserData = {
        id: userData.id,
        username: newUsername.username,
        role: userData.role
      }
      sessionStorage.setItem('user', JSON.stringify(newUserData))
      const sessionData = sessionStorage.getItem('user')
      saveUserData(JSON.parse(sessionData))
    } catch (err) {
      addToast(err.response.data.message, {
        appearance: 'error',
        autoDismiss: false
      })
    }
  }

  return (
    <BaseSection>
      <Col lg={12}>
        <h3>
          Hey
          {' '}
          {userData.username}
          !
          {' '}
          Change your username or password here.
          <br />
          Then some kickflips ?
        </h3>
      </Col>
      <Col lg={4} className="mx-auto">
        <Form onSubmit={(event) => handleSubmit(event)}>
          <Form.Group controlId="formBasicUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              name="username"
              type="username"
              placeholder={userData.username}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              name="password"
              type="password"
              placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;"
              onChange={handleChange}
            />
          </Form.Group>
          <Button variant="success" type="submit">
            Change
          </Button>
        </Form>
      </Col>
    </BaseSection>
  )
}

AdminProfile.propTypes = {
  saveUserData: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
  userData: PropTypes.shape({
    id: PropTypes.number,
    username: PropTypes.string,
    role: PropTypes.string
  })
}

AdminProfile.defaultProps = {
  userData: PropTypes.shape({
    id: undefined,
    username: undefined,
    role: undefined
  })
}

export default AdminProfile
