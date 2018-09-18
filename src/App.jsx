//@flow
import * as React from 'react';

type Error = 'UNKNOWN' | 'MAX_FILE_SIZE';

type Props = {
    uploadScript?: string,
    triggerBtnClassName?: string,
    triggerBtnLabel?: string,
    acceptedFileFormats?: string,
    filesClassName?: string,
    isUploadingMessage?: string,
    isUploadingClassName?: string,
    doneUploadingMessage?: string,
    doneUploadingClassName?: string,
    failUploadingClassName?: string,
    failUploadingMessage?: {
        [key: Error]: string,
    },
    inputHiddenName?: string,
};

type State = {
    file: ?File,
    uploading: 'IDLE' | 'IN-PROGRESS' | 'DONE' | 'FAIL',
    errorCode: ?Error,
    urlToFile: ?string,
};

class App extends React.PureComponent<Props, State> {
    fileEl: ?HTMLInputElement = null;

    state = {
        file: null,
        uploading: 'IDLE',
        errorCode: null,
        urlToFile: null,
    };

    render() {
        if (!this.props.uploadScript) return null;

        return (
            <React.Fragment>
                {this.renderFileInput()} {this.renderButton()}{' '}
                {this.renderFileList()}
                {this.props.inputHiddenName &&
                    this.state.uploading === 'DONE' && (
                        <input
                            type="hidden"
                            name={this.props.inputHiddenName}
                            value={this.state.urlToFile}
                        />
                    )}
            </React.Fragment>
        );
    }

    renderFileInput() {
        if (this.state.file) return null;

        return (
            <input
                type="file"
                style={{ display: 'none' }}
                ref={el => {
                    if (el) {
                        this.fileEl = el;
                    }
                }}
                accept={this.props.acceptedFileFormats}
                onChange={this.handleFileChange}
            />
        );
    }

    renderButton() {
        if (this.state.file) return null;

        return (
            <button
                onClick={this.handleTriggerClick}
                className={this.props.triggerBtnClassName}
            >
                {this.props.triggerBtnLabel}
            </button>
        );
    }

    renderFileList() {
        const { file, uploading, errorCode } = this.state;
        let uploadingClassName;
        let message;

        if (!file) return null;

        if (uploading === 'IN-PROGRESS') {
            uploadingClassName = this.props.isUploadingClassName;
            message = this.props.isUploadingMessage;
        }

        if (uploading === 'DONE') {
            uploadingClassName = this.props.doneUploadingClassName;
            message = this.props.doneUploadingMessage;
        }

        if (uploading === 'FAIL') {
            uploadingClassName = this.props.failUploadingClassName;

            if (
                this.props.failUploadingMessage &&
                this.props.failUploadingMessage.hasOwnProperty(errorCode)
            ) {
                message = (
                    <React.Fragment>
                        {/* $FlowFixMe */}
                        {this.props.failUploadingMessage[errorCode]}
                        <span onClick={this.handleReset}>
                            Erneut versuchen?
                        </span>
                    </React.Fragment>
                );
            }
        }

        return (
            <ul className={this.props.filesClassName}>
                <li className={uploadingClassName}>
                    <div>{file.name}</div>
                    <div>{message}</div>
                </li>
            </ul>
        );
    }

    handleReset = () => {
        this.setState({
            file: null,
            uploading: 'IDLE',
            errorCode: null,
            urlToFile: null,
        });
    };

    handleTriggerClick = () => {
        if (this.fileEl) {
            this.fileEl.click();
        }
    };

    handleFileChange = (e: SyntheticEvent<HTMLInputElement>) => {
        this.setState(
            {
                file: e.currentTarget.files[0],
            },
            () => {
                this.handleUpload();
            }
        );
    };

    handleUpload() {
        const formData = new FormData();

        this.setState({
            uploading: 'IN-PROGRESS',
        });

        if (this.state.file) {
            formData.append('file', this.state.file);
        }

        if (this.props.uploadScript) {
            fetch(this.props.uploadScript, {
                method: 'POST',
                body: formData,
            })
                .then(resp => resp.json())
                .then(data => {
                    console.log(data);
                    if (data.status === 'OK') {
                        this.setState({
                            uploading: 'DONE',
                            urlToFile: data.filename,
                        });
                    } else {
                        this.setState({
                            uploading: 'FAIL',
                            errorCode: 'UNKNOWN',
                        });
                    }
                })
                .catch(e => {
                    console.error(e);

                    this.setState({
                        uploading: 'FAIL',
                        errorCode: 'UNKNOWN',
                    });
                });
        }
    }
}

export default App;
