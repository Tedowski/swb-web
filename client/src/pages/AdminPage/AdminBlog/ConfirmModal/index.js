import React from 'react'
import PropTypes from 'prop-types'

import { Modal, Button } from 'react-bootstrap'

const ConfirmModal = ({
  showConfirmModal,
  closeConfirmModal,
  handleDelete,
  postId
}) => (
  <Modal
    show={showConfirmModal}
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
        Once you will delete this blog post it will be removed forever. You
        can not undo this action. I have warned you.
      </p>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="dark-blue" onClick={closeConfirmModal}>
        Close
      </Button>
      <Button variant="danger" onClick={() => handleDelete(postId)}>
        Delete
      </Button>
    </Modal.Footer>
  </Modal>
)

ConfirmModal.propTypes = {
  showConfirmModal: PropTypes.bool.isRequired,
  closeConfirmModal: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  postId: PropTypes.string.isRequired
}

export default ConfirmModal
