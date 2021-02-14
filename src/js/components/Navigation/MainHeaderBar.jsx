import React, { Suspense } from 'react';
import loadable from '@loadable/component';
import { AppBar, IconButton, Menu, MenuItem, Toolbar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import { historyPush } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import voterSignOut from '../../utils/voterSignOut';
import HeaderBarLogo from './HeaderBarLogo';

const SignInButton = loadable(() => import('./SignInButton'));


const useStyles = makeStyles((theme) => ({
  appBarRoot: {
    boxShadow: 'none',
    paddingBottom: '0',
  },
  innerWrapper: {
    margin: '0 auto',
    maxWidth: '960px',
  },
  logoLinkRoot: {
  },
  menuButton: {
    fontSize: '4px',
    marginLeft: 0,
    marginRight: theme.spacing(2),
    padding: '0',
  },
  menuRoot: {
    marginTop: '34px',
  },
  outerWrapper: {
    borderBottom: '1px solid #ddd',
    flexGrow: 1,
    minHeight: 52,
  },
  title: {
    flexGrow: 1,
  },
  toolbarRoot: {
    minHeight: '0 !important',
  },
}));

export default function MainHeaderBar () {
  const classes = useStyles();
  // const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (destination) => {
    setAnchorEl(null);
    historyPush(destination);
  };

  const signOut = () => {
    // console.log('MainHeaderBar signOut');
    setAnchorEl(null);
    voterSignOut();
  };

  const extraItems = {
    fontSize: 12,
    paddingTop: 'unset',
    paddingBottom: 6,
    lineHeight: 'unset',
    opacity: '60%',
  };

  const ourPromise = {
    fontSize: 14,
    padding: '10px 15px 24px',
    lineHeight: 'unset',
    opacity: '40%',
  };

  renderLog('MainHeaderBar');

  const chosenSiteLogoUrl = '';  // {AppStore.getChosenSiteLogoUrl()}
  const light = false;
  return (
    <div className={classes.outerWrapper}>
      <div className={classes.innerWrapper}>
        <AppBar className={classes.appBarRoot} position="static" color="default">
          <Toolbar className={classes.toolbarRoot} disableGutters>
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
              <HeaderBarLogo classes={classes} light={light} logUrl={chosenSiteLogoUrl} />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              &nbsp;
            </Typography>
            <Suspense fallback={<span>ZzZzZzZ</span>}>
              <SignInButton classes={classes} />
            </Suspense>
            <div style={{ padding: '8px 0 0 0' }}>
              <IconButton
                edge="start"
                className={classes.menuButton}
                color="inherit"
                onClick={handleMenu}
                aria-label="menu"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                className={classes.menuRoot}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                <Typography variant="h6" className={classes.title} style={ourPromise}>
                  Our Promise: We&apos;ll never sell your email.
                </Typography>
                {/* The next 6 lines have a test url of '/', not for production! */}
                <MenuItem onClick={() => handleClose('/')}>Your campaigns</MenuItem>
                <MenuItem onClick={() => handleClose('/')}>Your ballot</MenuItem>
                <MenuItem onClick={() => handleClose('/')}>Settings</MenuItem>
                <MenuItem onClick={() => handleClose('/start-a-campaign')}>Start a campaign</MenuItem>
                <MenuItem onClick={() => handleClose('/membership')}>Membership</MenuItem>
                <MenuItem onClick={() => handleClose('/')}>Search</MenuItem>
                <MenuItem onClick={() => signOut()}>Sign out</MenuItem>
                <span style={{ lineHeight: '28px' }}>&nbsp;</span>
                <MenuItem style={extraItems} onClick={() => handleClose('/faq')}>Frequently asked questions</MenuItem>
                <MenuItem style={extraItems} onClick={() => handleClose('/terms')}>Terms of service</MenuItem>
                <MenuItem style={extraItems} onClick={() => handleClose('/privacy')}>Privacy Policy</MenuItem>
              </Menu>
            </div>
          </Toolbar>
        </AppBar>
      </div>
    </div>
  );
}