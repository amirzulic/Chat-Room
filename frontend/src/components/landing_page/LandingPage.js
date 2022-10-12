import React, {useEffect, useRef, useState} from 'react';
import './landing_page.css';
import {useFormik} from "formik";
import * as Yup from 'yup';
import {useNavigate} from 'react-router-dom';
import {over} from 'stompjs';
import SockJS from 'sockjs-client';
import {getUser} from "../../service/UserService";

var stompClient = null;

function LandingPage() {
    let navigate = useNavigate();

    const [tab, setTab] = useState("PUBLIC");
    const [view, setView] = useState(1);
    const [userData, setUserData] = useState({
        name: "",
        receiver_name: "",
        connected: false,
        message: ""
    })
    const [publicChat, setPublicChat] = useState([]);
    const [privateChat, setPrivateChat] = useState(new Map());

    function handleMessage(event) {
        const {value} = event.target;
        setUserData({...userData, "message": value});
    }

    function register() {
        if(userData.name !== '' && localStorage.getItem("Authorization") !== null) {
            let Sock = new SockJS('http://localhost:8080/ws');
            stompClient = over(Sock);
            stompClient.connect({},
                function () {
                    setUserData({...userData, "connected": true});
                        stompClient.subscribe('/chatroom/public', function(payload) {
                            let payloadData = JSON.parse(payload.body);
                            switch(payloadData.status) {
                                case "JOIN":
                                    if(!privateChat.get(payloadData.sender_name)) {
                                        privateChat.set(payloadData.sender_name, []);
                                        setPrivateChat(new Map(privateChat));
                                    }
                                    break;
                                case "MESSAGE":
                                    publicChat.push(payloadData);
                                    setPublicChat([...publicChat]);
                                    break;
                            }
                        });
                        stompClient.subscribe('/user/' + userData.name + "/private", function (payload) {
                            let payloadData = JSON.parse(payload.body);
                            if(privateChat.get(payloadData.sender_name)) {
                                privateChat.get(payloadData.sender_name).push(payloadData);
                                setPrivateChat(new Map(privateChat));
                            } else {
                                let list = [];
                                list.push(payloadData);
                                privateChat.set(payloadData.sender_name, list);
                                setPrivateChat(new Map(privateChat));
                            }
                        });
                        userJoin();

                },
                function(err) {
                    console.log(err)
                });
        } else {
            navigate("/login");
        }
    }

    const userJoin = () => {
        let chatMessage = {
            sender_name: userData.name,
            status: 'JOIN'
        }
        stompClient.send('/app/message', {}, JSON.stringify(chatMessage));
    }

    const sendPublicMessage = () => {
        if(stompClient) {
            let chatMessage = {
                sender_name: userData.name,
                message: userData.message,
                date: new Date().toLocaleString('en-US', { hour12: false }),
                status: 'MESSAGE',
            }
            stompClient.send('/app/message', {}, JSON.stringify(chatMessage));
            setUserData({...userData, "message": ""})
        }
    }

    const sendPrivateMessage = () => {
        if(stompClient) {
            let chatMessage = {
                sender_name: userData.name,
                receiver_name: tab,
                message: userData.message,
                date: new Date().toLocaleString('en-US', { hour12: false }),
                status: 'MESSAGE',
            }
            if(userData.name !== tab) {
                privateChat.get(tab).push(chatMessage);
                setPrivateChat(new Map(privateChat));
            }
            stompClient.send('/app/private-message', {}, JSON.stringify(chatMessage));
            setUserData({...userData, "message": ""})
        }
    }

    const formik = useFormik({
        initialValues: {
            group_name: ''
        },
        validationSchema: Yup.object({
            group_name: Yup.string().required('Required')
        }),
        onSubmit: values => {
            let group = {
                group_name: formik.values.group_name
            }
        }
    })

    useEffect(() => {
        if(localStorage.getItem("Authorization") !== null) {
            getUser(localStorage.getItem("Authorization")).then(res => {
                setUserData({...userData, "name": res.data.first_name});
            }).catch((err) => {
                console.log(err);
            })
        }
    }, []);

    return(
        <div className="container-fluid">
            <div className="row">
                <br/>
            </div>
            <div className="row">
                <div className="col"></div>
                <div className="col">
                    {userData.connected !== true ?
                        <div>
                            <div className="row">
                                <h1 className="text-primary">Welcome to the ChatRoom homepage</h1>
                            </div>
                            <br/>
                            <h3>You can enter the world of chatting by clicking the button bellow</h3>
                            <br/>
                            <button className="btn btn-primary" onClick={() => {register()}}>
                                START CHATTING
                            </button>
                            <div className="row">
                                <br/>
                            </div>
                            <hr/>
                            <p>ChatRoom gives you an amazing opportunity to connect to the world of chatting and meeting a lot of people while presenting you and your presonality!</p>
                            <br/>
                            <small><i>“Each person you meet influences your mental universe in a way that has the potential to make a substantial impact upon the causality of the intellectual development of an entire species.”
                                ― Abhijit Naskar</i></small>
                        </div> : null
                    }
                </div>
                <div className="col"></div>
            </div>
            <div className="row">
                <br/>
            </div>
            {userData.connected && userData.name !== '' ?
                <div className="row">
                    <h3 className="text-primary">Hello {userData.name}</h3>
                </div>
                    : null }
            {userData.connected ?
            <div className="row align-items-center">
                <div className="col"></div>
                <div className="col-10">
                    <div className="row">
                        <div onClick={() => {setTab("PUBLIC")}}
                             className="col-4 border text-primary tab">
                            <h5>PUBLIC CHATROOM</h5>
                        </div>
                    </div>
                </div>
                <div className="col"></div>
            </div> : null }
            {userData.connected ?
            <div className="row">
                <div className="col"></div>
                <div className="col-10 border shadow">
                    <div className="row">
                        <br/>
                    </div>
                    <div className="row">
                        <div className="col-4">
                            {[...privateChat.keys()].map((name, index) => (
                                <div className="row text-center tab" onClick={() => {setTab(name)}}>
                                    <div className="col">
                                        <img src="https://cdn-icons-png.flaticon.com/512/3135/3135823.png" height="50" width="50"/>
                                    </div>
                                    <b className="p-2" key={index}>{name}</b>
                                    <small>🟢 Online</small>
                                    <div className="row">
                                        <br/>
                                    </div>
                                </div> ))}
                        </div>
                        {tab === "PUBLIC" ?
                            <div className="col text-start">
                                <div className="row">
                                    {publicChat.map((chat, index) => (
                                        <div className="row">
                                            <div className="col-4"></div>
                                            <div className="col-2 text-start">
                                                {chat.sender_name === userData.name ?
                                                    <p key={index}><b className="text-primary">{chat.sender_name}</b><small> (you)</small></p> :
                                                    <p key={index}><b className="text-success">{chat.sender_name}</b></p>
                                                }
                                            </div>
                                            <div className="col text-start">
                                                <p key={index}>{chat.message}</p>
                                            </div>
                                            <div className="col">
                                                <small key={index}>{chat.date}</small>
                                            </div>
                                        </div> ))}
                                    <div className="row">
                                        <div className="col"></div>
                                        <div className="col text-start">
                                            <input className="form-control" type="text"
                                                   placeholder={"Say Hello to everyone"} value={userData.message}
                                                   onChange={handleMessage}
                                            />
                                        </div>
                                        <div className="col text-start">
                                            <button type="button" className="btn btn-primary"
                                                    onClick={sendPublicMessage}
                                            >SEND</button>
                                        </div>
                                    </div>
                                </div>
                            </div> : null }
                            {tab !== "PUBLIC" ?
                                <div className="col text-start">
                                    <div className="row">
                                        {[...privateChat.get(tab)].map((chat, index) => (
                                            <div className="row">
                                                <div className="col-4"></div>
                                                <div className="col-2 text-start">
                                                    {chat.sender_name === userData.name ?
                                                        <p key={index}><b className="text-primary">{chat.sender_name}</b><small> (you)</small></p> :
                                                        <p key={index}><b className="text-success">{chat.sender_name}</b></p>
                                                    }
                                                </div>
                                                <div className="col text-start">
                                                    <p key={index}>{chat.message}</p>
                                                </div>
                                                <div className="col"><small key={index}>{chat.date}</small></div>
                                            </div> ))}
                                        <div className="row">
                                            <div className="col-4"></div>
                                            <div className="col text-start">
                                                <input className="form-control" type="text"
                                                       placeholder={"Say Hello to " + tab} value={userData.message}
                                                       onChange={handleMessage}
                                                />
                                            </div>
                                            <div className="col text-start">
                                                <button type="button" className="btn btn-primary"
                                                        onClick={sendPrivateMessage}
                                                >SEND</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                             : null }
                    </div>
                    <div className="row">
                        <br/>
                    </div>
                </div>
                <div className="col"></div>
            </div> : null }
            {/*{view === 3 ?
                <div className="row">
                    <div className="col"></div>
                    <div className="col-10 border shadow">
                        <div className="row">
                            <br/>
                        </div>
                        {showCreateGroup === false ?
                            <div className="row">
                                <div className="col">
                                    <button className="btn btn-primary"
                                            onClick={() => {handleShowCreateGroup(true)}}>
                                        CREATE A NEW GROUP
                                    </button>
                                </div>
                            </div> :
                            <form onSubmit={formik.handleSubmit}>
                                <div className="row">
                                    <div className="col text-end">
                                        <button className="btn btn-danger" type="button"
                                                onClick={() => {setShowCreateGroup(false)}}>
                                            x
                                        </button>
                                    </div>
                                    <div className="col">
                                        <input className="form-control" type="text" placeholder="Enter group name and select friends"
                                               id = "group_name" name = "group_name"
                                               value={formik.values.group_name}
                                               onBlur={formik.handleBlur}
                                               onChange={formik.handleChange}
                                        />
                                        {formik.touched.group_name && formik.errors.group_name ? <small className="text-danger text-uppercase">{formik.errors.group_name}</small> : null}
                                    </div>
                                    <div className="col text-start">
                                        <button className="btn btn-primary" type="submit">CREATE</button>
                                    </div>
                                </div>
                            </form>
                        }
                        <div className="row">
                            <br/>
                        </div>
                        <div className="row tab align-items-center">
                            <div className="col">
                                <img src="https://cdn-icons-png.flaticon.com/512/3135/3135823.png" height="50" width="50"/>
                            </div>
                            <div className="col text-start">
                                Ime
                            </div>
                            <div className="col text-start">
                                {showCreateGroup === true ?
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" value="1" id="checkbox"/>
                                        <label className="form-check-label" htmlFor="checkbox">
                                            Select
                                        </label>
                                    </div> : null
                                }
                            </div>
                        </div>
                        <div className="row">
                            <br/>
                        </div>
                    </div>
                    <div className="col"></div>
                </div> : null
            }*/}
            {/*{view === 2 ?
                <div className="row">
                    <div className="col"></div>
                    <div className="col-10 border shadow">
                        <div className="row">
                            <br/>
                        </div>
                        <div className="row align-items-center">
                            <div className="col-4 text-center">
                                <img src="https://cdn-icons-png.flaticon.com/512/3135/3135823.png" height="50" width="50"/>
                                <b className="p-2">User name</b>
                                <div className="row">
                                    <br/>
                                </div>
                                <div className="row">
                                    <small>You can say hello to everyone!</small>
                                </div>
                            </div>
                            {publicChat !== [] ? publicChat.map((chat, index) => (
                                <div key={index} className="row">{chat.message}<br/></div>
                            )): null }
                        </div>
                        <div className="row">
                            <br/>
                        </div>
                        <div className="row align-items-center">
                            <div className="col text-center">
                            </div>
                            <div className="col text-start">
                                <input className="form-control" type="text"
                                       placeholder="Enter message" value={userData.message}
                                       onChange={handleMessage}
                                />
                            </div>
                            <div className="col text-start">
                                <button type="button" className="btn btn-primary"
                                        onClick={sendPublicMessage}
                                >SEND</button>
                            </div>
                        </div>
                        <div className="row">
                            <br/>
                        </div>
                    </div>
                    <div className="col"></div>
                </div> : null
            }*/}
        </div>
    );
}

export default LandingPage;
