const BASE = 'http://localhost';
const PORT = 8080;
const PATH = '/api';

export const API_URLS = {
  USER_URL: BASE + ':' + PORT + PATH + '/user',
  PAYS_URL: BASE + ':' + PORT + PATH + '/pays',
  INDIVIDUS_URL: BASE + ':' + PORT + PATH + '/individus',
  INDIVIDUS_URL_SEARCH: BASE + ':' + PORT + PATH + '/individus/search',
  SALARIE_URL: BASE + ':' + PORT + PATH + '/salarie',
  SALARIE_URL_SEARCH: BASE + ':' + PORT + PATH + '/salarie/search',
  CONTACT_URL: BASE + ':' + PORT + PATH + '/contact',
  CONTACT_URL_SEARCH: BASE + ':' + PORT + PATH + '/contact/search',
  PAYMENT_URL: BASE + ':' + PORT + PATH + '/payment',
  PAYMENT_URL_SEARCH: BASE + ':' + PORT + PATH + '/payment/search',
  ADRESSE_URL: BASE + ':' + PORT + PATH + '/adresse',
  ADRESSE_URL_SEARCH: BASE + ':' + PORT + PATH + '/adresse/search',
  COMPTE_URL: BASE + ':' + PORT + PATH + '/compte',
  COMPTE_URL_SEARCH: BASE + ':' + PORT + PATH + '/compte/search',
  FISCALITE_URL: BASE + ':' + PORT + PATH + '/fiscalite',
  FILE_URL: BASE + ':' + PORT + PATH + '/file',
  REPORT_CREATE_URL: BASE + ':' + PORT + PATH + '/createFile',
  REPORT_UPDATE_URL: BASE + ':' + PORT + PATH + '/updateFile',
  CRUD_USER_URL: BASE + ':'+ PORT + '/crud_user',
  ROLES_USER_URL: BASE + ':'+ PORT + '/crud_user/roles',
  USERNAME_URL: BASE + ':'+ PORT + PATH + '/username',
  AUDIT_URL: BASE + ':' + PORT + PATH + '/audit',
  AUDIT_URL_SEARCH: BASE + ':' + PORT + PATH + '/audit/search',
  POSITION_URL: BASE + ':' + PORT + PATH + '/position',
  POSITION_URL_SEARCH: BASE + ':' + PORT + PATH + '/position/search',
  MOVEMENT_URL: BASE + ':' + PORT + PATH + '/movement',
  MOVEMENT_URL_SEARCH: BASE + ':' + PORT + PATH + '/movement/search',
  MOVEMENT_URL_DATE: BASE + ':' + PORT + PATH + '/movement/movementsByDate',

};
