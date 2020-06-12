import {Divider, Input, Button, Checkbox, Dropdown, Header} from 'semantic-ui-react';
import CKEditor from '@ckeditor/ckeditor5-react';
import InlineEditor from '@ckeditor/ckeditor5-build-inline';
// import {Link} from 'react-router-dom';
import React, { Component } from 'react';
import axios from 'axios';
import MyNavBar from "./nav";
import {Link} from "react-router-dom";

class test extends Component {

    state = { file: null }

    uploadImage = (e) => {
        let image = e.target.files[0];
        this.setState({
            file: image,
        });
    }

    handleSubmit = () => {
        let image = this.state.file;
        let formData = new FormData();
        console.log(image)
        formData.append('url', image);
        // formData.append('name', 'file');

        axios({
            url: "/images/",
            method: "post",
            withCredentials: true,
            headers: {'content-type': 'multipart/form-data'},
            data: formData,
        }).then((response) => {
            console.log(response);
        });
    }

    render() {
        return (
            <div>
                <input type="file" id="image-upload" onChange={this.uploadImage}/>
                <input type="submit" onClick={this.handleSubmit}/>
            </div>
                       );
    }
}

export default test;