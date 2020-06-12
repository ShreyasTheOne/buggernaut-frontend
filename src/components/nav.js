import React, { Component } from 'react';
import axios from 'axios';
import {Link, Redirect} from 'react-router-dom';


class MyNavBar extends Component {

    state = {
            login_state: false,
            got_response: false,
            enrolmentNumber: null,
            user_name: null,
            user_img: null
        }

    setCookie(cname, cvalue, exdays) {
      let d = new Date();
      d.setTime(d.getTime() + (exdays*24*60*60*1000));
      let expires = "expires="+ d.toUTCString();
      document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    componentDidMount() {
         axios({
            url: "/users/test/",
            method: "get",
            withCredentials: true,

        }).then((response) => {

            if(response.data["enrolment_number"] === "Not authenticated"){
                this.setState({
                    login_state: false,
                    got_response: true
                });
            } else {
                this.setCookie('is_admin', response.data["is_superuser"], 14)
                this.setCookie('enrolment_number', response.data["enrolment_number"], 14)
                this.setState({
                    login_state: true,
                    got_response: true,
                    enrolmentNumber: response.data["enrolment_number"],
                    user_name: response.data["full_name"],
                    user_img: response.data["display_picture"]
                });
            }

        });

    }


    render() {
            if(this.state.got_response){
                    if(this.state.login_state){

                        return(

                                <div className="my-nav">
                                    <div className='buggernaut-title'>
                                        <Link to="/dashboard" className="a"><div className='ui medium header'>Buggernaut</div></Link>
                                    </div>
                                    <div className='my-icon-nav-links'>
                                        <div className="notif-button">
                                            <i className="grey bell large icon"></i>
                                        </div>
                                        <img alt="ProfilePicture" className="ui rounded mini image" src={this.state.user_img}/>
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
