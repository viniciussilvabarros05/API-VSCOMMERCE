const Market = require('../models/superMarket')
const aws = require('aws-sdk')
const s3 = new aws.S3()

const crudController = {

    register: async function (req, res) {

        const superMarketMainImage = req.files.superMarketMainImage[0]
        const superMarketAdditionalImage1 = req.files.superMarketAdditionalImage1[0]
        const superMarketAdditionalImage2 = req.files.superMarketAdditionalImage2[0]
        const superMarketAdditionalImage3 = req.files.superMarketAdditionalImage3[0]

        const market = new Market({
            superMarketName: req.body.superMarketName,
            superMarketMainImage: superMarketMainImage,
            superMarketAdditionalImages: [superMarketAdditionalImage1, superMarketAdditionalImage2, superMarketAdditionalImage3],
            superMarketLocation: {
                city: req.body.city,
                country: req.body.country,
                number: req.body.number,
                zip: req.body.zip,
                district: req.body.district,
                state: req.body.state,
                street: req.body.street,
            },
            superMarketDescription: req.body.superMarketDescription,
            superMarketPhone: req.body.superMarketPhone,
        })
        try {
            const savedMarket = await market.save()

            res.send("A new Market registed")
        } catch (error) {
            res.status(400).send(error)
        }
    },

    lister: async function (req, res) {
        const ListMarkets = await Market.find()
        res.send(ListMarkets)
    },

    update: async function (req, res) {

        const marketOrigin = await Market.findOne({ _id: req.body.id })
        let { superMarketMainImage,
            superMarketAdditionalImage1,
            superMarketAdditionalImage2,
            superMarketAdditionalImage3 } = req.files


        try {

            const market = {
                id: req.body.id,
                superMarketName: req.body.superMarketName,
                superMarketMainImage: !superMarketMainImage ? marketOrigin.superMarketMainImage : superMarketMainImage[0],
                superMarketAdditionalImages:
                    [
                        !superMarketAdditionalImage1 ? marketOrigin.superMarketAdditionalImages[0] : superMarketAdditionalImage1[0],
                        !superMarketAdditionalImage2 ? marketOrigin.superMarketAdditionalImages[1] : superMarketAdditionalImage2[0],
                        !superMarketAdditionalImage3 ? marketOrigin.superMarketAdditionalImages[2] : superMarketAdditionalImage1[0],
                    ],

                superMarketLocation: {
                    city: req.body.city,
                    country: req.body.country,
                    number: req.body.number,
                    zip: req.body.zip,
                    district: req.body.district,
                    state: req.body.state,
                    street: req.body.street,
                },
                superMarketDescription: req.body.superMarketDescription,
                superMarketPhone: req.body.superMarketPhone,
            }
            const updateMarket = await Market.updateOne({ _id: req.body.id }, market)
          
            res.send('Supermarket updated')
        } catch (error) {
          
            res.send(error.message)
        }

    },

    delete: async function (req, res) {

        try {
            const market = await Market.findOne({ _id: req.params.id })

            s3.deleteObject({
                Bucket: 'myvstorage',
                Key: market.superMarketMainImage.key
            }).promise()

            market.superMarketAdditionalImages.forEach(img => {
                return s3.deleteObject({
                    Bucket: 'myvstorage',
                    Key: img.key
                }).promise()

            })
            const marketId = await Market.findByIdAndDelete(req.params.id)
            res.send("Market deleted" )
        } catch (error) {
            res.send(error.message)
        }

    },

}

module.exports = crudController