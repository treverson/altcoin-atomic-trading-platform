import {
  BtcInitiateParams,
  BtcParticipateParams,
  BitcoinWallet,
  InitiateData,
  ParticipateData,
  RedeemData,
  BtcRedeemParams
} from "altcoinio-wallet";
import {Observable} from "rxjs/Observable";
import {ShapeshiftStorage} from "../../common/shapeshift-storage";
import {BtcCoinModel} from "../coins/btc-coin.model";
import {Wallet} from "./wallet";

export class BtcWallet extends BitcoinWallet implements Wallet {

  constructor() {
    super();
  }

  Participate(data: InitiateData, btc: BtcCoinModel): Observable<ParticipateData> {
    // tslint:disable-next-line
    console.log("PARTICIPATING BTC:... ", InitiateData);
    const btcParticipateParams = new BtcParticipateParams();
    btcParticipateParams.address = (<any>data).address;
    btcParticipateParams.secretHash = data.secretHash;
    btcParticipateParams.amount = btc.amount;
    btcParticipateParams.privateKey = ShapeshiftStorage.get("btc-wif");
    btcParticipateParams.refundTime = 7200;
    console.log("btcParticipateParams", btcParticipateParams);
    return Observable.fromPromise(super.participate(btcParticipateParams));
  }

  Initiate(address: string, btc: BtcCoinModel): Observable<InitiateData> {
    const initParams = this.getInitParams(address, btc.amount);
    return Observable.fromPromise(
      super.initiate(
        initParams,
      ),
    );
  }

  Redeem(data: RedeemData, btc: BtcCoinModel): Observable<RedeemData> {
    const redeemParams = this.getRedeemParams(this.unoxify(data.secret), this.unoxify(data.secretHash), data.contractBin, data.contractTx);
    return Observable.fromPromise(
      super.redeem(
        redeemParams,
      ),
    );
  }

  getInitParams(address: string, amount: number): BtcInitiateParams {
    const wif = ShapeshiftStorage.get("btc-wif");
    return new BtcInitiateParams(7200, wif, address, amount);
  }

  getRedeemParams(secret: string, hashedsecret: string, contractBin, contractTx): BtcRedeemParams {
    const wif = ShapeshiftStorage.get("btc-wif");
    return new BtcRedeemParams(wif, secret, hashedsecret, contractBin, contractTx);
  }

  unoxify(param: string): string {
    return param.indexOf("0x") !== -1 ? param.slice(2) : param
  }
}
