import * as inquirer from 'inquirer';
import * as Rx from 'rx';

import { SharePointCollections } from '../utils/sp.get_site_collections';
import Config from '../config';

export default function getUserInfo(done: any) {

  let loginObservable = Rx.Observable.create((subscriber: Rx.Observer<inquirer.Question>) => {

    subscriber.onNext({
      type: 'confirm',
      name: 'confirm_sproot',
      message: `Just checking, is your sharepoint root url: ${Config.SP_ROOT}?`,
      when: !!Config.SP_ROOT
    });
    subscriber.onNext({
      type: 'input',
      name: 'sproot',
      message: `Enter your SharePoint root url with protocol (http:// or https://): `,
      when: (answers: any): boolean => {
        return !Config.SP_ROOT ? true : !answers.confirm_sproot;
      }
    });
    subscriber.onNext({
      type: 'confirm',
      name: 'confirm_user',
      message: `Just checking, is your username ${Config.USER_NAME}?`,
      when: !!Config.USER_NAME
    });
    subscriber.onNext({
      type: 'input',
      name: 'username',
      message: `Enter your SharePoint username: `,
      when: (answers: any): boolean => {
        return !Config.USER_NAME ? true : !answers.confirm_user;
      }
    });
    subscriber.onNext({
      type: 'confirm',
      name: 'confirm_pass',
      message: `Do you want to reenter your password?`,
      when: !!Config.USER_NAME && !!Config.USER_PASSWORD
    });
    subscriber.onNext({
      type: 'password',
      name: 'password',
      message: `Enter your SharePoint password: `,
      when: (answers: any): boolean => {
        return !Config.USER_PASSWORD ? true : !answers.confirm_pass;
      }
    });
    subscriber.onNext({
      type: 'confirm',
      name: 'confirm_domain',
      message: `Is your domain ${Config.USER_DOMAIN}?`,
    });
    subscriber.onNext({
      type: 'input',
      name: 'domain',
      message: `Enter your SharePoint domain: `,
      when: (answers: any): boolean => {
        return !answers.confirm_domain;
      },
      default: 'corporate'
    });    
    subscriber.onCompleted();
  });
  const promptLoginResponse = Rx.Observable.fromPromise(inquirer.prompt(loginObservable));

  promptLoginResponse
    .map((answers) => {
      Config.SP_ROOT = answers['sproot'] || Config.SP_ROOT;
      Config.USER_NAME = answers['username'] || Config.USER_NAME;
      Config.USER_PASSWORD = answers['password'] || Config.USER_PASSWORD;
      Config.USER_DOMAIN = answers['domain'] || Config.USER_DOMAIN;
      const spCollections = new SharePointCollections();
      const siteCollections = spCollections.searchSites()
        .mergeMap(res => spCollections.returnSites(res))
        .map(collections => Config.SP_COLLECTIONS.push(collections));
    })
  inquirer.prompt(loginObservable)
    .then((answers) => {
      Config.SP_ROOT = answers['sproot'] || Config.SP_ROOT;
      Config.USER_NAME = answers['username'] || Config.USER_NAME;
      Config.USER_PASSWORD = answers['password'] || Config.USER_PASSWORD;
      Config.USER_DOMAIN = answers['domain'] || Config.USER_DOMAIN;
      const spCollections = new SharePointCollections();
      const siteCollections = spCollections.searchSites().mergeMap(res => spCollections.returnSites(res));
      // subscribe and push results to config
      siteCollections.map((collections) => {
        Config.SP_COLLECTIONS.push(collections);
        return answers;
      });
    })
    .then(() => {
      
    });
  //let loginQuestions: inquirer.Question[] = [
  //  {
  //    type: 'confirm',
  //    name: 'confirm_sproot',
  //    message: `Just checking, is your sharepoint root url: ${Config.SP_ROOT}?`,
  //    when: !!Config.SP_ROOT
  //  },
  //  {
  //    type: 'input',
  //    name: 'sproot',
  //    message: `Enter your SharePoint root url with protocol (http:// or https://): `,
  //    when: (answers: any): boolean => {
  //      return !Config.SP_ROOT ? true : !answers.confirm_sproot;
  //    }
  //  },
  //  {
  //    type: 'confirm',
  //    name: 'confirm_user',
  //    message: `Just checking, is your username ${Config.USER_NAME}?`,
  //    when: !!Config.USER_NAME
  //  },
  //  {
  //    type: 'input',
  //    name: 'username',
  //    message: `Enter your SharePoint username: `,
  //    when: (answers: any): boolean => {
  //      return !Config.USER_NAME ? true : !answers.confirm_user;
  //    }
  //  },
  //  {
  //    type: 'confirm',
  //    name: 'confirm_pass',
  //    message: `Do you want to reenter your password?`,
  //    when: !!Config.USER_NAME && !!Config.USER_PASSWORD
  //  },
  //  {
  //    type: 'password',
  //    name: 'password',
  //    message: `Enter your SharePoint password: `,
  //    when: (answers: any): boolean => {
  //      return !Config.USER_PASSWORD ? true : !answers.confirm_pass;
  //    }
  //  },
  //  {
  //    type: 'confirm',
  //    name: 'confirm_domain',
  //    message: `Is your domain ${Config.USER_DOMAIN}?`,
  //  },
  //  {
  //    type: 'input',
  //    name: 'domain',
  //    message: `Enter your SharePoint domain: `,
  //    when: (answers: any): boolean => {
  //      return !answers.confirm_domain;
  //    },
  //    default: 'corporate'
  //  },
  //];
  //let collectionQuestion: inquirer.Question = {
  //  type: 'checkbox',
  //  name: 'collection_select',
  //  message: 'Select the site collection(s) to modify',
  //  choices: () => {
  //    let siteColls: string[] = ['all'];
  //    // push collection names to result
  //    Config.SP_COLLECTIONS.forEach((coll) => {
  //      siteColls.push(coll.name);
  //    });
  //    return siteColls;
  //  },
  //  when: Config.SELECTED_COLLECTIONS === null
  //};

  ////let loginObservable: Rx.Observable<inquirer.Question> = Rx.Observable.from(loginQuestions);

  //const inquirerObservable = Rx.Observable.bindCallback(inquirer.prompt);
  //const loginResult = inquirerObservable(loginQuestions)
  //  .map((answers: inquirer.Answers) => {
  //    Config.SP_ROOT = answers['sproot'] || Config.SP_ROOT;
  //    Config.USER_NAME = answers['username'] || Config.USER_NAME;
  //    Config.USER_PASSWORD = answers['password'] || Config.USER_PASSWORD;
  //    Config.USER_DOMAIN = answers['domain'] || Config.USER_DOMAIN;
  //    return answers;
  //  })
  //  .switchMap(answers => {
  //    var spCollections = new SharePointCollections();
  //    var siteCollections = spCollections
  //      .searchSites()
  //      .mergeMap(res => spCollections.returnSites(res));
  //    // subscribe and push results to config
  //    return siteCollections
  //      .map(collections => {
  //        Config.SP_COLLECTIONS.push(collections);
  //        return [answers, collections];
  //      });
  //  })
  //  .concatAll();
  //const collectionResult = inquirerObservable(collectionQuestion);
  //const inquirerResults = Rx.Observable.concat(loginResult, collectionResult);
  //inquirerResults.subscribe(x => {
  //  console.log(x);
  //  done();
  //},
  //  err => console.log(err));
  //  .concat(answers => {
  //    // get collections with current input
  //    let spCollections = new SharePointCollections();
  //    let siteCollections = spCollections.searchSites().mergeMap(res => spCollections.returnSites(res));
  //    // subscribe and push results to config
  //    return siteCollections.map((collections) => {
  //      Config.SP_COLLECTIONS.push(collections);
  //      return answers;
  //    }); 
  //  })
  //  .mergeMap(answerResults => Rx.Observable.fromPromise(inquirer.prompt(collectionQuestion)))
  //  .subscribe(answer => {
  //  Config.SELECTED_COLLECTIONS = (() => {
  //    return Config.SELECTED_COLLECTIONS !== null ? Config.SELECTED_COLLECTIONS : Config.SP_COLLECTIONS.filter((collection) => {
  //      return answer['collection_select'].forEach((selected: string) => {
  //        return selected === 'all' ? true : selected === collection.name;
  //      });
  //    });
  //  })();
  //  done();
  //});
}
