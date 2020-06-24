import React, {Component} from 'react';
import axios from "axios";
import {Link} from 'react-router-dom';
import {Divider, Popup, Button, Loader, Dropdown} from "semantic-ui-react";
import MyNavBar from "./nav";
import CKEditor from '@ckeditor/ckeditor5-react';
import InlineEditor from '@ckeditor/ckeditor5-build-inline';

import PendingIssues from "./pendingIssues";
import ResolvedIssues from "./resolvedIssues";

class Project extends Component {

    state = {
        user_id: null,
        project_found: false,
        project_name: null,
        project_wiki: null,
        project_id: null,
        project_members: [],
        project_members_enrolment_number_list:[],
        project_members_id_list:[],
        project_members_dropdown: [],
        userList: [],
        resolved_issues: null,
        pending_issues: null,
        got_response: false,

        got_user: false,
        wiki_save_loading: false,
        wiki_saved: false,
        wiki_save_failed: false,
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
                let mem_nums = [], mem_ids=[], mem_names=[];
                let mems = [];
                let arr = [];
                for( let mem in members){
                    mems.push(members[mem]);
                    mem_ids.push(members[mem]["id"]);
                    mem_names.push(members[mem]["full_name"])
                    mem_nums.push(members[mem]["enrolment_number"]);

                    let dict = {};
                    dict["key"] = mem;
                    dict["value"] = members[mem]["id"];
                    dict["text"] = members[mem]["full_name"];
                    arr.push(dict);
                }
                // console.log("mems of proj");
                // console.log(arr);
                this.setState({
                    // got_response: true,
                    project_members_dropdown: arr,
                    project_members: mems,
                    project_members_enrolment_number_list: mem_nums,
                    project_members_id_list: mem_ids,
                    project_found: true,
                    project_name: data[0]["title"],
                    project_wiki: data[0]["wiki"],
                    project_id: data[0]["id"],
                    got_response: true
                });
            }

            // console.log(this.state)
        });
    }

    componentDidMount() {
        this.getProjectInfo();

        axios({
            url: "/users/test/",
            method: "get",
            withCredentials: true,

         }).then((response) => {
            // console.log(response.data["pk"]);
             this.setState({
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
                // console.log("pen")
                // console.log(arr)
                // console.log(arr);
                this.setState({
                    userList: arr
                })
            }
        );

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
            // console.log(response)
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
        });
    }

    updateTeamMembers(){
        let members = this.state.project_members_id_list;
        if (members.length === 0) {
            alert("Team cannot be empty.");
            return;
        }
        console.log(members);
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
            // console.log(response)
            if(response["status"] === 200){

                window.location.reload();
            } else{
                this.setState({
                    wiki_save_failed: true,
                    wiki_save_loading: false,
                });
                alert("Team update failed, sorry.");
            }
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

        for(let elem in members){
            if(members[elem] === enrolment_number){
                return true;
            }
        }
        return false;
    }

    render(){
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
                                    <Link to="/dashboard" className="item">
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
                                      <div className="ui large header">{this.state.project_name}</div>
                                  </div>
                                    <Link to={{pathname: "/report", state:{project_id: this.state.project_id}}}>
                                        <Button id="add-proj" className="ui inverted violet labeled icon button">
                                            <i className="fitted bug icon"/>
                                            <p className="my-button-text-size">Report Bug</p>
                                        </Button>
                                    </Link>

                                </div>

                                <Divider/>
                            </div>

                                <div style={{display:'flex', width:"60%", flexDirection:"row", justifyContent:"space-between", marginTop: "15px"}}>
                                    <div className={"ui header big"} style={{marginBottom:"0px"}}>Project Wiki</div>
                                    { this.isTeamMemberOrAdmin() &&
                                    <div className="my-horizontal-div">
                                        {(this.state.wiki_saved && <p style={{margin:"0px"}}>SAVED</p>)
                                            || (this.state.wiki_save_failed && <p style={{margin:"0px"}}>SAVE FAILED :(</p> )}

                                        {(this.state.wiki_saved && <i className="check icon" style={{margin:"0px 10px 0px 2px"}}/>)
                                            ||
                                        (this.state.wiki_save_loading && <div style={{marginLeft:"2px", marginRight:"10px"}}><Loader size="mini" active inline/></div>)}

                                        <Popup
                                            trigger={<i className="pencil icon"/>}
                                            content='Click on wiki to edit'
                                            position='top center'
                                        />
                                    </div>}
                                </div>

                                <div style={{width: "60%", border: "1px solid #5f6062", borderRadius: "5px", marginTop:"5px"}}>
                                    <div style={{maxHeight:"500px", overflowY:"auto"}}>
                                    <CKEditor
                                        editor={InlineEditor}
                                        data={this.state.project_wiki}
                                        disabled={!this.isTeamMemberOrAdmin()}
                                        config={{resize_enabled: false}}
                                        onChange={ ( event, editor ) => {
                                            const data = editor.getData();
                                            this.updateWiki(data, this.state.project_id);
                                        } }
                                       />
                                    </div>

                                </div>

                                <div className="my-horizontal-div">
                                    <div className="team-members" style={{marginTop: "10px", display:"flex", flexDirection: "row", alignContent:"center"}}>
                                        <div style={{alignSelf:"center"}}><div className={"ui big header"} style={{ marginRight:"10px"}}>Team:</div></div>
                                        <div className="ui items" id="team-members-list" style={{marginTop:"0px"}}>
                                            {this.state.project_members.map((member, index) => {
                                                    return (
                                                            <div key={index} className={(member["is_superuser"] && "ui large black label")||"ui large blue label"}>{member["full_name"]}</div>
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
                                </div>

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