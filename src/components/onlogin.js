import React, {Component} from 'react';
import axios from 'axios';
import {Loader} from 'semantic-ui-react';
import {Redirect} from 'react-router-dom';
import queryString from 'query-string';
import ForbiddenMessage from "./forbiddenMessage";

class OnLogin extends Component {

    state = {
        user_found: false,
        got_response: false,
        user_banned: null,
    }


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
                        user_banned: false,
                        user_found: true,
                        got_response: true
                    });
                } else if(response.data["status"] === "user exists") {
                    this.setState({
                        user_banned: false,
                        user_found: true,
                        got_response: true
                    });
                } else if(response.data["status"] === "user not in IMG"){
                    this.setState({
                        user_banned: false,
                        user_found: false,
                        got_response: true
                    });
                } else if(response.data["status"] === "user banned"){
                    this.setState({
                       user_banned: true,
                       got_response: true,
                    });
                }
            });


    }

    render(){

        // return(<ForbiddenMessage message={"alien"}/>);

        if(this.state.got_response){
          if(this.state.user_found){
              return (<Redirect to="/dashboard" exact/>);
          } else if (this.state.user_banned){
              return ( <ForbiddenMessage message="banned"/> );
          } else {
              return ( <ForbiddenMessage message="alien"/> );
          }
        }else{
           return(
                    <div style={{display:"flex", flexDirection:"column", justifyContent:"center"}}><Loader active/></div>
           );
        }


    }
}
 export default OnLogin;