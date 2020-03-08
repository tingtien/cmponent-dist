/*
 * @Descripttion: 前端日志收集
 * @Author: tingtien
 * @Date: 2020-02-25 09:29:34
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-03-08 12:17:11
 */
import axios from "axios";
import Utils from "./utils";
import FMN from "@fm/network";
import queryString from "query-string";

/* Declaration Start */
interface Config {
  options: {
    platform: string; // 平台 h5 app
    productName: string; // 产品名
    version: string; // 版本号
  };
  configOpen: {
    URL: string;
    API_NAME: string;
    AES_KEY: string; // 数据上报不依赖Token
  };
  log: {
    enable: string | boolean;  // 默认关闭
    level: string[]; // 采集类型
  };
}

interface Message {
  type?: number; // 日志类型 默认1  // 1 error 2 info 3 warning
  code?: number; // 静态资源找不到 1，接口问题 2，代码问题 3,  代码问题 4,
  msg?: string | object | object[]; // 事件描述信息
  page?: {
    page_id?: string; // 页面id
    title?: string; // 页面title
    current_url?: string; // 当前url
    source_url?: string; // 来源url
  };
  api?: {
    request?: any;
    response?: any;
  };
}

interface Data {
  session_id: string;
  platform?: string; // 平台 h5 app
  user_id?: string;
  source_id?: string;
  product_id?: string;
  product_name?: string;
  product_version?: string;
  sceen_w?: number;
  sceen_h?: number;
  navigator?: {
    user_agent?: string;
    app_name?: string;
    cookie_enabled?: boolean;
    online?: boolean;
    vendor?: string;
  };
  messsge?: Message;
}
/* Declaration End */

class Logs {
  private store: Message[];
  public config: Config;
  private dataDefault: Data;
  constructor() {
    this.store = [];
    this.config = {
      options: {
        platform: "h5",
        productName: "",
        version: ""
      },
      configOpen: {
        URL: "",
        API_NAME: "",
        AES_KEY: ""
      },
      log: {
        enable: false,
        level: ["error", "info"]
      }
    };  
    this.getConfig();
    this.dataDefault = {
      session_id: Utils.getSessionId(),
      navigator: Utils.getNavigator()
    };
    this._addEventListener();
    this._network();
  }
  private getConfig() {
    // @ts-ignore
    const config = window.fmbase && window.fmbase.fmia;
    if (!config || !config.fmia) {
      return
    }

    if (config.log && config.log.enable && config.log.enable != "1") {
      console.info("[FMLOG] Log is unavailable")
      return
    }

    this.config.options = config.options;
    this.config.configOpen = config.configOpen;

    config.level && typeof config.level === "object" && (this.config.log.level = config.level)
  }
  public save(options: Message, callback?: () => void) {
    if (!options.msg) {
      return;
    }
    // 1 error 2 warning 3 info
    let logType = 1;
    switch (options.type) {
      case 2:
        logType = 2;
        break;
      case 3:
        logType = 3;
        break;
    }
    const data = {
      ...this.dataDefault,
      sceen_w: window.screen.width,
      sceen_h: window.screen.width,
      message: {
        type_l: logType,
        type_e: options.code,
        msg: options.msg,
        page: {
          page_id: Utils.getPageId(),
          title: document.title,
          current_url: window.location.href,
          // @ts-ignore
          source_url: window.FMIA_NEXT_URL || document.referrer
        },
        api: {}
      }
    }
    if (options.api && (options.api.request || options.api.response)) {
      data.message.api = {
        request: options.api.request,
        response: options.api.response
      };
    }
    // this.store.push(data);
    this.send(this.store, callback);
  }
  private send(item, callback?: () => void) {
    const dataStr = JSON.stringify(item);

    const data = {
      device_session: "",
      timestamp: new Date().getTime(),
      data: dataStr
    };
    console.info("[FMIA] Data is sent:")
    console.info(data)
    FMN.requestDataNoToken(this.config.configOpen.URL, this.config.configOpen.AES_KEY, "", {
      head: {
        api_name: this.config.configOpen.API_NAME,
        api_code: "",
        module_code: "",
        client_serial_no: ""
      },
      body: {
        siteId: "",
        appId: "",
        merchantNo: "",
        data: data
      }
    }).then(rs => {
      if (rs && rs.success && rs.code === 200) {
        console.info(`[FMIA] Data come form Server:`)
        console.info(rs)

        typeof callback === "function" && callback();

      } else {
        console.error(`[FMIA] Data come form Server:`)
        console.info(rs)

        typeof callback === "function" && callback();
      }
    }).catch(error => {
      console.error(`[FMIA] Data sent failed:`);
      console.error(error)
      typeof callback === "function" && callback();
    });
  }
  private _network() {
    let NETWORK_REQUEST = {};
    let NETWORK_RESPONSE = {};
    // Add a request interceptor
    axios.interceptors.request.use(
      request => {
        NETWORK_REQUEST = request;
        return request;
      },
      error => {
        // console.info(error, NETWORK_REQUEST, 22);
        this.save({
          msg: error,
          api: {
            request: NETWORK_REQUEST
          }
        });
        return error;
      }
    );

    // Add a response interceptor
    axios.interceptors.response.use(
      response => {
        NETWORK_RESPONSE = response;
        return response;
      },
      error => {
        // console.info(error, NETWORK_REQUEST, NETWORK_RESPONSE, 44);
        this.save({
          msg: error,
          api: {
            request: NETWORK_REQUEST,
            response: NETWORK_RESPONSE
          }
        });
        return error;
      }
    );
  }
  private _addEventListener() {
    const that = this;
    window.addEventListener(
      "error",
      function () {
        console.log("捕获到异常：", arguments[0], 1);
        that.save({
          code: 1,
          msg: `${arguments[0].target.href} cannot found`
        });
      },
      true
    );
    window.onerror = function () {
      console.log(arguments, 3);
      return true;
    };
  }
}
const logs = new Logs();
const FMLOG = {
  error: (msg: string) => {
    logs.save({
      type: 1,
      code: 4,
      msg:
        typeof msg === "object"
          ? JSON.stringify(msg)
          : msg
    });
  },
  info: (msg: string) => {
    let status = false;
    logs.config && logs.config.log.level.forEach(item => {
      if (item === "info") {
        status = true;
      }
    })
    if (status) {
      console.info("[FMLOG] info is not available")
      logs.save({
        type: 2,
        code: 4,
        msg:
          typeof msg === "object"
            ? JSON.stringify(msg)
            : msg
      });
    }
  },
  warn: (msg: string) => {
    let status = false;
    logs.config && logs.config.log.level.forEach(item => {
      if (item === "warn") {
        status = true;
      }
    })
    if (status) {
      console.info("[FMLOG] warn is not available")
      logs.save({
        type: 3,
        code: 4,
        msg:
          typeof msg === "object"
            ? JSON.stringify(msg)
            : msg
      });
    }
  }
};
Object.defineProperty(window, "FMLOG", {
  value: FMLOG,
  writable: false,
  configurable: false
});
