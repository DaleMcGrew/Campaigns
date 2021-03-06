import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { Ballot } from '@material-ui/icons';
import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { renderLog } from '../utils/logging';
import { historyPush, isCordova } from '../utils/cordovaUtils';

class PageNotFound extends Component {
  static getProps () {
    return {};
  }

  render () {
    renderLog('PageNotFound');  // Set LOG_RENDER_EVENTS to log all renders
    if (isCordova()) {
      console.log(`PageNotFound window.location.href: ${window.location.href}`);
    }
    const { classes } = this.props;
    return (
      <div>
        <Helmet title="Page Not Found - We Vote Campaigns" />
        <Wrapper cordova={isCordova()}>
          <EmptyBallotMessageContainer>
            <EmptyBallotText>Page not found.</EmptyBallotText>
            <Button
              classes={{ root: classes.buttonRoot }}
              color="primary"
              variant="contained"
              onClick={() => historyPush('/')}
            >
              <Ballot classes={{ root: classes.buttonIconRoot }} location={window.location} />
              Go to Home Page
            </Button>
          </EmptyBallotMessageContainer>
        </Wrapper>
      </div>
    );
  }
}
PageNotFound.propTypes = {
  classes: PropTypes.object,
};

const Wrapper = styled.div`
  @media (max-width: ${({ theme, cordova }) => (cordova ? undefined : theme.breakpoints.md)}) {
    margin: 1em 0;
  }
`;

const EmptyBallotMessageContainer = styled.div`
  padding: 3em 2em;
  display: flex;
  flex-flow: column;
  align-items: center;
`;

const EmptyBallotText = styled.p`
  font-size: 24px;
  text-align: center;
  margin: 1em 2em 3em;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin: 1em;
  }
`;

const styles = (theme) => ({
  buttonIconRoot: {
    marginRight: 8,
  },
  buttonRoot: {
    width: 250,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
});

export default withStyles(styles)(PageNotFound);
