import React, { Component } from 'react';
import Login from './components/login';
import Dashboard from "./components/dashboard";
import OnLogin from './components/onlogin';
import axios from 'axios';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';

class Home extends Component{
        state = {
            login_state: false,
            got_response: false
        }


        componentDidMount() {
             axios({
                url: "http://localhost:8000/users/test/",
                method: "get",
                withCredentials: true,

            }).then((response) => {
                console.log(response);

                if(response.data["detail"] === "Not authenticated"){
                    this.setState({
                        login_state: false,
                        got_response: true
                    });
                } else {
                    this.setState({
                        login_state: true,
                        got_response: true
                    });
                }

                console.log(this.state)
            });

        }

        render(){

            if(this.state.got_response){
                    if(this.state.login_state){
                        return <Redirect to="/dashboard" exact/>;
                    }else{
                        return (<Redirect to="/login"/>);
                    }
            } else {

                return <h1>Landing</h1>;
            }
               // return (alert(access_token));

           // if(access_token === "" || access_token == null){
           //     return (<Redirect to="/login"/>);
           // } else{


           // }

        }
}
class App extends Component {

    render() {

        return (
            <Router>
                <Switch>
                    <Route path="/" exact component={Home}/>
                    <Route path="/login" exact component={Login}/>
                    <Route path="/onlogin" component={OnLogin}/>
                    <Route path="/dashboard" component={Dashboard}/>

                </Switch>
            </Router>


            );

    }
}

export default App;