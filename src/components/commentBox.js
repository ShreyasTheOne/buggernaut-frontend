import React, { Component } from 'react';
import axios from 'axios';
import {Button, Checkbox, Comment, Divider, Header, Icon, Input} from 'semantic-ui-react';
import Moment from 'react-moment';
import 'moment-timezone';
// import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';

class CommentBox extends Component {
    constructor(props) {
        super(props);
        let initial_state = this.props; //issue_id, user_id, project_id
        let append_state = {comments_list: null, comment_text: null, comment_submit_loading:false, comment_error: false, comments_hide: false, };

        this.commentSocket = new WebSocket("ws://127.0.0.1:8000/ws/projects/"+initial_state["project_id"]+"/comments/");
        this.state = {...initial_state, ...append_state};
    }



    componentDidMount() {
        let url = "/issues/"+this.state.issue_id+"/comments/";
        axios({
            url: url,
            method: "get",
            withCredentials: true
        }).then((response) => {
            let comments = response.data;
            // console.log(comments);
            this.setState({
                comments_list: comments,
            });
            //SUBMIT ON ENTER PRESSED
            let comment_field = document.getElementById("comment-input-"+this.state.issue_id);
            comment_field.addEventListener("keyup",  (e) => {
                // console.log(e.key);
                if(e.key === "Enter"){
                    this.sendComment("comment-input-"+this.state.issue_id);
                }
            });

        });

        this.commentSocket.addEventListener("open", ()=> {
            console.log("Comment connection established!");
        });

        this.commentSocket.onmessage = (e) => {
            let data = JSON.parse(e.data);
            // console.log(data);
            if(data["issue"]["id"] === this.state.issue_id) {
                this.setState({
                    comments_list: [...this.state.comments_list, data],

                });
            }
        }
    }



    updateComment(div_id){
        let value = document.getElementById(div_id).value.trim();
        if(! (value === null || value === "") ){
            this.setState({
                comment_error: false,
                comment_text: value,
            });
        }
    }

    sendComment(div_id){
        let text = this.state.comment_text;
        if(text === null || text === ""){
            console.log("penguin")
            this.setState({
                comment_error: true,
            });
            return;
        }

        this.setState({
            comment_submit_loading: true,
        });

        document.getElementById(div_id).value = "";
        axios({
            url: "/comments/",
            method:"post",
            withCredentials: true,
            data:{
                commented_by: this.state.user_id,
                content: text,
                issue: this.state.issue_id
            }
        }).then((response) => {
            // console.log(response.data);
            this.setState({
                comment_text: null,
                comment_submit_loading: false,
            });
            this.commentSocket.send(JSON.stringify({
                comment_id: response.data["id"]
            }));
        });
    }

    render() {
        if(this.state.comments_list === null) {
            return (<div className="comments-list-card"><Header as={"h3"}>Loading comments...</Header></div>);
        } else if(this.state.comments_list.length === 0) {
            return (
                <div className="comments-list-card">
                    <Header as={"h4"}>No comments yet!</Header>
                     <Input
                        id={"comment-input-"+this.state.issue_id}
                        fluid
                        error={this.state.comment_error}
                        action={
                            <Button
                                secondary
                                content='Send'
                                onClick={() => {
                                    this.sendComment("comment-input-"+this.state.issue_id)
                                }}/>
                        }
                        onChange={() => {this.updateComment("comment-input-"+this.state.issue_id)}}
                        placeholder='Write a comment...' />
                </div>);
        }

        return (
            <div className="comments-list-card">
                <div style={{display: "flex", flexDirection:"row", marginTop:"5px"}}>
                    <Header as='h3' style={{ marginRight:"15px", marginBottom:"0px"}}>Comments</Header>
                    <Checkbox
                        label='Hide'
                        onChange={(e, {checked}) => {
                          this.setState({
                              comments_hide: checked
                          });
                      }}
                    />
                </div>
                    <Divider/>
                <Comment.Group style={{marginBottom:"0px"}} id={"comment-group-" + this.state.issue_id} collapsed={this.state.comments_hide === true}>
                    {
                        this.state.comments_list.map((comment, index) => {
                            return (
                                <div key={index}>
                                    <Comment >
                                      <Comment.Avatar src={comment["commented_by"]["display_picture"]} />
                                      <Comment.Content style={{paddingTop:"0px", paddingLeft:"5px"}}>
                                        <div className="my-horizontal-div">
                                            <Comment.Author>{comment["commented_by"]["full_name"]}</Comment.Author>
                                            <Comment.Metadata>
                                                <Moment fromNow date={comment["created_at"]}/>
                                            </Comment.Metadata>
                                        </div>
                                        <Comment.Text>{comment["content"]}</Comment.Text>
                                      </Comment.Content>

                                    </Comment>
                                </div>
                            );
                        })
                    }
                </Comment.Group>
                <Input
                    id={"comment-input-"+this.state.issue_id}
                    fluid
                    error={this.state.comment_error}
                    action={
                        (this.state.comment_submit_loading && <Button loading secondary/>)
                        || <Button
                            secondary
                            content='Send'
                            disabled={this.state.comment_submit_loading}
                            loading={this.state.comment_submit_loading}
                            onClick={() => {this.sendComment("comment-input-"+this.state.issue_id)}}/>

                    }
                    onChange={() => {
                        this.updateComment("comment-input-"+this.state.issue_id)
                    }}
                    placeholder='Write a comment...' />

            </div>

        );
    }
}

export default CommentBox;