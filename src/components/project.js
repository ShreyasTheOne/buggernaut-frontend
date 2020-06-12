import React, {Component} from 'react';
import axios from "axios";
import {Link} from 'react-router-dom';
import {Divider, Header, Popup, Accordion, Icon, Button, Loader, Dropdown} from "semantic-ui-react";
import MyNavBar from "./nav";
import CKEditor from '@ckeditor/ckeditor5-react';
import InlineEditor from '@ckeditor/ckeditor5-build-inline';

class Project extends Component {

    state = {
        user_id: null,
        currentIssueActiveIndex: -1,
        resolvedIssueActiveIndex: -1,
        project_found: false,
        project_name: null,
        project_wiki: null,
        project_id: null,
        project_members: [],
        project_members_enrolment_number_list:[],
        project_members_id_list:[],
        userList: [],
        resolved_issues: null,
        pending_issues: null,
        got_response: false,
        got_response_2: false,
        wiki_save_loading: false,
        wiki_saved: false,
        wiki_save_failed: false,
        resolve_loading:false,
        reopen_loading:false,
        assign_loading:false,
        delete_loading:false,
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
                let members_list = document.getElementById("team-members-list");
                let mem_nums = [], mem_ids=[], mem_names=[];
                let mems = [];
                for( let mem in members){
                    mems.push(members[mem]);
                    mem_ids.push(members[mem]["id"]);
                    mem_names.push(members[mem]["full_name"])
                    mem_nums.push(members[mem]["enrolment_number"]);
                }


                this.setState({
                    // got_response: true,
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

    getIssuesList(){
        let url = "/projects/"+this.state.project_id+"/issues";
        // alert("ho");
        axios({
            method: "get",
            url: url,
            withCredentials: true
        }).then(
            (response) => {
                // console.log(response.data);

                let list = response.data;
                let resolved = [];
                let pending = [];
                for(let iss in list){
                    if(list[iss]["resolved"]){
                        resolved.push(list[iss]);
                    } else{
                        pending.push(list[iss]);
                    }
                }

                this.setState({
                    resolved_issues: resolved,
                    pending_issues: pending,
                    got_response_2: true,
                });
            }
        );
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

                // console.log(arr);
                this.setState({
                    userList: arr
                })
            }
        );

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.state.got_response && !this.state.got_response_2){
            this.getIssuesList();
        }
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
    handleCurrentIssueOpen = (e, titleProps) => {
        const { index } = titleProps;
        const newIndex = (this.state.currentIssueActiveIndex === index) ? -1 : index;
        this.setState({ currentIssueActiveIndex: newIndex });
    }

    handleResolvedIssueOpen = (e, titleProps) => {
        const { index } = titleProps;
        const newIndex = (this.state.resolvedIssueActiveIndex === index) ? -1 : index;
        this.setState({ resolvedIssueActiveIndex: newIndex });
    }

    handleIssueDelete(issue_id, view_id){
        let del = window.confirm("Are you sure? This cannot be undone");
        if(!del) return;

        this.setState({
            delete_loading:true,
        });
        let url = "/issues/"+issue_id+"/";
        axios({
            url:url,
            method: "delete",
            withCredentials: true,
        }).then((response)=>{
            // console.log(response);
            if(response["status"]==204 || response["status"]==200){
                this.setState({
                    delete_loading: false
                });
                // let parentNode = document.getElementById("")
                document.getElementById(view_id).remove();
            }
        });
    }

    handleResolveReopen(issue_id, view_id, task){
        let del = window.confirm("Are you sure?");
        if(!del) return;

        if(task=="resolve"){
            this.setState({
                resolve_loading:true,
            });
        } else if(task=="reopen"){
            this.setState({
                reopen_loading: true,
            });
        }

        let url = "/issues/"+issue_id+"/resolve-or-reopen/";
        let user = this.state.user_id;
        axios({
            url:url,
            method: "get",
            withCredentials: true,

        }).then((response)=>{
            console.log(response);
            if(response["status"]==200){
                this.setState({
                    resolve_loading: false, reopen_loading: false,
                });
                document.getElementById(view_id).remove();
                window.location.reload();
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
                                      <div className="ui large header">{this.state.project_name}</div>
                                  </div>
                                    <Link to={{pathname: "/report", state: {project_id: this.state.project_id}}}>
                                        <Button id="add-proj" className="ui inverted violet labeled icon button">
                                            <i className="fitted bug icon"></i>
                                            <p className="my-button-text-size">Report Bug</p>
                                        </Button>
                                    </Link>

                                </div>

                                <Divider></Divider>
                            </div>

                                <div style={{display:'flex', width:"60%", flexDirection:"row", justifyContent:"space-between", marginTop: "15px"}}>
                                    <div className={"ui header big"} style={{marginBottom:"0px"}}>Project Wiki</div>
                                    { this.isTeamMemberOrAdmin() &&
                                    <div className="my-horizontal-div">
                                        {(this.state.wiki_saved && <p style={{margin:"0px"}}>SAVED</p>)
                                            || (this.state.wiki_save_failed && <p style={{margin:"0px"}}>SAVE FAILED :(</p> )}

                                        {(this.state.wiki_saved && <i className="check icon" style={{margin:"0px 10px 0px 2px"}}></i>)
                                            ||
                                        (this.state.wiki_save_loading && <div style={{marginLeft:"2px", marginRight:"10px"}}><Loader size="mini" active inline ></Loader></div>)}

                                        <Popup
                                            trigger={<i className="pencil icon"></i>}
                                            content='Click on wiki to edit'
                                            position='top center'
                                        />
                                    </div>}
                                </div>

                                <div style={{width: "60%", border: "1px solid #5f6062", borderRadius: "5px", marginTop:"5px"}}>

                                    <CKEditor
                                        editor={InlineEditor}
                                        data={this.state.project_wiki}
                                        disabled={!this.isTeamMemberOrAdmin()}
                                        config={{resize_enabled: false}}
                                        onInit={ editor => {
                                            // You can store the "editor" and use when it is needed.
                                            // console.log( 'Editor is ready to use!', editor );
                                        } }

                                        onChange={ ( event, editor ) => {
                                            const data = editor.getData();
                                            // console.log(data);
                                            this.updateWiki(data, this.state.project_id);
                                        } }
                                        onBlur={ ( event, editor ) => {
                                            // console.log( 'Blur.', editor );
                                        } }
                                        onFocus={ ( event, editor ) => {
                                            // console.log( 'Focus.', editor );
                                        } }

                                       />


                                </div>

                                <div className="my-horizontal-div">
                                    <div className="team-members" style={{marginTop: "10px", display:"flex", flexDirection: "row", alignContent:"center"}}>
                                        <div style={{alignSelf:"center"}}><div className={"ui big header"} style={{ marginRight:"10px"}}>Team:</div></div>
                                        <div className="ui items" id="team-members-list" style={{marginTop:"0px"}}>
                                            {this.state.project_members.map((member, index) => {
                                                    return (
                                                            <div className={(member["is_superuser"] && "ui large black label")||"ui large blue label"}>{member["full_name"]}</div>
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
                                            trigger={<i style={{cursor:"pointer", alignSelf:"center", marginLeft: "10px"}} className="pencil icon"></i>}
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
                                                {(this.state.wiki_save_loading && <Button secondary loading></Button>) ||
                                                  <Button floated="left" size={"small"} style={{marginTop:"30px"}} onClick={this.updateTeamMembers.bind(this)} secondary>Submit</Button>}
                                            </Popup.Content>
                                        </Popup>
                                        }
                                </div>

                                <div id="my-current-issues-list" style={{marginTop:"30px", width:"80%"}}>
                                    <div className="ui big header">Pending Issues</div>

                                    {
                                        this.state.got_response_2 &&
                                         <Accordion styled fluid id="pending-issues-accordion">
                                                {this.state.pending_issues.map((issue, index) => {
                                                    return (
                                                           <div key={index} id={"my-issue-pending-"+index}>
                                                                <Accordion.Title
                                                                  active={this.state.currentIssueActiveIndex === index}
                                                                  index={index}
                                                                  onClick={this.handleCurrentIssueOpen}
                                                                >
                                                                    <div style={{height:"fit-content", padding:"0px",display:"flex", flexDirection:"row", justifyContent:"space-between"}}>
                                                                        <div style={{maxWidth:"60%", height:"fit-content"}}>
                                                                            {issue["priority"]==1 && <Header as="h5" color="red">{issue["subject"]}</Header>}
                                                                            {issue["priority"]==2 && <Header as="h5" color="yellow">{issue["subject"]}</Header>}
                                                                            {issue["priority"]==3 && <Header as="h5" color="teal">{issue["subject"]}</Header>}
                                                                        </div>
                                                                        <div  style={{display:"flex", flexDirection:"row"}}>
                                                                            {/*<p style={{fontWeight: "lighter", color:"grey", marginRight:"15px"}}>{issue["created_at"]}</p>*/}
                                                                            <div>{ ((this.state.currentIssueActiveIndex === index) && <Icon name='angle up' />)
                                                                                    || <Icon name='angle down'/>}</div>
                                                                        </div>
                                                                    </div>
                                                                </Accordion.Title>

                                                                <Accordion.Content active={this.state.currentIssueActiveIndex === index}>
                                                                  <div style={{display:"flex", flexDirection:"column"}}>

                                                                      {/*<div className="issue-description">{issue["description"]}</div>*/}
                                                                      <CKEditor
                                                                        editor={InlineEditor}
                                                                        data={issue["description"]}
                                                                        disabled={true}
                                                                        onInit={ editor => {} }

                                                                       />

                                                                      <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between", marginTop:"20px"}}>
                                                                          <div><strong>Reported by:</strong> {issue["reported_by"]["full_name"]}</div>
                                                                          {this.isTeamMemberOrAdmin() && <div>
                                                                              <Button color="yellow" size="small">Assign</Button>

                                                                              {(this.state.resolve_loading && <Button positive loading></Button>)||
                                                                              (<Button positive size="small" onClick={() => {this.handleResolveReopen(issue["id"], "my-issue-pending-"+index, "resolve")}}>Resolve</Button>)}

                                                                              {(this.state.delete_loading && <Button negative loading></Button>)||
                                                                              (<Button negative size="small" onClick={() => {this.handleIssueDelete(issue["id"], "my-issue-pending-"+index)}}>Delete</Button>)}
                                                                          </div> }
                                                                      </div>
                                                                  </div>
                                                                </Accordion.Content>
                                                            </div>

                                                    )
                                                })}
                                            </Accordion>
                                    }

                                    <div className="ui big header" style={{marginTop:"20px"}}>Resolved Issues</div>
                                    {
                                        this.state.got_response_2 &&
                                         <Accordion styled fluid id="resolved-issues-accordion">
                                                {this.state.resolved_issues.map((issue, index) => {
                                                    return (
                                                           <div key={index} id={"my-issue-resolved-"+index}>
                                                                <Accordion.Title
                                                                  active={this.state.resolvedIssueActiveIndex === index}
                                                                  index={index}
                                                                  onClick={this.handleResolvedIssueOpen}
                                                                >
                                                                    <div style={{height:"fit-content", padding:"0px",display:"flex", flexDirection:"row", justifyContent:"space-between"}}>
                                                                        <div style={{maxWidth:"60%", height:"fit-content"}}>
                                                                            <Header as="h5" color="green">{issue["subject"]}</Header>
                                                                        </div>
                                                                        <div style={{display:"flex", flexDirection:"row"}}>
                                                                            {/*<p style={{fontWeight: "lighter", color:"grey", marginRight:"15px"}}>{issue["created_at"]}</p>*/}
                                                                            <div>{ ((this.state.resolvedIssueActiveIndex === index) && <Icon name='angle up' />)
                                                                                    || <Icon name='angle down'/>}</div>
                                                                        </div>
                                                                    </div>
                                                                </Accordion.Title>

                                                                <Accordion.Content active={this.state.resolvedIssueActiveIndex === index}>
                                                                  <div style={{display:"flex", flexDirection:"column"}}>

                                                                      <CKEditor
                                                                        editor={InlineEditor}
                                                                        data={issue["description"]}
                                                                        disabled={true}
                                                                        onInit={ editor => {} }

                                                                       />

                                                                      <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between", marginTop:"20px"}}>
                                                                          <div className="my-horizontal-div">
                                                                              <div><strong>Reported by:</strong> {issue["reported_by"]["full_name"]}</div>
                                                                              <div style={{marginLeft:"10px"}}><strong>Resolved by:</strong> {issue["resolved_by"]["full_name"]}</div>
                                                                          </div>
                                                                          {this.isTeamMemberOrAdmin() && <div>
                                                                              <Button color="yellow" size="small">Assign</Button>

                                                                              {(this.state.reopen_loading && <Button positive loading></Button>)||
                                                                              (<Button positive size="small" onClick={() => {this.handleResolveReopen(issue["id"], "my-issue-resolved-"+index, "reopen")}}>Reopen</Button>)}

                                                                              {(this.state.delete_loading && <Button negative loading></Button>)||
                                                                              (<Button negative size="small" onClick={() => {this.handleIssueDelete(issue["id"], "my-issue-resolved-"+index)}}>Delete</Button>)}
                                                                          </div> }
                                                                      </div>
                                                                  </div>
                                                                </Accordion.Content>
                                                            </div>
                                                    )
                                                })}
                                            </Accordion>
                                    }

                                </div>

                            </div>


                        </div>
                    </div>
                </div>
            );
    }
}

export default Project;