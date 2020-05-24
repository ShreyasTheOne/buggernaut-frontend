import React, {Component} from 'react';
import { Button } from 'semantic-ui-react';

class Login extends Component {

    render(){

        let cookies = document.cookie.split(';');
        console.log(cookies);

        let url = "https://internet.channeli.in/oauth/authorise/?client_id=uj0edatgcr0kBx1OZECybxsXQZvDh63s2NSwE38t&redirect_url=http://localhost:3000/onlogin&state=gottem";
        return(
           <a href={url}>Login with Omniport</a>
           //  <Button class="ui button inverted" loading color="blue">Loading</Button>
        );

    }
}

export default Login;