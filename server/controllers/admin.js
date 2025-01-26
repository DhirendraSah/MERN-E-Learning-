

import tryCatch from "../middlewares/TryCatch.js"
import { Lectures } from "../models/Lecture.js";
import { Courses } from "../models/Course.js";
import {rm} from "fs";
import {promisify} from 'util';
import fs from 'fs';
import {User} from '../models/User.js';

export const createCourse = tryCatch(async(req,res) => {
    const{title, description, category, createdBy, duration, price} = req.body;

    const image = req.file;

    await Courses.create({
        title,
        description,
        category,
        createdBy,
        duration,
        price,
        image: image?.path,
    });
    res.status(201).json({
        message: "Course created successfully",
    });
});

export const addLectures = tryCatch(async(req, res) => {
    const course = await Courses.findById(req.params.id);
    if (!course)
        return res.status(404).json({
            message: "No Course with this id  ",
        });
     const {title, description} = req.body;
     const file = req.file;
     const lecture = await Lecture.create({
        title,
        description,
        video: file?.path,
        course: course._id,
     })
     res.status(200).json({
        message: "Course created",
        lecture,
     })
});

export const deleteLecture = tryCatch(async(req,res)=>{
    const lecture = await Lecture.findById(req.params.id);
    rm(lecture.vido,()=> {
        console.log("video deleted");
    })
    await lecture.deleteOne();
    res.json({message: "Lecture deleted"});
});

const unlinkAsync = promisify(fs.unlink)

export const deleteCourse = tryCatch(async(req,res)=>{
    const course = await Courses.findById(req.params.id);

    const lectures = await Lecture.find({course: course._id});

    await Promise.all(
        lectures.map(async (lecture) => {
            await unlinkAsync(lecture.video);
            console.log("video deleted");
        })
    );
    rm(course.image,()=> {
        console.log("image deleted");
    });
    await Lecture.find({course: req.params.id}).deleteMany();

    await course.deleteOne();
    await User.updateMany({},{$pull:{subscription: req.params.id }});
    res.json({message: "Course deleted"});
});

export const getAllStats = tryCatch(async(require, res)=>{
    const totalCourse = (await Courses.findOne()).length;
    const totalLectures = (await Lecture.find()).length;
    const totalUsers = (await User.find()).length;

    const stats = {
        totalCourse,
        totalLectures,
        totalUsers,
    };
    res.json({
        stats,
    });
})

export const getMyCourses = tryCatch(async(require,res)=> {
    const courses = await Courses.find({_id: req.user.subscription})
    res.json({
        courses,
    });
})
