import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import AddCandidateInputField from '../components/CampaignStart/AddPoliticianInputField';
import CampaignStartActions from '../actions/CampaignStartActions';
import CampaignStartSteps from '../components/Navigation/CampaignStartSteps';
import CampaignStartStore from '../stores/CampaignStartStore';
import { historyPush, isCordova } from '../utils/cordovaUtils';
import MainFooter from '../components/Navigation/MainFooter';
import MainHeaderBar from '../components/Navigation/MainHeaderBar';
import { renderLog } from '../utils/logging';


class CampaignStartAddPolitician extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    // console.log('CampaignStartAddPolitician, componentDidMount');
    import('jquery').then(({ default: jquery }) => {
      window.jQuery = jquery;
      window.$ = jquery;
      CampaignStartActions.campaignRetrieveAsOwner('');
    }).catch((error) => console.error('An error occurred while loading jQuery', error));
  }

  submitPoliticianList = () => {
    const campaignPoliticianListQueuedToSave = CampaignStartStore.getCampaignPoliticianListQueuedToSave();
    const campaignPoliticianListQueuedToSaveSet = CampaignStartStore.getCampaignPoliticianListQueuedToSaveSet();
    // Has a change been made that needs to be saved?
    // console.log('CampaignStartAddPolitician, campaignPoliticianListQueuedToSaveSet:', campaignPoliticianListQueuedToSaveSet);
    if (campaignPoliticianListQueuedToSaveSet) {
      // console.log('CampaignStartAddPolitician, campaignPoliticianListQueuedToSave:', campaignPoliticianListQueuedToSave);
      const campaignWeVoteId = '';
      const campaignPoliticianListQueuedToSaveJson = JSON.stringify(campaignPoliticianListQueuedToSave);
      // console.log('CampaignStartAddPolitician, campaignPoliticianListQueuedToSaveJson:', campaignPoliticianListQueuedToSaveJson);
      CampaignStartActions.campaignPoliticianListSave(campaignWeVoteId, campaignPoliticianListQueuedToSaveJson);
      CampaignStartActions.campaignPoliticianListQueuedToSave(undefined);
    }
    historyPush('/start-a-campaign-why-winning-matters');
  }

  render () {
    renderLog('CampaignStartAddPolitician');  // Set LOG_RENDER_EVENTS to log all renders
    if (isCordova()) {
      console.log(`CampaignStartAddPolitician window.location.href: ${window.location.href}`);
    }
    const { classes } = this.props;
    const mobileButtonClasses = classes.buttonDefault; // isWebApp() ? classes.buttonDefault : classes.buttonDefaultCordova;
    return (
      <div>
        <Helmet title="Add Candidate - We Vote Campaigns" />
        <MainHeaderBar />
        <PageWrapper cordova={isCordova()}>
          <OuterWrapper>
            <InnerWrapper>
              <CampaignStartSteps atStepNumber2 />
              <ContentTitle>
                Who do you want to see elected?
              </ContentTitle>
              <ContentIntroductionText>
                Choose the candidate(s) you want to win. These are the politicians who will support your values and the policies you care about.
              </ContentIntroductionText>
              <CampaignStartSectionWrapper>
                <CampaignStartSection>
                  <AddCandidateInputField />
                  <DesktopButtonWrapper className="u-show-desktop-tablet">
                    <DesktopButtonPanel>
                      <Button
                        classes={{ root: classes.buttonDesktop }}
                        color="primary"
                        id="saveCampaignPoliticianList"
                        onClick={this.submitPoliticianList}
                        variant="contained"
                      >
                        Continue
                      </Button>
                    </DesktopButtonPanel>
                  </DesktopButtonWrapper>
                  <AdviceBoxWrapper>
                    <AdviceBox>
                      <AdviceBoxTitle>
                        Choose the names of politicians your friends can vote for
                      </AdviceBoxTitle>
                      <AdviceBoxText>
                        Most groups of friends can only vote in a few counties, or one state. Try to focus on candidates your friends will be able to vote for.
                      </AdviceBoxText>
                      <AdviceBoxText>
                        &nbsp;
                      </AdviceBoxText>
                      <AdviceBoxTitle>
                        Don’t overwhelm your friends
                      </AdviceBoxTitle>
                      <AdviceBoxText>
                        You may personally support dozens of politicians all over the country. Focus on a few politicians who will be in the closest races.
                      </AdviceBoxText>
                      <AdviceBoxText>
                        &nbsp;
                      </AdviceBoxText>
                      <AdviceBoxTitle>
                        Don’t overthink it
                      </AdviceBoxTitle>
                      <AdviceBoxText>
                        You can add or change candidate(s) later. For now, just start with one and write the rest of your campaign.
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
              id="saveCampaignPoliticianListFooter"
              onClick={this.submitPoliticianList}
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
CampaignStartAddPolitician.propTypes = {
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

export default withStyles(styles)(CampaignStartAddPolitician);
