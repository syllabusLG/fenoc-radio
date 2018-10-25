export class ReportUpdateFile {

  constructor(public id?: number,
              public module?: string,
              public nbreLinesUpdated?: number,
              public nbreLinesRejected?: number,
              public role?: string,
              public username?: string){}

}
