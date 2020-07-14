import React, { Component } from 'react';
import axios from 'axios';
import {Link, Redirect} from 'react-router-dom';
import {Button, Header, Icon, Image, Popup} from "semantic-ui-react";
import '../styles/nav.css';
import {urlApiUserLogout, urlAppAdmin, urlAppDashboard, urlAppLogin, urlAppMyPage} from "../urls";


class MyNavBar extends Component {

    constructor(props) {
        super(props);
        //this.props container user_data, isMobile

        let data = this.props["user_data"]
        if(data === null || data === undefined){
            this.setState({
                enrolmentNumber: null,
            })
            
            window.location.reload()
            // window.location = urlAppDashboard()
        } else {
            this.setCookie('enrolment_number', data["enrolment_number"], 14)
            this.state = {
                isMobile: this.props["isMobile"],
                user_banned: data["banned"],
                enrolmentNumber: data["enrolment_number"],
                user_name: data["full_name"],
                user_id: data["id"],
                user_img: data["display_picture"],
                is_admin: data["is_superuser"],
                reported_count: data["reported"],
                resolved_count: data["resolved"],
            }
        }

    }

    setCookie(cname, cvalue, exdays) {
      let d = new Date();
      d.setTime(d.getTime() + (exdays*24*60*60*1000));
      let expires = "expires="+ d.toUTCString();
      document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps) {
      if(this.props["isMobile"] !== prevProps["isMobile"])
      {
        this.setState({
            ...this.state,
            ...this.props
        })
      }
    }

    logout(){
        axios({
            url:urlApiUserLogout(),
            method:"get",
            withCredentials: true,
        }).then((response) => {
            if(response.data["status"] === "logged_out"){
                window.location = urlAppLogin();
            }
        }).catch( (e) => {
            alert("Unable to logout.");
        });
    }

    render() {

        if(this.state === null || this.state === undefined){
            return null;
        }

        return (
            <div className="my-nav"> {/* nav.css */}
                <Link to="/dashboard" className="a">
                    <div className='ui medium header buggernaut-title'>Buggernaut</div>
                </Link> {/* nav.css */}
                <div className='my-icon-nav-links'> {/* nav.css */}
                    <Popup
                        hideOnScroll
                        position='bottom right'
                        on="click"
                        style={{padding: "0px"}}
                        trigger={<img style={{cursor: 'pointer'}} alt="ProfilePicture"
                                      className="ui circular mini image" src={this.state.user_img}/>}
                    >
                        <Popup.Header style={{padding: "10px 15px"}}>
                            <div className="profile-menu-header"> {/* nav.css */}
                                <div className="profile-menu-header-left"> {/* nav.css */}
                                    <Image alt="ProfilePicture" circular size={"tiny"} src={this.state.user_img}/>
                                </div>
                                <div className="profile-menu-header-right"> {/* nav.css */}
                                    <Header as="h4"
                                            style={{margin: "0px"}}>{this.state.user_name}</Header> {/* nav.css */}
                                    <div className={"profile-menu-stats"}> {/* nav.css */}
                                        <span style={{
                                            fontWeight: "normal",
                                            fontSize: "0.9em"
                                        }}>{this.state.reported_count} Bugs Reported</span>
                                        <span style={{
                                            fontWeight: "normal",
                                            fontSize: "0.9em"
                                        }}>{this.state.resolved_count} Bugs Resolved</span>
                                    </div>
                                </div>
                            </div>
                        </Popup.Header>
                        <Popup.Content>
                            <Button.Group fluid vertical basic attached={"bottom"}>
                                <Button onClick={() => {
                                    window.location = urlAppDashboard();
                                }} icon labelPosition='left'>
                                    <Icon name='home'/>
                                    Dashboard
                                </Button>
                                <Button onClick={() => {
                                    window.location = urlAppMyPage();
                                }} icon labelPosition='left'>
                                    <Icon name='user'/>
                                    My Page
                                </Button>

                                {this.state.is_admin &&
                                <Button onClick={() => {
                                    window.location = urlAppAdmin();
                                }} icon labelPosition='left'>
                                    <Icon name='chess king'/>
                                    Admin
                                </Button>
                                }
                                <Button onClick={this.logout.bind(this)} icon labelPosition='left'>
                                    <Icon name='sign-out'/>
                                    Log out
                                </Button>
                            </Button.Group>
                        </Popup.Content>
                    </Popup>
                </div>

            </div>

        );
    }
}

export default MyNavBar;
