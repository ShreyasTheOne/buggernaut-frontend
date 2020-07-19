import React, {Component} from 'react';
import '../../styles/login.css';
import '../../styles/nav.css';
import {Button, Image} from 'semantic-ui-react';
import {Redirect} from 'react-router-dom';
import axios from "axios";
import {urlAppOnLogin} from "../../urls";

class Login extends Component {

    constructor(props) {
        super(props);
        let initial_state = this.props; //isMobile
        let append_state = {
           isMobile: (window.innerWidth <= 480),
        };
        this.state = {...initial_state, ...append_state};
    }

    redirect(){
        window.location= `https://internet.channeli.in/oauth/authorise/?client_id=uj0edatgcr0kBx1OZECybxsXQZvDh63s2NSwE38t&redirect_url=${urlAppOnLogin()}&state=gottem`;
    }


    render(){
        if(this.state.login_state === null || this.state.login_state === false){
            if(!this.state.isMobile){
                return(
                        <div className="login-div">
                            <div className="login-content">
                                <Image src={require("../../assets/app_logo_with_name_white.png")}/>
                                <Button onClick={this.redirect.bind(this)} inverted color={"violet"} className="login-button">
                                    <div className="my-horizontal-div">
                                        <Image size={"mini"} src={require("../../assets/op_logo.png")}/>
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
                                    <Image src={require("../../assets/app_logo_white.png")}/>
                                    <Image src={require("../../assets/app_logo_only_name_white.png")}/>
                                </div>
                                <Button onClick={this.redirect.bind(this)} inverted color={"violet"} className="login-button">
                                    <div className="my-horizontal-div">
                                        <Image size={"mini"} src={require("../../assets/op_logo.png")}/>
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