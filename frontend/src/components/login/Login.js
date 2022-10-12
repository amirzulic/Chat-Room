import React, {useState} from "react";
import './login.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useFormik} from "formik";
import * as Yup from 'yup';
import {loginUser, resetPassword} from "../../service/UserService";
import {useNavigate} from 'react-router-dom';
import cryptoRandomString from "crypto-random-string";
import emailjs from "@emailjs/browser";

function Login() {
    let navigate = useNavigate();

    const [view, setView] = useState(1);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Required'),
            password: Yup.string().min(8).required('Required')
        }),
        onSubmit: values => {
            let user = {
                email: formik.values.email,
                password: formik.values.password
            }

            loginUser(user).then(res => {
                console.log(res.data);
                navigate("/profile");
                localStorage.setItem("Authorization", res.data.jwtoken);
            }).catch((err) => {
                console.log(err.response.status);
                if(err.response.status === 500) {
                    alert("Email or password incorrect!")
                } else {
                    alert("Error");
                }
            })
        }
    })

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

    function handlePasswordReset() {
        const new_pw = cryptoRandomString({length: 8});
        let passwordReset = {
            password: new_pw,
            email: formik.values.email
        }
        sendEmail(passwordReset.password, passwordReset.email);
        resetPassword(passwordReset).then(res => {
            alert(res.data.message);
            navigate(0);
        }).catch((err) => {
            alert(err);
        })
    }

    return(
        <div className="container-fluid text-center">
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
                    <div className="row">
                        <div className="col"></div>
                        <div className="col-12">
                            <h1 className="text-primary"><b>LOGIN</b></h1>
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
                                    <br/>
                                </div>
                                {view === 1 ?
                                    <div className="form-group text-start">
                                        <label htmlFor="password">Password</label>
                                        <input type="password" className="form-control" id="password"
                                               name = "password"
                                               value={formik.values.password}
                                               onBlur={formik.handleBlur}
                                               onChange={formik.handleChange}/>
                                        {formik.touched.password && formik.errors.password ? <div className="text-danger text-uppercase">{formik.errors.password}</div> : null}
                                        <p className="text-start text-secondary forgotPassword" onClick={() => {setView(2)}}>
                                            Forgot your password?
                                        </p>
                                    </div> : null
                                }
                                <div className="row">
                                    <br/>
                                </div>
                                {view === 1 ?
                                    <button type="submit" className="btn btn-primary">Submit</button> :
                                    <button type="button" className="btn btn-primary" onClick={() => {handlePasswordReset()}}>Reset</button>
                                }
                                <div className="row">
                                    <br/>
                                </div>
                            </form>
                        </div>
                        <div className="col"></div>
                    </div>
                </div>
                <div className="col"></div>
            </div>
        </div>
    );
}

export default Login;
