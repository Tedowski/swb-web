import React from 'react'
import PropTypes from 'prop-types'

import { Modal, Button } from 'react-bootstrap'

const DeleteModal = ({
  showModal,
  closeModal,
  handleDelete,
  id,
  type
}) => (
  <Modal
    show={showModal}
    size="lg"
    aria-labelledby="contained-modal-title-vcenter"
    centered
  >
    <Modal.Header>
      <Modal.Title id="contained-modal-title-vcenter">
        Confrim your action
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <h4>Are you sure?</h4>
      <p>
        Once you will delete this
        {' '}
        {type}
        {' '}
        it will be removed forever. You
        can not undo this action. You have been warned.
      </p>
    </Modal.Body>
    <Modal.Footer>
      <Button onClick={closeModal}>Close</Button>
      <Button variant="danger" onClick={() => handleDelete(id)}>Delete</Button>
    </Modal.Footer>
  </Modal>
)

DeleteModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
}

export default DeleteModal
