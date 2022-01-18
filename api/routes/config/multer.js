const multer = require('multer')
const path = require('path')
const crypto = require('crypto')
const multerS3 = require('multer-s3')
const aws = require('aws-sdk')
const Market = require('../../models/superMarket')
aws.config.update({
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    region: process.env.AWS_DEFAULT_REGION
})


const storageTypes = {

    local: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.resolve(__dirname, '..', '..', 'images'))
        },
        filename: (req, file, cb) => {
            crypto.randomBytes(16, (error, hash) => {
                if (error) {
                    cb(error)
                }
                file.key = `${hash.toString('hex')}-${file.originalname}`
                cb(null, file.key)
            })
        }
    }),

    s3: multerS3({
        s3: new aws.S3(),
        bucket: 'myvstorage',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: (req, file, cb) => {


            crypto.randomBytes(16, (error, hash) => {
                if (error) {
                    cb(error)
                }
                const filename = `${hash.toString('hex')}-${file.originalname}`
                cb(null, filename)
            })
        }
    })
}

module.exports = {
    dest: path.resolve(__dirname, '..', '..', 'images'),
    storage: storageTypes['s3'],
    fileFilter: (req, file, cb) => {


        const allowedMimes = [
            'image/jpeg',
            'image/pjpeg',
            'image/png',
            'image/gif'
        ]

        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error("Invalid file type"))
        }
    }


}