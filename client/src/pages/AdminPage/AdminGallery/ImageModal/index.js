/* eslint-disable no-underscore-dangle */
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useToasts } from 'react-toast-notifications'

import { Modal, Button, Form } from 'react-bootstrap'
import { FaArrowRight } from 'react-icons/fa'

import FileInput from '../../../../components/FileInput'

import ImageService from '../../../../services/ImageService'
import AlbumService from '../../../../services/AlbumService'

import AlbumModal from '../AlbumModal'

const ImageModal = ({
  userData,
  token,
  showModal,
  closeModal,
  albums,
  fileList,
  setFileList,
  listImages,
  listAlbums
}) => {
  const [titles, setTitles] = useState([])
  const [albumId, setAlbumId] = useState([])
  const [typingTimeout, setTypingTimeout] = useState(0)
  const [, setTyping] = useState(false)

  const [showAlbumModal, setShowAlbumModal] = useState(false)
  const [albumName, setAlbumName] = useState()

  const { addToast } = useToasts()

  const handleOpen = () => {
    setShowAlbumModal(true)
  }

  const handleClose = () => {
    setShowAlbumModal(false)
  }

  const handleChange = (event) => {
    if (event.target.name === 'name') setAlbumName(event.target.value)
  }

  const createAlbum = async () => {
    const data = {
      name: albumName
    }
    try {
      await AlbumService.create(token, data)
      addToast('Album was successfully created', {
        appearance: 'success',
        autoDismiss: false
      })
      listAlbums()
      handleClose()
    } catch (err) {
      addToast(err.response.data.message, {
        appearance: 'error',
        autoDismiss: false
      })
    }
  }

  const handleFileList = (files) => {
    if (files.length > 12) {
      addToast('Maximum 12 images can be uploaded', {
        appearance: 'error',
        autoDismiss: false
      })
      closeModal()
      setFileList([])
    }
    setFileList(files)
  }


  const handleTitles = (event) => {
    if (typingTimeout) setTypingTimeout(0)
    if (event.target.name === 'title') {
      const title = event.target.value
      setTyping(false)
      setTimeout(() => {
        setTitles(titles.concat(title))
      }, 2000)
    }
  }

  const handleImageUpload = async (event) => {
    event.preventDefault()
    const data = new FormData()
    for (let i = 0; i < fileList.length; i += 1) {
      data.append('images', fileList[i])
      data.append('title', titles[i])
    }
    data.append('albumId', albumId)
    try {
      await ImageService.create(token, data)
      addToast('Images successfully uploaded', {
        appearance: 'success',
        autoDismiss: false
      })
      closeModal()
      listImages()
    } catch (err) {
      addToast(err.response.data.message, {
        appearance: 'error',
        autoDismiss: false
      })
    }
  }

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

  return (
    <Modal
      show={showModal}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header className="d-block">
        <Modal.Title id="contained-modal-title-vcenter">
          Hey
          {' '}
          {userData.username}
          {' '}
          , got some sick new photos ? Upload them here.
        </Modal.Title>
        <h5>
          Don’t forget to
          {' '}
          <a
            href="https://imagecompressor.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            compress
          </a>
          !
        </h5>
      </Modal.Header>
      <Modal.Body className="modal-upload">
        <p className="text-right">
          Max 12 images.
        </p>
        <FileInput
          name="image upload"
          multiple
          onValueChange={(files) => handleFileList(files)}
        />
      </Modal.Body>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formBasicName">
            <Form.Label>
              Create title for images
            </Form.Label>
            {fileList && Array.from(fileList).map((file) => (
              <Form.Group key={file.name} controlId={file.name}>
                <Form.Label>{file.name}</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  placeholder="Title of image"
                  onChange={handleTitles}
                />
              </Form.Group>
            ))}
          </Form.Group>
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
            variant="success"
            className="mt-2"
            onClick={() => handleOpen()}
          >
            Create new album
          </Button>
          <AlbumModal
            showModal={showAlbumModal}
            closeModal={handleClose}
            handleCreate={createAlbum}
            handleChange={handleChange}
          />
        </Form>
      </Modal.Body>
      <Button
        variant="light-blue"
        onClick={(event) => handleImageUpload(event)}
        className="mx-3"
      >
        <div className="mx-2 d-flex flex-row justify-content-between align-items-center">
          Upload all images
          {' '}
          <FaArrowRight size="10" />
        </div>
      </Button>
      <Modal.Footer>
        <Button variant="danger" onClick={closeModal}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}

ImageModal.propTypes = {
  userData: PropTypes.shape({
    id: PropTypes.number,
    username: PropTypes.string,
    role: PropTypes.string
  }).isRequired,
  token: PropTypes.string.isRequired,
  showModal: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  albums: PropTypes.node.isRequired,
  fileList: PropTypes.string.isRequired,
  setFileList: PropTypes.func.isRequired,
  listImages: PropTypes.func.isRequired,
  listAlbums: PropTypes.func.isRequired
}

export default ImageModal
