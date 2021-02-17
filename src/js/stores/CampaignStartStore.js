import { ReduceStore } from 'flux/utils';
import Dispatcher from '../components/Dispatcher/Dispatcher';

class CampaignStartStore extends ReduceStore {
  getInitialState () {
    return {
      campaignDescription: '',
      campaignDescriptionQueuedToSave: '',
      campaignDescriptionQueuedToSaveSet: false,
      campaignPhotoLargeUrl: '',
      campaignPhotoQueuedToSave: '',
      campaignPhotoQueuedToSaveSet: false,
      campaignPoliticianList: [],
      campaignPoliticianListQueuedToSave: [],
      campaignPoliticianListQueuedToSaveSet: false,
      campaignTitle: '',
      campaignTitleQueuedToSave: '',
      campaignTitleQueuedToSaveSet: false,
      campaignXOwnerList: [],
      campaignXWeVoteId: '',
    };
  }

  resetState () {
    return this.getInitialState();
  }

  campaignDescriptionExists () {
    if (this.getState().campaignDescription) {
      return Boolean(this.getState().campaignDescription.length > 10);
    } else {
      return false;
    }
  }

  campaignPhotoExists () {
    if (this.getState().campaignPhotoLargeUrl) {
      return Boolean(this.getState().campaignPhotoLargeUrl.length > 10);
    } else {
      return false;
    }
  }

  campaignPoliticianListExists () {
    if (this.getState().campaignPoliticianList) {
      return Boolean(this.getState().campaignPoliticianList.length > 0);
    } else {
      return false;
    }
  }

  campaignTitleExists () {
    if (this.getState().campaignTitle) {
      return Boolean(this.getState().campaignTitle.length > 10);
    } else {
      return false;
    }
  }

  getCampaignDescription () {
    return this.getState().campaignDescription || '';
  }

  getCampaignDescriptionQueuedToSave () {
    return this.getState().campaignDescriptionQueuedToSave;
  }

  getCampaignDescriptionQueuedToSaveSet () {
    return this.getState().campaignDescriptionQueuedToSaveSet;
  }

  getCampaignPhotoLargeUrl () {
    return this.getState().campaignPhotoLargeUrl || '';
  }

  getCampaignPhotoQueuedToSave () {
    return this.getState().campaignPhotoQueuedToSave;
  }

  getCampaignPhotoQueuedToSaveSet () {
    return this.getState().campaignPhotoQueuedToSaveSet;
  }

  getCampaignPoliticianList () {
    return this.getState().campaignPoliticianList || [];
  }

  getCampaignPoliticianListQueuedToSave () {
    return this.getState().campaignPoliticianListQueuedToSave || [];
  }

  getCampaignPoliticianListQueuedToSaveSet () {
    return this.getState().campaignPoliticianListQueuedToSaveSet || false;
  }

  getCampaignTitle () {
    return this.getState().campaignTitle || '';
  }

  getCampaignTitleQueuedToSave () {
    return this.getState().campaignTitleQueuedToSave;
  }

  getCampaignTitleQueuedToSaveSet () {
    return this.getState().campaignTitleQueuedToSaveSet;
  }

  reduce (state, action) {
    switch (action.type) {
      case 'campaignDescriptionQueuedToSave':
        // console.log('CampaignStartStore campaignDescriptionQueuedToSave: ', action.payload);
        if (action.payload === undefined) {
          return {
            ...state,
            campaignDescriptionQueuedToSave: [],
            campaignDescriptionQueuedToSaveSet: false,
          };
        } else {
          return {
            ...state,
            campaignDescriptionQueuedToSave: action.payload,
            campaignDescriptionQueuedToSaveSet: true,
          };
        }

      case 'campaignPhotoQueuedToSave':
        // console.log('CampaignStartStore campaignPhotoQueuedToSave: ', action.payload);
        if (action.payload === undefined) {
          return {
            ...state,
            campaignPhotoQueuedToSave: '',
            campaignPhotoQueuedToSaveSet: false,
          };
        } else {
          return {
            ...state,
            campaignPhotoQueuedToSave: action.payload,
            campaignPhotoQueuedToSaveSet: true,
          };
        }

      case 'campaignPoliticianListQueuedToSave':
        // console.log('CampaignStartStore campaignPoliticianListQueuedToSave: ', action.payload);
        if (action.payload === undefined) {
          return {
            ...state,
            campaignPoliticianListQueuedToSave: [],
            campaignPoliticianListQueuedToSaveSet: false,
          };
        } else {
          return {
            ...state,
            campaignPoliticianListQueuedToSave: action.payload,
            campaignPoliticianListQueuedToSaveSet: true,
          };
        }

      case 'campaignRetrieve':
      case 'campaignRetrieveAsOwner':
        // console.log('CampaignStartStore campaignRetrieveAsOwner');
        return {
          ...state,
          campaignDescription: action.res.campaign_description,
          campaignPhotoLargeUrl: action.res.we_vote_hosted_campaign_photo_large_url,
          campaignPoliticianList: action.res.campaignx_politician_list,
          campaignTitle: action.res.campaign_title,
          campaignXOwnerList: action.res.campaignx_owner_list,
          campaignXWeVoteId: action.res.campaignx_we_vote_id,
        };

      case 'campaignStartSave':
        // console.log('CampaignStartStore campaignStartSave');
        return {
          ...state,
          campaignDescription: action.res.campaign_description,
          campaignPhotoLargeUrl: action.res.we_vote_hosted_campaign_photo_large_url,
          campaignPoliticianList: action.res.campaignx_politician_list,
          campaignTitle: action.res.campaign_title,
          campaignXOwnerList: action.res.campaignx_owner_list,
          campaignXWeVoteId: action.res.campaignx_we_vote_id,
        };

      case 'campaignTitleQueuedToSave':
        // console.log('CampaignStartStore campaignTitleQueuedToSave: ', action.payload);
        if (action.payload === undefined) {
          return {
            ...state,
            campaignTitleQueuedToSave: [],
            campaignTitleQueuedToSaveSet: false,
          };
        } else {
          return {
            ...state,
            campaignTitleQueuedToSave: action.payload,
            campaignTitleQueuedToSaveSet: true,
          };
        }

      default:
        return state;
    }
  }
}

export default new CampaignStartStore(Dispatcher);
