import { parse } from 'url';
import { Observable } from 'rxjs';
//import 'sharepoint';

import Config from '../config';
import { SharePointAuthRequest } from './sp.rest_auth';
import { reqOptions, INtlmOptions } from './sp.rest_auth.interfaces';

export class SharePointCollections {

  request: SharePointAuthRequest;
  requestOptions: reqOptions;
  ntlmOptions: INtlmOptions;

  constructor(sproot?: string, username?: string, password?: string, domain?: string) {
    this.request = new SharePointAuthRequest(sproot, username, password, domain);
    this.requestOptions = {
      url: `/search/query?querytext='contentclass:sts_site'`,
      method: 'GET',
      json: true,
      headers: { accept: 'application/json;odata=verbose' }
    };
    this.ntlmOptions = {
      hostname: parse(Config.SP_ROOT).hostname,
      username: Config.USER_NAME,
      password: Config.USER_PASSWORD,
      domain: Config.USER_DOMAIN
    };
  }

  returnSites(queryResponse: any) {
    let siteUrls: { name: string, url: string, customize: boolean }[] = [];
    queryResponse.PrimaryQueryResult.RelevantResults.Table.Rows.results.forEach((row: any) => siteUrls.push({ name: row.Cells.results[3].Value, url: row.Cells.results[6].Value, customize: false }));
    return Observable.from(siteUrls);
  }

  searchSites() {
    return this.request.sendRequest(this.requestOptions, this.ntlmOptions);
  }
}
