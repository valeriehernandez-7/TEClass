import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../shared/Form.css';
import '../../app/user/Menu.css';
import './new_course.css';
import  defaultImagePath from '../../assets/course_default_img.png'; // Import the default image path
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';