import React, {Component} from 'react';
import '../styles/login.css';
import '../styles/nav.css';
import {Button, Image} from 'semantic-ui-react';
import {Redirect} from 'react-router-dom';
import axios from "axios";

class Login extends Component {
     state = {
            login_state: null,
            isMobile: (window.innerWidth <= 480)
        }

    redirect(){
        window.location= "https://internet.channeli.in/oauth/authorise/?client_id=uj0edatgcr0kBx1OZECybxsXQZvDh63s2NSwE38t&redirect_url=http://localhost:3000/onlogin&state=gottem";
        // window.location= "https://internet.channeli.in/oauth/authorise/?client_id=uj0edatgcr0kBx1OZECybxsXQZvDh63s2NSwE38t&redirect_url=http://localhost:4000/onlogin&state=gottem";
    }

    onWindowResize(){
        this.setState({ isMobile: window.innerWidth <= 480 });
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize.bind(this));
    }

    componentDidMount() {

         window.addEventListener('resize', this.onWindowResize.bind(this));
        axios({
           url: "/users/test/",
           method: "get",
           withCredentials: true,
        }).then((response) => {
            if(response.data["enrolment_number"] === "Not authenticated"){
               this.setState({
                   login_state: false,
               });
           } else {
               this.setState({
                   login_state: true,
               });
           }
        }).catch( (e) => {
            alert(e);
        });

    }

    render(){
        if(this.state.login_state === null || this.state.login_state === false){
            if(!this.state.isMobile){
                return(
                        <div className="login-div">
                            <div className="login-content">
                                <Image src={require("../assets/app_logo_with_name_white.png")}/>
                                <Button onClick={this.redirect.bind(this)} inverted color={"violet"} className="login-button">
                                    <div className="my-horizontal-div">
                                        <Image size={"mini"} src={require("../assets/op_logo.png")}/>
                                        <span className="login-button-text">Login through Omniport</span>
                                    </div>
                                </Button>
                            </div>
                        </div>
                );
            } else{
                return(
                    <div className="login-div">
                            <div className="login-content">
                                <div className="vertical-logo-div">
                                    <Image src={require("../assets/app_logo_white.png")}/>
                                    <Image src={require("../assets/app_logo_only_name_white.png")}/>
                                </div>
                                <Button onClick={this.redirect.bind(this)} inverted color={"violet"} className="login-button">
                                    <div className="my-horizontal-div">
                                        <Image size={"mini"} src={require("../assets/op_logo.png")}/>
                                        <span className="login-button-text">Login through Omniport</span>
                                    </div>
                                </Button>
                            </div>
                        </div>
                );
            }


        } else{
            return <Redirect to="/dashboard" exact/>;
        }


    }
}

export default Login;