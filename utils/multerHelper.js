const multer = require('multer')

const storageMemo = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + '/../uploads/memo')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const length = file.originalname.split('.').length
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.')[length - 1])
  }
})

const storageProject = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + '/../uploads/project')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const length = file.originalname.split('.').length
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.')[length - 1])
  }
})

const uploadMemo = multer({ storage: storageMemo }).any()
const uploadProject = multer({ storage: storageProject }).any()

exports.uploadMemoDocument = async (req, res, next) => {

  uploadMemo(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.log(err)
      return res.send({
        error: true,
        message: [err],
      })
    } else if (err) {
      console.log(err)
      return res.status(500).send({
        error: true,
        msg: err
      })
    }
    next()
  })
}

exports.uploadProjectDocument = async (req, res, next) => {

  uploadProject(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.log(err)
      return res.send({
        error: true,
        message: [err],
      })
    } else if (err) {
      console.log(err)
      return res.status(500).send({
        error: true,
        msg: err
      })
    }
    next()
  })
}