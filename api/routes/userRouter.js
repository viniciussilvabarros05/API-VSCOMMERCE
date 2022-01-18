const express = require('express')
const crudController = require('../controllers/crudController')
const multer = require('multer')

const multerConfig = require('./config/multer')
const router = express.Router()



router.get('/list', crudController.lister)

router.post('/register', multer(multerConfig).fields([
    {
        name: 'superMarketMainImage'
    }
    , {
        name: 'superMarketAdditionalImage1'
    }
    , {
        name: 'superMarketAdditionalImage2'
    }
    , {
        name: 'superMarketAdditionalImage3'
    }
],
), crudController.register)
router.post('/update', multer(multerConfig).fields([
    {
        name: 'superMarketMainImage'
    }
    , {
        name: 'superMarketAdditionalImage1'
    }
    , {
        name: 'superMarketAdditionalImage2'
    }
    , {
        name: 'superMarketAdditionalImage3'
    }
],
), crudController.update)

router.delete('/delete/:id', crudController.delete)


module.exports = router
