/* eslint-disable consistent-return */
/* eslint-disable global-require */
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import {
  Form, Image, Button, Accordion, Card
} from 'react-bootstrap'
import {
  FaFolderOpen,
  FaFileImage
} from 'react-icons/fa'

import { useToasts } from 'react-toast-notifications'

import GirlImage from '../../../../assets/images/girl.jpeg'

import AlbumService from '../../../../services/AlbumService'
import ImageService from '../../../../services/ImageService'


import DeleteModal from './DeleteModal'
import MoveModal from './MoveModal'
import DeleteImagesModal from './DeleteImagesModal'

const formatDate = (date) => moment(date).format('DD/MM/YY')

const GalleryPreviewItem = ({
  token,
  name,
  album,
  id,
  imgSrc,
  type,
  listItems,
  images,
  imagesIds,
  setImage,
  setMultiplemages,
  setSelectedImages,
  albums,
  multipleSelectedAlbums,
  albumIds,
  setAlbum,
  setMultipleAlbums,
  setSelectedAlbums
}) => {
  const [albumName, setAlbumName] = useState()
  const [imageTitle, setImageTitle] = useState()
  const [showEditForm, setShowEditForm] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showMoveModal, setShowMoveModal] = useState(false)
  const [showDeleteImagesModal, setShowDeleteImagesModal] = useState(false)

  const { addToast } = useToasts()

  const clearMultipleSelection = () => {
    setMultiplemages([])
    setSelectedImages([])
    setImage(null)
  }

  const clearMultipleAlbumSelection = () => {
    setMultipleAlbums([])
    setSelectedAlbums([])
    setAlbum(null)
  }

  const handleChange = (event) => {
    if (event.target.name === 'name' && type === 'album') {
      setAlbumName(event.target.value)
    }
    if (event.target.name === 'name' && type === 'image') {
      setImageTitle(event.target.value)
    }
  }

  const editAlbum = async (albumId) => {
    const data = {
      name: albumName
    }
    try {
      await AlbumService.edit(albumId, token, data)
      addToast('Album was successfully edited', {
        appearance: 'success',
        autoDismiss: false
      })
      listItems()
    } catch (err) {
      addToast(err.response.data.message, {
        appearance: 'error',
        autoDismiss: false
      })
    }
  }

  const editImage = async (imageId) => {
    const data = {
      title: imageTitle
    }
    try {
      await ImageService.edit(imageId, token, data)
      addToast('Image was successfully edited', {
        appearance: 'success',
        autoDismiss: false
      })
      listItems()
    } catch (err) {
      addToast(err.response.data.message, {
        appearance: 'error',
        autoDismiss: false
      })
    }
  }

  // eslint-disable-next-line no-shadow
  const handleAlbumDelete = async (albumIds) => {
    const arrAlbumIds = albumIds.toString()
    try {
      const response = (await AlbumService.delete(token, arrAlbumIds)).data

      if (response) {
        listItems()
        setShowModal(false)
      }
      addToast('Album was successfully deleted', {
        appearance: 'success',
        autoDismiss: false
      })
    } catch (err) {
      addToast(err.response.data.message, {
        appearance: 'error',
        autoDismiss: false
      })
    }
  }

  const handleImageDelete = async (imageIds) => {
    // Subject to change if passing multiple
    const arrImageIds = imageIds
    try {
      const response = (await ImageService.delete(token, arrImageIds)).data

      if (response) {
        listItems()
        setShowModal(false)
      }
      addToast('Image was successfully deleted', {
        appearance: 'success',
        autoDismiss: false
      })
    } catch (err) {
      addToast(err.response.data.message, {
        appearance: 'error',
        autoDismiss: false
      })
    }
  }

  const handleDelete = (idToDelete) => {
    if (type === 'album') handleAlbumDelete(idToDelete)
    if (type === 'multipleAlbums') handleAlbumDelete(albumIds)
    if (type === 'image') handleImageDelete(idToDelete)
  }


  const handleEditForm = () => {
    setShowEditForm(true)
  }

  const handleEdit = (event) => {
    if (type === 'album') editAlbum(event.target.id)
    if (type === 'image') editImage(event.target.id)
    setShowEditForm(false)
  }

  const handleOpen = () => {
    setShowModal(true)
  }

  const handleClose = () => {
    setShowModal(false)
  }

  const handleMoveModalOpen = () => {
    setShowMoveModal(true)
  }

  const handleMoveModalClose = () => {
    setShowMoveModal(false)
  }

  const handleDeleteImagesModalOpen = () => {
    setShowDeleteImagesModal(true)
  }

  const handleDeleteImagesModalClose = () => {
    setShowDeleteImagesModal(false)
  }


  if (!images && multipleSelectedAlbums) {
    return (
      <>
        <Accordion>
          {
            multipleSelectedAlbums && multipleSelectedAlbums.map((selectedAlbum, i) => (
              <Card>
                <Accordion.Toggle as={Card.Header} eventKey={i}>
                  <div className="d-flex">
                    <FaFolderOpen size="20" className="mr-3" />
                    <p>{selectedAlbum.name}</p>
                  </div>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={i}>
                  <Card.Body>
                    <p>
                      Name:
                      {' '}
                      {selectedAlbum.name}
                    </p>
                    <p className="text-grey">
                      Created at:
                      {' '}
                      {formatDate(selectedAlbum.createdAt)}
                    </p>
                    <p className="text-grey">
                      Updated at:
                      {' '}
                      {formatDate(selectedAlbum.updatedAt)}
                    </p>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>

            ))
          }
        </Accordion>
        <div className="d-flex flex-row justify-content-between mt-4">
          <Button
            variant="dark-blue"
            className="d-block mx-auto my-2"
            onClick={clearMultipleAlbumSelection}
          >
            Clear all
          </Button>
          <Button
            variant="danger"
            className="d-block mx-auto my-2"
            onClick={handleOpen}
          >
            Delete all
          </Button>
          <DeleteModal
            showModal={showModal}
            closeModal={handleClose}
            handleDelete={handleDelete}
            id={id}
            type={type}
          />
        </div>
      </>
    )
  }
  if (!images && !multipleSelectedAlbums) {
    return (
      <div id={id} className="d-flex flex-column align-items-center item-preview">
        {type === 'album' && !multipleSelectedAlbums && (<FaFolderOpen size={80} />)}
        {type === 'image' && (
          <Image
            src={
            // eslint-disable-next-line import/no-dynamic-require
              require(`../../../../../../server/src/public/images/small/${imgSrc}`)
            }
            fluid
            rounded
          />
        )}
        <p className="pt-2">
          {type === 'album' && !multipleSelectedAlbums && 'Name'}
          {type === 'image' && 'Title'}
          {' '}
          of
          {' '}
          {type}
          :
          {' '}
          {name}
        </p>
        {album && (
          <p className="py-2">
            Album assigned:
            {' '}
            {album.name}
          </p>
        )}
        <div className="d-flex flex-row justify-content-center mt-3">
          <Button variant="dark-blue" className="mx-2" onClick={handleEditForm}>
            Edit
          </Button>
          <Button variant="danger" className="mx-2" onClick={handleOpen}>
            Delete
          </Button>
          <DeleteModal
            showModal={showModal}
            closeModal={handleClose}
            handleDelete={handleDelete}
            id={id}
            type={type}
          />
        </div>
        {showEditForm && (
          <Form className="mt-5">
            <Form.Group controlId="formBasicName">
              <Form.Label>
                Edit
                {' '}
                {type}
                {' '}
                {type === 'album' && !multipleSelectedAlbums && 'Name'}
                {type === 'image' && 'Title'}
              </Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder={name}
                onChange={handleChange}
              />
            </Form.Group>
            <Button
              id={id}
              variant="success"
              onClick={(event) => handleEdit(event)}
            >
              Save
            </Button>
          </Form>
        )}
      </div>
    )
  }
  return (
    <div>
      <Accordion>
        {images && images.map((image, i) => (
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey={i}>
              <div className="d-flex">
                <FaFileImage size="20" className="mr-3" />
                <p>{image.title}</p>
              </div>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={i}>
              <Card.Body>
                <Image
                  src={
                    // eslint-disable-next-line import/no-dynamic-require
                    require(`../../../../../../server/src/public/images/small/${image.url}`)
                  }
                  fluid
                  rounded
                  className="my-2"
                />
                <p>
                  Title:
                  {' '}
                  {image.title}
                </p>
                {image.album && (
                  <p>
                    Album:
                    {' '}
                    {image.album.name}
                  </p>
                )}
                <p className="text-grey">
                  Created at:
                  {' '}
                  {formatDate(image.createdAt)}
                </p>
                <p className="text-grey">
                  Updated at:
                  {' '}
                  {formatDate(image.updatedAt)}
                </p>
              </Card.Body>
            </Accordion.Collapse>
          </Card>

        ))}
      </Accordion>
      <div className="d-flex flex-row justify-content-between mt-4">
        <Button
          variant="dark-blue"
          className="d-block mx-auto my-2"
          onClick={clearMultipleSelection}
        >
          Clear all
        </Button>
        <Button
          variant="blue"
          className="d-block mx-auto my-2"
          onClick={handleMoveModalOpen}
        >
          Move all
        </Button>
        <MoveModal
          token={token}
          showModal={showMoveModal}
          closeModal={handleMoveModalClose}
          images={images}
          imagesIds={imagesIds}
          albums={albums}
        />
        <Button
          variant="danger"
          className="d-block mx-auto my-2"
          onClick={handleDeleteImagesModalOpen}
        >
          Delete all
        </Button>
        <DeleteImagesModal
          token={token}
          showModal={showDeleteImagesModal}
          closeModal={handleDeleteImagesModalClose}
          images={images}
          imagesIds={imagesIds}
        />
      </div>
    </div>
  )
}


GalleryPreviewItem.propTypes = {
  token: PropTypes.string.isRequired,
  name: PropTypes.string,
  id: PropTypes.string,
  imgSrc: PropTypes.node,
  type: PropTypes.string.isRequired,
  listItems: PropTypes.func.isRequired,
  album: PropTypes.shape({
    name: PropTypes.string
  }),
  images: PropTypes.arrayOf({
    image: PropTypes.shape({
      title: PropTypes.string
    })
  }),
  albums: PropTypes.arrayOf({
    album: PropTypes.shape({
      name: PropTypes.string
    })
  }),
  multipleSelectedAlbums: PropTypes.arrayOf({
    album: PropTypes.shape({
      name: PropTypes.string
    })
  }),
  setMultiplemages: PropTypes.func,
  setSelectedImages: PropTypes.func,
  setImage: PropTypes.func,
  imagesIds: PropTypes.arrayOf(PropTypes.string),
  albumIds: PropTypes.arrayOf(PropTypes.string),
  setAlbum: PropTypes.func,
  setMultipleAlbums: PropTypes.func,
  setSelectedAlbums: PropTypes.func
}

GalleryPreviewItem.defaultProps = {
  name: undefined,
  id: undefined,
  imgSrc: GirlImage,
  album: undefined,
  images: undefined,
  setMultiplemages: undefined,
  setSelectedImages: undefined,
  setImage: undefined,
  albums: undefined,
  multipleSelectedAlbums: undefined,
  imagesIds: undefined,
  albumIds: undefined,
  setAlbum: undefined,
  setMultipleAlbums: undefined,
  setSelectedAlbums: undefined
}


export default GalleryPreviewItem
