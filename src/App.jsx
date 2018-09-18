//@flow
import * as React from 'react';

type Props = {
    triggerBtnClassName?: string,
    triggerBtnLabel?: string,
    acceptedFileFormats?: string,
    filesClassName?: string,
    isUploadingMessage?: string,
    isUploadingClassName?: string,
    doneUploadingMessage?: string,
    doneUploadingClassName?: string,
    failUploadingMessage?: string,
    failUploadingClassName?: string,
};

type State = {
    file: ?File,
    isUploading: boolean,
    doneUploading: boolean,
    failUploading: boolean,
};

class App extends React.PureComponent<Props, State> {
    fileEl: ?HTMLInputElement = null;

    state = {
        file: null,
        isUploading: false,
        doneUploading: false,
        failUploading: false,
    };

    render() {
        return (
            <React.Fragment>
                {this.renderFileInput()} {this.renderButton()}{' '}
                {this.renderFileList()}
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
        const { file, isUploading, doneUploading, failUploading } = this.state;
        let uploadingClassName;
        let message;

        if (!file) return null;

        if (isUploading) {
            uploadingClassName = this.props.isUploadingClassName;
            message = this.props.isUploadingMessage;
        }

        if (doneUploading) {
            uploadingClassName = this.props.doneUploadingClassName;
            message = this.props.doneUploadingMessage;
        }

        if (failUploading) {
            uploadingClassName = this.props.failUploadingClassName;
            message = this.props.failUploadingMessage;
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

    handleTriggerClick = () => {
        if (this.fileEl) {
            this.fileEl.click();
        }
    };

    handleFileChange = (e: SyntheticEvent<HTMLInputElement>) => {
        this.setState({
            file: e.currentTarget.files[0],
        });
    };
}

export default App;
