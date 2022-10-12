import React, {useEffect, useState, useRef} from "react";
import './profile_page.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {changePassword, deactivateUser, getUser, loginUser, resetPassword, updateUser} from "../../service/UserService";
import {useFormik} from "formik";
import * as Yup from 'yup';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import cryptoRandomString from "crypto-random-string";
import emailjs from '@emailjs/browser';

function ProfilePage() {
    let navigate = useNavigate();
    const inputFile = useRef(null);

    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState(0);
    const [view, setView] = useState(1);
    const [passwordChangeView, setPasswordChangeView] = useState(1);
    const [imageUrl, setImageUrl] = useState('');

    function handleSetView(view) {
        setView(view);
    }

    function handleChangePhoto() {
        inputFile.current.click();
    }

    const uploadImage = (files) => {
        const formData = new FormData();
        formData.append("file", files[0]);
        formData.append("upload_preset", "chat-room");

        axios.post("https://api.cloudinary.com/v1_1/dw3duxdxo/image/upload", formData)
            .then(res => {
                setImageUrl(res.data.url);
            });
    }

    const sendEmail = (password, email) => {
        let params = {
            password: password,
            email: email
        }
        emailjs.send('service_eg2wfdo', 'template_yko249q', params, 'APfvGvW3gFWJIaT4D')
            .then((res) => {
                console.log(res.text)
            }, (error) => {
                console.log(error.text);
            });
    }

    function handlePasswordChange() {
        let passwordChange = {
            email: user.email,
            current_password: formik.values.password,
            new_password: formik.values.new_password
        }
        changePassword(passwordChange).then(res => {
            alert(res.data.message);
            navigate(0);
        }).catch((err) => {
            alert(err);
        })
    }

    function handlePasswordReset() {
        const new_pw = cryptoRandomString({length: 8});
        let passwordReset = {
            password: new_pw,
            email: formik.values.email_pw
        }
        if(user.email === passwordReset.email) {
            sendEmail(passwordReset.password, passwordReset.email);
            resetPassword(passwordReset).then(res => {
                alert(res.data.message);
            }).catch((err) => {
                alert(err);
            })
        } else {
            alert("That is not your email!");
        }
    }

    function handleDeactivate(){
        if(userId !== 0) {
            const body = new FormData();
            body.append("user_id", userId)
            deactivateUser(body).then(res => {
                alert(res.data.message);
                localStorage.removeItem("Authorization");
                navigate("/registration");
            }).catch((err) => {
                console.log(err);
            })
        } else {
            alert("Error");
        }
    }

    const formik = useFormik({
        initialValues: {
            email: '',
            first_name: '',
            last_name: '',
            picture: '',
            password: '',
            new_password: '',
            email_pw: ''
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address'),
            email_pw: Yup.string().email('Invalid email address')
        }),
        onSubmit: values => {
            let update = {
                user_id: user.user_id,
                email: formik.values.email === '' ? user.email : formik.values.email,
                first_name: formik.values.first_name === '' ? user.first_name : formik.values.first_name,
                last_name: formik.values.last_name === '' ? user.last_name : formik.values.last_name,
                picture: imageUrl === '' ? user.picture : imageUrl
            }
            updateUser(update).then(res => {
                navigate("/profile");
                navigate(0);
            }).catch((err) => {
                alert(err);
            })
        }
    })

    useEffect(() => {
        if(localStorage.getItem("Authorization") !== null) {
            getUser(localStorage.getItem("Authorization")).then(res => {
                setUser(res.data);
                setUserId(res.data.user_id);
                console.log(res.data);
            }).catch((err) => {
                console.log(err);
            })
        }
    }, []);

    return(
        <div className="container-fluid">
            <div className="row">
                <div className="col"></div>
                <div className="col">
                    <h1 className="text-primary">My Profile</h1>
                </div>
                <div className="col"></div>
            </div>
            <div className="row">
                <br/>
            </div>
            <div className="row">
                <div className="col"></div>
                <div className="col-10">
                    <div className="row">
                        {user !== null ?
                            <div className="col shadow p-1">
                                <img src={user.picture} height="180" width="180"
                                     className="img-thumbnail"
                                />
                                <p onClick={() => {handleChangePhoto()}} className="uploadImage">Change photo</p>
                                <input type='file' id='photo' ref={inputFile} style={{display: 'none'}} onChange={
                                    (event) => {uploadImage(event.target.files)}
                                }/>
                                <h4><b>{user.first_name + " " + user.last_name}</b></h4>
                            </div> : null }
                        {view === 1 && user !== null ?
                            <div className="col shadow p-1">
                                <h5>Settings</h5>
                                <div className="row">
                                    <div className="col"></div>
                                    <div className="col-8">
                                        <form onSubmit={formik.handleSubmit}>
                                            <div className="form-group text-start">
                                                <label htmlFor="email">Email address</label>
                                                <input type="email" className="form-control" id="email" name = "email"
                                                       value={formik.values.email}
                                                       onBlur={formik.handleBlur}
                                                       onChange={formik.handleChange}/>
                                                {formik.touched.email && formik.errors.email ? <div className="text-danger text-uppercase">{formik.errors.email}</div> : null}
                                            </div>
                                            <div className="row">
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
                                            <br/>
                                            <button type="submit" className="btn btn-primary">CHANGE</button>
                                            <div className="row">
                                                <br/>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="col"></div>
                                </div>
                            </div> : null
                        }
                        {view === 2 && user !== null ?
                            <div className="col shadow p-1">
                                <h5>Account information</h5>
                                <br/>
                                <h5>Email: <b>{user.email}</b></h5>
                                <h5>Full Name: <b>{user.first_name + " " + user.last_name}</b></h5>
                                <br/>
                                {passwordChangeView === 1 ?
                                    <div>
                                        <div className="row">
                                            <div className="col"></div>
                                            <div className="col-6">
                                                Want to change password?
                                                <input type="password" className="form-control"
                                                       placeholder="Enter current password"  id="password" name = "password"
                                                       value={formik.values.password}
                                                       onBlur={formik.handleBlur}
                                                       onChange={formik.handleChange}
                                                />
                                            </div>
                                            <div className="col"></div>
                                        </div>
                                        <br/>
                                        <div className="row">
                                            <div className="col"></div>
                                            <div className="col-6">
                                                <input type="password" className="form-control"
                                                       placeholder="Enter new password" id="new_password" name = "new_password"
                                                       value={formik.values.new_password}
                                                       onBlur={formik.handleBlur}
                                                       onChange={formik.handleChange}
                                                />
                                            </div>
                                            <div className="col"></div>
                                        </div>
                                        <small className="text-secondary forgotPassword" onClick={() => {setPasswordChangeView(2)}}>
                                            Forgot you password?
                                        </small>
                                        <div className="row">
                                            <div className="col"></div>
                                            <div className="col">
                                                <button className="btn btn-primary" type="button"
                                                        onClick={() => {handlePasswordChange()}}>
                                                    CHANGE
                                                </button>
                                            </div>
                                            <div className="col"></div>
                                        </div>
                                    </div> :
                                    <div>
                                        <div className="row">
                                            <div className="col"></div>
                                            <div className="col-6">
                                                <label htmlFor="email_pw">Enter your email</label>
                                                <input type="email" className="form-control"
                                                       placeholder="" id="email_pw" name="email_pw"
                                                       value={formik.values.email_pw}
                                                       onBlur={formik.handleBlur}
                                                       onChange={formik.handleChange}/>
                                                {formik.touched.email_pw && formik.errors.email_pw ? <div className="text-danger text-uppercase">{formik.errors.email_pw}</div> : null}
                                            </div>
                                            <div className="col"></div>
                                        </div>
                                        <br/>
                                        <small className="text-secondary forgotPassword" onClick={() => {setPasswordChangeView(1)}}>
                                            Change my password manually
                                        </small>
                                        <div className="row">
                                            <div className="col"></div>
                                            <div className="col-6">
                                                <button className="btn btn-primary" type="button" onClick={() => {handlePasswordReset()}}>
                                                    SEND
                                                </button>
                                            </div>
                                            <div className="col"></div>
                                        </div>
                                    </div>
                                }
                            </div> : null
                        }
                        {view === 3  ?
                            <div className="col shadow p-1">
                                <h5>Deactivation</h5>
                                <br/>
                                <h5>Are you sure you want to deactivate your account?</h5>
                                <button className="btn btn-danger" onClick={() => {handleDeactivate()}}>
                                    DEACTIVATE
                                </button>
                            </div> : null
                        }
                    </div>
                </div>
                <div className="col"></div>
            </div>
            <div className="row">
                <br/>
            </div>
            <div className="row">
                <div className="col"></div>
                <div className="col-10">
                    <div className="row shadow">
                        <div className="row">
                            <div className="col border tab">
                                <h5>
                                    <a href="/" className="text-decoration-none text-dark">
                                        Go To Messenger
                                    </a>
                                </h5>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col border tab"
                                 onClick={() => {handleSetView(1)}}>
                                <h5>Settings</h5>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col border tab"
                                 onClick={() => {handleSetView(2)}}>
                                <h5>Privacy</h5>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col border tab"
                                 onClick={() => {handleSetView(3)}}>
                                <h5 className="text-danger">Deactivate</h5>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col"></div>
            </div>
            <div className="row">
                <br/>
            </div>
            <div className="row">
                <div className="col"></div>
                <div className="col">
                    <p>
                        <small>Chatroom will never leak your private information.</small>
                    </p>
                </div>
                <div className="col"></div>
            </div>
        </div>
    );
}

export default ProfilePage;
