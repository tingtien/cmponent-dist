/*
 * @Descripttion:
 * @Author:
 * @Date: 2020-02-25 14:08:05
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-03-08 12:05:52
 */

import * as md5 from "js-md5";
import Cookies from 'js-cookie';
import uuidv1 from 'uuid/v4';

class Utils {
  static getSessionId(): string {
    throw new Error("Method not implemented.");
  }
  getPageId() {
    const origin = window.location.search
      ? window.location.href.replace(window.location.hash, "").replace(window.location.search, "")
      : window.location.href;
    return md5(`${origin}${document.title}`);
  }
  getSessionId() {
    const id = Cookies.get('FMIASESSION');
    if (id) {
      console.info("[FMIA] Data named session_id come from Cookie");
      return id
    }
    const uuid = uuidv1();
    console.info("[FMIA] Data named session_id is created and saved to Storage called cookie");
    Cookies.set('FMIASESSION', uuid);
    return uuid;
  }
  getNavigator() {
    if (navigator) {
      return {
        user_agent: navigator.userAgent,
        app_name: navigator.appName,
        cookie_enabled: navigator.cookieEnabled,
        online: navigator.onLine,
        vendor: navigator.vendor
      }
    }
  }
};

export default new Utils()