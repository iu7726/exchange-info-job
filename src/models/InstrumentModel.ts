import instrument from '../seed/instrument.json'

export default class InstrumentModel {
  async getInstrument(instId: string) {
    return instrument.filter(item => item.instId == instId)[0]
  }
}