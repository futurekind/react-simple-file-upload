//@flow
import * as React from 'react';

type Props = {
    triggerBtnClassName?: string,
    triggerBtnLabel?: string,
    acceptedFileFormats?: string,
};

class App extends React.PureComponent<Props> {
    fileEl: ?HTMLInputElement = null;

    render() {
        return (
            <React.Fragment>
                <input
                    type="file"
                    style={{ display: 'none' }}
                    ref={el => {
                        if (el) {
                            this.fileEl = el;
                        }
                    }}
                    accept={this.props.acceptedFileFormats}
                />
                <button
                    onClick={this.handleTriggerClick}
                    className={this.props.triggerBtnClassName}
                >
                    {this.props.triggerBtnLabel}
                </button>
            </React.Fragment>
        );
    }

    handleTriggerClick = () => {
        if (this.fileEl) {
            this.fileEl.click();
        }
    };
}

export default App;
