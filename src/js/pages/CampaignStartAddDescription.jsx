import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import CampaignStartActions from '../actions/CampaignStartActions';
import CampaignStartSteps from '../components/Navigation/CampaignStartSteps';
import CampaignStartStore from '../stores/CampaignStartStore';
import CampaignDescriptionInputField from '../components/CampaignStart/CampaignDescriptionInputField';
import { historyPush, isCordova } from '../utils/cordovaUtils';
import MainFooter from '../components/Navigation/MainFooter';
import MainHeaderBar from '../components/Navigation/MainHeaderBar';
import { renderLog } from '../utils/logging';


class CampaignStartAddDescription extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    // console.log('CampaignStartAddDescription, componentDidMount');
    import('jquery').then(({ default: jquery }) => {
      window.jQuery = jquery;
      window.$ = jquery;
      CampaignStartActions.campaignRetrieveAsOwner('');
    }).catch((error) => console.error('An error occurred while loading jQuery', error));
  }

  submitCampaignDescription = () => {
    const campaignDescriptionQueuedToSave = CampaignStartStore.getCampaignDescriptionQueuedToSave();
    const campaignDescriptionQueuedToSaveSet = CampaignStartStore.getCampaignDescriptionQueuedToSaveSet();
    if (campaignDescriptionQueuedToSaveSet) {
      // console.log('CampaignStartAddDescription, campaignDescriptionQueuedToSave:', campaignDescriptionQueuedToSave);
      const campaignWeVoteId = '';
      CampaignStartActions.campaignDescriptionSave(campaignWeVoteId, campaignDescriptionQueuedToSave);
      CampaignStartActions.campaignDescriptionQueuedToSave(undefined);
    }
    historyPush('/start-a-campaign-add-photo');
  }

  render () {
    renderLog('CampaignStartAddDescription');  // Set LOG_RENDER_EVENTS to log all renders
    if (isCordova()) {
      console.log(`CampaignStartAddDescription window.location.href: ${window.location.href}`);
    }
    const { classes } = this.props;
    const mobileButtonClasses = classes.buttonDefault; // isWebApp() ? classes.buttonDefault : classes.buttonDefaultCordova;
    return (
      <div>
        <Helmet title="Start a Campaign - We Vote Campaigns" />
        <MainHeaderBar />
        <PageWrapper cordova={isCordova()}>
          <OuterWrapper>
            <InnerWrapper>
              <CampaignStartSteps atStepNumber3 />
              <ContentTitle>
                Explain why winning matters
              </ContentTitle>
              <ContentIntroductionText>
                People are more likely to support your campaign if it’s clear why you care. Explain how this candidate winning will impact you, your family, or your community.
              </ContentIntroductionText>
              <CampaignStartSectionWrapper>
                <CampaignStartSection>
                  <CampaignDescriptionInputField />
                  <DesktopButtonWrapper className="u-show-desktop-tablet">
                    <DesktopButtonPanel>
                      <Button
                        classes={{ root: classes.buttonDesktop }}
                        color="primary"
                        id="saveCampaignDescription"
                        onClick={this.submitCampaignDescription}
                        variant="contained"
                      >
                        Continue
                      </Button>
                    </DesktopButtonPanel>
                  </DesktopButtonWrapper>
                  <AdviceBoxWrapper>
                    <AdviceBox>
                      <AdviceBoxTitle>
                        Describe the people who will be affected if this candidate loses
                      </AdviceBoxTitle>
                      <AdviceBoxText>
                        People are most likely to vote when they understand the consequences of this candidate not being elected, described in terms of the people impacted.
                      </AdviceBoxText>
                      <AdviceBoxText>
                        &nbsp;
                      </AdviceBoxText>
                      <AdviceBoxTitle>
                        Describe the benefits of this candidate winning
                      </AdviceBoxTitle>
                      <AdviceBoxText>
                        Explain why this candidate or candidates winning will bring positive change.
                      </AdviceBoxText>
                      <AdviceBoxText>
                        &nbsp;
                      </AdviceBoxText>
                      <AdviceBoxTitle>
                        Make it personal
                      </AdviceBoxTitle>
                      <AdviceBoxText>
                        Readers are more likely to sign and support your campaign if it’s clear why you care.
                      </AdviceBoxText>
                      <AdviceBoxText>
                        &nbsp;
                      </AdviceBoxText>
                      <AdviceBoxTitle>
                        Respect others
                      </AdviceBoxTitle>
                      <AdviceBoxText>
                        Don’t bully, use hate speech, threaten violence or make things up.
                      </AdviceBoxText>
                    </AdviceBox>
                  </AdviceBoxWrapper>
                </CampaignStartSection>
              </CampaignStartSectionWrapper>
            </InnerWrapper>
          </OuterWrapper>
        </PageWrapper>
        <MobileButtonWrapper className="u-show-mobile">
          <MobileButtonPanel>
            <Button
              classes={{ root: mobileButtonClasses }}
              color="primary"
              id="saveCampaignDescriptionFooter"
              onClick={this.submitCampaignDescription}
              variant="contained"
            >
              Continue
            </Button>
          </MobileButtonPanel>
        </MobileButtonWrapper>
        <MainFooter />
      </div>
    );
  }
}
CampaignStartAddDescription.propTypes = {
  classes: PropTypes.object,
};

const styles = () => ({
  buttonDefault: {
    boxShadow: 'none !important',
    fontSize: '18px',
    height: '45px !important',
    padding: '0 12px',
    textTransform: 'none',
    width: '100%',
  },
  buttonDefaultCordova: {
    boxShadow: 'none !important',
    fontSize: '18px',
    height: '35px !important',
    padding: '0 12px',
    textTransform: 'none',
    width: '100%',
  },
  buttonDesktop: {
    boxShadow: 'none !important',
    fontSize: '18px',
    height: '45px !important',
    padding: '0 12px',
    textTransform: 'none',
    width: '100%',
  },
  buttonRoot: {
    width: 250,
  },
});

const AdviceBox = styled.div`
  margin: 25px;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin: 20px;
  }
`;

const AdviceBoxText = styled.div`
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 4px;
`;

const AdviceBoxTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
`;

const AdviceBoxWrapper = styled.div`
  background-color: #f8f8f8;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-top: 20px;
`;

const CampaignStartSection = styled.div`
  margin-bottom: 60px !important;
  max-width: 620px;
  width: 100%;
`;

const CampaignStartSectionWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const ContentIntroductionText = styled.div`
  color: #555;
  font-size: 16px;
  max-width: 620px;
  text-align: left;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 16px;
  }
`;

const ContentTitle = styled.div`
  font-size: 32px;
  font-weight: 600;
  margin: 20px 0 10px 0;
  max-width: 620px;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 24px;
  }
`;

const DesktopButtonPanel = styled.div`
  background-color: #fff;
  padding: 10px 0;
  // width: 100%;
`;

const DesktopButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 30px 0 0 0;
  width: 100%;
`;

const InnerWrapper = styled.div`
`;

const MobileButtonPanel = styled.div`
  background-color: #fff;
  border-top: 1px solid #ddd;
  padding: 10px;
`;

const MobileButtonWrapper = styled.div`
  position: fixed;
  width: 100%;
  bottom: 0;
  display: block;
`;

const OuterWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 15px 0;
`;

const PageWrapper = styled.div`
  margin: 0 auto;
  max-width: 960px;
  @media (max-width: 1005px) {
    // Switch to 15px left/right margin when auto is too small
    margin: 0 15px;
  }
`;

export default withStyles(styles)(CampaignStartAddDescription);
