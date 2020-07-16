import React, { Component } from 'react';
import Login from './components/login';
import Dashboard from "./components/dashboard";
import OnLogin from './components/onlogin';
import Project from "./components/project";
import AddIssue from "./components/addIssue.js";
import MyPage from "./components/myPage";
import test from "./components/test";
import AdminPage from "./components/adminPage";
import axios from 'axios';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import {Loader} from "semantic-ui-react";
import ForbiddenMessage from "./components/forbiddenMessage";


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isMobile:  window.innerWidth <= 480,
            login_state: null,
            user_id: null,
            is_admin: null,
            user_data: null,
        }
    }

     onWindowResize(){
        this.setState({ isMobile: window.innerWidth <= 480 });
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize.bind(this));
    }

    componentDidMount() {
            window.addEventListener('resize', this.onWindowResize.bind(this));
            let first = window.location.pathname;
            first.indexOf(1);
            first.toLowerCase();
            first = first.split("/")[1];

            if(first === "onlogin"){
                let params = new URLSearchParams(window.location.search);
                if(params.get('state') === 'gottem'){
                    this.setState({
                        login_state: "allowed",
                        code: params.get('code'),
                        state: params.get('state'),
                    });
                } else {
                    // alert('State incorrect!');
                    this.setState({
                        login_state: "Not authenticated",
                    });
                }
            } else {
                // alert("starting")
                axios({
                    url: "/users/stats/",
                    method: "get",
                    withCredentials: true,
                }).then((response) => {
                    // alert("received")
                    if (response.data["enrolment_number"] === "Not authenticated") {
                        this.setState({
                            login_state: "Not authenticated",
                        });
                    } else if (response.data["enrolment_number"] === "user banned") {
                        this.setState({
                            login_state: "user banned",
                        });
                    } else {
                        let data = response.data;
                        this.setState({
                            login_state: "allowed",
                            user_id: data["pk"],
                            is_admin: data["is_superuser"],
                            user_data: data
                        });
                    }
                }).catch((e) => {
                    console.log(e);
                    // alert(e);
                    alert("Sorry, there was an error at the server :/")
                });
            }
    }

    render() {
            if(this.state.login_state === null){
                return(
                    <div className="my-loader-div"><Loader active/></div> // {/* index.css */}
                );
            }

            if(this.state.login_state === "user banned"){
                return ( <ForbiddenMessage message="banned"/> );
            }

            if(this.state.login_state === "Not authenticated"){
                return(<Router>
                    <Switch>
                        <Route
                            path='/onlogin'
                            exact
                            render={(props) => (
                                <OnLogin {...props} code={this.state.code} state={this.state.state} />
                            )}
                        />
                        <Route
                            path='/'
                            render={(props) => (
                                <Login {...props} login_state={false} isMobile={this.state.isMobile} />
                            )}
                        />
                    </Switch>
                </Router>);
                // return <Login login_state={this.state.login_state} isMobile={this.state.isMobile}/> ;
            }

            if(this.state.login_state === "allowed"){

                return (

                    <Router>
                        <Switch>
                            <Route
                                path='/onlogin'
                                render={(props) => (
                                    <OnLogin {...props} code={this.state.code} state={this.state.state} />
                                )}
                            />
                            <Route
                              path='/login'
                              render={(props) => (
                                <Login {...props} login_state={true} isMobile={this.state.isMobile} />
                              )}
                            />
                            <Route
                              path='/dashboard'
                              render={(props) => (
                                <Dashboard {...props} user_data={this.state.user_data} isMobile={this.state.isMobile} />
                              )}
                            />
                            <Route
                              path='/mypage'
                              render={(props) => (
                                <MyPage {...props} user_data={this.state.user_data} user_id={this.state.user_id} is_admin={this.state.is_admin} isMobile={this.state.isMobile}/>
                              )}
                            />
                            <Route
                              path="/projects/:slug"
                              render={(props) => (
                                <Project {...props} user_data={this.state.user_data} user_id={this.state.user_id} is_admin={this.state.is_admin} isMobile={this.state.isMobile}/>
                              )}
                            />
                            <Route
                              path="/report"
                              render={(props) => (
                                <AddIssue {...props} user_data={this.state.user_data} user_id={this.state.user_id} is_admin={this.state.is_admin} isMobile={this.state.isMobile}/>
                              )}
                            />
                            <Route
                              path="/admin"
                              render={(props) => (
                                <AdminPage {...props} user_data={this.state.user_data} user_id={this.state.user_id} is_admin={this.state.is_admin} isMobile={this.state.isMobile}/>
                              )}
                            />
                            <Route path="/test" component={test}/>
                            <Route
                              path='/'
                              render={(props) => (
                                <Redirect to="/dashboard"/>
                              )}
                            />
                        </Switch>
                    </Router>




                    );
            }









    }
}

export default App;