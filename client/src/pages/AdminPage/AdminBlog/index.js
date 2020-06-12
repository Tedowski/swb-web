/* eslint-disable jsx-quotes */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Redirect } from 'react-router-dom'

import { useToasts } from 'react-toast-notifications'

import { FaPen, FaTrashAlt } from 'react-icons/fa'

import {
  Row, Col, Button, Table, Image
} from 'react-bootstrap'

import BaseSection from '../../../components/BaseSection'
import BlogModal from './BlogModal'
import ConfirmModal from './ConfirmModal'

import BlogService from '../../../services/BlogService'
import TagService from '../../../services/TagService'

const formatDate = (date) => moment(date).format('DD/MM/YY')

const AdminBlog = ({ token, userData }) => {
  const [showModal, setShowModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const [blogPosts, setBlogPosts] = useState()
  const [tags, setTags] = useState()
  const [blogPost, setBlogPost] = useState()

  const [author, setAuthor] = useState()
  const [title, setTitle] = useState()
  const [subtitle, setSubtitle] = useState()
  const [content, setContent] = useState()
  const [activeTags, setActiveTags] = useState([])
  const [images, setImages] = useState([])

  const { addToast } = useToasts()

  const handleList = async () => {
    try {
      const response = (await BlogService.list()).data.data
      setBlogPosts(response)
    } catch (err) {
      addToast(err.response.data.message, {
        appearance: 'error',
        autoDismiss: false
      })
    }
  }

  const filterTags = (isDisabled) => {
    const filteredTags = tags.map((tag) => {
      const isSelected = activeTags.some((activeTag) => tag.id === activeTag.id)

      if (isSelected) {
        return {
          ...tag,
          isDisabled
        }
      }
      return tag
    })
    setTags(filteredTags)
  }

  const handleOnePost = async (id) => {
    try {
      const response = (await BlogService.listOne(id)).data.data
      setBlogPost(response)
      const postTags = response.tags.map((tag) => tag)
      if (postTags.length !== 0) {
        setActiveTags(postTags)
      }
    } catch (err) {
      addToast(err.response.data.message, {
        appearance: 'error',
        autoDismiss: false
      })
    }
  }

  const handleTags = async () => {
    try {
      const response = (await TagService.list()).data.data
      setTags(response)
    } catch (err) {
      addToast(err.response.data.message, {
        appearance: 'error',
        autoDismiss: false
      })
    }
  }

  const handleRemoveTag = (id) => {
    const indexToDelete = activeTags.map((tag) => {
      if (tag.id === id) {
        return {
          tag
        }
      }
    }).map((tag, i) => {
      if (tag !== undefined) {
        return i
      }
    }).filter((i) => i !== undefined)[0]
    activeTags.splice(indexToDelete, 1)
    setActiveTags(activeTags)
    filterTags(false)
  }


  const handleChange = (event) => {
    if (event.target.name === 'title') {
      setTitle(event.target.value)
    }
    if (event.target.name === 'subtitle') {
      setSubtitle(event.target.value)
    }
    if (event.target.name === 'content') {
      setContent(event.target.value)
    }
    if (event.target.name === 'tags') {
      const tagIndex = event.target.selectedIndex
      const { id } = event.target[tagIndex]
      const name = event.target.value
      setActiveTags(activeTags.concat({ id, name }))
      filterTags(true)
    }
  }

  const handleOpen = (id) => {
    setShowModal(true)
    if (typeof id !== 'object') handleOnePost(id)
  }

  const handleClose = () => {
    setBlogPost()
    setActiveTags([])
    filterTags(false)
    setShowModal(false)
    setImages([])
  }

  const handleSave = async (id) => {
    handleClose()
    // eslint-disable-next-line no-shadow
    const tags = activeTags.map((tag) => tag.id)
    const data = {
      author,
      title,
      subtitle,
      tags,
      content,
      images
    }
    try {
      await BlogService.edit(id, token, data).data
      addToast('Blog post has been successfuly edited.', {
        appearance: 'success',
        autoDismiss: false
      })
      handleList()
    } catch (err) {
      addToast(err.response.data.message, {
        appearance: 'error',
        autoDismiss: false
      })
    }
  }

  const handleCreate = async () => {
    // eslint-disable-next-line no-shadow
    const tags = activeTags.map((tag) => tag.id)
    const data = {
      author,
      title,
      subtitle,
      tags,
      content,
      images
    }
    try {
      const response = await BlogService.create(token, data)
      console.log(response, images)
      addToast('Blog post has been successfuly created.', {
        appearance: 'success',
        autoDismiss: false
      })
      handleClose()
      handleList()
    } catch (err) {
      addToast(err.response.data.message, {
        appearance: 'error',
        autoDismiss: false
      })
    }
  }

  const handleConfirmOpen = () => {
    setShowConfirmModal(true)
  }

  const handleConfirmClose = () => {
    setShowConfirmModal(false)
  }

  const handleDelete = async (id) => {
    try {
      await BlogService.delete(id, token).data
      addToast('Blog post has been successfuly deleted.', {
        appearance: 'success',
        autoDismiss: false
      })
      handleList()
      handleConfirmClose()
    } catch (err) {
      addToast(err.response.data.message, {
        appearance: 'error',
        autoDismiss: false
      })
    }
  }

  useEffect(() => {
    handleTags()
    handleList()
    setAuthor(userData.username)
  }, [])

  if (!token) {
    return (
      <Redirect to="/" />
    )
  }

  return (
    <BaseSection fullScreen>
      <Col lg={12}>
        <div className="mx-auto d-flex flex-row justify-content-between">
          <h2>Your latest blog posts</h2>
          <Button onClick={handleOpen} variant="dark-blue">
            Create Blog Post
          </Button>
        </div>
      </Col>
      <Col lg={12}>
        <Row>
          <Col lg={12}>
            <BlogModal
              activeTags={activeTags}
              blogPost={blogPost}
              tags={tags}
              author={author}
              token={token}
              showModal={showModal}
              closeModal={handleClose}
              handleCreate={handleCreate}
              handleSave={handleSave}
              handleTags={handleTags}
              handleChange={handleChange}
              handleRemoveTag={handleRemoveTag}
              setImages={setImages}
            />
          </Col>
        </Row>
        <Row className="py-4">
          <Col lg={12}>
            <Table hover variant="light">
              <tbody>
                {blogPosts && blogPosts.map((post) => (
                  <tr key={post.id} className="my-auto">
                    <td className="image-td">
                      <Image
                        src='http://www.oneloveskatemag.com/wp-content/uploads/2019/10/73006529_456126955258424_2125230821144002560_n.jpg'
                        rounded
                        className="w-100"
                      />
                    </td>
                    <td>
                      <h5>
                        {post.title}
                      </h5>
                      <div className="mt-4">
                        <p className="text-uppercase text-grey font-weight-bold">
                          author:
                          {' '}
                          {post.author}
                        </p>
                        <p className="text-uppercase text-grey font-weight-bold">
                          {formatDate(post.createdAt)}
                        </p>
                      </div>
                    </td>
                    <td className="d-flex justify-content-center my-auto">
                      <>
                        <FaPen
                          className="mr-4"
                          onClick={() => handleOpen(post.id)}
                        />
                        <FaTrashAlt
                          variant="danger"
                          onClick={handleConfirmOpen}
                        />
                        <ConfirmModal
                          showConfirmModal={showConfirmModal}
                          closeConfirmModal={handleConfirmClose}
                          handleDelete={handleDelete}
                          postId={post.id}
                        />
                      </>
                    </td>
                  </tr>

                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Col>
    </BaseSection>
  )
}

AdminBlog.propTypes = {
  token: PropTypes.string,
  userData: PropTypes.shape({
    id: PropTypes.number,
    username: PropTypes.string,
    role: PropTypes.string
  })
}

AdminBlog.defaultProps = {
  token: undefined,
  userData: PropTypes.shape({
    id: undefined,
    username: undefined,
    role: undefined
  })
}

BlogModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  handleCreate: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  error: PropTypes.string.isRequired,
  blogPost: PropTypes.shape({
    id: PropTypes.number,
    author: PropTypes.string,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    content: PropTypes.string
  })
}

BlogModal.defaultProps = {
  blogPost: undefined
}

export default AdminBlog
