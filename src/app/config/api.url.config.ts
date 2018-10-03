const BASE = 'http://localhost';
const PORT = 8080;
const PATH = '/api';

export const API_URLS = {
  USER_URL: BASE + ':' + PORT + PATH + '/user',
  PAYS_URL: BASE + ':' + PORT + PATH + '/pays',
  INDIVIDUS_URL: BASE + ':' + PORT + PATH + '/individus',
  SALARIE_URL: BASE + ':' + PORT + PATH + '/salarie',
  CONTACT_URL: BASE + ':' + PORT + PATH + '/contact',
  IBAN_URL: BASE + ':' + PORT + PATH + '/iban',
  FILE_URL: BASE + ':' + PORT + PATH + '/file',
  CRUD_USER_URL: BASE + ':'+ PORT + '/crud_user'

};
