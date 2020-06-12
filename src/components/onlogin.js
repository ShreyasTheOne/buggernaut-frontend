import React, {Component} from 'react';
import axios from 'axios';
import {Loader} from 'semantic-ui-react';
import {Redirect} from 'react-router-dom';
import queryString from 'query-string';

class OnLogin extends Component {

    state = {
        user_found: false,
        got_response: false,

    }
    // setCookie(cname, cvalue, exdays) {
    //   let d = new Date();
    //   d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    //   let expires = "expires="+d.toUTCString();
    //   document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    //     }

    componentDidMount() {
        let url = this.props.location.search;
        let params = queryString.parse(url);
        console.log(params['code']);

            // console.log("sending")
            axios({
                method:'post',
                url: '/users/onlogin/',
                headers:{
                    'Content-Type':'application/json',

                },
                withCredentials: true,
                data:{
                    code: params['code'],
                }
            }).then((response) => {
                console.log(response);
                // alert("gott");
                //REMEMBER TO SET COOKIE AS ACCESS TOKEN -- NOPE NOT ANYMORE, USING SESSIONS
                if(response.data["status"] === "user created") {
                    this.setState({
                        user_found: true,
                        got_response: true
                    });
                } else if(response.data["status"] === "user exists") {
                    this.setState({
                        user_found: true,
                        got_response: true
                    });
                } else if(response.data["status"] === "user not in IMG"){
                    this.setState({
                        user_found: false,
                        got_response: true
                    });
                }
            });


    }

    render(){

        if(this.state.got_response){
          if(this.state.user_found){
              return (<Redirect to="/dashboard" exact/>);
          } else {
              alert("You must be an IMG member to use this app");
              return (<Redirect to="/login" exact/>);
          }

        }else{
                return(
                    <div style={{display:"flex", flexDirection:"column", justifyContent:"center"}}><Loader active/></div>
            );
        }


    }
}
 export default OnLogin;