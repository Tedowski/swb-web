const sharp = require('sharp')
const { v4: uuidv4 } = require('uuid')
const Promise = require('bluebird')
const { dirs, imageHandler: imagesConfig } = require('../config/config')
const ImageService = require('../services/ImageService')
const AlbumService = require('../services/AlbumService')
const { handleMongooseError, ErrorHandler } = require('../helpers/errors/error')
const { handleResponse, searchResult } = require('../helpers/resources/response')
const { toArray, isIdValidObjectId } = require('../helpers/utilities/utilities')
const { TAlbum, TImage } = require('../helpers/transforms/transforms')
const { ImageCriterion, AlbumCriterion, Criteria } = require('../helpers/criterions/criterions')
const { sculpt } = require('../helpers/resources/interface')
const { deleteFiles } = require('../features/FsHandler')

module.exports = {
  async getImage(req, res, next) {
    const { imageId } = req.params

    try {
      if (!isIdValidObjectId(imageId)) throw new ErrorHandler(403, 'invalid document id passed as a parameter', __filename)

      const image = await ImageService.getOne(imageId)

      handleResponse(sculpt(image), res)
    } catch (err) {
      next(err)
    }
  },
  async listImages(req, res, next) {
    const { query } = req

    const criteria = Criteria(query, ImageCriterion)

    try {
      const result = await ImageService.list(criteria)

      searchResult(res, criteria, result, ['title', 'url', 'createdAt', 'updatedAt', 'album'])
    } catch (err) {
      next(err)
    }
  },
  async createImages(req, res, next) {
    try {
      // Handle upload code
      Promise.map(req.files, async (file, i) => {
        const imageName = `${uuidv4()}.png`
        const fileObject = {
          url: imageName,
          title: req.body.title[i],
          album: req.body.albumId || null
        }

        await Promise.map(imagesConfig.sizes, (size) => sharp(file.buffer)
          .resize(size.width)
          .png(size.options)
          .toFile(size.path + imageName))
        return fileObject
      })
        .then(async (data) => {
          const tImages = TImage(data)

          const inserted = await ImageService.create(tImages)

          handleResponse(sculpt(inserted), res)
        })
    } catch (err) {
      next(handleMongooseError(err))
    }
  },
  async deleteImages(req, res, next) {
    const { query } = req

    try {
      const criteria = Criteria(query, ImageCriterion)

      const imagesToDelete = await ImageService.list(criteria)

      if (imagesToDelete.count === 0) throw new ErrorHandler(401, 'No images found', __filename)

      const urlsToDelete = imagesToDelete.data.map((image) => image.url)
      const paths = [`${dirs.images}/full/`, `${dirs.images}/medium/`, `${dirs.images}/small/`]
      const filesToDelete = urlsToDelete.map((url) => paths.map((filePath) => filePath + url))
        .flat()

      deleteFiles(filesToDelete, async (err) => {
        if (err) {
          throw ErrorHandler(403, err, __filename)
        } else {
          const deleted = await ImageService.delete(imagesToDelete.data.map((image) => image.id))

          handleResponse({
            images: deleted
          }, res)
        }
      })
    } catch (err) {
      next(err)
    }
  },
  async moveImages(req, res, next) {
    const { imageIds, albumId } = req.body

    try {
      if (!isIdValidObjectId(albumId)) throw new ErrorHandler(403, 'invalid document id passed as a parameter', __filename)

      const tImage = TImage({ album: albumId })

      const updated = await ImageService.updateMany(imageIds, tImage)

      handleResponse(sculpt(updated), res)
    } catch (err) {
      next(err)
    }
  },
  async updateImage(req, res, next) {
    const { imageId } = req.params

    try {
      if (!isIdValidObjectId(imageId)) throw new ErrorHandler(403, 'invalid document id passed as a parameter', __filename)

      const tImage = TImage(req.body)

      const updated = ImageService.updateById(imageId, tImage)

      handleResponse(sculpt(updated), res)
    } catch (err) {
      next(err)
    }
  },
  async getAlbum(req, res, next) {
    const { albumId } = req.params

    try {
      if (!isIdValidObjectId(albumId)) throw new ErrorHandler(403, 'invalid document id passed as a parameter', __filename)

      const result = await AlbumService.getOne(albumId)

      handleResponse(sculpt(result), res)
    } catch (err) {
      next(err)
    }
  },
  async listAlbums(req, res, next) {
    const { query } = req

    const criteria = Criteria(query, AlbumCriterion)

    try {
      const result = await AlbumService.list(criteria)

      searchResult(res, criteria, result, ['name'])
    } catch (err) {
      next(err)
    }
  },
  async createAlbum(req, res, next) {
    const tAlbum = TAlbum(req.body)

    try {
      const inserted = await AlbumService.create(tAlbum)

      handleResponse(sculpt(inserted, ['name', 'createdAt']), res)
    } catch (err) {
      next(handleMongooseError(err))
    }
  },
  async updateAlbum(req, res, next) {
    const { params, body } = req
    try {
      if (!isIdValidObjectId(params.albumId)) throw new ErrorHandler(403, 'invalid document id passed as a parameter', __filename)

      const tAlbum = TAlbum(body)

      const response = await AlbumService.updateById(params.albumId, tAlbum)

      if (!response) throw new ErrorHandler(500, 'Album not found', __filename)

      handleResponse(sculpt(response, ['name', 'updatedAt']), res)
    } catch (err) {
      next(err)
    }
  },
  async deleteAlbums(req, res, next) {
    const { albumIds, isDeepDelete } = req.query

    try {
      const albumDelete = await AlbumService.deleteMany(toArray(albumIds))

      if (isDeepDelete) {
        const criteria = Criteria({
          albumIds,
          limit: 1000
        }, ImageCriterion)

        const imagesToDelete = await ImageService.list(criteria)

        if (imagesToDelete.count === 0) {
          handleResponse({
            album: albumDelete,
            images: '0 images found in the album'
          }, res)
          return
        }

        const urlsToDelete = imagesToDelete.data.map((image) => image.url)
        const paths = [`${dirs.images}/full/`, `${dirs.images}/medium/`, `${dirs.images}/small/`]
        const filesToDelete = urlsToDelete.map((url) => paths.map((filePath) => filePath + url)).flat()

        deleteFiles(filesToDelete, async (err) => {
          if (err) {
            throw ErrorHandler(403, err, __filename)
          } else {
            const deleted = await ImageService.delete(imagesToDelete.data.map((image) => image.id))

            handleResponse({
              album: albumDelete,
              images: deleted
            }, res)
          }
        })
      } else {
        const imageUpdate = await ImageService.updateAlbum(albumIds)

        handleResponse({
          album: albumDelete,
          images: imageUpdate
        }, res)
      }
    } catch (err) {
      next(err)
    }
  }
}
