"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.routes = void 0;
var express_1 = require("express");
var axios_1 = require("axios");
var dateAndTime_1 = require("./dateAndTime");
var token = process.env.TOKEN;
var myToken = process.env.MY_TOKEN;
exports.routes = (0, express_1.Router)(); // start routes
exports.routes.get("/", function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, response.status(200).send("Hello, World!")];
    });
}); });
exports.routes.get('/webhooks', function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var mode, challenge, token, myToken;
    return __generator(this, function (_a) {
        mode = request.query["hub.mode"];
        challenge = request.query["hub.challenge"];
        token = request.query["hub.verify_token"];
        myToken = process.env.MY_TOKEN;
        if (mode && token) {
            if (mode == "subscribe" && token == myToken) {
                response.status(200).send(challenge);
            }
            else {
                response.status(403);
            }
        }
        else {
            response.status(403);
        }
        return [2 /*return*/];
    });
}); });
exports.routes.post("/webhooks", function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var body, phoneNumberId, from, messageBody, region, datetime, expression, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, request.body];
            case 1:
                body = _a.sent();
                console.log("The Body: " + JSON.stringify(body, null, 2));
                if (body === null || body === void 0 ? void 0 : body.object) {
                    if (body.entry &&
                        body.entry[0].changes &&
                        body.entry[0].changes[0].value.messages &&
                        body.entry[0].changes[0].value.messages[0]) {
                        phoneNumberId = body.entry[0].changes[0].value.metadata.phone_number_id;
                        from = body.entry[0].changes[0].value.messages[0].from;
                        messageBody = body.entry[0].changes[0].value.messages[0].text.body;
                        console.log("".concat(from, " said ").concat(messageBody));
                        if (messageBody.startsWith("#time")) {
                            region = messageBody.substring(5).trim();
                            datetime = (0, dateAndTime_1.getTimeZone)(region);
                            (0, axios_1["default"])({
                                method: "POST",
                                url: "https://graph.facebook.com/v14.0/".concat(phoneNumberId, "/messages?access_token=").concat(token),
                                data: {
                                    messaging_product: "whatsapp",
                                    to: from,
                                    text: {
                                        body: "".concat(datetime)
                                    }
                                },
                                headers: {
                                    "Content-Type": "application/json"
                                }
                            });
                        }
                        else if (messageBody.startsWith("#calc")) {
                            expression = messageBody.substring(5).trim();
                            result = eval(expression);
                            (0, axios_1["default"])({
                                method: "POST",
                                url: "https://graph.facebook.com/v14.0/".concat(phoneNumberId, "/messages?access_token=").concat(token),
                                data: {
                                    messaging_product: "whatsapp",
                                    to: from,
                                    text: {
                                        body: "".concat(expression, " = ").concat(result)
                                    }
                                },
                                headers: {
                                    "Content-Type": "application/json"
                                }
                            });
                        }
                        else {
                            (0, axios_1["default"])({
                                method: "POST",
                                url: "https://graph.facebook.com/v14.0/".concat(phoneNumberId, "/messages?access_token=").concat(token),
                                data: {
                                    messaging_product: "whatsapp",
                                    to: from,
                                    text: {
                                        body: "Hi.. I'm ESimas Bot"
                                    }
                                },
                                headers: {
                                    "Content-Type": "application/json"
                                }
                            });
                        }
                        response.sendStatus(200);
                    }
                    else {
                        response.sendStatus(404);
                    }
                }
                return [2 /*return*/];
        }
    });
}); });
