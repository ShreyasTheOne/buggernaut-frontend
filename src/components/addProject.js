import {Input, Button, Checkbox, Dropdown, Header, Confirm} from 'semantic-ui-react';
import React, { Component } from 'react';
import {Editor} from "@tinymce/tinymce-react";
import axios from 'axios';
import '../styles/form.css';

import {
    urlApiDeleteRemainingImages, urlApiImages,
    urlApiProjects,
    urlApiProjectVerifySlug,
    urlApiUsers,
    urlAppDashboardCurrentProjects,
    urlAppDashboardDeployedProjects
} from "../urls";

// import Cropper from "react-easy-crop";
// import 'react-easy-crop/react-easy-crop.css';

import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import {
    base64StringToFile, downloadBase64File,
    extractImageFileExtensionFromBase64,
    image64toCanvasRef
} from "../imageCropperHelperFunctions";
const imageMaxSize = 20000000 // bytes
const acceptedFileTypes = 'image/png, image/jpg, image/jpeg';
const acceptedFileTypesArray = acceptedFileTypes.split(",").map((item) => {return item.trim()});

class AddProject extends Component {

    constructor(props) {
        super(props);
        this.fileInputRef = React.createRef()
        this.imagePreviewCanvasRef = React.createRef()
        this.state = {
            userList: [],
            editor_images: [],
            project_image: null,
            project_name: "",
            project_wiki: "",
            project_deployed: false,
            project_members: [],
            project_slug: "",
            slug_available: "",
            slug_valid: true,
            imgSrc: null,
            imgSrcExt: null,
            crop: {aspect: 3/2 , unit: "px",},
            submit_loading: false,
            confirm_open: false,
            editorID: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        }
    }

    componentDidMount() {

        axios({
            url: urlApiUsers(),
            method: 'get',
            withCredentials: true
        }).then(
            (response) => {
                let arr = [];
                const ul = response.data;
                for (let user in ul) {
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
        );
    }

    onProjectNameChange() {
        let value = document.getElementById("project-name").value.trim();
        let slug = value.replace(/\s+/g, '-').toLowerCase();
        let validator = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

        if (!validator.test(slug)) {
            this.setState({
                slug_valid: false, project_name: value, project_slug: slug, slug_available: false
            });
            return;
        } else {
            this.setState({
                slug_valid: true,
            });
        }

        if (!(value === "")) {
            let url = urlApiProjectVerifySlug(slug);
            axios({
                method: 'get',
                url: url,
                withCredentials: true,
            }).then(
                (response) => {
                    let status = response.data["status"];
                    if (status === "Available") {
                        this.setState({
                            project_name: value, project_slug: slug, slug_available: true
                        });
                    } else {
                        this.setState({
                            project_name: value, project_slug: slug, slug_available: false
                        });
                    }
                }
            );
        } else {
            this.setState({
                project_name: value, project_slug: slug, slug_available: false
            });
        }

    }

    verifyFile = (files) => {
        if (files && files.length > 0) {
            const currentFile = files[0]
            const currentFileType = currentFile.type
            const currentFileSize = currentFile.size
            if (currentFileSize > imageMaxSize) {
                alert("This file is not allowed. " + currentFileSize + " bytes is too large")
                return false
            }
            if (!acceptedFileTypesArray.includes(currentFileType)) {
                alert("This file is not allowed. Only images are allowed.")
                return false
            }
            return true
        }
    }
    // ------------------------------------------------ REACT IMAGE CROP STARTS ------------------------------------------------------//
    handleImageLoad = (image) => {
        console.log(image)
        this.imageRef = image;
    }
    getCroppedImg(image, crop) {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(
          image,
          crop.x * scaleX,
          crop.y * scaleY,
          crop.width * scaleX,
          crop.height * scaleY,
          0,
          0,
          crop.width,
          crop.height
        );

        return new Promise((resolve, reject) => {
            const imageData64 = canvas.toDataURL('image/' + this.state.imgSrcExt);
            resolve(imageData64);
        });
      }

    async makeClientCrop(crop) {
        if (this.imageRef && crop.width && crop.height) {
          const croppedImageUrl = await this.getCroppedImg(
                this.imageRef,
                crop,
          );
          console.log(croppedImageUrl);
          this.setState({ croppedImageUrl });
        }
      }

    handleOnCrop = (crop) => {
        this.setState({crop: crop});
    }

    handleOnCropComplete = (crop, pixelCrop) => {
       this.makeClientCrop(crop);
    }

    handleUploadImage = (e) => {
        let files = e.target.files;
        if (files && files.length > 0) {
            const isVerified = this.verifyFile(files)
            if (isVerified) {
                // imageBase64Data
                const currentFile = files[0]
                const myFileItemReader = new FileReader()
                myFileItemReader.addEventListener("load", () => {
                    // console.log("myFileItemReader.result")
                    // console.log(myFileItemReader.result)
                    const myResult = myFileItemReader.result

                    this.setState({
                        imgSrc: myResult,
                        imgSrcExt: extractImageFileExtensionFromBase64(myResult),
                        crop: {aspect: 3/2, unit:"px"},
                        croppedImageUrl: null,
                    })
                    // alert(this.state.imgSrc)
                    // alert(this.state.imgSrcExt)
                }, false)
                myFileItemReader.readAsDataURL(currentFile)
            }
        }
    }

    submitForm() {
         this.setState({
            confirm_open: false,
        });

        let projectName = this.state.project_name;
        let projectSlug = this.state.project_slug;
        let projectMembers = this.state.project_members;
        let projectDeployed = this.state.project_deployed;
        let projectWiki = this.state.project_wiki;
        let slugAvailable = this.state.slug_available;
        let slugValid = this.state.slug_valid;
        if(!slugValid){
            alert("The generated slug is invalid.");
            return;
        }

        if(!slugAvailable){
            alert("A project with this slug already exists.");
            return;
        }
        if(projectMembers.length === 0) {
            alert("Team cannot have zero members");
            return;
        }
        if(projectWiki===""){
            alert("Project wiki cannot be blank");
            return;
        }
        if(projectName===""){
            alert("Project name cannot be blank");
            return;
        }

        let projectImage;
        if(this.state.croppedImageUrl === null){
            let del = window.confirm("You have not uploaded an image, and a default image will be set." +
                "\nAre you ready to continue?");
            if(!del){return;}
        } else {
            projectImage = base64StringToFile(this.state.croppedImageUrl, projectName+"."+this.state.imgSrcExt);
        }

        // return;

        let formData = new FormData();
        if(projectImage !== null) formData.append('image', projectImage);
        formData.append('title', projectName);
        formData.append('slug', projectSlug);
        formData.append('wiki', projectWiki);
        formData.append('deployed', projectDeployed);
        formData.append('editorID', this.state.editorID);

        for(let mem in projectMembers){
            formData.append("members", projectMembers[mem]);
        }

         this.setState({
            submit_loading: true,
        });

        axios({
            url: urlApiProjects(),
            method: "post",
            withCredentials: "true",
            data: formData,
        }).then((response) =>{
            this.setState({
                submit_loading: false,
            });
            if(response["status"] === 201){
                window.location = (projectDeployed) ? urlAppDashboardDeployedProjects() : urlAppDashboardCurrentProjects();
            } else{
                alert(response["status"]);
            }
            console.log(response);
        }).catch((e) => {
            alert(e);
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

    render() {
        return (
            <div className="form-content"> {/* index.css */}
                <Confirm
                    open={this.state.confirm_open}
                    cancelButton='No'
                    confirmButton="Yes"
                    onCancel={() => {this.setState({confirm_open: false,})}}
                    onConfirm={this.submitForm.bind(this)}
                />
                <Header as={'h3'} style={{marginBottom:"5px"}}>Project name:</Header>
                <Input
                    error={!this.state.slug_valid}
                    fluid
                    id='project-name'
                    placeholder="Buggernaut"
                    onChange={this.onProjectNameChange.bind(this)}
                    />

                <div className="form-input-meta-data"> {/* form.css */}
                    <p style={{marginRight:"5px"}}>Slug generated:</p>
                    {(!this.state.slug_valid && <p style={{color:"red"}}>{this.state.project_slug} &nbsp;SLUG INVALID!</p> ) || ((this.state.project_slug !== "" && this.state.project_slug != null )  &&
                        (this.state.slug_available && <p style={{color:"green"}}>{this.state.project_slug} &nbsp;SLUG AVAILABLE! :)</p>
                    || <p style={{color:"red"}}>{this.state.project_slug} &nbsp;SLUG UNAVAILABLE :(</p>))}
                </div>



                <Header as={'h3'} style={{marginBottom:"5px"}}>Project wiki:</Header>
                <div className="form-editor-input"> {/* form.css*/}
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
                                project_wiki: content,
                                editor_images: editor_images,
                            })
                        }}
                            />
                </div>


                <Header as={'h3'} style={{marginBottom:"5px"}}>Team Members:</Header>
                <Dropdown id="team-select"
                          placeholder='Members'
                          fluid multiple search selection
                          options={this.state.userList}
                          onChange={(event, data) =>{
                              // console.log(data.value);
                              this.setState({project_members: data.value });
                          }}/>


                <Header style={{marginTop:"25px"}} as={'h3'}>Upload Display Image:</Header>
                <input
                    style={{marginTop:"0px"}}
                    type="file"
                    multiple={false}
                    accept="image/png, image/jpg, image/jpeg"
                    id="image-upload"
                    onChange={this.handleUploadImage}/>

                {this.state.imgSrc !== null &&
                    <div className="image-crop-div">
                        <ReactCrop
                            id="original-image"
                            src={this.state.imgSrc}
                            crop={this.state.crop}
                            onChange={this.handleOnCrop}
                            onImageLoaded={this.handleImageLoad}
                            onComplete={this.handleOnCropComplete}
                            />
                        {this.state.croppedImageUrl &&
                              <img id={"preview-cropped-image"} alt="Crop" style={{ maxWidth: '100%' }} src={this.state.croppedImageUrl} />
                           }
                    </div>
                }

                <Checkbox id="deployed-or-not"
                          label='Project has already been deployed'
                          style={{marginTop:"25px"}}
                          onChange={(e, data) => {
                              this.setState({project_deployed: data.checked });
                          }}/>

                <div className="form-submit-button">
                   <Button
                       floated="left"
                       disabled={this.state.submit_loading}
                       loading={this.state.submit_loading}
                       secondary
                       onClick={() => {this.setState({confirm_open: true})}}>
                       {/*onClick={() => {this.getCroppedImage()}}>*/}
                       Submit
                   </Button>
                </div>

            </div>

        );
    }
}

export default AddProject;