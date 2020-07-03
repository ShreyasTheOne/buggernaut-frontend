import React, { Component } from 'react';
import axios from 'axios';
import CKEditor from '@ckeditor/ckeditor5-react';
import InlineEditor from '@ckeditor/ckeditor5-build-inline';
import {Header, Icon, Button, Accordion, Popup, Dropdown, Label, Loader,} from "semantic-ui-react";
import CommentBox from "./commentBox";
import Moment from "react-moment";
import 'moment-timezone';
import '../styles/issues.css';

class PendingIssues extends Component {

    constructor(props) {
        super(props);
        let initial_state = this.props; //user_id, projectMembersList (FOR DROPDOWN LIST) , project_id, teamMemberOrAdmin
        let append_state = {
            issueActiveIndex: -1,
            pending_issues: null,
            assign_loading: false,
            resolve_loading: false,
            delete_loading: false,
            assign_to_member: null,
            // assign_confirm_open: false,
            // delete_confirm_open: false,
            // reopen_resolve_confirm_open: false,
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
            assign_confirm_open: false,
        });

        if(this.state.assign_to_member === null){
            alert("Please select a team member");
            return;
        }
        let url = "/issues/"+issue_id+"/assign/?assign_to="+this.state.assign_to_member;

        axios({
            url: url,
            method: "get",
            withCredentials: true,
        }).then((response) => {
            this.setState({
                assign_loading: false,
            });
            window.location.reload();
        }).catch( (e) => {
            alert(e);
        });
    }

    getIssuesList(){
        let url = "/projects/"+this.state.project_id+"/issues/";

        axios({
            method: "get",
            url: url,
            withCredentials: true
        }).then(
            (response) => {
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
        ).catch( (e) => {
            alert(e);
        });
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
            delete_confirm_open: false,
        });
        let url = "/issues/"+issue_id+"/";
        axios({
            url:url,
            method: "delete",
            withCredentials: true,
        }).then((response)=>{
            if(response["status"]===204 || response["status"]===200){
                this.setState({
                    delete_loading: false
                });
                document.getElementById(view_id).remove();
            }
        }).catch( (e) => {
            alert(e);
        });
    }

    handleResolveReopen(issue_id, view_id, task){
        if(task==="resolve"){
            this.setState({
                resolve_loading: true,
                reopen_resolve_confirm_open: false,
            });
        } else if(task==="reopen"){
            this.setState({
                reopen_loading: true,
                reopen_resolve_confirm_open: false,
            });
        }

        let url = "/issues/"+issue_id+"/resolve-or-reopen/";

        axios({
            url:url,
            method: "get",
            withCredentials: true,
        }).then((response)=>{

            if(response["status"]===200){
                this.setState({
                    resolve_loading: false, reopen_loading: false,
                });
                document.getElementById(view_id).remove();
                window.location.reload();
            }
        }).catch( (e) => {
            alert(e);
        });
    }

    render() {
        if(this.state.pending_issues === null){
            return(
               <div id="my-current-issues-list" className="issues-box"> {/* issues.css */}
                    <div className="ui big header">Pending Issues</div>
                    <div className="my-loader-div"><Loader active inline size="small"/></div>
                </div>
           );
        } else if (this.state.pending_issues.length === 0){
            return(
                <div id="my-current-issues-list" className="issues-box"> {/* issues.css */}
                    <div className="ui big header">Pending Issues</div>
                    <p style={{alignSelf:"center", fontSize:"1.1em"}}>No pending issues <span role="img" aria-label="party hat emoji">🥳</span> </p>
                </div>
            );
        }

        return (
                <div id="my-current-issues-list" className="issues-box"> {/* issues.css */}
                    <div className="ui big header">Pending Issues</div>
                    <div  className="issues-list-card"> {/* issues.css */}
                        <Accordion styled fluid id="pending-issues-accordion" >
                            {this.state.pending_issues.map((issue, index) => {
                                return (
                                    <div key={index} id={"my-issue-pending-" + index}>
                                        <Accordion.Title
                                            active={this.state.issueActiveIndex === index}
                                            index={index}
                                            onClick={this.handleIssueOpen}
                                        >
                                            <div className="issue-title-div">
                                                <div className="my-horizontal-div">
                                                    <div>
                                                        <Header
                                                            style={{color: this.state.priority_colors[issue["priority"]]}}
                                                            as="h5">
                                                                {issue["subject"]}
                                                        </Header>
                                                    </div>
                                                    <div className="issue-tags-div">
                                                        {issue["tags"].map((tag, index) => {
                                                           return( <Label key={index} className="tag-label">{tag["name"]}</Label> );
                                                        } )}
                                                        {/*<Label color={"brown"} tag>Compatibility</Label>*/}
                                                    </div>
                                                </div>
                                                <div className="my-horizontal-div">
                                                    <Moment className="issue-published-time" date={issue["created_at"]} format={"LLL"}/> {/* issues.css */}
                                                    <div>{((this.state.issueActiveIndex === index) &&
                                                        <Icon name='angle up'/>)
                                                    || <Icon name='angle down'/>}</div>
                                                </div>
                                            </div>
                                        </Accordion.Title>

                                        <Accordion.Content active={this.state.issueActiveIndex === index}>
                                            <div className="issue-content-div"> {/* issues.css */}

                                                <CKEditor
                                                    editor={InlineEditor}
                                                    data={issue["description"]}
                                                    disabled={true}
                                                />

                                                <div className="issue-meta-data"> {/* issues.css*/}
                                                    <div className="my-horizontal-div">
                                                        <div className="reported-by-div"> {/* issues.css*/}
                                                            <strong>Reported by:</strong>
                                                            <span className="doer-name">{issue["reported_by"]["full_name"]}</span>{/* issues.css */}
                                                        </div>
                                                        <div className="assigned-to-div">{/* issues.css */}
                                                            <strong>Assigned to:</strong>
                                                            <span className="doer-name">{issue["assigned_to"] === null ? " ¯\\_(ツ)_/¯ " : issue["assigned_to"]["full_name"]}</span>
                                                        </div>
                                                    </div>


                                                    {this.state.teamMemberOrAdmin && <div className="issue-buttons-div">

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
                                                                      className="issue-action-button"
                                                                      floated="left"
                                                                      size={"small"}
                                                                      disabled={this.state.assign_loading}
                                                                      loading={this.state.assign_loading}
                                                                      onClick={() => {this.assignIssue(issue["id"])}}
                                                                      secondary>
                                                                      Assign
                                                                  </Button>

                                                            </Popup.Content>
                                                        </Popup>


                                                        <Button
                                                            className="issue-action-button"
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
                                                            className="issue-action-button"
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