import React, {Component} from 'react';
import axios from 'axios';
import {Loader} from 'semantic-ui-react';
import {Redirect, Router} from 'react-router-dom';
import ForbiddenMessage from "../forbiddenMessage";
import {urlApiUserOnLogin, urlAppLogin} from "../../urls";

class OnLogin extends Component {

     constructor(props) {
        super(props);
        let initial_state = this.props; //code, state
        let append_state = {
            user_status: null,
        };
        this.state = {...initial_state, ...append_state};
    }

    componentDidMount() {

        console.log(this.state.code);
            axios({
                method:'post',
                url: urlApiUserOnLogin(),
                headers:{
                    'Content-Type':'application/json',
                },
                withCredentials: true,
                data:{
                    code: this.state.code,
                }
            }).then((response) => {
                this.setState({
                    user_status: response.data["status"],
                });
            }).catch( (e) => {
                window.location = urlAppLogin();
            });
    }

    render(){
         if(this.state.user_status === null){
             return(
                   <div className="my-loader-div"><Loader active/></div> // {/* index.css */}
               );
         }

         if(this.state.user_status === "invalid token"){
             return <Redirect to="/login" exact />;
         }

         if(this.state.user_status === "user created" || this.state.user_status === "user exists"){
             return <Redirect to="/login" exact/>;
         }

         if(this.state.user_status === "user not in IMG"){
             return ( <ForbiddenMessage message="alien"/> );
         }

         if(this.state.user_status === "user banned"){
             return ( <ForbiddenMessage message="banned"/> );
         }

    }
}
 export default OnLogin;