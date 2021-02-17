import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import CampaignStartActions from '../actions/CampaignStartActions';
import CampaignStartSteps from '../components/Navigation/CampaignStartSteps';
import CampaignStartStore from '../stores/CampaignStartStore';
import CampaignTitleInputField from '../components/CampaignStart/CampaignTitleInputField';
import { historyPush, isCordova } from '../utils/cordovaUtils';
import MainFooter from '../components/Navigation/MainFooter';
import MainHeaderBar from '../components/Navigation/MainHeaderBar';
import { renderLog } from '../utils/logging';


class CampaignStartAddTitle extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    // console.log('CampaignStartAddTitle, componentDidMount');
    import('jquery').then(({ default: jquery }) => {
      window.jQuery = jquery;
      window.$ = jquery;
      CampaignStartActions.campaignRetrieveAsOwner('');
    }).catch((error) => console.error('An error occurred while loading jQuery', error));
  }

  submitCampaignTitle = () => {
    const campaignTitleQueuedToSave = CampaignStartStore.getCampaignTitleQueuedToSave();
    const campaignTitleQueuedToSaveSet = CampaignStartStore.getCampaignTitleQueuedToSaveSet();
    if (campaignTitleQueuedToSaveSet) {
      // console.log('CampaignStartAddTitle, campaignTitleQueuedToSave:', campaignTitleQueuedToSave);
      const campaignWeVoteId = '';
      CampaignStartActions.campaignTitleSave(campaignWeVoteId, campaignTitleQueuedToSave);
      CampaignStartActions.campaignTitleQueuedToSave(undefined);
    }
    historyPush('/who-do-you-want-to-see-elected');
  }

  render () {
    renderLog('CampaignStartAddTitle');  // Set LOG_RENDER_EVENTS to log all renders
    if (isCordova()) {
      console.log(`CampaignStartAddTitle window.location.href: ${window.location.href}`);
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
              <CampaignStartSteps atStepNumber1 />
              <ContentTitle>
                Write your campaign title
              </ContentTitle>
              <ContentIntroductionText>
                This is the first thing people will see about your campaign. Get their attention with a short title that focuses on what the candidate you support will do to improve people&apos;s lives.
              </ContentIntroductionText>
              <CampaignStartSectionWrapper>
                <CampaignStartSection>
                  <CampaignTitleInputField />
                  <DesktopButtonWrapper className="u-show-desktop-tablet">
                    <DesktopButtonPanel>
                      <Button
                        classes={{ root: classes.buttonDesktop }}
                        color="primary"
                        id="saveCampaignTitle"
                        onClick={this.submitCampaignTitle}
                        variant="contained"
                      >
                        Continue
                      </Button>
                    </DesktopButtonPanel>
                  </DesktopButtonWrapper>
                  <AdviceBoxWrapper>
                    <AdviceBox>
                      <AdviceBoxTitle>
                        Keep it short and to the point
                      </AdviceBoxTitle>
                      <AdviceBoxText>
                        Example: &quot;Sam Davis for Oakland School Board&quot;
                      </AdviceBoxText>
                      <AdviceBoxText>
                        Not: &quot;If you want to have your kids be more engaged at school, vote for Sam Davis for Oakland School Board&quot;
                      </AdviceBoxText>
                      <AdviceBoxText>
                        &nbsp;
                      </AdviceBoxText>
                      <AdviceBoxTitle>
                        Focus on the positive change
                      </AdviceBoxTitle>
                      <AdviceBoxText>
                        Example: &quot;&quot;
                      </AdviceBoxText>
                      <AdviceBoxText>
                        Not: &quot;&quot;
                      </AdviceBoxText>
                      <AdviceBoxText>
                        &nbsp;
                      </AdviceBoxText>
                      <AdviceBoxTitle>
                        Communicate urgency
                      </AdviceBoxTitle>
                      <AdviceBoxText>
                        Example: &quot;&quot;
                      </AdviceBoxText>
                      <AdviceBoxText>
                        Not: &quot;&quot;
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
              id="saveCampaignTitleFooter"
              onClick={this.submitCampaignTitle}
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
CampaignStartAddTitle.propTypes = {
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

export default withStyles(styles)(CampaignStartAddTitle);
