import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { TextField, FormControl } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import CampaignStartActions from '../../actions/CampaignStartActions';
import CampaignStartStore from '../../stores/CampaignStartStore';
import { renderLog } from '../../utils/logging';

class CampaignDescriptionInputField extends Component {
  constructor (props) {
    super(props);
    this.state = {
      campaignDescription: '',
    };

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.updateCampaignDescription = this.updateCampaignDescription.bind(this);
  }

  componentDidMount () {
    // console.log('CampaignDescriptionInputField, componentDidMount');
    this.campaignStartStoreListener = CampaignStartStore.addListener(this.onCampaignStartStoreChange.bind(this));
    const campaignDescription = CampaignStartStore.getCampaignDescription();
    this.setState({
      campaignDescription,
    });
  }

  componentWillUnmount () {
    this.campaignStartStoreListener.remove();
  }

  handleKeyPress () {
    //
  }

  onCampaignStartStoreChange () {
    const campaignDescription = CampaignStartStore.getCampaignDescription();
    const campaignDescriptionQueuedToSave = CampaignStartStore.getCampaignDescriptionQueuedToSave();
    const campaignDescriptionAdjusted = campaignDescriptionQueuedToSave || campaignDescription;
    // console.log('onCampaignStartStoreChange campaignDescription: ', campaignDescription, ', campaignDescriptionQueuedToSave: ', campaignDescriptionQueuedToSave, ', campaignDescriptionAdjusted:', campaignDescriptionAdjusted);
    this.setState({
      campaignDescription: campaignDescriptionAdjusted,
    });
  }

  updateCampaignDescription (event) {
    if (event.target.name === 'campaignDescription') {
      CampaignStartActions.campaignDescriptionQueuedToSave(event.target.value);
      this.setState({
        campaignDescription: event.target.value,
      });
    }
  }

  render () {
    renderLog('CampaignDescriptionInputField');  // Set LOG_RENDER_EVENTS to log all renders

    const { classes, externalUniqueId } = this.props;
    const { campaignDescription } = this.state;

    return (
      <div className="">
        <form onSubmit={(e) => { e.preventDefault(); }}>
          <Wrapper>
            <ColumnFullWidth>
              <FormControl classes={{ root: classes.formControl }}>
                <TextField
                  // classes={{ root: classes.textField }} // Not working yet
                  id={`campaignDescriptionTextArea-${externalUniqueId}`}
                  name="campaignDescription"
                  margin="dense"
                  multiline
                  rows={5}
                  variant="outlined"
                  // placeholder="What will the candidate(s) accomplish?"
                  value={campaignDescription}
                  onKeyDown={this.handleKeyPress}
                  onChange={this.updateCampaignDescription}
                />
              </FormControl>
            </ColumnFullWidth>
          </Wrapper>
        </form>
      </div>
    );
  }
}
CampaignDescriptionInputField.propTypes = {
  classes: PropTypes.object,
  externalUniqueId: PropTypes.string,
};

const styles = () => ({
  formControl: {
    width: '100%',
  },
  // TODO: Figure out how to apply to TextField
  textField: {
    fontSize: '22px',
  },
});

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

export default withStyles(styles)(CampaignDescriptionInputField);
