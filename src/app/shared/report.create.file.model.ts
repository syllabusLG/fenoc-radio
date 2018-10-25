export class ReportCreateFile {

  constructor(public id?: number,
              public module?: string,
              public nbreLinesCreated?: number,
              public nbreLinesRejected?: number,
              public role?: string,
              public username?: string){}

}
