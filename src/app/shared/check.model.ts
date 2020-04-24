export class Check {
  constructor(public sampleId?: string,
              public sampleType?: string,
              public kidId?: string,
              public studyID?: string,
              public sujId?: string,
              public createDT?: any,
              public receivedDT?: any,
              public sampleIdRedCap?: string,
              public kidIdRedCap?: string,
              public collectionDT?: any,
              public qc?: string) {}
}
