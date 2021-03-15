(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! C:\Work\websdk-only-morph\ZoomAngularTest\src\main.ts */"zUnb");


/***/ }),

/***/ "AytR":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const environment = {
    production: false
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "Sy1n":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "tk/3");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "tyNb");





class AppComponent {
    constructor(httpClient, document, route) {
        this.httpClient = httpClient;
        this.route = route;
        this.loader = CY.loader();
        this.oppenedConnection = false;
        this.route.queryParams.subscribe(params => {
            let meetingId = params['meetingId'];
            this.meetingNumber = meetingId;
        });
    }
    ngOnInit() {
        console.log("init");
        this.loadMorphcast();
        this.connectToServerAndStartSendingDataGuest(this.meetingNumber, "Guest_" + this.getRandomID(), "Guest_" + this.getRandomID() + "@gmail.com");
    }
    getRandomID() {
        return Math.random().toString(36).substr(2, 9);
    }
    loadMorphcast() {
        this.loader.licenseKey("39d24a4191518dde3e4fbed5ec690d6fc6a22dd3507d");
        this.loader.addModule(CY.modules().FACE_DETECTOR.name, { maxInputFrameSize: 320, multiFace: true });
        this.loader.addModule(CY.modules().FACE_ATTENTION.name, { smoothness: 0.99 });
        this.loader.addModule(CY.modules().FACE_EMOTION.name, { smoothness: 0.99, enableBalancer: false });
        this.loader.addModule(CY.modules().FACE_AROUSAL_VALENCE.name, { smoothness: 0.8 });
        this.loader.addModule(CY.modules().FACE_AGE.name);
        this.loader.powerSave(1);
        this.loader.maxInputFrameSize(320);
        this.loader.load().then(({ start, stop, terminate }) => {
            this.startSDK = start;
            this.stopSDK = stop;
            this.terminateSDK = terminate;
        });
    }
    connectToServerAndStartSendingDataGuest(meetingNumber, name, email) {
        this.user = {};
        this.user.name = name;
        this.user.user_id = email;
        this.ws = new WebSocket('wss://guarded-garden-95047.herokuapp.com');
        this.ws.onopen = () => {
            console.log('WebSocket Client Connected');
            const data = {
                user_id: this.user.user_id,
                meetingNumber: meetingNumber
            };
            this.ws.send(JSON.stringify(data));
            this.oppenedConnection = true;
        };
        this.ws.onclose = () => {
            this.oppenedConnection = false;
        };
        this.ws.onmessage = function (message) {
            console.log(message);
            console.log(message.data);
            console.log(JSON.parse(message.data));
        };
        window.addEventListener(CY.modules().FACE_DETECTOR.eventName, (evt) => {
            console.log('Face detector result', evt.detail);
            const data = {
                user: this.user.name,
                eventType: evt.detail.type,
                eventValue: evt.detail.totalFaces
            };
            if (this.oppenedConnection) {
                this.ws.send(JSON.stringify(data));
            }
        });
        window.addEventListener(CY.modules().FACE_AGE.eventName, (evt) => {
            console.log('Age result', evt.detail);
            let data = new EventData();
            data.user = this.user.name;
            data.eventType = evt.detail.type;
            data.eventValue = evt.detail.output.numericAge;
            if (this.oppenedConnection) {
                this.ws.send(JSON.stringify(data));
            }
        });
        window.addEventListener(CY.modules().FACE_EMOTION.eventName, (evt) => {
            console.log('Emotion result', evt.detail);
            let data = new EventData();
            data.user = this.user.name;
            data.eventType = evt.detail.type;
            data.eventValue = evt.detail.output.dominantEmotion;
            if (this.oppenedConnection) {
                this.ws.send(JSON.stringify(data));
            }
        });
        window.addEventListener(CY.modules().FACE_ATTENTION.eventName, (evt) => {
            console.log('Face attention result', evt.detail);
            let data = new EventData();
            data.user = this.user.name;
            data.eventType = evt.detail.type;
            data.eventValue = evt.detail.output.attention;
            if (this.oppenedConnection) {
                this.ws.send(JSON.stringify(data));
            }
        });
        window.addEventListener(CY.modules().FACE_AROUSAL_VALENCE.eventName, (evt) => {
            console.log('Face arousal valence result', evt.detail, evt.detail.output.arousalvalence.arousal > 0);
            if (evt.detail.output.arousalvalence.arousal > 0) {
                let data = new EventData();
                data.user = this.user.name;
                data.eventType = "face_arousal";
                data.eventValue = evt.detail.output.arousalvalence.arousal;
                if (this.oppenedConnection) {
                    this.ws.send(JSON.stringify(data));
                }
            }
            if (evt.detail.output.arousalvalence.valence > 0) {
                let data = new EventData();
                data.user = this.user.name;
                data.eventType = "face_valence";
                data.eventValue = evt.detail.output.arousalvalence.valence;
                if (this.oppenedConnection) {
                    this.ws.send(JSON.stringify(data));
                }
            }
        });
    }
}
AppComponent.ɵfac = function AppComponent_Factory(t) { return new (t || AppComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_common__WEBPACK_IMPORTED_MODULE_1__["DOCUMENT"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_3__["ActivatedRoute"])); };
AppComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: AppComponent, selectors: [["app-root"]], decls: 9, vars: 0, consts: [[3, "click"]], template: function AppComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "main");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "h1");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, "Morphcast SDK Sample Angular");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "button", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function AppComponent_Template_button_click_3_listener() { return ctx.startSDK(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4, "Start SDK ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "button", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function AppComponent_Template_button_click_5_listener() { return ctx.stopSDK(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6, "Stop SDK ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "button", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function AppComponent_Template_button_click_7_listener() { return ctx.terminateSDK(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8, "Terminate SDK ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } }, styles: ["main[_ngcontent-%COMP%] {\r\n  width: 70%;\r\n  margin: auto;\r\n  text-align: center;\r\n}\r\n\r\nbutton[_ngcontent-%COMP%] {\r\n  margin-top: 20px;\r\n  background-color: #2D8CFF;\r\n  color: #ffffff;\r\n  text-decoration: none;\r\n  padding-top: 10px;\r\n  padding-bottom: 10px;\r\n  padding-left: 40px;\r\n  padding-right: 40px;\r\n  display: inline-block;\r\n  border-radius: 10px;\r\n}\r\n\r\nbutton[_ngcontent-%COMP%]:hover {\r\n  background-color: #2681F2;\r\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UsVUFBVTtFQUNWLFlBQVk7RUFDWixrQkFBa0I7QUFDcEI7O0FBRUE7RUFDRSxnQkFBZ0I7RUFDaEIseUJBQXlCO0VBQ3pCLGNBQWM7RUFDZCxxQkFBcUI7RUFDckIsaUJBQWlCO0VBQ2pCLG9CQUFvQjtFQUNwQixrQkFBa0I7RUFDbEIsbUJBQW1CO0VBQ25CLHFCQUFxQjtFQUNyQixtQkFBbUI7QUFDckI7O0FBRUE7RUFDRSx5QkFBeUI7QUFDM0IiLCJmaWxlIjoiYXBwLmNvbXBvbmVudC5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyJtYWluIHtcclxuICB3aWR0aDogNzAlO1xyXG4gIG1hcmdpbjogYXV0bztcclxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbn1cclxuXHJcbmJ1dHRvbiB7XHJcbiAgbWFyZ2luLXRvcDogMjBweDtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMkQ4Q0ZGO1xyXG4gIGNvbG9yOiAjZmZmZmZmO1xyXG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcclxuICBwYWRkaW5nLXRvcDogMTBweDtcclxuICBwYWRkaW5nLWJvdHRvbTogMTBweDtcclxuICBwYWRkaW5nLWxlZnQ6IDQwcHg7XHJcbiAgcGFkZGluZy1yaWdodDogNDBweDtcclxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbiAgYm9yZGVyLXJhZGl1czogMTBweDtcclxufVxyXG5cclxuYnV0dG9uOmhvdmVyIHtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMjY4MUYyO1xyXG59XHJcbiJdfQ== */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](AppComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-root',
                templateUrl: './app.component.html',
                styleUrls: ['./app.component.css']
            }]
    }], function () { return [{ type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"] }, { type: undefined, decorators: [{
                type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"],
                args: [_angular_common__WEBPACK_IMPORTED_MODULE_1__["DOCUMENT"]]
            }] }, { type: _angular_router__WEBPACK_IMPORTED_MODULE_3__["ActivatedRoute"] }]; }, null); })();
class EventData {
}


/***/ }),

/***/ "ZAI4":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "jhN1");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "tk/3");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app.component */ "Sy1n");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ "tyNb");







class AppModule {
}
AppModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineNgModule"]({ type: AppModule, bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"]] });
AppModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjector"]({ factory: function AppModule_Factory(t) { return new (t || AppModule)(); }, providers: [], imports: [[
            _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
            _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClientModule"],
            _angular_router__WEBPACK_IMPORTED_MODULE_4__["RouterModule"].forRoot([{
                    path: '',
                    component: _app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"]
                },
            ]),
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsetNgModuleScope"](AppModule, { declarations: [_app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"]], imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
        _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClientModule"], _angular_router__WEBPACK_IMPORTED_MODULE_4__["RouterModule"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵsetClassMetadata"](AppModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"],
        args: [{
                declarations: [
                    _app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"]
                ],
                imports: [
                    _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
                    _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClientModule"],
                    _angular_router__WEBPACK_IMPORTED_MODULE_4__["RouterModule"].forRoot([{
                            path: '',
                            component: _app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"]
                        },
                    ]),
                ],
                providers: [],
                bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"]]
            }]
    }], null, null); })();


/***/ }),

/***/ "zUnb":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./environments/environment */ "AytR");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "ZAI4");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/platform-browser */ "jhN1");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
_angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__["platformBrowser"]().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(err => console.error(err));


/***/ }),

/***/ "zn8P":
/*!******************************************************!*\
  !*** ./$$_lazy_route_resource lazy namespace object ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "zn8P";

/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map