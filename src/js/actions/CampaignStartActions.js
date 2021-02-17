import Dispatcher from '../components/Dispatcher/Dispatcher';

export default {
  campaignDescriptionQueuedToSave (campaignDescription) {
    Dispatcher.dispatch({ type: 'campaignDescriptionQueuedToSave', payload: campaignDescription });
  },

  campaignDescriptionSave (campaignWeVoteId, campaignDescription) {
    // console.log('campaignDescriptionSave: ', campaignDescription);
    Dispatcher.loadEndpoint('campaignStartSave',
      {
        campaign_description: campaignDescription,
        campaign_description_changed: true,
        campaignx_we_vote_id: campaignWeVoteId,
      });
  },

  campaignPhotoQueuedToSave (campaignPhotoFromFileReader) {
    Dispatcher.dispatch({ type: 'campaignPhotoQueuedToSave', payload: campaignPhotoFromFileReader });
  },

  campaignPhotoSave (campaignWeVoteId, campaignPhotoFromFileReader) {
    // console.log('campaignPhotoFromFileReader: ', campaignPhotoFromFileReader);
    Dispatcher.loadEndpoint('campaignStartSave',
      {
        campaign_photo_from_file_reader: campaignPhotoFromFileReader,
        campaign_photo_changed: true,
        campaignx_we_vote_id: campaignWeVoteId,
      });
  },

  campaignPoliticianListQueuedToSave (campaignPoliticianList) {
    Dispatcher.dispatch({ type: 'campaignPoliticianListQueuedToSave', payload: campaignPoliticianList });
  },

  campaignPoliticianListSave (campaignWeVoteId, campaignPoliticianList) {
    // console.log('campaignPoliticianListSave: ', campaignPoliticianList);
    Dispatcher.loadEndpoint('campaignStartSave',
      {
        politician_list: campaignPoliticianList,
        politician_list_changed: true,
        campaignx_we_vote_id: campaignWeVoteId,
      });
  },

  campaignRetrieve (campaignWeVoteId) {
    Dispatcher.loadEndpoint('campaignRetrieve',
      {
        campaignx_we_vote_id: campaignWeVoteId,
      });
  },

  campaignRetrieveAsOwner (campaignWeVoteId) {
    Dispatcher.loadEndpoint('campaignRetrieveAsOwner',
      {
        campaignx_we_vote_id: campaignWeVoteId,
      });
  },

  campaignTitleQueuedToSave (campaignTitle) {
    Dispatcher.dispatch({ type: 'campaignTitleQueuedToSave', payload: campaignTitle });
  },

  campaignTitleSave (campaignWeVoteId, campaignTitle) {
    // console.log('campaignTitleSave: ', campaignTitle);
    Dispatcher.loadEndpoint('campaignStartSave',
      {
        campaign_title: campaignTitle,
        campaign_title_changed: true,
        campaignx_we_vote_id: campaignWeVoteId,
      });
  },
};
