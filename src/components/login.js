import React, {Component} from 'react';
import '../styles/login.css'
import { Button } from 'semantic-ui-react';
import {Redirect} from 'react-router-dom';
import axios from "axios";

class Login extends Component {
     state = {
            login_state: false,
            got_response: false
        }

    redirect(){
        window.location= "https://internet.channeli.in/oauth/authorise/?client_id=uj0edatgcr0kBx1OZECybxsXQZvDh63s2NSwE38t&redirect_url=http://localhost:3000/onlogin&state=gottem";
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

        if(this.state.got_response && this.state.login_state){
            return <Redirect to="/dashboard" exact/>;
        } else{
             return(
                <div className="full granimate">
                    <Button className="ui white massive button" onClick={this.redirect}>
                        {/*<img className="ui tiny image" src={require("../assets/op_logo.png")}></img>*/}
                        Login using Omniport
                    </Button>
                </div>
            );
        }


    }
}

export default Login;