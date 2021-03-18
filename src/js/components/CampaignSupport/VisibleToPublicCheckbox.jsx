import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Checkbox, FormControl, FormControlLabel } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import CampaignSupportActions from '../../actions/CampaignSupportActions';
import CampaignSupportStore from '../../stores/CampaignSupportStore';
import { renderLog } from '../../utils/logging';

class VisibleToPublicCheckbox extends Component {
  constructor (props) {
    super(props);
    this.state = {
      visibleToPublic: true, // Default setting
    };

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.updateVisibleToPublic = this.updateVisibleToPublic.bind(this);
  }

  componentDidMount () {
    // console.log('VisibleToPublicCheckbox, componentDidMount');
    this.onCampaignSupportStoreChange();
    this.campaignSupportStoreListener = CampaignSupportStore.addListener(this.onCampaignSupportStoreChange.bind(this));
  }

  componentDidUpdate (prevProps) {
    // console.log('CampaignDetailsActionSideBox componentDidUpdate');
    const {
      campaignXWeVoteId: campaignXWeVoteIdPrevious,
    } = prevProps;
    const {
      campaignXWeVoteId,
    } = this.props;
    if (campaignXWeVoteId) {
      if (campaignXWeVoteId !== campaignXWeVoteIdPrevious) {
        this.onCampaignSupportStoreChange();
      }
    }
  }

  componentWillUnmount () {
    this.campaignSupportStoreListener.remove();
  }

  handleKeyPress () {
    //
  }

  onCampaignSupportStoreChange () {
    const { campaignXWeVoteId } = this.props;
    let visibleToPublicFromDatabase;
    if (campaignXWeVoteId) {
      const campaignXSupporter = CampaignSupportStore.getCampaignXSupporterVoterEntry(campaignXWeVoteId);
      // console.log('campaignXSupporter:', campaignXSupporter);
      if ('visible_to_public' in campaignXSupporter) {
        ({ visible_to_public: visibleToPublicFromDatabase } = campaignXSupporter);
      }
    }
    const visibleToPublicQueuedToSave = CampaignSupportStore.getVisibleToPublicQueuedToSave();
    const visibleToPublicQueuedToSaveSet = CampaignSupportStore.getVisibleToPublicQueuedToSaveSet();
    // console.log('onCampaignSupportStoreChange visibleToPublicFromDatabase: ', visibleToPublicFromDatabase, ', visibleToPublicQueuedToSave: ', visibleToPublicQueuedToSave);
    if (visibleToPublicQueuedToSaveSet) {
      this.setState({
        visibleToPublic: visibleToPublicQueuedToSave,
      });
    } else if (visibleToPublicFromDatabase !== undefined) {
      this.setState({
        visibleToPublic: visibleToPublicFromDatabase,
      });
    }
  }

  updateVisibleToPublic (event) {
    if (event.target.name === 'visibleToPublic') {
      const visibleToPublic = Boolean(event.target.checked);
      CampaignSupportActions.visibleToPublicQueuedToSave(visibleToPublic);
      this.setState({
        visibleToPublic,
      });
    }
  }

  render () {
    renderLog('VisibleToPublicCheckbox');  // Set LOG_RENDER_EVENTS to log all renders

    const { campaignXWeVoteId, classes, externalUniqueId } = this.props;
    const { visibleToPublic } = this.state;
    return (
      <div className="">
        {!!(campaignXWeVoteId) && (
          <form onSubmit={(e) => { e.preventDefault(); }}>
            <Wrapper>
              <ColumnFullWidth>
                <FormControl classes={{ root: classes.formControl }}>
                  <CheckboxLabel
                    classes={{ label: classes.checkboxLabel }}
                    control={(
                      <Checkbox
                        checked={visibleToPublic}
                        classes={{ root: classes.checkboxRoot }}
                        color="primary"
                        id={`visibleToPublicCheckbox-${externalUniqueId}`}
                        name="visibleToPublic"
                        onChange={this.updateVisibleToPublic}
                        onKeyDown={this.handleKeyPress}
                      />
                    )}
                    label="Display my name and comment with this campaign"
                  />
                </FormControl>
              </ColumnFullWidth>
            </Wrapper>
          </form>
        )}
      </div>
    );
  }
}
VisibleToPublicCheckbox.propTypes = {
  campaignXWeVoteId: PropTypes.string,
  classes: PropTypes.object,
  externalUniqueId: PropTypes.string,
};

const styles = () => ({
  formControl: {
    width: '100%',
  },
  checkboxRoot: {
    paddingTop: 0,
    paddingLeft: '9px',
    paddingBottom: 0,
  },
  checkboxLabel: {
    fontSize: 12,
    marginTop: 2,
  },
});

const CheckboxLabel = styled(FormControlLabel)`
  margin-bottom: 0 !important;
`;

const ColumnFullWidth = styled.div`
  padding: 0 12px;
  width: 100%;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-left: -12px;
  width: calc(100% + 24px);
`;

export default withStyles(styles)(VisibleToPublicCheckbox);