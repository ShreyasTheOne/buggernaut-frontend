import React, { Component } from 'react';
import axios from "axios";

axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.xsrfCookieName = 'buggernaut_csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

class test extends Component {

    state = { file: null,
        project_wiki: null,
        editor_images: null,
        editorID: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    }

    componentDidMount() {

    }


    render() {
        return (
            <div style={{display:"flex", flexDirection:"row", justifyContent:"center"}}>

            </div>
            );
    }
}

export default test;