const mongoose = require('mongoose')
const aws = require('aws-sdk')



const s3 = new aws.S3()

aws.config.update({
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    region: process.env.AWS_DEFAULT_REGION
})

const marketSchema = mongoose.Schema({
    superMarketName: String,
    superMarketMainImage: Object,
    superMarketAdditionalImages: Array,
    superMarketLocation: Object,
    superMarketDescription: String,
    superMarketPhone: Number
})




module.exports = mongoose.model('Market', marketSchema)