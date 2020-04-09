/*const BASE = 'http://localhost';
const PORT = 8080; */
const PATH = '/api';

const BASE = 'https://amundi-file-integration-server.herokuapp.com';

export const API_URLS = {
  //USER_URL: BASE + ':' + PORT + PATH + '/user',
  USER_URL: BASE + PATH + '/user',
  PAYS_URL: BASE + PATH + '/pays',
  INDIVIDUS_URL: BASE +  PATH + '/individus',
  INDIVIDUS_URL_SEARCH: BASE + PATH + '/individus/search',
  INDIVIDUS_URL_NAME: BASE + PATH + '/individus/name',
  SALARIE_URL: BASE + PATH + '/salarie',
  SALARIE_URL_SEARCH: BASE + PATH + '/salarie/search',
  CONTACT_URL: BASE + PATH + '/contact',
  CONTACT_URL_SEARCH: BASE + PATH + '/contact/search',
  PAYMENT_URL: BASE + PATH + '/payment',
  PAYMENT_URL_SEARCH: BASE + PATH + '/payment/search',
  ADRESSE_URL: BASE + PATH + '/adresse',
  ADRESSE_URL_SEARCH: BASE + PATH + '/adresse/search',
  COMPTE_URL: BASE + PATH + '/compte',
  COMPTE_URL_SEARCH: BASE + PATH + '/compte/search',
  COMPTE_URL_INDIVIDU: BASE + PATH + '/compte/individu',
  FISCALITE_URL: BASE + PATH + '/fiscalite',
  FILE_URL: BASE + PATH + '/file',
  REPORT_CREATE_URL: BASE + PATH + '/createFile',
  REPORT_UPDATE_URL: BASE + PATH + '/updateFile',
  CRUD_USER_URL: BASE + '/crud_user',
  ROLES_USER_URL: BASE + '/crud_user/roles',
  USERNAME_URL: BASE + PATH + '/username',
  AUDIT_URL: BASE + PATH + '/audit',
  AUDIT_URL_SEARCH: BASE + PATH + '/audit/search',
  AUDIT_URL_DATE: BASE + PATH + '/audit/auditsByDate',
  POSITION_URL: BASE + PATH + '/position',
  POSITION_URL_SEARCH: BASE + PATH + '/position/search',
  POSITION_URL_CODE: BASE + PATH + '/position/byCode',
  MOVEMENT_URL: BASE + PATH + '/movement',
  MOVEMENT_URL_SEARCH: BASE + PATH + '/movement/search',
  MOVEMENT_URL_DATE: BASE + PATH + '/movement/movementsByDate',
  INSTRUMENT_URL: BASE + PATH + '/instrument',
  INSTRUMENT_URL_SEARCH: BASE + PATH + '/instrument/search'
};
