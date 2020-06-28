import React, { Component } from 'react';
import axios from 'axios';
import CKEditor from '@ckeditor/ckeditor5-react';
import InlineEditor from '@ckeditor/ckeditor5-build-inline';
import {Header, Icon, Button, Accordion, Popup, Dropdown, Label} from "semantic-ui-react";
import CommentBox from "./commentBox";
import Moment from "react-moment";
import 'moment-timezone';

class PendingIssues extends Component {

    constructor(props) {
        super(props);
        // console.log(this.props)
        let initial_state = this.props; //user_id, projectMembersList (FOR DROPDOWN LIST) , project_id, teamMemberOrAdmin
        let append_state = {
            issueActiveIndex: -1,
            pending_issues: [],
            assign_loading: false,
            resolve_loading: false,
            delete_loading: false,
            assign_to_member: null,
            priority_colors: ["black", "#E30F00", "#FFAA00", "#95C200"] //#9FCC2E
        };
        this.state = {...initial_state, ...append_state};
    }


    componentDidMount() {
        this.getIssuesList();
    }

    assignIssue(issue_id){
        let del = window.confirm("Are you sure?");
        if(!del) return;

        this.setState({
            assign_loading:true,
        });

        if(this.state.assign_to_member === null){

            alert("Please select a team member");
            return;
        }
        let url = "/issues/"+issue_id+"/assign/?assign_to="+this.state.assign_to_member;

        // console.log(this.state.assign_to_member);
        axios({
            url: url,
            method: "get",
            withCredentials: true,

        }).then((response) => {
            this.setState({
                assign_loading: false,
            });
            window.location.reload();
            console.log(response);
        });
    }

    getIssuesList(){
        let url = "/projects/"+this.state.project_id+"/issues/";
        // alert("ho");
        axios({
            method: "get",
            url: url,
            withCredentials: true
        }).then(
            (response) => {
                // console.log(response.data);

                let list = response.data;
                let pending = [];
                for(let iss in list){
                    if(!list[iss]["resolved"]){
                        pending.push(list[iss]);
                    }
                }

                this.setState({
                    pending_issues: pending,
                });
            }
        );
    }

    handleIssueOpen = (e, titleProps) => {
        const { index } = titleProps;
        const newIndex = (this.state.issueActiveIndex === index) ? -1 : index;
        this.setState({ issueActiveIndex: newIndex, assign_to_member: null });
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
            if(response["status"]===204 || response["status"]===200){
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

        if(task==="resolve"){
            this.setState({
                resolve_loading: true,
            });
        } else if(task==="reopen"){
            this.setState({
                reopen_loading: true,
            });
        }

        let url = "/issues/"+issue_id+"/resolve-or-reopen/";
        // let user = this.state.user_id;
        axios({
            url:url,
            method: "get",
            withCredentials: true,

        }).then((response)=>{
            console.log(response);
            if(response["status"]===200){
                this.setState({
                    resolve_loading: false, reopen_loading: false,
                });
                document.getElementById(view_id).remove();
                window.location.reload();
            }
        });
    }

    render() {
        return (
                <div id="my-current-issues-list" style={{marginTop:"30px", width:"100%"}}>
                    <div className="ui big header">Pending Issues</div>
                    <div  className="issues-list-card">
                        <Accordion styled fluid id="pending-issues-accordion" >
                            {this.state.pending_issues.map((issue, index) => {
                                return (
                                    <div key={index} id={"my-issue-pending-" + index}>
                                        <Accordion.Title
                                            // style={{background:"#FCF5C7"}}
                                            // style={{background:this.state.priority_colors[issue["priority"]]}}
                                            active={this.state.issueActiveIndex === index}
                                            index={index}
                                            onClick={this.handleIssueOpen}
                                        >
                                            <div style={{
                                                height: "fit-content",
                                                padding: "0px",
                                                display: "flex",
                                                flexDirection: "row",
                                                justifyContent: "space-between"
                                            }}>
                                                <div style={{display:"flex", flexDirection:"row", alignItems:"center"}}>
                                                    <div>
                                                        <Header
                                                            style={{color: this.state.priority_colors[issue["priority"]]}}
                                                            as="h5">
                                                                {issue["subject"]}
                                                        </Header>
                                                    </div>
                                                    <div style={{display:"flex", flexDirection:"row", alignItems:"center", marginLeft:"15px", height: "1.5em"}}>
                                                        {issue["tags"].map((tag, index) => {
                                                           return( <Label key={index} className="tag-label">{tag["name"]}</Label> );
                                                        } )}
                                                        {/*<Label color={"brown"} tag>Compatibility</Label>*/}
                                                    </div>
                                                </div>
                                                <div style={{display: "flex", flexDirection: "row"}}>
                                                    <Moment date={issue["created_at"]} format={"LLL"}/>
                                                    <div>{((this.state.issueActiveIndex === index) &&
                                                        <Icon name='angle up'/>)
                                                    || <Icon name='angle down'/>}</div>
                                                </div>
                                            </div>
                                        </Accordion.Title>

                                        <Accordion.Content active={this.state.issueActiveIndex === index}>
                                            <div style={{display: "flex", flexDirection: "column"}}>

                                                <CKEditor
                                                    editor={InlineEditor}
                                                    data={issue["description"]}
                                                    disabled={true}
                                                />

                                                <div style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    justifyContent: "space-between",
                                                    marginTop: "20px",
                                                    marginBottom: "20px"
                                                }}>
                                                    <div className="my-horizontal-div">
                                                        <div><strong>Reported by:</strong> {issue["reported_by"]["full_name"]}</div>
                                                        <div style={{marginLeft:"10px"}}><strong>Assigned to:</strong> {issue["assigned_to"] === null ? " ¯\\_(ツ)_/¯ " : issue["assigned_to"]["full_name"]}</div>
                                                    </div>


                                                    {this.state.teamMemberOrAdmin && <div>

                                                        <Popup
                                                            wide="very"
                                                            position='bottom center'
                                                            on="click"
                                                            trigger={<Button color="yellow" size="small">Assign</Button>}
                                                        >
                                                            <Popup.Header>
                                                                Select Team Member:
                                                            </Popup.Header>
                                                            <Popup.Content>
                                                                <Dropdown id="assign-to_member"
                                                                  placeholder='Member'
                                                                  fluid search selection
                                                                  options={this.state.projectMembersList}
                                                                  onChange={(event, data) =>{
                                                                      console.log(data.value);
                                                                      this.setState({assign_to_member: data.value });
                                                                  }}/>
                                                                  <Button
                                                                      floated="left"
                                                                      size={"small"}
                                                                      disabled={this.state.assign_loading}
                                                                      loading={this.state.assign_loading}
                                                                      style={{marginTop:"20px"}}
                                                                      onClick={() => {this.assignIssue(issue["id"])}}
                                                                      secondary>
                                                                      Assign
                                                                  </Button>

                                                            </Popup.Content>
                                                        </Popup>


                                                        <Button
                                                            positive
                                                            size="small"
                                                            disabled={this.state.resolve_loading}
                                                            loading={this.state.resolve_loading}
                                                            onClick={() => {
                                                                this.handleResolveReopen(issue["id"], "my-issue-pending-" + index, "resolve")
                                                            }}>
                                                            Resolve
                                                        </Button>

                                                        <Button
                                                            negative
                                                            size="small"
                                                            disabled={this.state.delete_loading}
                                                            loading={this.state.delete_loading}
                                                            onClick={() => {
                                                                this.handleIssueDelete(issue["id"], "my-issue-pending-" + index)
                                                            }}>
                                                            Delete
                                                        </Button>
                                                    </div>}


                                                </div>

                                                {this.state.issueActiveIndex === index && <CommentBox issue_id={issue["id"]}
                                                                                                      user_id={this.state.user_id}
                                                                                                      project_id={this.state.project_id}/>}

                                            </div>
                                        </Accordion.Content>
                                    </div>

                                )
                            })}
                        </Accordion>
                        </div>
                </div>

                       );
    }
}

export default PendingIssues;