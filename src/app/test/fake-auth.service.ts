import { KeycloakType } from '../auth/auth.service'
import { Observable } from 'rxjs/Observable'
import { Account } from '../auth/account/account'

import 'rxjs/add/observable/of'

class FakeKeycloak {
  token: "fake"

  init() {

  }
  /**
   * Called if there was an error during authentication.
   */
  onAuthError: () => void

  /**
   * Called when the token is refreshed.
   */
  onAuthRefreshSuccess: () => void

  /**
   * Called if there was an error while trying to refresh the token.
   */
  onAuthRefreshError: () => void

  /**
   * Called if the user is logged out (will only be called if the session status iframe is enabled, or in Cordova mode).
   */
  onAuthLogout: () => void

  /**
   * Called when the access token is expired. If a refresh token is available the token can be refreshed with
   * updateToken, or in cases where it’s not (ie. with implicit flow) you can redirect to login screen to obtain a
   * new access token.
   */
  onTokenExpired: () => void

  updateToken(delay?: number) {
  }

}

export class FakeAuthService {
    authenticated: boolean = false
    account: Account = new Account()
    initCallBack: Promise<boolean>
    keycloak: KeycloakType = <any>new FakeKeycloak()

    init(config: any): Promise<boolean> {
        return Promise.resolve(true)
    }

    isUserLoggedIn(): Promise<boolean> {
        return Promise.resolve(this.authenticated)
    }

    login() {
        this.authenticated = true
    }

    logout() {
        this.authenticated = false
    }

    getLoginAccount(): Observable<Account> {
        return Observable.of(this.account)
    }
}
