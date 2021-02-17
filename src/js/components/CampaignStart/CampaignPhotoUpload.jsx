import React, { Component } from 'react';
import { DropzoneArea } from 'material-ui-dropzone';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import CampaignStartActions from '../../actions/CampaignStartActions';
import CampaignStartStore from '../../stores/CampaignStartStore';
import isMobileScreenSize from '../../utils/isMobileScreenSize';
import { renderLog } from '../../utils/logging';
import CampaignPhoto
  from "../../../img/global/photos/SamDavisFamily2020-800x450.jpg";

class CampaignPhotoUpload extends Component {
  constructor (props) {
    super(props);
    this.state = {
      files: [],
    };

    this.handleDrop = this.handleDrop.bind(this);
  }

  componentDidMount () {
    // console.log('CampaignPhotoUpload, componentDidMount');
    this.campaignStartStoreListener = CampaignStartStore.addListener(this.onCampaignStartStoreChange.bind(this));
    const campaignPhotoLargeUrl = CampaignStartStore.getCampaignPhotoLargeUrl();
    this.setState({
      campaignPhotoLargeUrl,
    });
  }

  componentWillUnmount () {
    this.campaignStartStoreListener.remove();
  }

  handleDrop (files) {
    if (files && files[0]) {
      const fileFromDropzone = files[0];
      if (!fileFromDropzone) return;
      const fileReader = new FileReader();
      fileReader.addEventListener('load', () => {
        const photoFromFileReader = fileReader.result;
        console.log('photoFromFileReader:', photoFromFileReader);
        CampaignStartActions.campaignPhotoQueuedToSave(photoFromFileReader);
      });
      fileReader.readAsDataURL(fileFromDropzone);
    }
  }

  onCampaignStartStoreChange () {
    const campaignPhotoLargeUrl = CampaignStartStore.getCampaignPhotoLargeUrl();
    this.setState({
      campaignPhotoLargeUrl,
    });
  }

  render () {
    renderLog('CampaignPhotoUpload');  // Set LOG_RENDER_EVENTS to log all renders

    const { classes } = this.props;
    const { campaignPhotoLargeUrl } = this.state;
    let dropzoneText = isMobileScreenSize() ? 'Upload photo' : 'Drag photo here (or click to find file)';
    if (campaignPhotoLargeUrl) {
      dropzoneText = isMobileScreenSize() ? 'Upload new photo' : 'Drag new photo here (or click to find file)';
    }
    return (
      <div className="">
        <form onSubmit={(e) => { e.preventDefault(); }}>
          <Wrapper>
            <ColumnFullWidth>
              {campaignPhotoLargeUrl && (
                <CampaignImage src={campaignPhotoLargeUrl} alt="Campaign" />
              )}
              <DropzoneArea
                acceptedFiles={['image/*']}
                classes={{ icon: classes.dropzoneIcon, root: classes.dropzoneRoot }}
                dropzoneText={dropzoneText}
                filesLimit={1}
                initialFiles={campaignPhotoLargeUrl ? [campaignPhotoLargeUrl] : undefined}
                maxFileSize={6000000}
                onChange={this.handleDrop}
              />
            </ColumnFullWidth>
          </Wrapper>
        </form>
      </div>
    );
  }
}
CampaignPhotoUpload.propTypes = {
  classes: PropTypes.object,
};

const styles = (theme) => ({
  dropzoneIcon: {
    color: '#999',
  },
  dropzoneRoot: {
    color: '#999',
    [theme.breakpoints.down('sm')]: {
      minHeight: '160px',
    },
  },
});

const CampaignImage = styled.img`
  width: 100%;
`;

const ColumnFullWidth = styled.div`
  padding: 8px 12px;
  width: 100%;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-left: -12px;
  width: calc(100% + 24px);
`;

export default withStyles(styles)(CampaignPhotoUpload);
