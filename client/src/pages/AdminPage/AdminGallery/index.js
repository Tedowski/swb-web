/* eslint-disable global-require */
/* eslint-disable no-shadow */
/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'

import {
  Row,
  Col,
  Button,
  Image
} from 'react-bootstrap'

import { FaFolderOpen } from 'react-icons/fa'

import BaseSection from '../../../components/BaseSection'

import GalleryNav from './GalleryNav'
import GalleryFilter from './GalleryFilter'
import GalleryPreviewItem from './GalleryPreviewItem'

import AlbumService from '../../../services/AlbumService'
import ImageService from '../../../services/ImageService'

import AlbumModal from './AlbumModal'
import ImageModal from './ImageModal'


const AdminGallery = ({ token, userData }) => {
  const [activeSection, setActiveSection] = useState()

  const [albums, setAlbums] = useState([])
  const [album, setAlbum] = useState()

  const [selectedAlbums, setSelectedAlbums] = useState([])
  const [multipleSelectedAlbums, setMultipleSelectedAlbums] = useState([])

  const [images, setImages] = useState([])
  const [image, setImage] = useState()

  const [selectedImages, setSelectedImages] = useState([])
  const [multipleSelectedImages, setMultipleSelectedImages] = useState([])

  const [showAlbumModal, setShowAlbumModal] = useState(false)
  const [albumName, setAlbumName] = useState()

  const [showImageModal, setShowImageModal] = useState(false)

  const [fileList, setFileList] = useState([])


  const { addToast } = useToasts()

  const listAlbums = async () => {
    try {
      const response = (await AlbumService.list(token)).data.data
      setAlbums(response)
      setAlbum(null)
    } catch (err) {
      addToast(err.response.data.message, {
        appearance: 'error',
        autoDismiss: false
      })
    }
  }

  const listImages = async () => {
    try {
      const response = (await ImageService.list()).data.data
      setImages(response)
      setImage(null)
    } catch (err) {
      addToast(err.response.data.message, {
        appearance: 'error',
        autoDismiss: false
      })
    }
  }

  const listOneAlbum = async (id) => {
    try {
      const response = (await AlbumService.listOne(token, id)).data.data
      setAlbum(response)
    } catch (err) {
      addToast(err.response.data.message, {
        appearance: 'error',
        autoDismiss: false
      })
    }
  }

  const listOneImage = async (id) => {
    try {
      const response = (await ImageService.listOne(id)).data.data
      setImage(response)
    } catch (err) {
      addToast(err.response.data.message, {
        appearance: 'error',
        autoDismiss: false
      })
    }
  }

  const filterSelectedImages = () => {
    // eslint-disable-next-line consistent-return
    const filteredImages = images.filter(
      (image) => selectedImages.indexOf(image.id) !== -1
    )
    setMultipleSelectedImages(filteredImages)
  }

  const filterSelectedAlbums = () => {
    // eslint-disable-next-line consistent-return
    const filteredAlbums = albums.filter(
      (album) => selectedAlbums.indexOf(album.id) !== -1
    )
    setMultipleSelectedAlbums(filteredAlbums)
  }


  const handleOpen = () => {
    setShowAlbumModal(true)
  }

  const handleClose = () => {
    setShowAlbumModal(false)
  }

  const handleImageModalOpen = () => {
    listAlbums()
    setShowImageModal(true)
  }

  const handleImageModalClose = () => {
    setShowImageModal(false)
    setFileList([])
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

  const handleSelection = (event, id) => {
    event.preventDefault()
    if (activeSection === 'albums') {
      setSelectedAlbums(selectedAlbums.concat(id))
      listOneAlbum(id)
      if (album) {
        setAlbum(null)
      }
    }
    if (activeSection === 'images') {
      setSelectedImages(selectedImages.concat(id))
      listOneImage(id)
      if (image) {
        setImage(null)
        listAlbums()
      }
    }
  }

  const handleChange = (event) => {
    if (event.target.name === 'name') setAlbumName(event.target.value)
  }


  useEffect(() => {
    if (activeSection === 'albums') listAlbums()
    if (activeSection === 'images') listImages()
  }, [activeSection])

  useEffect(() => {
    filterSelectedImages()
  }, [selectedImages])

  useEffect(() => {
    filterSelectedAlbums()
  }, [selectedAlbums])

  if (!token) {
    return (
      <Redirect to="/" />
    )
  }

  return (
    <BaseSection fullScreen fluid>
      <Col lg={1}>
        <GalleryNav setActiveSection={setActiveSection} />
      </Col>
      <Col lg={8} className="gallery-main">
        {
          activeSection === 'albums'
          && (
            <>
              <div className="mx-auto d-flex flex-row justify-content-between mb-3">
                <h2>Albums of SWB gallery</h2>
                <Button
                  variant="dark-blue"
                  onClick={() => handleOpen()}
                >
                  Create new album
                </Button>
              </div>
              <AlbumModal
                showModal={showAlbumModal}
                closeModal={handleClose}
                handleCreate={createAlbum}
                handleChange={handleChange}
              />
              <GalleryFilter token={token} />
            </>
          )
        }
        {
          activeSection === 'images'
          && (
            <>
              <div className="mx-auto d-flex flex-row justify-content-between mb-3">
                <h2>Images of SWB gallery</h2>
                <Button
                  variant="dark-blue"
                  onClick={() => handleImageModalOpen()}
                >
                  Upload images
                </Button>
              </div>
              <ImageModal
                token={token}
                albums={albums}
                showModal={showImageModal}
                fileList={fileList}
                userData={userData}
                setFileList={setFileList}
                closeModal={handleImageModalClose}
                listImages={listImages}
                listAlbums={listAlbums}
              />
              <GalleryFilter token={token} />
            </>
          )
        }
        <Row className="mt-4">
          {activeSection === 'albums' && albums && albums.map((album) => (
            <Col
              lg={4}
              key={album.name}
              id={album.id}
              className="my-3 album-icon text-center"
              onClick={(event) => handleSelection(event, album.id)}
            >
              <FaFolderOpen size={80} />
              <p className="text-uppercase">
                {album.name}
              </p>
            </Col>
          ))}
          {activeSection === 'images' && images && images.map((image) => (
            <Col
              lg={4}
              key={image.title}
              id={image.id}
              className="my-3 album-icon"
              onClick={(event) => handleSelection(event, image.id)}
            >
              <Image
                src={
                  // eslint-disable-next-line import/no-dynamic-require
                  require(`../../../../../server/src/public/images/small/${image.url}`)
                }
                fluid
                rounded
              />
              <p className="text-center text-uppercase">
                {image.title}
                {' '}
              </p>
            </Col>
          ))}
        </Row>
      </Col>
      <Col lg={3}>
        {
          activeSection === 'albums'
          && album
          && multipleSelectedAlbums
          && multipleSelectedAlbums.length <= 1
          && (
            <GalleryPreviewItem
              token={token}
              id={album._id}
              name={album.name}
              listItems={listAlbums}
              type="album"
            />
          )
        }
        {
          activeSection === 'albums'
          && multipleSelectedAlbums
          && multipleSelectedAlbums.length >= 2
          && (
            <GalleryPreviewItem
              token={token}
              type="multipleAlbums"
              multipleSelectedAlbums={multipleSelectedAlbums}
              albumIds={selectedAlbums}
              setAlbum={setAlbum}
              setMultipleAlbums={setMultipleSelectedAlbums}
              setSelectedAlbums={setSelectedAlbums}
              listItems={listAlbums}
            />
          )
        }
        {
          activeSection === 'images'
          && image
          && multipleSelectedImages
          && multipleSelectedImages.length <= 1
          && (
            <GalleryPreviewItem
              token={token}
              id={image._id}
              name={image.title}
              album={image.album}
              type="image"
              imgSrc={image.url}
              listItems={listImages}
            />
          )
        }
        {
          activeSection === 'images'
          && multipleSelectedImages
          && multipleSelectedImages.length >= 2
          && (
            <GalleryPreviewItem
              token={token}
              type="image"
              images={multipleSelectedImages}
              imagesIds={selectedImages}
              albums={albums}
              setImage={setImage}
              setMultiplemages={setMultipleSelectedImages}
              setSelectedImages={setSelectedImages}
              listItems={listImages}
            />
          )
        }
      </Col>
    </BaseSection>
  )
}

AdminGallery.propTypes = {
  token: PropTypes.string,
  userData: PropTypes.shape({
    id: PropTypes.number,
    username: PropTypes.string,
    role: PropTypes.string
  }).isRequired
}

AdminGallery.defaultProps = {
  token: undefined
}

export default AdminGallery
