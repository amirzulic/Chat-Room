import React, {useState, useRef} from "react";
import './registration.css';
import {useFormik} from "formik";
import * as Yup from "yup";
import axios from "axios";
import {registerUser} from "../../service/UserService";
import {useNavigate} from 'react-router-dom';

function Registration() {
    let navigate = useNavigate();

    const [imageUrl, setImageUrl] = useState(null);

    const uploadImage = (files) => {
        const formData = new FormData();
        formData.append("file", files[0]);
        formData.append("upload_preset", "chat-room");
        axios.post("https://api.cloudinary.com/v1_1/dw3duxdxo/image/upload", formData)
            .then(res => {
                setImageUrl(res.data.url);
            });
    }

    const formik = useFormik({
        initialValues: {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            rpassword: '',
            picture: ''
        },
        validationSchema: Yup.object({
            first_name: Yup.string().required('Required'),
            last_name: Yup.string().required('Required'),
            email: Yup.string().email('Invalid email address').required('Required'),
            password: Yup.string().min(8, 'Password must be atleast 8 charactes')
                .max(15, 'Password must not be longer than 15 charactes').required('Required'),
            rpassword: Yup.string().min(8, 'Password must be atleast 8 charactes')
                .max(15, 'Password must not be longer than 15 charactes').required('Required')
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
        }),
        onSubmit: values => {
            const user = {
                first_name: formik.values.first_name,
                last_name: formik.values.last_name,
                email: formik.values.email,
                password: formik.values.password,
                picture: imageUrl
            }
            registerUser(user).then(res => {
                console.log(res.data);
                navigate("/login");
            }).catch((err) => {
                if(err.response.status === 500) {
                    alert("Email is already in use!");
                }
            });
        }
    })

    return(
        <div className="container-fluid">
            <div className="row">
                <br/>
            </div>
            <div className="row">
                <div className="col">
                    {/*<img src="https://play-lh.googleusercontent.com/OY4rxeNTPaHwyOTZ-RUooqJvPnO5QUYmQcw0dhD90Mu6UWItOSZfQv7ks_FscbBow0M"/>*/}
                </div>
                <div className="col border border-grey rounded bg-light shadow">
                    <div className="row">
                        <br/>
                    </div>
                    <form onSubmit={formik.handleSubmit}>
                        <div className="row">
                            <h1><b className="text-primary">REGISTRATION</b></h1>
                            <div className="col">
                                <div className="form-group text-start">
                                    <label htmlFor="first_name">First Name</label>
                                    <input type="text" className="form-control" id="first_name" name = "first_name"
                                           value={formik.values.first_name}
                                           onBlur={formik.handleBlur}
                                           onChange={formik.handleChange}/>
                                    {formik.touched.first_name && formik.errors.first_name ? <div className="text-danger text-uppercase">{formik.errors.first_name}</div> : null}
                                </div>
                            </div>
                            <div className="col">
                                <div className="form-group text-start">
                                    <label htmlFor="last_name">Last Name</label>
                                    <input type="text" className="form-control" id="last_name" name = "last_name"
                                           value={formik.values.last_name}
                                           onBlur={formik.handleBlur}
                                           onChange={formik.handleChange}/>
                                    {formik.touched.last_name && formik.errors.last_name ? <div className="text-danger text-uppercase">{formik.errors.last_name}</div> : null}
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <br/>
                        </div>
                        <div className="form-group text-start">
                            <label htmlFor="email">Email address</label>
                            <input type="email" className="form-control" id="email" name = "email"
                                   value={formik.values.email}
                                   onBlur={formik.handleBlur}
                                   onChange={formik.handleChange}/>
                            {formik.touched.email && formik.errors.email ? <div className="text-danger text-uppercase">{formik.errors.email}</div> : null}
                        </div>
                        <div className="row">
                            <br/>
                        </div>
                        <div className="form-group text-start">
                            <label htmlFor="password">Password</label>
                            <input type="password" className="form-control" id="password" name = "password"
                                   value={formik.values.password}
                                   onBlur={formik.handleBlur}
                                   onChange={formik.handleChange}/>
                            {formik.touched.password && formik.errors.password ? <div className="text-danger text-uppercase">{formik.errors.password}</div> : null}
                        </div>
                        <div className="row">
                            <br/>
                        </div>
                        <div className="form-group text-start">
                            <label htmlFor="rpassword">Repeat password</label>
                            <input type="password" className="form-control" id="rpassword" name = "rpassword"
                                   value={formik.values.rpassword}
                                   onBlur={formik.handleBlur}
                                   onChange={formik.handleChange}/>
                            {formik.touched.rpassword && formik.errors.rpassword ? <div className="text-danger text-uppercase">{formik.errors.rpassword}</div> : null}
                        </div>
                        <div className="row">
                            <br/>
                        </div>
                        <div className="mb-3 text-start">
                            <label htmlFor="picture" className="form-label">Upload your profile picture</label>
                            <input className="form-control" type="file" id="picture"
                                   onChange={(event) => uploadImage(event.target.files)}/>
                        </div>
                        <div className="row">
                            <br/>
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                        <div className="row">
                            <br/>
                        </div>
                    </form>
                </div>
                <div className="col">
                    {/*<img src="https://play-lh.googleusercontent.com/OY4rxeNTPaHwyOTZ-RUooqJvPnO5QUYmQcw0dhD90Mu6UWItOSZfQv7ks_FscbBow0M"/>*/}
                </div>
            </div>
        </div>
    );
}

export default Registration;
