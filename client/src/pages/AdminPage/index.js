import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { Button, Form } from 'react-bootstrap'
import { useToasts } from 'react-toast-notifications'

import AuthService from '../../services/AuthService'
import BaseSection from '../../components/BaseSection'

import AdminPanel from './AdminPanel'

const AdminPage = ({
  token,
  saveToken,
  saveUserData
}) => {
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
    const user = {
      username,
      password
    }

    try {
      const response = (await AuthService.login(user)).data.data
      const data = {
        id: response.user.id,
        username: response.user.username,
        role: response.user.role.name
      }
      const authToken = response.token
      sessionStorage.setItem('token', authToken)
      sessionStorage.setItem('user', JSON.stringify(data))
      saveToken(authToken)
      saveUserData(data)
    } catch (err) {
      addToast(err.response.data.message, {
        appearance: 'error',
        autoDismiss: false
      })
    }
  }

  if (token) {
    return (
      <AdminPanel />
    )
  }
  return (
    <BaseSection fullScreen>
      <Form className="mx-auto" onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            name="username"
            type="username"
            placeholder="Enter username"
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
          />
        </Form.Group>
        <Button variant="dark-blue" type="submit">
          Login
        </Button>
      </Form>
    </BaseSection>
  )
}

AdminPage.propTypes = {
  token: PropTypes.string,
  saveToken: PropTypes.func.isRequired,
  userData: PropTypes.shape({
    id: PropTypes.number,
    username: PropTypes.string,
    role: PropTypes.string
  }),
  saveUserData: PropTypes.func.isRequired
}

AdminPage.defaultProps = {
  token: undefined,
  userData: PropTypes.shape({
    id: undefined,
    username: undefined,
    role: undefined
  })
}

export default AdminPage
