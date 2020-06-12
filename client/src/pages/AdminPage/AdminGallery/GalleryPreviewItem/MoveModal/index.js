/* eslint-disable no-underscore-dangle */
/* eslint-disable array-callback-return */
import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { useToasts } from 'react-toast-notifications'

import {
  Row, Col, Modal, Button, Form
} from 'react-bootstrap'

import {
  FaFileImage,
  FaArrowRight
} from 'react-icons/fa'

import ImageService from '../../../../../services/ImageService'

const MoveModal = ({
  token,
  showModal,
  closeModal,
  images,
  imagesIds,
  albums
}) => {
  const [albumId, setAlbumId] = useState([])

  const { addToast } = useToasts()

  const handleAlbumId = (event) => {
    if (event.target.name === 'albums') {
      const albumIndex = event.target.selectedIndex
      if (albums[albumIndex - 1] === undefined) {
        setAlbumId(null)
      } else {
        const idOfAlbum = albums[albumIndex - 1].id
        setAlbumId(idOfAlbum)
      }
    }
  }
  const moveImages = async () => {
    const data = {
      imageIds: imagesIds,
      albumId
    }
    try {
      await ImageService.move(token, data)
      addToast('Images were successfully moved', {
        appearance: 'success',
        autoDismiss: false
      })
      closeModal()
    } catch (err) {
      console.log(err.response)
      addToast(err.response.data.message, {
        appearance: 'error',
        autoDismiss: false
      })
    }
  }
  return (
    <Modal
      show={showModal}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title as="h4" id="contained-modal-title-vcenter">
          Move images
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>Your selected images:</h5>
        <Row className="my-3">
          {images && images.map((image) => (
            <Col lg={4} className="d-flex">

              <FaFileImage size="20" className="mr-3" />
              <p>{image.title}</p>
            </Col>
          ))}
        </Row>
        <Form>
          <Form.Group controlId="formBasicName">
            <Form.Label>
              Assign to album
            </Form.Label>
            <Form.Control as="select" name="albums" onChange={handleAlbumId}>
              <option selected disabled>Choose one album</option>
              {albums && albums.map((album) => (
                <option key={album._id} id={album._id}>
                  {album.name}
                </option>
              ))}
              <option id="null">uncategorised</option>
            </Form.Control>
          </Form.Group>
          <Button
            variant="dark-blue"
            className="w-25 d-block ml-auto mt-4"
            onClick={moveImages}
          >
            <div className="mx-2 d-flex flex-row justify-content-between align-items-center">
              Move all images
              {' '}
              <FaArrowRight size="10" />
            </div>
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={closeModal}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}

MoveModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  token: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
  imagesIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  images: PropTypes.arrayOf({
    image: PropTypes.shape({
      title: PropTypes.string
    })
  }).isRequired,
  albums: PropTypes.arrayOf({
    album: PropTypes.shape({
      name: PropTypes.string
    })
  }).isRequired
}

export default MoveModal
