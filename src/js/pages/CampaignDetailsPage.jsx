import React, { Component, Suspense } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import CampaignTopNavigation from '../components/Navigation/CampaignTopNavigation';
import CampaignStore from '../stores/CampaignStore';
import CampaignSupporterActions from '../actions/CampaignSupporterActions';
import CampaignSupporterStore from '../stores/CampaignSupporterStore';
import CompleteYourProfileModalController from '../components/Settings/CompleteYourProfileModalController';
import DelayedLoad from '../components/Widgets/DelayedLoad';
import { getCampaignXValuesFromIdentifiers } from '../utils/campaignUtils';
import { historyPush, isCordova } from '../utils/cordovaUtils';
import initializejQuery from '../utils/initializejQuery';
import { renderLog } from '../utils/logging';

const CampaignSupportThermometer = React.lazy(() => import('../components/CampaignSupport/CampaignSupportThermometer'));
const CampaignDetailsActionButtonFooter = React.lazy(() => import('../components/CampaignSupport/CampaignDetailsActionButtonFooter'));
const CampaignDetailsActionSideBox = React.lazy(() => import('../components/CampaignSupport/CampaignDetailsActionSideBox'));
const CampaignRetrieveController = React.lazy(() => import('../components/Campaign/CampaignRetrieveController'));


class CampaignDetailsPage extends Component {
  constructor (props) {
    super(props);
    this.state = {
      campaignPhoto: '',
      campaignSEOFriendlyPath: '',
      campaignTitle: '',
      campaignXWeVoteId: '',
      pathToUseWhenProfileComplete: '',
      payToPromoteStepCompleted: false,
      payToPromoteStepTurnedOn: false,
      sharingStepCompleted: false,
      step2Completed: false,
    };
  }

  componentDidMount () {
    // console.log('CampaignDetailsPage componentDidMount');
    this.onCampaignStoreChange();
    const { match: { params } } = this.props;
    const { campaignSEOFriendlyPath, campaignXWeVoteId } = params;
    // console.log('componentDidMount campaignSEOFriendlyPath: ', campaignSEOFriendlyPath, ', campaignXWeVoteId: ', campaignXWeVoteId);
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
    this.campaignSupporterStoreListener = CampaignSupporterStore.addListener(this.onCampaignSupporterStoreChange.bind(this));
    // retrieveCampaignXFromIdentifiersIfNeeded(campaignSEOFriendlyPath, campaignXWeVoteId);
    let pathToUseWhenProfileComplete;
    if (campaignSEOFriendlyPath) {
      this.setState({
        campaignSEOFriendlyPath,
      });
      pathToUseWhenProfileComplete = `/c/${campaignSEOFriendlyPath}/why-do-you-support`;
    } else {
      this.setState({
        campaignXWeVoteId,
      });
      pathToUseWhenProfileComplete = `/id/${campaignXWeVoteId}/why-do-you-support`;
    }
    this.setState({
      pathToUseWhenProfileComplete,
    });
  }

  componentWillUnmount () {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.campaignStoreListener.remove();
    this.campaignSupporterStoreListener.remove();
  }

  onCampaignStoreChange () {
    const { match: { params } } = this.props;
    const { campaignSEOFriendlyPath: campaignSEOFriendlyPathFromParams, campaignXWeVoteId: campaignXWeVoteIdFromParams } = params;
    // console.log('onCampaignStoreChange campaignSEOFriendlyPathFromParams: ', campaignSEOFriendlyPathFromParams, ', campaignXWeVoteIdFromParams: ', campaignXWeVoteIdFromParams);
    const {
      campaignDescription,
      campaignPhoto,
      campaignSEOFriendlyPath,
      campaignTitle,
      campaignXWeVoteId,
    } = getCampaignXValuesFromIdentifiers(campaignSEOFriendlyPathFromParams, campaignXWeVoteIdFromParams);
    let pathToUseWhenProfileComplete;
    if (campaignSEOFriendlyPath) {
      pathToUseWhenProfileComplete = `/c/${campaignSEOFriendlyPath}/why-do-you-support`;
      this.setState({
        campaignSEOFriendlyPath,
        pathToUseWhenProfileComplete,
      });
    } else if (campaignXWeVoteId) {
      pathToUseWhenProfileComplete = `/id/${campaignXWeVoteId}/why-do-you-support`;
    }
    if (campaignXWeVoteId) {
      this.setState({
        campaignXWeVoteId,
      });
    }
    this.setState({
      campaignDescription,
      campaignPhoto,
      campaignTitle,
    });
  }

  onCampaignSupporterStoreChange () {
    const { campaignXWeVoteId } = this.state;
    const step2Completed = CampaignSupporterStore.supporterEndorsementExists(campaignXWeVoteId);
    const payToPromoteStepCompleted = false;
    const payToPromoteStepTurnedOn = true;
    const sharingStepCompleted = false;
    // console.log('onCampaignSupporterStoreChange sharingStepCompleted: ', sharingStepCompleted, ', step2Completed: ', step2Completed, ', payToPromoteStepCompleted:', payToPromoteStepCompleted);
    this.setState({
      sharingStepCompleted,
      step2Completed,
      payToPromoteStepCompleted,
      payToPromoteStepTurnedOn,
    });
  }

  getCampaignBasePath = () => {
    const { campaignSEOFriendlyPath, campaignXWeVoteId } = this.state;
    let campaignBasePath;
    if (campaignSEOFriendlyPath) {
      campaignBasePath = `/c/${campaignSEOFriendlyPath}`;
    } else {
      campaignBasePath = `/id/${campaignXWeVoteId}`;
    }

    return campaignBasePath;
  }

  goToNextPage = () => {
    const { pathToUseWhenProfileComplete } = this.state;
    this.timer = setTimeout(() => {
      historyPush(pathToUseWhenProfileComplete);
    }, 500);
  }

  functionToUseToKeepHelping = () => {
    // console.log('functionToUseToKeepHelping');
    const { payToPromoteStepCompleted, payToPromoteStepTurnedOn, sharingStepCompleted, step2Completed } = this.state;
    if (!sharingStepCompleted) {
      historyPush(`${this.getCampaignBasePath()}/share-campaign`);
    } else if (payToPromoteStepTurnedOn && !payToPromoteStepCompleted) {
      historyPush(`${this.getCampaignBasePath()}/pay-to-promote`);
    } else if (!step2Completed) {
      historyPush(`${this.getCampaignBasePath()}/why-do-you-support`);
    } else {
      historyPush(`${this.getCampaignBasePath()}/share-campaign`);
    }
  }

  functionToUseWhenProfileComplete = () => {
    const { campaignXWeVoteId } = this.state;
    const campaignSupported = true;
    const campaignSupportedChanged = true;
    // From this page we always send value for 'visibleToPublic'
    let visibleToPublic = CampaignSupporterStore.getVisibleToPublic();
    const visibleToPublicChanged = CampaignSupporterStore.getVisibleToPublicQueuedToSaveSet();
    if (visibleToPublicChanged) {
      // If it has changed, use new value
      visibleToPublic = CampaignSupporterStore.getVisibleToPublicQueuedToSave();
    }
    // console.log('functionToUseWhenProfileComplete, visibleToPublic:', visibleToPublic, ', visibleToPublicChanged:', visibleToPublicChanged);
    const saveVisibleToPublic = true;
    initializejQuery(() => {
      CampaignSupporterActions.supportCampaignSave(campaignXWeVoteId, campaignSupported, campaignSupportedChanged, visibleToPublic, saveVisibleToPublic);
    }, this.goToNextPage());
  }

  render () {
    renderLog('CampaignDetailsPage');  // Set LOG_RENDER_EVENTS to log all renders
    if (isCordova()) {
      console.log(`CampaignDetailsPage window.location.href: ${window.location.href}`);
    }
    // const { classes } = this.props;
    const {
      campaignDescription, campaignPhoto, campaignSEOFriendlyPath, campaignTitle, campaignXWeVoteId,
    } = this.state;
    // console.log('render campaignSEOFriendlyPath: ', campaignSEOFriendlyPath, ', campaignXWeVoteId: ', campaignXWeVoteId);
    const htmlTitle = `${campaignTitle} - We Vote Campaigns`;
    return (
      <div>
        <Suspense fallback={<span>&nbsp;</span>}>
          <CampaignRetrieveController campaignSEOFriendlyPath={campaignSEOFriendlyPath} campaignXWeVoteId={campaignXWeVoteId} />
        </Suspense>
        <Helmet title={htmlTitle} />
        <PageWrapper cordova={isCordova()}>
          <CampaignTopNavigation campaignSEOFriendlyPath={campaignSEOFriendlyPath} campaignXWeVoteId={campaignXWeVoteId} />
          <DetailsSectionMobile className="u-show-mobile">
            <CampaignImageMobileWrapper>
              {campaignPhoto ? (
                <CampaignImage src={campaignPhoto} alt="Campaign" />
              ) : (
                <DelayedLoad waitBeforeShow={1000}>
                  <CampaignImagePlaceholder>
                    <CampaignImagePlaceholderText>
                      No image provided
                    </CampaignImagePlaceholderText>
                  </CampaignImagePlaceholder>
                </DelayedLoad>
              )}
            </CampaignImageMobileWrapper>
            <CampaignTitleAndScoreBar>
              <CampaignTitleMobile>{campaignTitle}</CampaignTitleMobile>
              <Suspense fallback={<span>&nbsp;</span>}>
                <CampaignSupportThermometer campaignXWeVoteId={campaignXWeVoteId} />
              </Suspense>
            </CampaignTitleAndScoreBar>
            <CampaignDescriptionWrapper>
              <CampaignDescription>
                {campaignDescription}
              </CampaignDescription>
            </CampaignDescriptionWrapper>
          </DetailsSectionMobile>
          <DetailsSectionDesktopTablet className="u-show-desktop-tablet">
            <CampaignTitleDesktop>{campaignTitle}</CampaignTitleDesktop>
            <ColumnsWrapper>
              <ColumnTwoThirds>
                <CampaignImageDesktopWrapper>
                  {campaignPhoto ? (
                    <CampaignImageDesktop src={campaignPhoto} alt="Campaign" />
                  ) : (
                    <DelayedLoad waitBeforeShow={1000}>
                      <CampaignImagePlaceholder>
                        <CampaignImagePlaceholderText>
                          No image provided
                        </CampaignImagePlaceholderText>
                      </CampaignImagePlaceholder>
                    </DelayedLoad>
                  )}
                </CampaignImageDesktopWrapper>
                <CampaignDescriptionDesktopWrapper>
                  <CampaignDescriptionDesktop>
                    {campaignDescription}
                  </CampaignDescriptionDesktop>
                </CampaignDescriptionDesktopWrapper>
              </ColumnTwoThirds>
              <ColumnOneThird>
                <Suspense fallback={<span>&nbsp;</span>}>
                  <CampaignSupportThermometer campaignXWeVoteId={campaignXWeVoteId} />
                </Suspense>
                <Suspense fallback={<span>&nbsp;</span>}>
                  <CampaignDetailsActionSideBox
                    campaignSEOFriendlyPath={campaignSEOFriendlyPath}
                    campaignXWeVoteId={campaignXWeVoteId}
                    functionToUseToKeepHelping={this.functionToUseToKeepHelping}
                    functionToUseWhenProfileComplete={this.functionToUseWhenProfileComplete}
                  />
                </Suspense>
              </ColumnOneThird>
            </ColumnsWrapper>
          </DetailsSectionDesktopTablet>
        </PageWrapper>
        <SupportButtonFooterWrapper className="u-show-mobile">
          <CampaignDetailsActionButtonFooter
            campaignSEOFriendlyPath={campaignSEOFriendlyPath}
            campaignXWeVoteId={campaignXWeVoteId}
            functionToUseToKeepHelping={this.functionToUseToKeepHelping}
            functionToUseWhenProfileComplete={this.functionToUseWhenProfileComplete}
          />
        </SupportButtonFooterWrapper>
        <CompleteYourProfileModalController
          campaignXWeVoteId={campaignXWeVoteId}
          functionToUseWhenProfileComplete={this.functionToUseWhenProfileComplete}
          supportCampaign
        />
      </div>
    );
  }
}
CampaignDetailsPage.propTypes = {
  // classes: PropTypes.object,
  match: PropTypes.object,
};

const styles = () => ({
  buttonRoot: {
    width: 250,
  },
});

const CampaignDescription = styled.div`
  font-size: 15px;
  text-align: left;
  white-space: pre-wrap;
`;

const CampaignDescriptionDesktop = styled.div`
  font-size: 15px;
  text-align: left;
  white-space: pre-wrap;
`;

const CampaignDescriptionWrapper = styled.div`
  margin: 10px;
`;

const CampaignDescriptionDesktopWrapper = styled.div`
  margin-bottom: 10px;
  margin-top: 2px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
  }
`;

const CampaignImagePlaceholder = styled.div`
  background-color: #eee;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 183px;
  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    min-height: 174px;
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    min-height: 239px;
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    min-height: 319px;
  }
`;

const CampaignImagePlaceholderText = styled.div`
  color: #ccc;
`;

const CampaignImageDesktopWrapper = styled.div`
  margin-bottom: 10px;
  min-height: 180px;
  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    min-height: 174px;
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    min-height: 239px;
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    min-height: 300px;
  }
`;

const CampaignImageMobileWrapper = styled.div`
  min-height: 174px;
  @media (min-width: ${({ theme }) => theme.breakpoints.xs}) {
    min-height: 175px;
  }
`;

const CampaignImage = styled.img`
  width: 100%;
`;

const CampaignImageDesktop = styled.img`
  border-radius: 5px;
  width: 100%;
`;

const CampaignTitleAndScoreBar = styled.div`
  margin: 10px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
  }
`;

const CampaignTitleDesktop = styled.h1`
  font-size: 28px;
  text-align: center;
  margin: 30px 20px 40px 20px;
  min-height: 29px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 24px;
  }
`;

const CampaignTitleMobile = styled.h1`
  font-size: 22px;
  margin: 0;
  margin-bottom: 10px;
  min-height: 27px;
  text-align: left;
`;

const ColumnOneThird = styled.div`
  flex: 1;
  flex-direction: column;
  flex-basis: 40%;
  margin: 0 0 0 25px;
`;

const ColumnsWrapper = styled.div`
  display: flex;
  @media (max-width: 1005px) {
    // Switch to 15px left/right margin when auto is too small
    margin: 0 15px;
  }
`;

const ColumnTwoThirds = styled.div`
  flex: 2;
  flex-direction: column;
  flex-basis: 60%;
`;

const DetailsSectionDesktopTablet = styled.div`
  display: flex;
  flex-flow: column;
`;

const DetailsSectionMobile = styled.div`
  display: flex;
  flex-flow: column;
`;

const PageWrapper = styled.div`
  margin: 0 auto;
  max-width: 960px;
`;

const SupportButtonFooterWrapper = styled.div`
`;

export default withStyles(styles)(CampaignDetailsPage);
