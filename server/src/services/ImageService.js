/* eslint-disable consistent-return */
/* eslint-disable no-return-await */
const Image = require('../models/Gallery/Image.model')
const { searchQuery } = require('../helpers/criterions/criterions')

module.exports = {
  async getOne(id) {
    return await Image.findById(id)
      .populate('album')
  },
  async list(criteria) {
    return await searchQuery(Image, criteria, 'album')
  },
  async create(images) {
    return await Image.create(images)
  },
  async delete(ids) {
    return await Image.deleteMany({ _id: { $in: ids } })
  },
  async deleteByAlbums(albumIds) {
    return await Image.deleteMany({ album: { $in: albumIds } })
  },
  async updateById(id, newData) {
    const image = await Image.findById(id)

    if (!image) return

    // eslint-disable-next-line array-callback-return
    Object.keys(newData).map((key) => {
      if (key !== 'id' && key !== '_id') {
        image[key] = newData[key]
      }
    })

    return await image.save()
  },
  async updateAlbum(albumIds, newAlbum = undefined) {
    return await Image.updateMany({ album: { $in: albumIds } }, { $set: { album: newAlbum } })
  }
}
