import {Divider, Input, Button, Checkbox, Dropdown, Header} from 'semantic-ui-react';
import CKEditor from '@ckeditor/ckeditor5-react';
import InlineEditor from '@ckeditor/ckeditor5-build-inline';
// import {Link} from 'react-router-dom';
import React, { Component } from 'react';
import axios from 'axios';
import MyNavBar from "./nav";
import {Link} from "react-router-dom";

class addProject extends Component {

    state={
        userList: [],
        project_name: "",
        project_wiki: "",
        project_deployed: false,
        project_members: [],
        project_slug: "",
        slug_available:"",
    }

    getCookie(cname) {
      let name = cname + "=";
      let decodedCookie = decodeURIComponent(document.cookie);
      let ca = decodedCookie.split(';');
      for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    }

    componentDidMount() {

        axios({
            url: '/users',
            method: 'get',
            withCredentials: true
        }).then(
            (response) => {
                // console.log(response.data);
                let arr = [];
                const ul = response.data;
                for(let user in ul){
                    let dict = {};
                    dict["key"] = user;
                    dict["value"] = ul[user]["pk"];
                    dict["text"] = ul[user]["full_name"];
                    // dict["enrolment_number"] = ul[user]["enrolment_number"];
                    arr.push(dict);
                }

                // console.log(arr);
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
            file: image,
        });
    }

    submitForm() {
        let projectName = this.state.project_name;
        let projectSlug = this.state.project_slug;
        let projectMembers = this.state.project_members;
        let projectDeployed = this.state.project_deployed;
        let projectWiki = this.state.project_wiki;
        let slug_available = this.state.slug_available;

        if(!slug_available){
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

        axios({
            url: "/projects/",
            method: "post",
            withCredentials: "true",
            data: {
                title: projectName,
                slug: projectSlug,
                wiki: projectWiki,
                members: projectMembers,
                deployed: projectDeployed
            }
        }).then((response) =>{
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
            <div className="my-page">
                <MyNavBar/>

                <div className="my-container">
                    <div className='my-container-inner'>
                        <div className="ui secondary vertical large menu">
                            <div className="left-menu-list">
                                <Link to="/dashboard"><a className="item">
                                    Dashboard
                                </a></Link>
                                <a className="item huge ">
                                    My Page
                                </a>
                            </div>

                        </div>

                        <div className="my-content">
                            <div style={{marginTop: "20px"}}>
                                <div style={{
                                    width: "100%",
                                    display: "flex",
                                    flexDirection: "row",
                                    alignContent: "flex-end",
                                    justifyContent: "space-between"
                                }}>
                                  <div style={{display: "flex", flexDirection:"column", justifyContent: "flex-end"}}>
                                      <div className="ui large header">Add a Project</div>
                                  </div>

                                </div>

                                <Divider></Divider>
                            </div>

                            <div style={{marginTop:"15px", width:"60%", display:"flex", flexDirection:"column"}}>

                                <Header as={'h3'} style={{marginBottom:"5px"}}>Project name:</Header>
                                <Input
                                    fluid
                                    id='project-name'
                                    placeholder="Buggernaut"
                                    onChange={this.onProjectNameChange.bind(this)}
                                    />
                                <div style={{display:"flex", flexDirection:"row", marginTop:"5px"}}><p style={{marginRight:"5px"}}>Slug generated:</p>
                                {(this.state.project_slug !== "" && this.state.project_slug != null )  && (this.state.slug_available && <p style={{color:"green"}}>{this.state.project_slug} &nbsp;SLUG AVAILABLE! :)</p>
                                    || <p style={{color:"red"}}>{this.state.project_slug} &nbsp;SLUG UNAVALIABLE :(</p> )}

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

                                <input style={{marginTop:"25px"}} type="file" id="image-upload" onChange={this.uploadImage}/>

                                <Checkbox id="deployed-or-not"
                                          label='Project has already been deployed'
                                          style={{marginTop:"25px"}}
                                          onChange={(e, data) => {
                                              this.setState({project_deployed: data.checked });
                                          }}/>

                                <div style={{width:"50px", marginTop:"25px"}}><Button floated="left" secondary onClick={this.submitForm.bind(this)}>Submit</Button></div>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default addProject;