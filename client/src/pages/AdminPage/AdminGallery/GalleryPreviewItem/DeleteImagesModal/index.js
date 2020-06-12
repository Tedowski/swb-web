/* eslint-disable no-underscore-dangle */
/* eslint-disable array-callback-return */
import React from 'react'
import PropTypes from 'prop-types'

import { useToasts } from 'react-toast-notifications'

import {
  Row, Col, Modal, Button
} from 'react-bootstrap'

import {
  FaFileImage,
  FaArrowRight
} from 'react-icons/fa'

import ImageService from '../../../../../services/ImageService'

const DeleteImagesModal = ({
  token,
  showModal,
  closeModal,
  images,
  imagesIds
}) => {
  const { addToast } = useToasts()

  const deleteImages = async () => {
    const data = {
      imageIds: imagesIds
    }
    try {
      await ImageService.delete(token, data)
      addToast('Images were successfully deleted', {
        appearance: 'success',
        autoDismiss: false
      })
      closeModal()
    } catch (err) {
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
          Delete images
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
        <Button
          variant="dark-blue"
          className="w-25 d-block ml-auto mt-4"
          onClick={deleteImages}
        >
          <div className="mx-2 d-flex flex-row justify-content-between align-items-center">
            Delete all images
            {' '}
            <FaArrowRight size="10" />
          </div>
        </Button>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={closeModal}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}

DeleteImagesModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  token: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
  imagesIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  images: PropTypes.arrayOf({
    image: PropTypes.shape({
      title: PropTypes.string
    })
  }).isRequired
}

export default DeleteImagesModal
