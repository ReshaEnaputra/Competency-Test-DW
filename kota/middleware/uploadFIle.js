const multer = require('multer')

module.exports = (imageFile) => {
    // set destination
    const storage = multer.diskStorage({
        destination: function (request, file, cb) {
            cb(null, 'uploads')
        },
        filename: function (request, file, cb) {
            cb(null, Date.now() + '-' + file.originalname.replace(/\s/g, ''))
        }
    })

    // Sizing file upload
    const sizeInMB = 10
    const maxSize = sizeInMB * 1000 * 1000

    // Generate Setting
    const upload = multer({
        storage,
        limits: {
            fileSize: maxSize
        }
    }).single(imageFile)

    // Middleware handler
    return (request, response, next) => {
        upload(request, response, function (err) {
            if (request.fileValidationError) {
                request.session.message = {
                    type: 'danger',
                    message: 'Please select files upload'
                }
                return response.redirect(request.originalUrl)
            }

            if (err) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    request.session.message = {
                        type: 'danger',
                        message: 'Error, max file sized 10mb'
                    }
                    return response.redirect(request.originalUrl)
                }
                request.session.message = {
                    type: 'danger',
                    message: err
                }
                return response.redirect(request.originalUrl)
            }
            return next()
        })
    }
}