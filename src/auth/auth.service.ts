import { Injectable } from "@angular/core"
import { Account } from "./account/account"

import { Observable } from "rxjs/Observable"
import { Subject } from "rxjs/Subject"
import "rxjs/add/operator/mergeMap"

declare let Keycloak: any

export type onLoadT = 'login-required' | 'check-sso'
export type responseModeT = 'query' | 'fragment'
export type flowT = 'standard' | 'implicit' | 'hybrid'

export interface KeycloakPromise {
  success(fn: (value: any) => void): KeycloakPromise
  error(fn: (error: any) => void): KeycloakPromise
}

export function keycloakPromiseToPromise(keycloakPromise: KeycloakPromise): Promise<any> {
  return new Promise((resolve, reject) => {
    keycloakPromise.success((value) => resolve(value))
      .error(e => reject(e))
  })
}

@Injectable()
export abstract class InitOptions {
  /**
   * URL for the keycloak server
   */
  url?: string
  /**
   * Realm to authenticate
   */
  realm?: string
  /**
   * Client ID
   */
  clientId?: string
  /**
   * Specifies an action to do on load. Supported values are 'login-required' or 'check-sso'.
   */
  onLoad?: onLoadT
  /**
   * Set an initial value for the token.
   */
  token?: string
  /**
   * Set an initial value for the refresh token.
   */
  refreshToken?: string
  /**
   * Set an initial value for the id token (only together with token or refreshToken).
   */
  idToken?: string
  /**
   * Set an initial value for skew between local time and Keycloak server in seconds (only together with token or refreshToken).
   */
  timeSkew?: number
  /**
   * Set to enable/disable monitoring login state (default is true).
   */
  checkLoginIframe?: boolean
  /**
   * Set the interval to check login state (default is 5 seconds).
   */
  checkLoginIframeInterval?: number
  /**
   * Set the OpenID Connect response mode send to Keycloak server at login request. Valid values are query or
   * fragment. Default value is fragment, which means that after successful authentication will Keycloak redirect
   * to javascript application with OpenID Connect parameters added in URL fragment. This is generally safer and
   * recommended over query.
   */
  responseMode?: responseModeT
  /**
   * Set the OpenID Connect flow. Valid values are standard, implicit or hybrid.
   */
  flow?: flowT
}
export type promptT = 'none' | 'login'
export type actionT = 'register' | 'login'
export interface LoginOptions {
  /**
   * Specifies the uri to redirect to after login.
   */
  redirectUri?: string
  /**
   * By default the login screen is displayed if the user is not logged-in to Keycloak. To only authenticate to the
   * application if the user is already logged-in and not display the login page if the user is not logged-in, set this
   * option to none. To always require re-authentication and ignore SSO, set this option to login .
   */
  prompt?: promptT
  /**
   * Used just if user is already authenticated. Specifies maximum time since the authentication of user happened.
   * If user is already authenticated for longer time than maxAge, the SSO is ignored and he will need to
   * re-authenticate again.
   */
  maxAge?: number
  /**
   * Used to pre-fill the username/email field on the login form.
   */
  loginHint?: string
  /**
   * If value is 'register' then user is redirected to registration page, otherwise to login page.
   */
  action?: actionT
  /**
   * Specifies the desired locale for the UI.
   */
  locale?: string
}

export interface LogoutOptions {
  redirectUri: string
}

export interface KeycloakType {
  token: string
  authenticated: boolean
  tokenParsed: any
  subject: string
  idToken: string
  idTokenParsed: any
  realmAccess: string[]
  resourceAccess: string[]
  refreshToken: string
  refreshTokenParsed: any
  timeSkew: number
  responseMode: string
  responseType: string
  flow: string

  /**
  * Called when a user is successfully authenticated
  */
  onAuthSuccess: () => void

  /**
   * Called when the adapter is initialized.
   * @param authenticated
   */
  onReady: (authenticated) => void

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

  /**
   * Called to initialize the adapter.
   * @param options
   */
  init(options: InitOptions): KeycloakPromise

  /**
   * Redirects to login form on (options is an optional object with redirectUri and/or prompt fields).
   * @param options
   */
  login(options?: LoginOptions)

  /**
   * Returns the URL to login form on (options is an optional object with redirectUri and/or prompt fields).
   * Options is an Object, which supports same options like the function login .
   * @param options
   */
  createLoginUrl(options?: LoginOptions)

  /**
   * Returns the URL to logout the user.
   * Options is an Object, where:
   * redirectUri - Specifies the uri to redirect to after logout.
   * @param options
   */
  createLogoutUrl(options?: LogoutOptions): string

  /**
   * Redirects to logout.
   * Options is an Object, where:
   * redirectUri - Specifies the uri to redirect to after logout.
   * @param options
   */
  logout(options?: LogoutOptions)

  /**
   * If the token expires within minValidity seconds (minValidity is optional, if not specified 0 is used) the token
   * is refreshed. If the session status iframe is enabled, the session status is also checked.
   * Returns promise to set functions that can be invoked if the token is still valid, or if the token
   * is no longer valid
   * @param minValue
   */
  updateToken(minValue?: number): KeycloakPromise

  /**
   * Redirects to registration form. Shortcut for login with option action = 'register'
   * Options are same as for the login method but 'action' is set to 'register'
   * @param options
   */
  register(options?: LoginOptions)

  /**
   * Returns the url to registration page. Shortcut for createLoginUrl with option action = 'register'
   * Options are same as for the createLoginUrl method but 'action' is set to 'register'
   * @param options
   */
  createRegisterUrl(options?: LoginOptions): string

  /**
   * Redirects to the Account Management Console.
   */
  accountManagement()

  /**
   * Returns the URL to the Account Management Console.
   */
  createAccountUrl(): string

  /**
   * Returns true if the token has the given realm role.
   * @param role
   */
  hasRealmRole(role: string): boolean

  /**
   * Returns true if the token has the given role for the resource (resource is optional, if not specified clientId
   * is used).
   */
  hasResourceRole(role: string, resource?: string): boolean

  /**
   * Loads the users profile.
   * Returns promise to set functions to be invoked on success or error.
   */
  loadUserProfile(): KeycloakPromise

  /**
   * Returns true if the token has less than minValidity seconds left before it expires (minValidity is optional,
   * if not specified 0 is used).
   * @param minValidity
   */
  isTokenExpired(minValidity?: number): boolean

  /**
   * If the token expires within minValidity seconds (minValidity is optional, if not specified 0 is used) the token
   * is refreshed. If the session status iframe is enabled, the session status is also checked.
   * Returns promise to set functions that can be invoked if the token is still valid, or if the token is no longer
   * valid
   * @param minValidity
   */
  updateToken(minValidity?: number): KeycloakPromise

  /**
   * Clear authentication state, including tokens. This can be useful if application has detected the session was
   * expired, for example if updating token fails.
   * Invoking this results in onAuthLogout callback listener being invoked.
   */
  clearToken()
}

/**
 * Provides authentication service for the application
 * This class wrapps a keycloak object
 * https://keycloak.gitbooks.io/securing-client-applications-guide/content/v/2.4/topics/oidc/javascript-adapter.html
 */
@Injectable()
export class AuthService {
  protected initCallBack: Promise<boolean> = Promise.resolve(false)
  keycloak: KeycloakType

  private _onReady: Subject<boolean>
  private _onAuthSuccess: Subject<void>
  private _onAuthError: Subject<void>
  private _onAuthRefreshError: Subject<void>
  private _onAuthLogout: Subject<void>
  private _onTokenExpired: Subject<void>

  get onReady(): Observable<boolean> {
    return this._onReady.asObservable()
  }

  constructor(config: InitOptions) {
    this._onReady = new Subject()
    this._onAuthSuccess = new Subject<void>()
    this._onAuthError = new Subject<void>()
    this._onAuthRefreshError = new Subject<void>()
    this._onAuthLogout = new Subject<void>()
    this._onTokenExpired = new Subject<void>()
    this.init(config)
  }

  private initEvents() {
    this.keycloak.onReady = (authenticated) => this._onReady.next(authenticated)
    this.keycloak.onAuthSuccess = () => this._onAuthSuccess.next()
    this.keycloak.onAuthError = () => this._onAuthError.next()
    this.keycloak.onAuthRefreshError = () => this._onAuthRefreshError.next()
    this.keycloak.onAuthLogout = () => this._onAuthLogout.next()
    this.keycloak.onTokenExpired = () => this._onTokenExpired.next()
  }

  init(config: any): Promise<boolean> {
    if (this.keycloak == null) {
      this.keycloak = new Keycloak(config)
    }
    this.initCallBack = new Promise((resolve) => {
      this.keycloak.init(config)
        .success((value) => {
          resolve(value)
        }).error(() => {
          resolve(false)
        })
    })
    return this.initCallBack
  }

  isUserLoggedIn(): Promise<boolean> {
    return this.initCallBack
  }

  login(options?: LoginOptions) {
    this.keycloak.login()
  }

  createLoginUrl(options?: LoginOptions) {
    return this.keycloak.createLoginUrl(options)
  }

  logout(options?: LogoutOptions) {
    this.keycloak.logout(options)
  }

  createLogoutUrl(options?: LogoutOptions) {
    return this.keycloak.createLogoutUrl(options)
  }

  register(options?: LoginOptions) {
    this.keycloak.register(options)
  }

  createRegisterUrl(options?: LoginOptions) {
    return this.keycloak.createRegisterUrl(options)
  }

  accountManagement() {
    this.keycloak.accountManagement()
  }

  createAccountManagementUrl() {
    return this.keycloak.createAccountUrl()
  }

  loadUserProfile(): Observable<Account> {
    return this.getLoginAccount()
  }

  isTokenExpired(minValidity?: number): boolean {
    return this.keycloak.isTokenExpired(minValidity)
  }

  updateToken(minValidity?: number): Observable<any> {
    return Observable.fromPromise(keycloakPromiseToPromise(this.keycloak.updateToken(minValidity)))
  }

  clearToken() {
    this.keycloak.clearToken()
  }

  getLoginAccount(): Observable<Account> {
    return this.updateToken(10).flatMap(_ => Observable.fromPromise(keycloakPromiseToPromise(this.keycloak.loadUserProfile())))
  }

  hasRole(role: string, resource?: string) {
    if (resource) {
      return this.keycloak.hasResourceRole(role, resource)
    } else {
      return this.keycloak.hasRealmRole(role)
    }
  }

}
