import {Individus} from "./individus.model";

export class Sample {
  constructor(public sampleId?: string,
              public sampleDesc?: string,
              public sampleTypeId?: string,
              public createDT?: any,
              public kitTube?: string,
              public createBy?: string,
              public receivedDT?: any,
              public sstudyId?: string
              ){}
}
