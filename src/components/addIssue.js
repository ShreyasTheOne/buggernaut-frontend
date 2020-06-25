import {Divider, Input, Button, Radio, Dropdown, Header} from 'semantic-ui-react';
import CKEditor from '@ckeditor/ckeditor5-react';
import InlineEditor from '@ckeditor/ckeditor5-build-inline';
import React, { Component } from 'react';
import axios from 'axios';
import MyNavBar from "./nav";
import {Link} from "react-router-dom";

class addIssue extends Component {

    state={
        projectsList: [],
        for_project: -1,
        user_id: "caramel",
        issue_subject: "",
        issue_description: "",
        issue_priority: 2,
        charsTitle: 100,
        submit_loading: false,
    }

    componentDidMount() {

        axios({
            url: '/projects',
            method: 'get',
            withCredentials: true
        }).then(
            (response) => {
                // console.log(response.data);
                let arr = [];
                const pl = response.data;
                for(let project in pl){
                    let dict = {};
                    dict["key"] = project;
                    dict["value"] = pl[project]["id"];
                    dict["text"] = pl[project]["title"];
                    // dict["enrolment_number"] = ul[user]["enrolment_number"];
                    arr.push(dict);
                }

                // console.log(arr);
                this.setState({
                    projectsList: arr,
                    for_project: this.getProject()
                });
                console.log(this.state);
            }
        );

         axios({
            url: "/users/test/",
            method: "get",
            withCredentials: true,

         }).then((response) => {
            this.setState({
                user_id: response.data["pk"],
            });
         });
         console.log(this.state);

    }

    onSubjectChange() {
        let value = document.getElementById("issue-subject").value.trim();

        this.setState({
            issue_subject: value,
            charsTitle: 100 - value.length
        });
    }

    submitForm() {
       let subject = this.state.issue_subject;
       let description = this.state.issue_description;
       let priority = this.state.issue_priority;
       let reporter = this.state.user_id;
       let project = this.state.for_project;

       if(reporter === "caramel"){alert("Sorry, we are unable to send a request. Please save your data elsewhere, refresh and try again"); return;}
       if(project === -1){ alert("Please select a project."); return;}
       if(subject===""){ alert("Subject cannot be empty"); return;}
       if(description === ""){ alert("Description cannot be empty"); return;}

       this.setState({
           submit_loading: true,
       });
        axios({
            url: "/issues/",
            method: "post",
            withCredentials: "true",

            data: {
                project: project,
                reported_by: reporter,
                description: description,
                priority: priority,
                subject: subject
            }
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

    getProject(){
        if(typeof this.props.location.state === "undefined"){
            return -1;
        } else{
            return this.props.location.state.project_id;
        }

    }
    render() {
        // const { isLoading, value, results } = this.state
        return (
            <div className="my-page">
                <MyNavBar/>

                <div className="my-container">
                    <div className='my-container-inner'>
                        <div className="ui secondary vertical large menu">
                            <div className="left-menu-list">
                                <Link to="/dashboard" className="item">
                                    Dashboard
                                </Link>
                               <Link to="/mypage" className="item">
                                    My Page
                                </Link>
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
                                      <div className="ui large header">Report an Issue</div>
                                  </div>

                                </div>

                                <Divider></Divider>
                            </div>

                            <div style={{marginTop:"15px", width:"60%", display:"flex", flexDirection:"column"}}>

                                <Header as={'h3'} style={{marginBottom:"5px"}}>For Project:</Header>
                                <div><Dropdown id="team-select"

                                          placeholder='Project'
                                          search selection
                                          options={this.state.projectsList}
                                          defaultValue = {this.getProject()}
                                          onChange={(event, data) =>{
                                              // console.log(data.value);
                                              this.setState({for_project: data.value });

                                          }}/></div>

                                <Header as={'h3'} style={{marginBottom:"5px"}}>Subject:</Header>
                                <Input
                                    fluid
                                    id='issue-subject'
                                    placeholder="Subject"
                                    maxLength={100}
                                    onChange={this.onSubjectChange.bind(this)}
                                    />
                                <div style={{display:"flex", flexDirection:"row", marginTop:"5px"}}>
                                    <p>Characters left: {this.state.charsTitle} </p>
                                </div>



                                <Header as={'h3'} style={{marginBottom:"5px"}}>Description:</Header>
                                <div style={{border: "1px solid #cad8de", borderRadius: "5px", marginBottom:"15px"}}>
                                <CKEditor
                                    id="project-wiki"
                                    editor={InlineEditor}
                                    config={ {placeholder: 'Add a description for better understanding...'}}
                                    onChange={ ( event, editor ) => {
                                           const data = editor.getData();

                                            this.setState({
                                                issue_description: data
                                            });
                                            console.log(this.state);
                                        } }
                                    />
                                </div>

                                <Header as={'h3'} style={{marginBottom:"5px"}}>Priority:</Header>
                                <Radio
                                    label='High'
                                    name='priority'
                                    value={1}
                                    checked={this.state.issue_priority === 1}
                                    onChange={(e, {value}) => {
                                        this.setState({
                                            issue_priority: 1
                                        });
                                    }}
                                  />
                                  <Radio
                                    label='Medium'
                                    name='priority'
                                    value={2}
                                    checked={this.state.issue_priority === 2}
                                    onChange={(e, {value}) => {
                                        this.setState({
                                            issue_priority: 2
                                        });
                                    }}
                                  />
                                  <Radio
                                    label='Low'
                                    name='priority'
                                    value={3}
                                    checked={this.state.issue_priority === 3}
                                    onChange={(e, {value}) => {
                                        this.setState({
                                            issue_priority: 3
                                        });
                                    }}
                                  />

                                <div style={{width:"50px", marginTop:"25px"}}>
                                    <Button
                                        floated="left"
                                        secondary
                                        disabled={this.state.submit_loading}
                                        loading={this.state.submit_loading}
                                        onClick={this.submitForm.bind(this)}>Submit</Button>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default addIssue;