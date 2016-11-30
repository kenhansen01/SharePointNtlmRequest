import { join } from 'path';
import { argv } from 'yargs';

export class SharePointConfig {

  /**
   * SharePoint root site collection. Use flag '--sproot' or console prompt.
   */
  SP_ROOT = argv['sproot'] || null;

  /**
   * User name. Can be provided with '--user' flag or with response to console prompt.
   */
  USER_NAME: string = argv['user'] || null;

  /**
   * User password. Use flag '--pass' or console prompt
   */
  USER_PASSWORD: string = argv['pass'] || null;

  /**
   * User domain. Use flag '--domain' or console prompt, default is 'corporate'
   */
  USER_DOMAIN: string = argv['domain'] || 'corporate';

  /**
   * SharePoint Collections available to the user.
   */
  SP_COLLECTIONS: { name: string, url: string, customize: boolean }[] = [
    {
      name: 'root', url: this.SP_ROOT, customize: true
    }
  ];

  /**
   * Selected collections. Defaults to 'all' (SP_COLLECTIONS) can be changed in console.
   */
  SELECTED_COLLECTIONS = argv['selectcoll'] || null;

}