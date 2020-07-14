import {Divider, Input, Button, Radio, Dropdown, Header, Confirm} from 'semantic-ui-react';
import React, { Component } from 'react';
import axios from 'axios';
import MyNavBar from "./nav";
import {Link} from "react-router-dom";
import '../styles/form.css';
import {Editor} from "@tinymce/tinymce-react";
import {
    urlApiDeleteRemainingImages,
    urlApiImages,
    urlApiIssues,
    urlApiProjects,
    urlApiTags,
    urlAppProjectDetail
} from "../urls";


class AddIssue extends Component {

    constructor(props) {
        super(props);
        this.state={
            ...this.props, //user_data, user_id, is_admin, isMobile
            editor_images:[],
            editorID: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
            projectsList: [],
            projectSlugs: {},
            tagsList: [],
            tags_selected: [],
            for_project: -1,
            issue_subject: "",
            issue_description: "",
            issue_priority: 2,
            charsTitle: 100,
            submit_loading: false,
            confirm_open: false,
        }
    }


    componentDidMount() {

        axios({
            url: urlApiProjects(),
            method: 'get',
            withCredentials: true
        }).then(
            (response) => {
                let arr = [];
                let brr = {};
                const pl = response.data;
                for(let project in pl){
                    let dict = {};
                    dict["key"] = project;
                    dict["value"] = pl[project]["id"];
                    dict["text"] = pl[project]["title"];
                    arr.push(dict);
                    brr[pl[project]["id"]] = pl[project]["slug"];
                }

                this.setState({
                    projectsList: arr,
                    projectSlugs: brr,
                    for_project: this.getProject()
                });
            }
        ).catch((e) => {
            alert(e);
        });

        axios({
            url: urlApiTags(),
            method: "get",
            withCredentials: true
        }).then(
            (response) => {
                // console.log(response.data);
                let arr = [];
                const tl = response.data;
                for(let tag in tl){
                    let dict = {};
                    dict["key"] = tag;
                    dict["value"] = tl[tag]["id"];
                    dict["text"] = tl[tag]["name"];
                    // dict["enrolment_number"] = ul[user]["enrolment_number"];
                    arr.push(dict);
                }

                // console.log(arr);
                this.setState({
                    tagsList: arr,
                });
            }
        ).catch((e) => {
            alert(e);
        });
    }

    componentDidUpdate(prevProps) {
      if(this.props["isMobile"] !== prevProps["isMobile"])
      {
        this.setState({
            ...this.state,
            ...this.props
        })
      }
    }

    onSubjectChange() {
        let value = document.getElementById("issue-subject").value.trim();

        this.setState({
            issue_subject: value,
            charsTitle: 100 - value.length
        });
    }

    submitForm() {
        console.log(this.state.tags_selected)

        this.setState({
            confirm_open: false,
        });
        let subject = this.state.issue_subject;
        let description = this.state.issue_description;
        let priority = this.state.issue_priority;
        let reporter = this.state.user_id;
        let project = this.state.for_project;
        let editor = this.state.editorID

       let tags = this.state.tags_selected;

       if(reporter === "caramel"){alert("Sorry, we are unable to send a request. Please save your data elsewhere, refresh and try again"); return;}
       if(project === -1){ alert("Please select a project."); return;}
       if(subject===""){ alert("Subject cannot be empty"); return;}
       if(description === ""){ alert("Description cannot be empty"); return;}

       this.setState({
           submit_loading: true,
       });

        axios({
            url: urlApiIssues(),
            method: "post",
            withCredentials: "true",

            data: {
                project: project,
                reported_by: reporter,
                description: description,
                priority: priority,
                subject: subject,
                tags: tags,
                editorID: editor
            }
        }).then((response) =>{
            this.setState({
               submit_loading: false,
           });
            if(response["status"] === 201){
                window.location = urlAppProjectDetail(this.state.projectSlugs[project]);
            } else if (response["status"]===500){
                alert(response["status"]);
            }
            console.log(response);
        }).catch((e) => {
            this.setState({
               submit_loading: false,
            });
            console.log(e);
            alert(e);
            // alert("Let's not go crazy with the text, words will do just fine :)");
        });

        const deleteData = new FormData();
        deleteData.append('editorID', this.state.editorID)
        deleteData.append('urls', this.state.editor_images)

        axios({
            url:urlApiDeleteRemainingImages(),
            method:"post",
            data: deleteData,
            withCredentials: true,
        }).then((response)=>{
            // console.log(response);
        }).catch((e) => {
            console.log(e);
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
                <Confirm
                    open={this.state.confirm_open}
                    cancelButton='No'
                    confirmButton="Yes"
                    onCancel={() => {this.setState({confirm_open: false,})}}
                    onConfirm={this.submitForm.bind(this)}
                />
                <MyNavBar user_data={this.state.user_data} isMobile={this.state.isMobile}/>

                <div className="my-container">
                    <div className='my-container-inner'>
                        <div className="ui secondary vertical large menu left-menu-list">
                            <div>
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
                                <Header size="large" >Report an Issue</Header>
                                <Divider/>
                            </div>

                            <div className="form-content"> {/* index.css */}

                                <Header as={'h3'} style={{marginBottom:"5px"}}>For Project:</Header>
                                <div>
                                    <Dropdown id="team-select"
                                          placeholder='Project'
                                          search selection
                                          options={this.state.projectsList}
                                          defaultValue = {this.getProject()}
                                          onChange={(event, data) =>{
                                              this.setState({for_project: data.value });
                                          }}/>
                                </div>

                                <Header as={'h3'} style={{marginBottom:"5px"}}>Subject:</Header>
                                <Input
                                    fluid
                                    id='issue-subject'
                                    placeholder="Subject"
                                    maxLength={100}
                                    onChange={this.onSubjectChange.bind(this)}
                                    />
                                <div className="form-input-meta-data"> {/* index.css */}
                                    <p>Characters left: {this.state.charsTitle} </p>
                                </div>


                                <Header as={'h3'} style={{marginBottom:"5px"}}>Description:</Header>
                                <div className="form-editor-input"> {/* form.css */}
                                    <Editor
                                        apiKey="0blvqqisiocr0gaootpb271thzo2qqtydxzdyba6ya9nihwr"
                                        init={{
                                            plugins:
                                              ' lists link table image codesample emoticons code charmap ' +
                                              ' fullscreen ' +
                                              ' wordcount',
                                            contextmenu:
                                              'bold italic underline strikethrough | ' +
                                              'superscript subscript | ' +
                                              'link',
                                            toolbar1:
                                              'formatselect | ' +
                                              'bold italic underline strikethrough blockquote removeformat | ' +
                                              'alignleft aligncenter alignright alignjustify',
                                            toolbar2:
                                              'undo redo | ' +
                                              'bullist numlist outdent indent | ' +
                                              'link unlink | ' +
                                              'table image codesample charmap | ' +
                                              'fullscreen',
                                            toolbar3:
                                              'fontselect fontsizeselect | emoticons',
                                            relative_urls : false,
                                            menubar: true,
                                            branding: false,
                                            height: 450,
                                            width: '100%',
                                            codesample_languages: [
                                              {text: 'HTML/XML', value: 'markup'},
                                              {text: 'JavaScript', value: 'javascript'},
                                              {text: 'CSS', value: 'css'},
                                              {text: 'PHP', value: 'php'},
                                              {text: 'Ruby', value: 'ruby'},
                                              {text: 'Python', value: 'python'},
                                              {text: 'Java', value: 'java'},
                                              {text: 'C', value: 'c'},
                                              {text: 'C#', value: 'csharp'},
                                              {text: 'C++', value: 'cpp'},
                                              {text: 'Dart', value: 'dart'},
                                              {text: 'Go', value: 'go'},
                                          ],
                                            images_upload_handler: (blobInfo, success, failure, progress) => {
                                                const data = new FormData()
                                                data.append('editorID', this.editorID)
                                                data.append('url', blobInfo.blob())
                                                axios({
                                                    url:urlApiImages(),
                                                    method:"post",
                                                    data: data,
                                                    withCredentials: true,
                                                }).then((response) =>{
                                                    console.log(response);

                                                    if (response.status < 200 || response.status >= 300) {
                                                        failure('HTTP Error: ' + response.status);
                                                    } else {
                                                        success(response.data["url"])
                                                    }
                                                }).catch((e) => {
                                                    failure(e);
                                                });
                                            }
                                        }}
                                        disabled={false}
                                        inline={false}
                                        onEditorChange={(content) => {
                                            console.log(content)
                                            const editor_images = Array.from( new DOMParser().parseFromString( content, 'text/html' )
                                                    .querySelectorAll( 'img' ) )
                                                    .map( img => img.getAttribute( 'src' ) )
                                            this.setState({
                                                issue_description: content,
                                                editor_images: editor_images,
                                            })
                                        }}
                                            />
                                </div>

                                <Header as={'h3'} style={{marginBottom:"5px"}}>Tags:</Header>
                                <div>
                                    <Dropdown
                                          id="tags-select"
                                          multiple
                                          placeholder='Tags'
                                          search selection
                                          options={this.state.tagsList}
                                          onChange={(event, data) =>{
                                              this.setState({tags_selected: data.value });
                                          }}/>
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

                                <div className="form-submit-button">
                                    <Button
                                        floated="left"
                                        secondary
                                        disabled={this.state.submit_loading}
                                        loading={this.state.submit_loading}
                                        onClick={() => {this.setState({ confirm_open: true })}}>
                                        Submit
                                    </Button>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AddIssue;