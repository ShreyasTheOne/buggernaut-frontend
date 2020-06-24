import React, { Component } from 'react';
import axios from 'axios';
import CKEditor from '@ckeditor/ckeditor5-react';
import InlineEditor from '@ckeditor/ckeditor5-build-inline';
import {Header, Icon, Button, Accordion} from "semantic-ui-react";
import CommentBox from "./commentBox";
import Moment from "react-moment";


class ResolvedIssues extends Component {

    constructor(props) {
        super(props);
        // console.log(this.props)
        let initial_state = this.props; //user_id, projectMembersList (FOR DROPDOWN LIST) , project_id, teamMemberOrAdmin
        let append_state = {
            issueActiveIndex: -1,
            resolved_issues: [],
            reopen_loading: false,
            delete_loading: false,
        };
        this.state = {...initial_state, ...append_state};
        // console.log({...initial_state, ...append_state});

    }

    componentDidMount() {
        this.getIssuesList();
        // this.testSocket.addEventListener("open", () => {
        //     console.log("Connection established!");
        // });
        // this.testSocket.onmessage = (e) => {
        //
        //     const data = JSON.parse(e.data);
        //     console.log(data);
        // };
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
                let resolved = [];
                for(let iss in list){
                    if(list[iss]["resolved"]){
                        resolved.push(list[iss]);
                    }
                }

                this.setState({
                    resolved_issues: resolved,
                });
            }
        );
    }

    handleIssueOpen = (e, titleProps) => {
        const { index } = titleProps;
        const newIndex = (this.state.issueActiveIndex === index) ? -1 : index;
        this.setState({ issueActiveIndex: newIndex });
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
                resolve_loading:true,
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
                <div id="my-resolved-issues-list" style={{marginTop:"30px", width:"80%"}}>
                    <div className="ui big header" style={{marginTop:"20px"}}>Resolved Issues</div>
                        <div  className="issues-list-card">
                            <Accordion styled fluid id="resolved-issues-accordion">
                                        {this.state.resolved_issues.map((issue, index) => {
                                            return (
                                                   <div key={index} id={"my-issue-resolved-"+index}>
                                                        <Accordion.Title
                                                          active={this.state.issueActiveIndex === index}
                                                          index={index}
                                                          onClick={this.handleIssueOpen}
                                                        >
                                                            <div style={{
                                                                height:"fit-content",
                                                                padding:"0px",
                                                                display:"flex",
                                                                flexDirection:"row",
                                                                justifyContent:"space-between"}}>
                                                                <div style={{maxWidth:"60%", height:"fit-content"}}>
                                                                    <Header as="h5" color="green">{issue["subject"]}</Header>
                                                                </div>
                                                                <div style={{display:"flex", flexDirection:"row"}}>
                                                                    <Moment date={issue["created_at"]} format={"LLL"}/>
                                                                    <div>{ ((this.state.issueActiveIndex === index) && <Icon name='angle up' />)
                                                                            || <Icon name='angle down'/>}</div>
                                                                </div>
                                                            </div>
                                                        </Accordion.Title>

                                                        <Accordion.Content active={this.state.issueActiveIndex === index}>
                                                          <div style={{display:"flex", flexDirection:"column"}}>

                                                              <CKEditor
                                                                editor={InlineEditor}
                                                                data={issue["description"]}
                                                                disabled={true}
                                                               />

                                                              <div style={{
                                                                  display:"flex",
                                                                  flexDirection:"row",
                                                                  justifyContent:"space-between",
                                                                  marginTop:"20px",
                                                                  marginBottom: "20px"}}>
                                                                  <div className="my-horizontal-div">
                                                                      <div><strong>Reported by:</strong> {issue["reported_by"]["full_name"]}</div>
                                                                      <div style={{marginLeft:"10px"}}><strong>Resolved by:</strong> {issue["resolved_by"]["full_name"]}</div>
                                                                  </div>
                                                                  {this.state.teamMemberOrAdmin &&
                                                                      <div>
                                                                          <Button
                                                                              positive
                                                                              size="small"
                                                                              disabled={this.state.reopen_loading}
                                                                              loading={this.state.reopen_loading}
                                                                              onClick={() => {
                                                                                  this.handleResolveReopen(issue["id"], "my-issue-resolved-"+index, "reopen")
                                                                              }}>
                                                                              Reopen
                                                                          </Button>

                                                                          <Button
                                                                              negative
                                                                              size="small"
                                                                              disabled={this.state.delete_loading}
                                                                              loading={this.state.delete_loading}
                                                                              onClick={() => {
                                                                                  this.handleIssueDelete(issue["id"], "my-issue-resolved-"+index)
                                                                              }}>
                                                                              Delete
                                                                          </Button>
                                                                      </div>
                                                                  }
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

export default ResolvedIssues;