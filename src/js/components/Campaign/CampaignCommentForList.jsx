import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import TruncateMarkup from 'react-truncate-markup';
import { withStyles } from '@material-ui/core/styles';
import { AccountCircle } from '@material-ui/icons';
import anonymous from '../../../img/global/icons/avatar-generic.png';
import CampaignSupporterStore from '../../stores/CampaignSupporterStore';
import { isCordova } from '../../utils/cordovaUtils';
import LazyImage from '../../utils/LazyImage';
import { renderLog } from '../../utils/logging';
import { timeFromDate } from '../../utils/dateFormat';

class CampaignCommentForList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      campaignXSupporter: {},
    };
  }

  componentDidMount () {
    // console.log('CampaignCommentForList componentDidMount');
    this.campaignSupporterStoreListener = CampaignSupporterStore.addListener(this.onCampaignSupporterStoreChange.bind(this));
    const { campaignXSupporterId } = this.props;
    const campaignXSupporter = CampaignSupporterStore.getCampaignXSupporterById(campaignXSupporterId);
    // console.log('componentDidMount campaignXSupporter:', campaignXSupporter);
    this.setState({
      campaignXSupporter,
    });
  }

  componentWillUnmount () {
    this.campaignSupporterStoreListener.remove();
  }

  onCampaignSupporterStoreChange () {
    const { campaignXSupporterId } = this.props;
    const campaignXSupporter = CampaignSupporterStore.getCampaignXSupporterById(campaignXSupporterId);
    // console.log('onCampaignSupporterStoreChange campaignXSupporter:', campaignXSupporter);
    this.setState({
      campaignXSupporter,
    });
  }

  render () {
    renderLog('CampaignCommentForList');  // Set LOG_RENDER_EVENTS to log all renders
    if (isCordova()) {
      console.log(`CampaignCommentForList window.location.href: ${window.location.href}`);
    }
    const { classes } = this.props;
    const { campaignXSupporter } = this.state;
    if (!campaignXSupporter || !('id' in campaignXSupporter)) {
      return null;
    }
    const {
      date_supported: dateSupported,
      id,
      supporter_endorsement: supporterEndorsement,
      supporter_name: supporterName,
      we_vote_hosted_profile_image_url_tiny: voterPhotoUrlTiny,
    } = campaignXSupporter;
    return (
      <Wrapper cordova={isCordova()}>
        <OneCampaignOuterWrapper>
          <OneCampaignInnerWrapper>
            <CommentWrapper className="comment" key={id}>
              <CommentVoterPhotoWrapper>
                {voterPhotoUrlTiny ? (
                  <LazyImage
                    src={voterPhotoUrlTiny}
                    placeholder={anonymous}
                    className="profile-photo"
                    height={48}
                    width={48}
                    alt="Your Settings"
                  />
                ) : (
                  <AccountCircle classes={{ root: classes.accountCircleRoot }} />
                )}
              </CommentVoterPhotoWrapper>
              <CommentTextWrapper>
                <Comment>
                  <TruncateMarkup lines={4}>
                    <div>
                      {supporterEndorsement}
                    </div>
                  </TruncateMarkup>
                </Comment>
                <CommentNameWrapper>
                  <CommentName>
                    {supporterName}
                  </CommentName>
                  {' '}
                  supported
                  {' '}
                  {timeFromDate(dateSupported)}
                </CommentNameWrapper>
              </CommentTextWrapper>
            </CommentWrapper>
          </OneCampaignInnerWrapper>
        </OneCampaignOuterWrapper>
      </Wrapper>
    );
  }
}
CampaignCommentForList.propTypes = {
  campaignXSupporterId: PropTypes.number,
  classes: PropTypes.object,
};

const styles = (theme) => ({
  accountCircleRoot: {
    color: '#999',
    height: 48,
    marginRight: 8,
    width: 48,
  },
  buttonRoot: {
    width: 250,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
});

const Comment = styled.div`
  font-size: 18px;
  margin: 0;
`;

const CommentName = styled.span`
  color: #808080;
  font-weight: 500 !important;
`;

const CommentNameWrapper = styled.div`
  color: #999;
  font-size: 12px;
`;

const CommentTextWrapper = styled.div`
  margin-top: 5px;
`;

const CommentVoterPhotoWrapper = styled.div`
`;

const CommentWrapper = styled.div`
  border-radius: 10px;
  border-top-left-radius: 0;
  display: flex;
  justify-content: flex-start;
  margin: 8px 0;
  width: 100%;
`;

const OneCampaignInnerWrapper = styled.div`
  margin: 15px 0;
  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    display: flex;
    justify-content: space-between;
    margin: 15px;
  }
`;

const OneCampaignOuterWrapper = styled.div`
  border-top: 1px solid #ddd;
  margin-top: 15px;
  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    border: 1px solid #ddd;
    border-radius: 5px;
  }
`;

const Wrapper = styled.div`
`;

export default withStyles(styles)(CampaignCommentForList);