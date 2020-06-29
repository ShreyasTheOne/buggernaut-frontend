import React, { Component } from 'react';
import axios from 'axios';
import {Link, Redirect} from 'react-router-dom';
import {Header, Icon, Image, Popup, Statistic} from "semantic-ui-react";
import ForbiddenMessage from "./forbiddenMessage";
import '../styles/nav.css';


class MyNavBar extends Component {

    state = {
            login_state: false,
            got_response: false,
            enrolmentNumber: null,
            user_name: null,
            user_img: null,
            is_admin: null,
            user_banned: null,
        }

    setCookie(cname, cvalue, exdays) {
      let d = new Date();
      d.setTime(d.getTime() + (exdays*24*60*60*1000));
      let expires = "expires="+ d.toUTCString();
      document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    componentDidMount() {
         axios({
            url: "/users/stats/",
            method: "get",
            withCredentials: true,

        }).then((response) => {
            if(response.status === 403 || response.data["enrolment_number"] === "Not authenticated"){
                this.setState({
                    login_state: false,
                    got_response: true,
                    user_banned: false,
                });

            } else if(response.data["enrolment_number"] === "user banned") {
                this.setState({
                    login_state: false,
                    got_response: true,
                    user_banned: true
                });
            } else {
                this.setCookie('is_admin', response.data["is_superuser"], 14)
                this.setCookie('enrolment_number', response.data["enrolment_number"], 14)
                this.setState({
                    user_banned: false,
                    login_state: true,
                    got_response: true,
                    enrolmentNumber: response.data["enrolment_number"],
                    user_name: response.data["full_name"],
                    user_id: response.data["id"],
                    user_img: response.data["display_picture"],
                    is_admin: response.data["is_superuser"],
                    reported_count: response.data["reported"],
                    resolved_count: response.data["resolved"],
                });
            }

        }).catch( (e) => {
            // alert("You must be logged in to use this app");
             this.setState({
                    login_state: false,
                    got_response: true
                });
         });

    }

    logout(){
        axios({
            url:"/users/logout_user/",
            method:"get",
            withCredentials: true,
        }).then((response) => {
            if(response.data["status"] === "logged_out"){
                window.location = "http://localhost:3000/login";
            }
        }).catch( (e) => {
            alert("Unable to logout.");
        });
    }

    render() {
            if(this.state.got_response){
                    if(this.state.user_banned){
                        return (<ForbiddenMessage message={"banned"}/>);
                    }

                    if(this.state.login_state){

                        return(

                                <div className="my-nav"> {/* nav.css */}
                                    <Link to="/dashboard" className="a"><div className='ui medium header buggernaut-title'>Buggernaut</div></Link> {/* nav.css */}
                                    <div className='my-icon-nav-links'> {/* nav.css */}
                                         <Popup
                                            wide={"very"}
                                            position='bottom right'
                                            on="click"
                                            trigger={<img style={{cursor:'pointer'}} alt="ProfilePicture" className="ui circular mini image" src={this.state.user_img}/>}
                                         >
                                            <Popup.Header>
                                                <div className="profile-menu-header"> {/* nav.css */}
                                                    <div className="profile-menu-header-left"> {/* nav.css */}
                                                        <Image alt="ProfilePicture" circular src={this.state.user_img}/>
                                                    </div>
                                                    <div className="profile-menu-header-right"> {/* nav.css */}
                                                        <Header className={"profile-menu-name-header"} >{this.state.user_name}</Header> {/* nav.css */}
                                                        <Header className={"profile-menu-name-header"} >{this.state.enrolmentNumber}</Header> {/* nav.css */}
                                                        <div className={"profile-menu-stats"}> {/* nav.css */}
                                                            <Statistic className="profile-menu-stats-reported" size={"mini"}> {/* nav.css */}
                                                                <Statistic.Value>{this.state.reported_count}</Statistic.Value>
                                                                <Statistic.Label>BUGS REPORTED</Statistic.Label>
                                                            </Statistic>
                                                            <Statistic className="profile-menu-stats-resolved" size={"mini"}> {/* nav.css */}
                                                                <Statistic.Value>{this.state.resolved_count}</Statistic.Value>
                                                                <Statistic.Label>BUGS RESOLVED</Statistic.Label>
                                                            </Statistic>
                                                        </div>
                                                        <div className="profile-menu-actions"> {/* nav.css */}
                                                            {this.state.is_admin &&
                                                               <Link to="/admin">
                                                                   {/*or should I use user icon to represent admin?*/}
                                                                   <Icon
                                                                    size={"large"}
                                                                    name={"chess king"}
                                                                    className={"profile-menu-icons"}
                                                                    />
                                                                   {/* nav.css */}
                                                               </Link>
                                                            }

                                                            <Icon
                                                                size={"large"}
                                                                name={"log out"}
                                                                className={"profile-menu-icons"}
                                                                onClick={this.logout.bind(this)}
                                                            /> {/* nav.css */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Popup.Header>
                                            <Popup.Content>

                                            </Popup.Content>
                                        </Popup>
                                    </div>
                                </div>

                        );

                    }else{
                        return (<Redirect to="/login"/>);
                    }
            } else {
                return null;
            }




    }
}

export default MyNavBar;
