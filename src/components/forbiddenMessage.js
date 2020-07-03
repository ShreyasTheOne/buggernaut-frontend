import React, {Component} from 'react';
import {Link} from "react-router-dom";
import {Header} from "semantic-ui-react";
import MyNavBar from "./nav";


class ForbiddenMessage extends Component {

    constructor(props) {
        super(props);
        let append_props = { login_state: false, got_response: false}
        this.state = {
            ...this.props, ...append_props
        }
    }

    componentDidMount() {
        if(this.state.message !== "project-not-found"){
            setTimeout(() => {window.location= "http://localhost:3000/login"}, 5000);
        }
    }

    render(){

        if(this.state.message === "project-not-found"){
            return(
                <div>
                <MyNavBar/>
                <div className="banned-page">
                    <Header size={"huge"}>404 PAGE NOT FOUND!</Header>
                    <div className="banned-message">The requested project does not exist. Please check your URL.</div>
                    <Link style={{cursor:"pointer"}} to="/dashboard">Click here to view all projects</Link>
                </div>
                </div>
            );
        }

        return(
            <div>
            <MyNavBar/>
            <div className="banned-page"> {/* index.css */}
                {this.state.message === "banned" && <div className="banned-message">You have been banned from entering Buggernaut <span role="img" aria-label="sad emoji">😕</span></div>}
                {this.state.message === "alien" && <div className="banned-message">Alien detected <span role="img" aria-label="alien emoji">👾</span></div>}
            </div>
                </div>
        );

    }
}

export default ForbiddenMessage;