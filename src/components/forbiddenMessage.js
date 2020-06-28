import React, {Component} from 'react';


class ForbiddenMessage extends Component {

    constructor(props) {
        super(props);
        let append_props = { login_state: false, got_response: false}
        this.state = {
            ...this.props, ...append_props
        }
    }

    redirect(){
        window.location= "http://localhost:3000/login";
    }

    componentDidMount() {
        setTimeout(() => {this.redirect()}, 5000);
    }

    render(){
        return(
            <div className="banned-page">
                {this.state.message === "banned" && <div className="banned-message">You have been banned from entering Buggernaut <span aria-label="sad emoji">😕</span></div>}
                {this.state.message === "alien" && <div className="banned-message">Alien detected <span aria-label="sad emoji">👾</span></div>}

                <div>Redirecting to Login page in 5 seconds...</div>
            </div>
        );

    }
}

export default ForbiddenMessage;