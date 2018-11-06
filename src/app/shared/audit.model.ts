
export class Audit {
  constructor(public id?: string,
              public username?: string,
              public loginDate?: Date,
              public uploadFileName?: String,
              public errorFileName?: String,
              public reportFileName?: String,
              public individuReportCSV?: String,
              public salarieReportCSV?: String,
              public contactReportCSV?: String,
              public paymentReportCSV?: String,
              public adresseReportCSV?: String,
              public compteReportCSV?: String,
              public updateIndividu?: String,
              public updateSalarie?: String,
              public updateContact?: String,
              public updatePayment?: String,
              public updateAdresse?: String,
              public updateCompte?: String,
              public deleteIndividu?: String,
              public deleteSalarie?: String,
              public deleteContact?: String,
              public deletePayment?: String,
              public deleteAdresse?: String,
              public deleteCompte?: String,
){}




}
