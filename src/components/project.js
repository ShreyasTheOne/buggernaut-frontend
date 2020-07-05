import React, {Component} from 'react';
import axios from "axios";
import {Link} from 'react-router-dom';
import {Divider, Popup, Button, Loader, Dropdown, Icon, Confirm, Segment} from "semantic-ui-react";
import MyNavBar from "./nav";
import CKEditor from '@ckeditor/ckeditor5-react';
import InlineEditor from '@ckeditor/ckeditor5-build-inline';

import PendingIssues from "./pendingIssues";
import ResolvedIssues from "./resolvedIssues";

import '../styles/project.css';
import ForbiddenMessage from "./forbiddenMessage";
import MyUploadAdapter from "../uploadAdapter";

class Project extends Component {

    state = {
        user_id: null,
        project_found: null,
        project_name: null,
        project_wiki: null,
        project_editor_id: null,
        project_id: null,
        project_deployed: false,
        deploy_loading: false,
        deploy_confirm_open: false,
        project_members: [],
        project_members_enrolment_number_list:[],
        project_members_id_list:[],
        project_members_dropdown: [],
        userList: [],
        resolved_issues: null,
        pending_issues: null,
        got_response: false,
        is_admin: false,
        got_user: false,
        wiki_save_loading: false,
        wiki_saved: false,
        wiki_save_failed: false,
        isMobile: (window.innerWidth <= 480),
    }

    onWindowResize(){
        this.setState({ veryMobile: window.innerWidth <= 410 });
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize.bind(this));
    }

    getProjectInfo(){
        const name=  this.props.match.params.slug;
        let url = "/projects/?slug="+name;

        axios({
           url: url,
           method: "get",
           withCredentials: true,
        }).then((response) => {
            let data = response.data;
            if(data.length === 0){
                this.setState({
                    project_found: false
                });
            } else{
                let members = response.data[0]["members"];
                let mem_nums = [], mem_ids=[];
                let mems = [];
                let arr = [];
                for( let mem in members){
                    mems.push(members[mem]);
                    mem_ids.push(members[mem]["id"]);
                    mem_nums.push(members[mem]["enrolment_number"]);

                    let dict = {};
                    dict["key"] = mem;
                    dict["value"] = members[mem]["id"];
                    dict["text"] = members[mem]["full_name"];
                    arr.push(dict);
                }

                this.setState({
                    project_members_dropdown: arr,
                    project_members: mems,
                    project_members_enrolment_number_list: mem_nums,
                    project_members_id_list: mem_ids,
                    project_found: true,
                    project_editor_id: data[0]["editorID"],
                    project_deployed: data[0]["deployed"],
                    project_name: data[0]["title"],
                    project_wiki: data[0]["wiki"],
                    project_id: data[0]["id"],
                    got_response: true
                });
            }

            // console.log(this.state)
        }).catch( (e) => {
            alert(e);
        });
    }

    componentDidMount() {
        window.addEventListener('resize', this.onWindowResize.bind(this));
        this.getProjectInfo();

        axios({
            url: "/users/test/",
            method: "get",
            withCredentials: true,

         }).then((response) => {
             this.setState({
                 is_admin: response.data["is_superuser"] ,
                 user_id: response.data["pk"],
                 got_user: true,
            });
         });

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
        ).catch( (e) => {
            alert(e);
        });

    }

    updateWiki(data, id){
        if(data==="" || data === null){
            alert("Wiki cannot be blank.");
            return;
        }

        let url = "/projects/"+id+"/";
        this.setState({
            wiki_save_loading: true,
            wiki_saved: false,
            wiki_save_failed: false
        });
        axios({
            url:url,
            method:"patch",
            withCredentials: true,
            data:{
                wiki: data,
            }
        }).then((response) => {
            if(response["status"] === 200){
                this.setState({
                    wiki_save_loading: false,
                    wiki_saved: true,
                });
            } else{
                this.setState({
                    wiki_save_failed: true,
                    wiki_save_loading: false,
                });
            }
        }).catch( (e) => {
            alert(e);
        });

        const deleteData = new FormData();
        deleteData.append('editorID', this.state.project_editor_id )
        deleteData.append('urls', this.state.editor_images)

        axios({
            url:"/images/deleteRem/",
            method:"post",
            data: deleteData,
            withCredentials: true,
        }).then((response)=>{
            // console.log("DELETE DATA")
            // console.log(response);
        }).catch((e) => {
            console.log(e);
        });    }

    updateTeamMembers(){
        let members = this.state.project_members_id_list;
        if (members.length === 0) {
            alert("Team cannot be empty.");
            return;
        }

        let url = "/projects/"+this.state.project_id+"/update-team/";
        this.setState({
            wiki_save_loading: true,
            wiki_saved: false,
            wiki_save_failed: false
        });
        axios({
            url:url,
            method:"patch",
            withCredentials: true,
            data:{
                members: members
            }
        }).then((response) => {
            if(response["status"] === 200){
                window.location.reload();
            } else{
                this.setState({
                    wiki_save_failed: true,
                    wiki_save_loading: false,
                });
                alert("Team update failed, sorry.");
            }
        }).catch( (e) => {
            alert(e);
        });

    }

    getCookie(cname) {
      let name = cname + "=";
      let decodedCookie = decodeURIComponent(document.cookie);
      let ca = decodedCookie.split(';');
      for(var i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    }

    isTeamMemberOrAdmin(){
        let enrolment_number = this.getCookie("enrolment_number");
        let members = this.state.project_members_enrolment_number_list;

        if(this.state.is_admin) return true;

        for(let elem in members){
            if(members[elem] === enrolment_number){
                return true;
            }
        }
        return false;
    }

    deploy(){
        this.setState({
            deploy_loading: true,
            deploy_confirm_open: false,
        });

        let url = "/projects/"+this.state.project_id+"/deploy/"
        axios({
            url: url,
            method: "get",
            withCredentials: true,
        }).then((response) => {
            let status = response.data["Status"];
            this.setState({
                deploy_loading: false,
            });
            if(status === "Not authenticated."){
                alert("You must be a team member or an admin to deploy the app.")
            } else if(status === "All issues are not resolved for this project"){
                alert("Please resolve all pending issues before deploying the project");
            } else if(status === "Project successfully deployed"){
                this.setState({
                    project_deployed: true,
                });
            }
        }).catch( (e) => {
            alert(e);
        } );
    }

    render(){
            if(this.state.project_found === null){
                return (
                    <div className="my-loader-div"><Loader active/></div>
                );
            }

            if(this.state.project_found === false){
                return(
                    <ForbiddenMessage message="project-not-found"/>
                );
            }

            return (
                <div className="my-page">
                    <Confirm
                        open={this.state.deploy_confirm_open}
                        cancelButton="Not really..."
                        confirmButton="Oh yeah!"
                        content="Are you sure the app is ready to be deployed?"
                        onCancel={() => {this.setState({deploy_confirm_open: false,})}}
                        onConfirm={this.deploy.bind(this)}
                    />
                    <MyNavBar/>

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

                            <div className="my-content">{/* index.css */}
                                <div style={{marginTop: "20px"}}>
                                    <div className="page-header-container">{/* project.css */}
                                      <div className="page-header-large">{/* project.css */}
                                          <div className="my-horizontal-div">
                                              <div id="project-title" className="ui large header">{this.state.project_name}</div>

                                                {this.state.project_deployed &&
                                                    <Popup
                                                        content="Project has been deployed"
                                                        size={"small"}
                                                        inverted
                                                        position='bottom center'
                                                        trigger={
                                                            <Icon
                                                                color="green"
                                                                size="large"
                                                                style={{cursor:"pointer", alignSelf:"center", marginLeft: "10px"}}
                                                                className="check circle icon"/>}
                                                    />
                                                    }

                                                { this.isTeamMemberOrAdmin() && !this.state.project_deployed &&
                                                    <Popup
                                                        content="Deploy"
                                                        size={"small"}
                                                        inverted
                                                        position='bottom center'
                                                        trigger={
                                                            <Icon
                                                                loading={this.state.deploy_loading}
                                                                color="blue"
                                                                onClick = {() => {this.setState({deploy_confirm_open: true})}}
                                                                size="large"
                                                                style={{cursor:"pointer", alignSelf:"center", marginLeft: "10px"}}
                                                                className="paper plane outline icon"/>}
                                                    />
                                                    }
                                          </div>
                                      </div>

                                        <Link to={{pathname: "/report", state:{project_id: this.state.project_id}}}>
                                            <Button id="report-bug" className="ui inverted violet labeled icon button ">
                                                <i className="fitted bug icon"/>
                                                <p className="my-button-text-size">Report Bug</p>{/* index.css */}
                                            </Button>
                                        </Link>

                                    </div>

                                    <Divider/>
                                </div>

                                <div className="project-wiki-header-line">{/* project.css */}
                                    <div className={"ui header big"} style={{marginBottom:"0px"}}>Project Wiki</div>
                                    { this.isTeamMemberOrAdmin() &&
                                    <div className="my-horizontal-div">{/* index.css */}
                                        {(this.state.wiki_saved && <p style={{margin:"0px"}}>SAVED</p>)
                                            || (this.state.wiki_save_failed && <p style={{margin:"0px"}}>SAVE FAILED :(</p> )}

                                        {(this.state.wiki_saved && <i className="check icon" style={{margin:"0px 10px 0px 2px"}}/>)
                                            ||
                                        (this.state.wiki_save_loading && <div style={{marginLeft:"2px", marginRight:"10px"}}><Loader size="mini" active inline/></div>)}

                                        <Popup
                                            trigger={<i className="pencil icon"/>}
                                            content='Click on wiki to edit'
                                            position='top right'
                                        />
                                    </div>}
                                </div>

                                <div className="project-detail-ckeditor"> {/* project.css */}
                                    <div style={{maxHeight:"500px", overflowY:"auto"}}>
                                        <CKEditor
                                            editor={InlineEditor}
                                            data={this.state.project_wiki}
                                            disabled={!this.isTeamMemberOrAdmin()}
                                            config={{resize_enabled: false}}
                                            onInit={editor=>{
                                                const editorID = this.state.project_editor_id
                                                editor.plugins.get('FileRepository').createUploadAdapter = function(loader){
                                                    return new MyUploadAdapter(loader, editorID);
                                                }
                                            }}
                                            onChange={ ( event, editor ) => {
                                                const data = editor.getData();
                                                const editor_images = Array.from( new DOMParser().parseFromString( editor.getData(), 'text/html' )
                                                        .querySelectorAll( 'img' ) )
                                                        .map( img => img.getAttribute( 'src' ) )
                                                this.setState({
                                                    project_wiki: editor.getData(),
                                                    editor_images: editor_images,
                                                });
                                                this.updateWiki(data, this.state.project_id);
                                            } }
                                           />
                                    </div>
                                </div>

                                {!this.state.isMobile &&
                                <div className="my-horizontal-div">
                                    <div className="team-members"> {/* project.css */}
                                        <div style={{alignSelf:"center"}}><div className={"ui big header"} style={{ marginRight:"10px"}}>Team:</div></div>
                                        <div className="ui items team-members-list"> {/* project.css */}
                                            {this.state.project_members.map((member, index) => {
                                                    return (
                                                            <div
                                                                key={index}
                                                                className={(member["is_superuser"] && "ui large black label member-label")||"ui large blue label member-label"}> {/* project.css */}
                                                                    {member["full_name"]}
                                                            </div>
                                                        )
                                                })
                                            }
                                        </div>
                                    </div>
                                    {this.isTeamMemberOrAdmin() &&
                                        <Popup
                                            wide="very"
                                            position='bottom center'
                                            on="click"
                                            trigger={<i style={{cursor:"pointer", alignSelf:"center", marginLeft: "10px"}} className="pencil icon"/>}
                                        >
                                            <Popup.Header>
                                                Select Team Members:
                                            </Popup.Header>
                                            <Popup.Content>
                                                <Dropdown id="team-select"
                                                  placeholder='Members'
                                                  fluid multiple search selection
                                                  options={this.state.userList}
                                                  defaultValue={this.state.project_members_id_list}
                                                  onChange={(event, data) =>{
                                                      // console.log(data.value);
                                                      this.setState({project_members_id_list: data.value });
                                                  }}/>
                                                {(this.state.wiki_save_loading && <Button secondary loading/>) ||
                                                  <Button floated="left" size={"small"} style={{marginTop:"30px"}} onClick={this.updateTeamMembers.bind(this)} secondary>Submit</Button>}
                                            </Popup.Content>
                                        </Popup>
                                        }
                                </div>}

                                {this.state.isMobile &&
                                    (
                                        <Segment>
                                            <div className="my-horizontal-div">
                                                <div style={{alignSelf:"center"}}><div className={"ui big header"} style={{ marginRight:"10px"}}>Team</div></div>
                                                {this.isTeamMemberOrAdmin() &&
                                                    <Popup
                                                        wide="very"
                                                        position='bottom center'
                                                        on="click"
                                                        trigger={<i style={{cursor:"pointer", alignSelf:"flex-start"}} className="pencil icon"/>}
                                                    >
                                                        <Popup.Header>
                                                            Select Team Members:
                                                        </Popup.Header>
                                                        <Popup.Content>
                                                            <Dropdown id="team-select"
                                                              placeholder='Members'
                                                              fluid multiple search selection
                                                              options={this.state.userList}
                                                              defaultValue={this.state.project_members_id_list}
                                                              onChange={(event, data) =>{
                                                                  // console.log(data.value);
                                                                  this.setState({project_members_id_list: data.value });
                                                              }}/>
                                                            {(this.state.wiki_save_loading && <Button secondary loading/>) ||
                                                              <Button floated="left" size={"small"} style={{marginTop:"30px"}} onClick={this.updateTeamMembers.bind(this)} secondary>Submit</Button>}
                                                        </Popup.Content>
                                                    </Popup>
                                                }
                                            </div>
                                            <div style={{marginTop:"10px"}}>
                                                {this.state.project_members.map((member, index) => {
                                                        return (
                                                                <div
                                                                    key={index}
                                                                    className={(member["is_superuser"] && "ui large black label member-label")||"ui large blue label member-label"}> {/* project.css */}
                                                                        {member["full_name"]}
                                                                </div>
                                                            )
                                                    })
                                                }
                                            </div>
                                        </Segment>
                                    )
                                }


                                {this.state.got_response && this.state.got_user &&
                                    <PendingIssues
                                            teamMemberOrAdmin={this.isTeamMemberOrAdmin()}
                                            project_id={this.state.project_id}
                                            projectMembersList={this.state.project_members_dropdown}
                                            user_id={this.state.user_id}
                                    />
                                }

                                {this.state.got_response && this.state.got_user &&
                                    <ResolvedIssues
                                            teamMemberOrAdmin={this.isTeamMemberOrAdmin()}
                                            project_id={this.state.project_id}
                                            projectMembersList={this.state.project_members_dropdown}
                                            user_id={this.state.user_id}
                                    />
                                }

                            </div>


                        </div>
                    </div>
                </div>
            );
    }
}

export default Project;