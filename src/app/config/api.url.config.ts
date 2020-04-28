const BASE = 'http://localhost';
const PORT = 8080;
const PROXY = 8180
const PATH2 = '/pevodata/ibbl/api'
const PATH3 = '/redcap/redcap/api'
const PATH = '/api';

export const API_URLS = {
  LIMS_SAMPLE_URL: BASE + ':' + PROXY + PATH2 + '/limsSamples',
  LIMS_SAMPLE_DATE_URL: BASE + ':' + PROXY + PATH2 + '/limsSamplesDate',
  REDCAP_SAMPLE_URL: BASE + ':' + PROXY + PATH3 + '/redcapSamples',
  REDCAP_SAMPLE_DATE_URL: BASE + ':' + PROXY + PATH3 + '/redcapSamplesDate',
  USER_URL: BASE + ':' + PORT + PATH + '/user',
  CRUD_USER_URL: BASE + ':'+ PORT + '/crud_user',
  ROLES_USER_URL: BASE + ':'+ PORT + '/crud_user/roles',
  USERNAME_URL: BASE + ':'+ PORT + PATH + '/username',
};
