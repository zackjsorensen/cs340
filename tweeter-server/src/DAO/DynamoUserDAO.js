"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoUserDAO = void 0;
var ParentDAO_1 = require("./ParentDAO");
var lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
var DynamoUserDAO = /** @class */ (function (_super) {
    __extends(DynamoUserDAO, _super);
    function DynamoUserDAO() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.tableName = "users";
        return _this;
    }
    DynamoUserDAO.prototype.putUser = function (firstName, lastName, alias, password, imageUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var params, command;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            TableName: this.tableName,
                            Item: {
                                user_handle: alias,
                                first_name: firstName,
                                last_name: lastName,
                                password: password,
                                image_url: imageUrl
                            }
                        };
                        command = new lib_dynamodb_1.PutCommand(params);
                        return [4 /*yield*/, this.doOperation(command, function (result) {
                                return true;
                            }, "Failed to put user")];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DynamoUserDAO.prototype.getUser = function (userAlias) {
        return __awaiter(this, void 0, void 0, function () {
            var params, command;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            TableName: this.tableName,
                            Key: { user_handle: userAlias }
                        };
                        command = new lib_dynamodb_1.GetCommand(params);
                        return [4 /*yield*/, this.doOperation(command, function (result) {
                                if (result.Item) {
                                    var userDto = {
                                        alias: result.Item.user_handle,
                                        firstName: result.Item.first_name,
                                        lastName: result.Item.last_name,
                                        imageUrl: result.Item.image_url
                                    };
                                    return userDto;
                                }
                                else {
                                    var empty = null;
                                    return empty;
                                }
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DynamoUserDAO.prototype.getPassword = function (userAlias) {
        return __awaiter(this, void 0, void 0, function () {
            var params, command;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            TableName: this.tableName,
                            Key: { user_handle: userAlias }
                        };
                        command = new lib_dynamodb_1.GetCommand(params);
                        return [4 /*yield*/, this.doOperation(command, function (result) {
                                if (result.Item) {
                                    return result.Item.password;
                                }
                                else {
                                    throw new Error("Unable to retrieve password");
                                }
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DynamoUserDAO.prototype.putBatchOfUsers = function (items) {
        return __awaiter(this, void 0, void 0, function () {
            var params, command;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        params = {
                            RequestItems: (_a = {},
                                _a[this.tableName] = items.map(function (item) { return ({
                                    PutRequest: { Item: {
                                            user_handle: item.alias,
                                            first_name: item.firstName,
                                            last_name: item.lastName,
                                            password: "gocougs",
                                            image_url: item.imageUrl
                                        } }
                                }); }),
                                _a)
                        };
                        command = new lib_dynamodb_1.BatchWriteCommand(params);
                        return [4 /*yield*/, this.doOperation(command, function () { return true; })];
                    case 1: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    return DynamoUserDAO;
}(ParentDAO_1.ParentDAO));
exports.DynamoUserDAO = DynamoUserDAO;
/*
 Table: users
    - PK: user_handle
    - Attrs
        - firstName
        - lastName
        - password (hashed)
        - imageUrl

 */ 
