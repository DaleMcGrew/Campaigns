import PropTypes from 'prop-types';
import React, { Component } from 'react';
import AppActions from '../../actions/AppActions';
import webAppConfig from '../../config';
import AppStore from '../../stores/AppStore';
// import VoterStore from '../../stores/VoterStore';
import { dumpCssFromId } from '../../utils/appleSiliconUtils';
import { getApplicationViewBooleans, weVoteBrandingOff } from '../../utils/applicationUtils';
import { cordovaTopHeaderTopMargin } from '../../utils/cordovaOffsets';
import { hasIPhoneNotch, historyPush, isCordova, isIOS, isIOSAppOnMac, isIPad, isWebApp } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import { startsWith, stringContains } from '../../utils/textFormat';

const appleSiliconDebug = false;

export default class Header extends Component {
  constructor (props) {
    super(props);
    this.state = {
      organizationModalBallotItemWeVoteId: '',
      sharedItemCode: '',
      showHowItWorksModal: false,
      showVoterPlanModal: false,
      showOrganizationModal: false,
      showSharedItemModal: false,
      priorPath: '',
    };

    this.closeHowItWorksModal = this.closeHowItWorksModal.bind(this);
    this.closeVoterPlanModal = this.closeVoterPlanModal.bind(this);
    this.closeOrganizationModal = this.closeOrganizationModal.bind(this);
    this.closeSharedItemModal = this.closeSharedItemModal.bind(this);
    this.handleResize = this.handleResize.bind(this);
    // 2021-1-3: This is a workaround for the difficulty of nesting components in react-router V5, it should not be necessary
    global.weVoteGlobalHistory.listen((location, action) => {
      if (location.pathname !== this.state.priorPath) {
        // Re-render the Header if the path changed (Needed for React-router V5)
        this.setState({ priorPath: window.locationPathname });
      }
      if (webAppConfig.LOG_ROUTING) {
        console.log(`Header: The current URL is ${location.pathname}${location.search}${location.hash}`);
        console.log(`Header: The last navigation action was ${action}`, JSON.stringify(global.weVoteGlobalHistory, null, 2));
      }
    });
  }

  componentDidMount () {
    this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));
    this.setState({ windowWidth: window.innerWidth });
    window.addEventListener('resize', this.handleResize);
    if (isIOSAppOnMac() && appleSiliconDebug) {
      dumpCssFromId('header-container');
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    // console.log('HEADER shouldComponentUpdate');
    const { location: { pathname } } = window;
    if (this.state.activityTidbitWeVoteIdForDrawer !== nextState.activityTidbitWeVoteIdForDrawer) return true;
    if (this.state.organizationModalBallotItemWeVoteId !== nextState.organizationModalBallotItemWeVoteId) return true;
    if (pathname !== nextProps.pathname) return true;
    if (this.state.priorPath === undefined) return true;
    if (this.state.sharedItemCode !== nextState.sharedItemCode) return true;
    if (this.state.showActivityTidbitDrawer !== nextState.showActivityTidbitDrawer) return true;
    if (this.state.showHowItWorksModal !== nextState.showHowItWorksModal) return true;
    if (this.state.showVoterPlanModal !== nextState.showVoterPlanModal) return true;
    if (this.state.showOrganizationModal !== nextState.showOrganizationModal) return true;
    if (this.state.showSharedItemModal !== nextState.showSharedItemModal) return true;
    return this.state.windowWidth !== nextState.windowWidth;
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('Header caught error: ', `${error} with info: `, info);
  }

  componentWillUnmount () {
    this.appStoreListener.remove();
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize () {
    this.setState({ windowWidth: window.innerWidth });
  }

  onAppStoreChange () {
    // console.log('Header, onAppStoreChange');
    this.setState({
      activityTidbitWeVoteIdForDrawer: AppStore.activityTidbitWeVoteIdForDrawer(),
      organizationModalBallotItemWeVoteId: AppStore.organizationModalBallotItemWeVoteId(),
      sharedItemCode: AppStore.getSharedItemCode(),
      showActivityTidbitDrawer: AppStore.showActivityTidbitDrawer(),
      showHowItWorksModal: AppStore.showHowItWorksModal(),
      showVoterPlanModal: AppStore.showVoterPlanModal(),
      showOrganizationModal: AppStore.showOrganizationModal(),
      showSharedItemModal: AppStore.showSharedItemModal(),
    });
  }

  closeActivityTidbitDrawer () {
    AppActions.setShowActivityTidbitDrawer(false);
  }

  closeHowItWorksModal () {
    AppActions.setShowHowItWorksModal(false);
  }

  closeVoterPlanModal () {
    AppActions.setShowVoterPlanModal(false);
  }

  closeOrganizationModal () {
    AppActions.setShowOrganizationModal(false);
  }

  closeSharedItemModal () {
    AppActions.setShowSharedItemModal('');
    const { location: { pathname } } = window;
    if (stringContains('/modal/sic/', pathname)) {
      const pathnameWithoutModalSharedItem = pathname.substring(0, pathname.indexOf('/modal/sic/'));
      historyPush(pathnameWithoutModalSharedItem);
    }
  }

  render () {
    renderLog('Header');  // Set LOG_RENDER_EVENTS to log all renders

    // console.log('Header global.weVoteGlobalHistory', global.weVoteGlobalHistory);
    const { location: { pathname } } = window;
    const {
      settingsMode, showBackToSettingsDesktop,
      showBackToSettingsMobile, showBackToVoterGuides,
    } = getApplicationViewBooleans(pathname);
    let iPhoneSpacer = '';
    if (isCordova() && isIOS() && hasIPhoneNotch()) {
      iPhoneSpacer = <div className="ios-notched-spacer" />;
    } else if (isCordova() && isIOS() && !hasIPhoneNotch() && !isIOSAppOnMac()) {
      iPhoneSpacer = <div className="ios-no-notch-spacer" style={{ height: `${isIPad() ? '26px' : 'undefined'}` }} />;
    }

    // console.log('organizationModalBallotItemWeVoteId: ', this.state.organizationModalBallotItemWeVoteId);

    let pageHeaderClasses = weVoteBrandingOff() ? 'page-header__container_branding_off headroom' : 'page-header__container headroom';
    if (isIPad() && !isIOSAppOnMac()) {
      pageHeaderClasses = pageHeaderClasses.replace('page-header__container', 'page-header__container_ipad');
    }
    // console.log(`Header href: ${window.location.href}  cordovaStyle: `, cordovaTopHeaderTopMargin());


    if (settingsMode) {
      // console.log('Header in settingsMode, showBackToSettingsDesktop:', showBackToSettingsDesktop, ', showBackToSettingsMobile:', showBackToSettingsMobile);
      const classNameHeadroom = showBackToVoterGuides ? 'headroom-wrapper-webapp__voter-guide' : 'headroom-wrapper-webapp__default';

      return (
        <div id="app-header">
          { iPhoneSpacer }
          <div className={isWebApp() ? classNameHeadroom : ''} id="headroom-wrapper">
            <div className={pageHeaderClasses} style={cordovaTopHeaderTopMargin()} id="header-container">
              { showBackToSettingsDesktop && (
                <span>
                  <span className="u-show-desktop-tablet">
                    {/* <HeaderBackTo backToLink={backToSettingsLinkDesktop} backToLinkText={backToSettingsLinkText} /> */}
                  </span>
                  { !showBackToVoterGuides && !showBackToSettingsMobile && (
                    <span className="u-show-mobile">
                      {/* <HeaderBar /> */}
                    </span>
                  )}
                </span>
              )}
            </div>
          </div>
          {/* {showHowItWorksModal && ( */}
          {/*  <HowItWorksModal */}
          {/*    show={showHowItWorksModal} */}
          {/*    toggleFunction={this.closeHowItWorksModal} */}
          {/*  /> */}
          {/* )} */}
        </div>
      );
    } else if (
      typeof pathname !== 'undefined' && pathname &&
      (pathname === '/for-campaigns' ||
      pathname === '/for-organizations' ||
      startsWith('/how', pathname) ||
      pathname === '/more/about' ||
      pathname === '/more/credits' ||
      startsWith('/more/donate', pathname) ||
      startsWith('/more/pricing', pathname) ||
      pathname === '/welcome')) {
      return null;
    } else {
      // console.log('Header not in any mode');
      let classNameHeadroom = '';  // Value for isCordova is ''
      if (isWebApp()) {
        if (stringContains('/ballot', pathname.toLowerCase())) {
          classNameHeadroom = 'headroom-wrapper-webapp__ballot';
        } else if (stringContains('/office', pathname.toLowerCase())) {
          classNameHeadroom = 'headroom-wrapper-webapp__office';
        } else {
          classNameHeadroom = 'headroom-wrapper-webapp__default';
        }
      }
      // This handles other pages, like the Ballot display
      return (
        <div id="app-header">
          { iPhoneSpacer }
          <div className={classNameHeadroom}
            id="headroom-wrapper"
          >
            <div className={pageHeaderClasses} style={cordovaTopHeaderTopMargin()} id="header-container">
              {/* <HeaderBar /> */}
            </div>
          </div>
        </div>
      );
    }
  }
}
Header.propTypes = {
  // params: PropTypes.object,
  pathname: PropTypes.string.isRequired,
};
