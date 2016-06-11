System.register(['@angular/core', '@angular/platform-browser-dynamic', './app.service'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, platform_browser_dynamic_1, app_service_1;
    var HeaderComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (platform_browser_dynamic_1_1) {
                platform_browser_dynamic_1 = platform_browser_dynamic_1_1;
            },
            function (app_service_1_1) {
                app_service_1 = app_service_1_1;
            }],
        execute: function() {
            let HeaderComponent = class HeaderComponent {
                constructor(service) {
                    this.service = service;
                    this.name = "Suraj";
                    this.connection = {
                        host: "localhost", port: 6379
                    };
                }
                testConnection(data) {
                    console.log(data);
                    this.service.connect();
                }
            };
            HeaderComponent = __decorate([
                core_1.Component({
                    selector: 'header',
                    templateUrl: "src/app/header/header.html",
                    providers: [app_service_1.HeaderService]
                }), 
                __metadata('design:paramtypes', [app_service_1.HeaderService])
            ], HeaderComponent);
            exports_1("HeaderComponent", HeaderComponent);
            platform_browser_dynamic_1.bootstrap(HeaderComponent);
        }
    }
});

//# sourceMappingURL=app.component.js.map
