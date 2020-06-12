import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import { useToasts } from 'react-toast-notifications'

import { Form } from 'react-bootstrap'

import {
  FaSortAmountDownAlt,
  FaFilter,
  FaSearch
} from 'react-icons/fa'

import AuthService from '../../../../services/AuthService'


const GalleryFilter = ({ token }) => {
  const [users, setUsers] = useState()

  const { addToast } = useToasts()

  const listUsers = async () => {
    try {
      const response = (await AuthService.list(token)).data.data
      setUsers(response)
    } catch (err) {
      addToast(err.response.data.message, {
        appearance: 'error',
        autoDismiss: false
      })
    }
  }
  useEffect(() => {
    listUsers()
  }, [])
  return (
    <>
      <Form inline className="filter-form d-flex flex-row justify-content-between">
        <div className="d-flex flex-row">
          <Form.Group
            controlId="dateCreated"
            className="ml-2 display-flex flex-column"
          >
            <Form.Label className="mt-3">
              <FaSortAmountDownAlt size="10" className="mr-1" />
              Sort by date
            </Form.Label>
            <Form.Control as="select">
              <option selected>Newest to oldest</option>
              <option>Oldest to newest</option>
            </Form.Control>
          </Form.Group>
          <Form.Group
            controlId="Author"
            className="ml-2 display-flex flex-column"
          >
            <Form.Label className="mt-3">
              <FaFilter size="10" className="mr-1" />
              Filter by authors
            </Form.Label>
            <Form.Control as="select">
              <option selected>All authors</option>
              {users && users.map((user) => (
                <option>{user.username}</option>
              ))}
            </Form.Control>
          </Form.Group>
        </div>
        <div>
          <Form.Label className="mt-3">
            <FaSearch size="10" className="mr-1" />
            Search
          </Form.Label>
          <Form.Control
            type="text"
            name="title"
            placeholder="Write some keyword..."
          />
        </div>
      </Form>
    </>
  )
}

GalleryFilter.propTypes = {
  token: PropTypes.string
}

GalleryFilter.defaultProps = {
  token: undefined
}


export default GalleryFilter
