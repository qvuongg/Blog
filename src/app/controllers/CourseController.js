const Course = require('../models/Course');
const { mongooseToObject } = require('../../util/mongoose');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const moment = require('moment');

class CourseController {
    // GET /courses/:slug
    show(req, res, next) {
        Course.findOne({ slug: req.params.slug })
            .then(course => res.render('courses/show', { course: mongooseToObject(course) }))
            .catch(next);
    }

    // GET /courses/create
    create(req, res, next) {
        res.render('courses/create');
    }

    // POST /courses/store
    store = async (req, res, next) => {
        try {
            console.log(req.body);

            const result = await cloudinary.uploader.upload(req.file.path);
            const img = result.secure_url;

            const course = new Course({
                name: req.body.name,
                description: req.body.description,
                image: img,
                videoId: req.body.videoId,
                level: req.body.level,
            });

            await course.save();

            fs.unlinkSync(req.file.path);

            res.redirect('/me/stored/courses');
        } catch (error) {
            console.error(error);
            res.status(500).send('Có lỗi xảy ra');
        }
    }

    // GET /courses/edit/:id
    edit(req, res, next) {
        Course.findById(req.params.id)
            .then(course => res.render('courses/edit', {
                course: mongooseToObject(course)
            }))
            .catch(next);
    }

    // PUT /courses/:id
    update(req, res, next) {
    const { id } = req.params;
    const updateData = req.body;

    Course.updateOne({ _id: id }, updateData)
        .then(() => res.redirect('/home')) 
        .catch(err => {
            console.error(err);
            res.status(500).send("Cập nhật thất bại!");
        });
}

    // DELETE /courses/:id
    destroy(req, res, next) {
        Course.delete({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    // FORCE DELETE /courses/:id
    forceDestroy(req, res, next) {
        Course.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    // PATCH /courses/:id/restore
    restore(req, res, next) {
        Course.restore({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    // PATCH /courses/handle-form-actions
    handleFormActions(req, res, next) {
        switch (req.body.action) {
            case 'delete':
                Course.delete({ _id: { $in: req.body.courseIds } })
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            case 'restore':
                Course.restore({ _id: { $in: req.body.courseIds } })
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            default:
                res.json({ message: 'Action invalid' });
        }
    }
    // Hàm định dạng ngày với moment.js
    formatDate(date) {
        return moment(date).fromNow();  // Ví dụ: "2 days ago"
    }
}

module.exports = new CourseController();
