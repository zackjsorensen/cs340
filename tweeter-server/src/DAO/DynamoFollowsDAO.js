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
exports.DynamoFollowsDAO = void 0;
var lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
var ParentDAO_1 = require("./ParentDAO");
var DynamoUserDAO_1 = require("./DynamoUserDAO");
var DynamoFollowsDAO = /** @class */ (function (_super) {
    __extends(DynamoFollowsDAO, _super);
    function DynamoFollowsDAO() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.tableName = "follows";
        _this.indexName = "follows_index";
        _this.follower_handle_attr = "follower_handle";
        _this.followee_handle_attr = "followee_handle";
        _this.userDao = new DynamoUserDAO_1.DynamoUserDAO();
        return _this;
    }
    DynamoFollowsDAO.prototype.getFolloweeCount = function (userAlias) {
        return __awaiter(this, void 0, void 0, function () {
            var params, command;
            return __generator(this, function (_a) {
                params = {
                    TableName: this.tableName,
                    KeyConditionExpression: "follower_handle = :u",
                    ExpressionAttributeValues: { ":u": userAlias },
                    Select: "COUNT" // treats it as required literal rather than string
                };
                command = new lib_dynamodb_1.QueryCommand(params);
                return [2 /*return*/, this.doOperation(command, function (result) {
                        var _a;
                        return (_a = result.Count) !== null && _a !== void 0 ? _a : 0;
                    })];
            });
        });
    };
    DynamoFollowsDAO.prototype.getFollowerCount = function (userAlias) {
        return __awaiter(this, void 0, void 0, function () {
            var params, command;
            return __generator(this, function (_a) {
                params = {
                    TableName: this.tableName,
                    IndexName: this.indexName,
                    KeyConditionExpression: "followee_handle = :u",
                    ExpressionAttributeValues: { ":u": userAlias },
                    Select: "COUNT" // treats it as required literal rather than string
                };
                command = new lib_dynamodb_1.QueryCommand(params);
                return [2 /*return*/, this.doOperation(command, function (result) {
                        var _a;
                        return (_a = result.Count) !== null && _a !== void 0 ? _a : 0;
                    })];
            });
        });
    };
    DynamoFollowsDAO.prototype.getFollower = function (followeeAlias, followerAlias) {
        return __awaiter(this, void 0, void 0, function () {
            var params, command, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            TableName: this.tableName,
                            Key: {
                                follower_handle: followerAlias,
                                followee_handle: followeeAlias,
                            },
                        };
                        command = new lib_dynamodb_1.GetCommand(params);
                        return [4 /*yield*/, this.ddb.send(command)];
                    case 1:
                        result = _a.sent();
                        if (result.Item) {
                            return [2 /*return*/, true];
                        }
                        else {
                            return [2 /*return*/, false];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    DynamoFollowsDAO.prototype.removeFollower = function (followeeAlias, followerAlias) {
        return __awaiter(this, void 0, void 0, function () {
            var params, command, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            TableName: this.tableName,
                            Key: {
                                follower_handle: followerAlias,
                                followee_handle: followeeAlias,
                            },
                        };
                        command = new lib_dynamodb_1.DeleteCommand(params);
                        return [2 /*return*/, this.doOperation(command, function () {
                                return true;
                            })];
                    case 1:
                        result = _a.sent();
                        if (result.$metadata.httpStatusCode == 200) {
                            return [2 /*return*/, true];
                        }
                        else {
                            throw new Error(JSON.stringify(result.$metadata)); // cusotmize errors?
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    DynamoFollowsDAO.prototype.putBatchOfFollowers = function (items) {
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
                                            follower_handle: item.followee_handle, // bandaid fix: Change later
                                            followee_handle: item.follower_handle
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
    DynamoFollowsDAO.prototype.addFollower = function (followeeAlias, followerAlias) {
        return __awaiter(this, void 0, void 0, function () {
            var params, command, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            TableName: this.tableName,
                            Item: {
                                follower_handle: followeeAlias,
                                followee_handle: followerAlias,
                            },
                        };
                        command = new lib_dynamodb_1.PutCommand(params);
                        console.log("DynamoFollowsDAO: follow request: ".concat(followeeAlias, " <-- ").concat(followerAlias, "\n\n"));
                        return [2 /*return*/, this.doOperation(command, function () {
                                return true;
                            })];
                    case 1:
                        result = _a.sent();
                        if (result.$metadata.httpStatusCode == 200) {
                            return [2 /*return*/, true];
                        }
                        else {
                            throw new Error(JSON.stringify(result.$metadata));
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    DynamoFollowsDAO.prototype.getPageOfFollowers = function (followeeHandle, pageSize, lastFollowerHandle) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log("GET_PAGE_OF_FOLLOWERS in DynamoFollowersDAO was passed this ARGUMENT for lastFollowerHandle: ".concat(lastFollowerHandle, "\n"));
                return [2 /*return*/, this.getPage(followeeHandle, pageSize, lastFollowerHandle, false)];
            });
        });
    };
    DynamoFollowsDAO.prototype.getPageOfFollowees = function (followerHandle, pageSize, lastFolloweeHandle) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.getPage(followerHandle, pageSize, lastFolloweeHandle, true)];
            });
        });
    };
    DynamoFollowsDAO.prototype.getPage = function (pkHandle, pageSize, lastFolloweeHandle, getFollowees) {
        return __awaiter(this, void 0, void 0, function () {
            var pk, sk, startKey, KeyConditionExpression, ExpressionAttributeValues, params, command;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("GET_PAGE in DynamoFollwsDAO was passed this value for lastFolloweeHandle: ".concat(lastFolloweeHandle, "\n"));
                        if (getFollowees == true) {
                            pk = this.follower_handle_attr;
                            sk = this.followee_handle_attr;
                            startKey = {
                                follower_handle: pkHandle,
                                followee_handle: lastFolloweeHandle
                            };
                        }
                        else {
                            pk = this.followee_handle_attr;
                            sk = this.follower_handle_attr;
                            startKey = {
                                followee_handle: pkHandle,
                                follower_handle: lastFolloweeHandle
                            };
                        }
                        KeyConditionExpression = "".concat(pk, " = :pk");
                        ExpressionAttributeValues = { ":pk": "".concat(pkHandle) };
                        if (getFollowees == true) {
                            params = {
                                TableName: this.tableName,
                                KeyConditionExpression: KeyConditionExpression,
                                ExpressionAttributeValues: ExpressionAttributeValues,
                                Limit: pageSize
                            };
                        }
                        else {
                            params = {
                                TableName: this.tableName,
                                IndexName: this.indexName,
                                KeyConditionExpression: KeyConditionExpression,
                                ExpressionAttributeValues: ExpressionAttributeValues,
                                Limit: pageSize
                            };
                        }
                        console.log("START KEY: ".concat(JSON.stringify(startKey)));
                        if (lastFolloweeHandle) {
                            params.ExclusiveStartKey = startKey;
                        }
                        command = new lib_dynamodb_1.QueryCommand(params);
                        return [4 /*yield*/, this.doOperation(command, function (result) { return __awaiter(_this, void 0, void 0, function () {
                                var hasMore, userDtos, target, _i, _a, item, raw, target_alias, singleDto;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            hasMore = false;
                                            if (result.LastEvaluatedKey) {
                                                hasMore = true;
                                            }
                                            if (!result.Items) return [3 /*break*/, 5];
                                            userDtos = [];
                                            target = void 0;
                                            if (getFollowees == true) {
                                                target = this.followee_handle_attr;
                                            }
                                            else {
                                                target = this.follower_handle_attr;
                                            }
                                            _i = 0, _a = result.Items;
                                            _b.label = 1;
                                        case 1:
                                            if (!(_i < _a.length)) return [3 /*break*/, 4];
                                            item = _a[_i];
                                            raw = item[target];
                                            if (typeof raw !== "string") {
                                                console.error("Unexpected type for alias:", raw);
                                                return [3 /*break*/, 3];
                                            }
                                            target_alias = item[target];
                                            return [4 /*yield*/, this.userDao.getUser(target_alias)];
                                        case 2:
                                            singleDto = _b.sent();
                                            userDtos.push(singleDto);
                                            _b.label = 3;
                                        case 3:
                                            _i++;
                                            return [3 /*break*/, 1];
                                        case 4: return [2 /*return*/, [userDtos, hasMore]];
                                        case 5: return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return DynamoFollowsDAO;
}(ParentDAO_1.ParentDAO));
exports.DynamoFollowsDAO = DynamoFollowsDAO;
/*

We get an error when we try to fan the story out to followers, bc
LIMIT has to be >0, and if we have a user with no followers, we set LIMIT = 0

*/
