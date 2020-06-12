/* eslint-disable no-underscore-dangle */
import React, { useState } from 'react'
import PropTypes from 'prop-types'

import {
  Row, Col, Modal, Button, Form
} from 'react-bootstrap'

import { useToasts } from 'react-toast-notifications'
import {
  FaFileUpload,
  FaArrowRight,
  FaRegTimesCircle
} from 'react-icons/fa'

import TagModal from './TagModal'
import FileInput from '../../../../components/FileInput'

import TagService from '../../../../services/TagService'
import ImageService from '../../../../services/ImageService'

const CUSTOM_LABEL = (
  <div className="d-flex flex-column">
    <h5 className="text-center text-custom-primary">
      Drag n&apos; drop a thumbnail photo for blog post.
    </h5>
    <p className="text-center mt-4">
      <u>
        Upload from computer
        {' '}
        <FaFileUpload />
      </u>
    </p>
  </div>
)

const BlogModal = ({
  token,
  author,
  showModal,
  closeModal,
  blogPost,
  handleSave,
  handleChange,
  handleCreate,
  handleRemoveTag,
  handleTags,
  tags,
  activeTags,
  setImages
}) => {
  const [showTagModal, setShowTagModal] = useState(false)
  const [tagName, setTagName] = useState()

  const [fileList, setFileList] = useState([])

  const { addToast } = useToasts()

  const handleConfirmOpen = () => {
    setShowTagModal(true)
  }

  const handleConfirmClose = () => {
    setShowTagModal(false)
  }

  const handleTagChange = (event) => {
    if (event.target.name === 'tagName') {
      setTagName(event.target.value)
    }
  }

  const handleFileList = (files) => {
    if (files.length > 6) {
      addToast('Maximum 5 images can be uploaded', {
        appearance: 'error',
        autoDismiss: false
      })
      setFileList([])
      closeModal()
    }
    setFileList(files)
  }

  const handleImageUpload = async (event) => {
    event.preventDefault()
    const data = new FormData()
    for (let i = 0; i < fileList.length; i += 1) {
      data.append('images', fileList[i])
      data.append('title', Math.random().toString(36).substring(7))
    }
    data.append('albumId', '5ee09ed0ef0f9f2aaac7d4f1') /* Id of blog album */
    try {
      const response = (await ImageService.create(token, data)).data.data
      setImages(response.map((image) => image.id))
      addToast('Images uploaded to gallery. ', {
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


  const handleTagCreate = async () => {
    const data = {
      name: tagName
    }
    try {
      await TagService.create(token, data)
      handleConfirmClose()
      handleTags()
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
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          Hey
          {' '}
          {author}
          ,
          {' '}
          {!blogPost && ('create')}
          {blogPost && ('edit')}
          {' '}
          the description, then the content.
          Then some kickflips?
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col lg={6}>
            <Form>
              <Form.Group controlId="formBasicTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  placeholder="Skate World Better goes to Africa again, this time Zimbabwe."
                  defaultValue={
                    blogPost && blogPost.title
                  }
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formBasicSubtitle">
                <Form.Label>Subtitle</Form.Label>
                <Form.Control
                  type="text"
                  name="subtitle"
                  placeholder="Because screw them haters. See ya later skater bois."
                  defaultValue={
                    blogPost && blogPost.subtitle
                  }
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formBasicContent">
                <Form.Label>Content</Form.Label>
                <Form.Control
                  as="textarea"
                  rows="10"
                  type="text"
                  name="content"
                  placeholder="Někdo mi jednou řekl, že mě svět hodí, nejsem nejostřejší nástroj v kůlně. Prstem a palcem vypadala hloupě, ve tvaru písmene „L“ na čele. "
                  defaultValue={
                    blogPost && blogPost.content
                  }
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Tags</Form.Label>
                <Form.Control as="select" name="tags" onChange={handleChange}>
                  <option selected disabled>Choose some tags</option>
                  {tags && tags.map((tag) => (
                    <option key={tag._id} id={tag._id} disabled={tag.isDisabled}>
                      {tag.name}
                    </option>
                  ))}
                </Form.Control>
                <Button
                  variant="success"
                  className="mt-4"
                  onClick={handleConfirmOpen}
                >
                  Create new tag
                </Button>
                <TagModal
                  showTagModal={showTagModal}
                  closeTagModal={handleConfirmClose}
                  handleTagChange={handleTagChange}
                  handleTagCreate={handleTagCreate}
                />
              </Form.Group>
              {activeTags && activeTags.map((activeTag) => (
                <Button
                  key={activeTag._id}
                  className="my-2 mr-2"
                  onClick={() => handleRemoveTag(activeTag._id)}
                  variant="light-grey"
                >
                  {activeTag.name}
                  {' '}
                  {' '}
                  <FaRegTimesCircle size="10" />
                </Button>
              ))}
            </Form>
          </Col>
          <Col lg={6} className="blog-upload mt-4">
            <FileInput
              custom
              label={CUSTOM_LABEL}
              multiple
              onValueChange={(files) => handleFileList(files)}
            />
            <p className="compress-link">
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
            </p>
            <Button
              variant="light-blue"
              onClick={(event) => handleImageUpload(event)}
              className="d-block ml-auto w-50 mt-1"
            >
              <div className="mx-2 d-flex flex-row justify-content-between align-items-center">
                Upload images.
                {' '}
                <FaArrowRight size="10" />
              </div>
            </Button>
            {blogPost && (
              <Button
                variant="dark-blue"
                onClick={() => handleSave(blogPost._id)}
                className="d-block ml-auto w-100 mt-4"
              >
                <div className="mx-2 d-flex flex-row justify-content-between align-items-center">
                  Edit blog post now. Then build skatepark?
                  {' '}
                  <FaArrowRight size="10" />
                </div>
              </Button>
            )}
            {!blogPost && (
              <Button
                variant="dark-blue"
                onClick={handleCreate}
                className="w-100 mt-5"
              >
                <div className="mx-2 d-flex flex-row justify-content-between align-items-center">
                  Create blog post now. Then build skatepark ?
                  {' '}
                  <FaArrowRight size="10" />
                </div>
              </Button>
            )}
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={closeModal}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}

BlogModal.propTypes = {
  token: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  showModal: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  handleTags: PropTypes.func.isRequired,
  handleCreate: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleRemoveTag: PropTypes.func.isRequired,
  setImages: PropTypes.func.isRequired,
  blogPost: PropTypes.shape({
    _id: PropTypes.number,
    author: PropTypes.string,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    content: PropTypes.string
  }),
  tags: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.number,
      name: PropTypes.string
    })
  ).isRequired,
  activeTags: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.number,
      name: PropTypes.string
    })
  )
}

BlogModal.defaultProps = {
  blogPost: undefined,
  activeTags: undefined
}

export default BlogModal
