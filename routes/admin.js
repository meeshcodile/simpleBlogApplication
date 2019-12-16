const express = require('express')
const router = express.Router()
const cloudinary = require('cloudinary')
const multer = require('multer')
const path = require('path')
const Admin = require('../models/admin')
const auth = require('../config/customFunctions')
const isAdmin = auth.isAdmin
const blogPost = require('../models/blogposts')

// =============setting up atorage engine===========
const storage = multer.diskStorage({
        filename: function(req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now())
        }
    })
    // ============configuring multer==================
const upload = multer({
    storage: storage,
    // limiting the filesize
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb)
    }
})

// check file typee function
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png/
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetypes.test(file.mimetype)

    if (mimetype && extname) {
        return cb(null, true)
    } else {
        // cb('error')
        console.log('error')
    }
}

// =====setting up cloudinary=============
cloudinary.config({
    cloud_name: process.env.cloudname,
    api_key: process.env.apikey,
    api_secret: process.env.apisecret
})

// ====================admin route==============
router.get('/',isAdmin, async(req, res) => {
    let user = req.user
        await blogPost.find().then((blog)=>{
             res.render('admin/index', { layout: 'adminLayout',blog:blog,user})
            })
        
});

// ===============posts route ======================

router.get('/posts',isAdmin,(req, res) => {
    let user =req.user
        res.render('admin/posts', { layout: 'adminLayout', user })
    })
router.route('/posts/:id')
    .post(upload.single('fileupload'), async(req, res, next) => {
        console.log(req.body)
        await cloudinary.v2.uploader.upload(req.file.path, async(err, result) => {
            console.log(result)
            let { title, body, topics } = req.body
            var fileupload = result.secure_url
            let newBlogPost = new blogPost({ title, body, topics, fileupload, date: Date.now() })
            console.log(newBlogPost)


            await newBlogPost.save().then(blogpost => {
                req.flash('success', 'post created successfully')
                return res.redirect('back')
            }).catch(err => {
                console.log(err)
            })
        })
    })

// ===============Topics route ======================
router.get('/topics', isAdmin,(req, res) => {
    res.render('admin/topics', { layout: 'adminLayout' })
});

// ===============create topics ===================
router.get('/createtopics', isAdmin, (req, res) => {
    res.render('admin/createtopics', { layout: 'adminLayout' })
});

// ======================= users route ====================
router.get('/users', isAdmin, (req, res) => {
    res.render('admin/users', { layout: 'adminLayout' })
});

// ========================= createUsers route =====================
router.get('/createUser', isAdmin, (req, res) => {
    res.render('admin/createUser', { layout: 'adminLayout' })
});

// =================deleting blog post======================
router.delete("/deleteblogpost/:id", isAdmin,async(req, res)=>{
    const id = req.params.id
    console.log(id)
    await blogPost.findByIdAndDelete(id).then((blogpost)=>{
        req.flash('success', 'Blog Post has been removed successfully')
        res.redirect('/admin')
        return
    }).catch((err)=>{
        console.log(err)
        req.flash('error', 'something went wrong while removing post')
        res.redirect('/admin')
        return
    })
});

// ========logout route===============
router.get('/logout',(req, res)=>{
    req.logout()
    req.flash('success', 'see you later')
    res.redirect('/')
})

module.exports = router