import axios from 'axios';

class MyUploadAdapter {
    constructor( loader, editorID ) {
        // The file loader instance to use during the upload.
        this.loader = loader;
        this.editorID = editorID;
    }

    // Starts the upload process.
    upload() {
        return this.loader.file.then(file => new Promise((resolve, reject) => {
            const data = new FormData()
            data.append('editorID', this.editorID)
            data.append('url', file)
            axios({
                url:"/images/",
                method:"post",
                data: data,
                withCredentials: true,
            }).then((response) =>{
                console.log(response)
                let resData = response.data
                resData.default = resData.url
                resolve(resData)
            }).catch((e) => {
                reject(e);
            });
        }));
    }

    // Aborts the upload process.
    abort() {
        // Reject the promise returned from the upload() method.
        //server.abortUpload();
    }
}

export default MyUploadAdapter;