import {Divider, Input, Button, Checkbox, Dropdown, Header} from 'semantic-ui-react';
import CKEditor from '@ckeditor/ckeditor5-react';
import InlineEditor from '@ckeditor/ckeditor5-build-inline';
import React, { Component } from 'react';
import axios from 'axios';


class AddProject extends Component {

    state={
        userList: [],
        project_image: null,
        project_name: "",
        project_wiki: "",
        project_deployed: false,
        project_members: [],
        project_slug: "",
        slug_available:"",
        submit_loading: false,
    }

    componentDidMount() {

        axios({
            url: '/users',
            method: 'get',
            withCredentials: true
        }).then(
            (response) => {
                let arr = [];
                const ul = response.data;
                for(let user in ul){
                    let dict = {};
                    dict["key"] = user;
                    dict["value"] = ul[user]["pk"];
                    dict["text"] = ul[user]["full_name"];
                    arr.push(dict);
                }

                this.setState({
                    userList: arr
                })
            }
        );

    }

    onProjectNameChange() {
        let value = document.getElementById("project-name").value.trim();
        let slug = value.replace(/\s+/g, '-').toLowerCase();

        if(! (value === null || value === "") ){
            let url = '/projects/verify/?slug=' + slug;
            axios({
                method: 'get',
                url:url,
                withCredentials: true,
            }).then(
                (response) => {
                    console.log("Slug Check:");
                    console.log(response.data);
                    let status = response.data["status"];
                    if(status === "Available"){
                        this.setState({
                            project_name: value, project_slug: slug, slug_available: true
                        });
                    } else {
                        this.setState({
                            project_name: value, project_slug: slug, slug_available: false
                        });
                    }
                }
            );
        } else {
            this.setState({
                project_name: value, project_slug: slug, slug_available: false
            });
        }

    }

    uploadImage = (e) => {
        let image = e.target.files[0];
        this.setState({
            project_image: image,
        });
    }

    submitForm() {
        let projectName = this.state.project_name;
        let projectSlug = this.state.project_slug;
        let projectMembers = this.state.project_members;
        let projectDeployed = this.state.project_deployed;
        let projectWiki = this.state.project_wiki;
        let slugAvailable = this.state.slug_available;


        if(!slugAvailable){
            alert("A project with this slug already exists.");
            return;
        }
        if(projectMembers.length ===0) {
            alert("Team cannot have zero members");
            return;
        }
        if(projectWiki===""){
            alert("Project wiki cannot be blank");
            return;
        }
        if(projectName===""){
            alert("Project name cannot be blank");
            return;
        }

        if(this.state.project_image === null){
            let del = window.confirm("You have not uploaded an image, and a default image will be set." +
                "\nAre you ready to continue?");
            if(!del){return;}
        }
        let projectImage = this.state.project_image;

        let formData = new FormData();
        formData.append('image', projectImage);
        formData.append('title', projectName);
        formData.append('slug', projectSlug);
        formData.append('wiki', projectWiki);
        formData.append('deployed', projectDeployed);

        for(let mem in projectMembers){
            formData.append("members", projectMembers[mem]);
        }

        this.setState({
            submit_loading: true,
        });

        axios({
            url: "/projects/",
            method: "post",
            withCredentials: "true",
            data: formData,
        }).then((response) =>{
            this.setState({
                submit_loading: false,
            });
            if(response["status"] === 201){
                window.location = "http://localhost:3000/dashboard";
            } else{
                alert(response["status"]);
            }
            console.log(response);
        });

    }

    render() {
        return (
            <div style={{marginTop:"30px", width:"60%", display:"flex", flexDirection:"column"}}>

                <Header as={'h3'} style={{marginBottom:"5px"}}>Project name:</Header>
                <Input
                    fluid
                    id='project-name'
                    placeholder="Buggernaut"
                    onChange={this.onProjectNameChange.bind(this)}
                    />
                <div style={{display:"flex", flexDirection:"row", marginTop:"5px"}}><p style={{marginRight:"5px"}}>Slug generated:</p>
                {(this.state.project_slug !== "" && this.state.project_slug != null )  && (this.state.slug_available && <p style={{color:"green"}}>{this.state.project_slug} &nbsp;SLUG AVAILABLE! :)</p>
                    || <p style={{color:"red"}}>{this.state.project_slug} &nbsp;SLUG UNAVAILABLE :(</p> )}
                </div>


                <Header as={'h3'} style={{marginBottom:"5px"}}>Project wiki:</Header>
                <div style={{border: "1px solid #cad8de", borderRadius: "5px", marginBottom:"20px"}}>
                <CKEditor
                    id="project-wiki"
                    editor={InlineEditor}
                    config={ {placeholder: "Instructions on how to use the app...", height: "100px" }}
                    onChange={ ( event, editor ) => {
                           const data = editor.getData();

                            this.setState({
                                project_wiki: data
                            });
                            console.log(this.state);
                        } }

                    />
                </div>


                <Header as={'h3'} style={{marginBottom:"5px"}}>Team Members:</Header>
                <Dropdown id="team-select"
                          placeholder='Members'
                          fluid multiple search selection
                          options={this.state.userList}
                          onChange={(event, data) =>{
                              // console.log(data.value);
                              this.setState({project_members: data.value });

                          }}/>

                <Header style={{marginTop:"25px"}} as={'h3'}>Upload Image:</Header>
                <input style={{marginTop:"0px"}} type="file" id="image-upload" onChange={this.uploadImage}/>

                <Checkbox id="deployed-or-not"
                          label='Project has already been deployed'
                          style={{marginTop:"25px"}}
                          onChange={(e, data) => {
                              this.setState({project_deployed: data.checked });
                          }}/>

                <div style={{width:"50px", marginTop:"25px"}}>
                   <Button floated="left" disabled={this.state.submit_loading} loading={this.state.submit_loading} secondary onClick={this.submitForm.bind(this)}>Submit</Button>
                </div>

            </div>

        );
    }
}

export default AddProject;