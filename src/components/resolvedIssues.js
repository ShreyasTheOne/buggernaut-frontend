import React, { Component } from 'react';
import axios from 'axios';
import {Header, Icon, Button, Accordion, Label, Loader} from "semantic-ui-react";
import CommentBox from "./commentBox";
import Moment from "react-moment";
import '../styles/issues.css';
import {urlApiIssueDetail, urlApiProjectIssues, urlApiReopenResolveIssue} from "../urls";


class ResolvedIssues extends Component {

    constructor(props) {
        super(props);
        let initial_state = this.props; //user_id, projectMembersList (FOR DROPDOWN LIST) , project_id, teamMemberOrAdmin
        let append_state = {
            issueActiveIndex: -1,
            resolved_issues: null,
            reopen_loading: false,
            delete_loading: false,
        };
        this.state = {...initial_state, ...append_state};

    }

    componentDidMount() {
        this.getIssuesList();
    }

    getIssuesList(){
        let url = urlApiProjectIssues(this.state.project_id);
        axios({
            method: "get",
            url: url,
            withCredentials: true
        }).then(
            (response) => {

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
        ).catch( (e) => {
            alert(e);
        });
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

        let url = urlApiIssueDetail(issue_id);
        axios({
            url:url,
            method: "delete",
            withCredentials: true,
        }).then((response)=>{
            if(response["status"]===204 || response["status"]===200){
                this.setState({
                    delete_loading: false
                });
                window.location.reload()
                // document.getElementById(view_id).remove();
            }
        }).catch( (e) => {
            alert(e);
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

        let url = urlApiReopenResolveIssue(issue_id);
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
        }).catch( (e) => {
            alert(e);
        });
    }


    render() {
         if(this.state.resolved_issues === null){
            return(
               <div id="my-current-issues-list" className="issues-box"> {/* issues.css */}
                    <div className="ui big header">Resolved Issues</div>
                    <div className="my-loader-div"><Loader active inline size="small"/></div>
                </div>
           );
        } else if (this.state.resolved_issues.length === 0){
            return(
                <div id="my-current-issues-list" className="issues-box"> {/* issues.css */}
                    <div className="ui big header">Resolved Issues</div>
                    <p style={{alignSelf:"center", fontSize:"1.1em"}}>No resolved issues <span role="img" aria-label="cowboy hat emoji">🤠</span> </p>
                </div>
            );
        }

        return (
                <div id="my-resolved-issues-list" className="issues-box"> {/* issues.css */}
                    <div className="ui big header" style={{marginTop:"20px"}}>Resolved Issues</div>
                        <div  className="issues-list-card"> {/* issues.css */}
                            <Accordion styled fluid id="resolved-issues-accordion">
                                        {this.state.resolved_issues.map((issue, index) => {
                                            return (
                                                   <div key={index} id={"my-issue-resolved-"+index}>
                                                        <Accordion.Title
                                                            active={this.state.issueActiveIndex === index}
                                                            index={index}
                                                            onClick={this.handleIssueOpen}
                                                        >
                                                            <div className="issue-title-div"> {/* issues.css */}
                                                                <div className="my-horizontal-div">{/* index.css */}
                                                                    <div>
                                                                        <Header as="h5">
                                                                                {issue["subject"]}
                                                                        </Header>
                                                                    </div>
                                                                    <div className="issue-tags-div"> {/* issues.css */}
                                                                        {issue["tags"].map((tag, index) => {
                                                                           return(
                                                                               <Label key={index} className="tag-label">{tag["name"]}</Label> // {/* issues.css */}
                                                                            );
                                                                        } )}
                                                                    </div>
                                                                </div>
                                                                <div className="my-horizontal-div"> {/* index.css */}
                                                                    <Moment className="issue-published-time" date={issue["created_at"]} format={"LLL"}/> {/* issues.css */}
                                                                    <div>{((this.state.issueActiveIndex === index) &&
                                                                        <Icon name='angle up'/>)
                                                                    || <Icon name='angle down'/>}</div>
                                                                </div>
                                                            </div>
                                                        </Accordion.Title>

                                                        <Accordion.Content active={this.state.issueActiveIndex === index}>
                                                          <div className="issue-content-div"> {/* issues.css */}

                                                              <div
                                                                className="issue-description" /* issues.css */
                                                                dangerouslySetInnerHTML={{
                                                                  __html: issue["description"],
                                                                }}
                                                              />

                                                              <div className="issue-meta-data"> {/* issues.css */}
                                                                  <div className="my-horizontal-div">
                                                                      <div className="reported-by-div">{/* issues.css */}
                                                                          <strong>Reported by:</strong>
                                                                          <span className="doer-name">{issue["reported_by"]["full_name"]}</span>{/* issues.css */}
                                                                      </div>
                                                                      <div className="resolved-by-div">{/* issues.css */}
                                                                          <strong>Resolved by:</strong>
                                                                          <span className="doer-name">{issue["resolved_by"]["full_name"]}</span>{/* issues.css */}
                                                                      </div>
                                                                  </div>
                                                                  {this.state.teamMemberOrAdmin &&
                                                                      <div className="issue-buttons-div">
                                                                          <Button
                                                                              className="issue-action-button"
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
                                                                              className="issue-action-button"
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