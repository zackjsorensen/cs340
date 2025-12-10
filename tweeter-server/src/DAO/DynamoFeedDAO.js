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
exports.DynamoFeedDAO = void 0;
var ParentDAO_1 = require("./ParentDAO");
var lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
var DynamoFeedDAO = /** @class */ (function (_super) {
    __extends(DynamoFeedDAO, _super);
    function DynamoFeedDAO() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.tableName = "feed";
        _this.gsiName = "stories";
        _this.pkAttr = "feed_owner_handle";
        _this.skAttr = "timestamp";
        _this.gsiPkAttr = "author_handle";
        _this.skAttrAlias = "#tstamp";
        return _this;
    }
    DynamoFeedDAO.prototype.getFeedPage = function (userAlias, pageSize, lastItem) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getPageOfStatuses(this.pkAttr, userAlias, pageSize, lastItem, true)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DynamoFeedDAO.prototype.OldgetStoriesPage = function (userAlias, pageSize, lastItem) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, vals, hasMore, val;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getPageOfStatuses(this.gsiPkAttr, userAlias, pageSize, lastItem, false)];
                    case 1:
                        _a = _b.sent(), vals = _a[0], hasMore = _a[1];
                        for (val in vals) {
                            console.log("DYNAMO_FEED_DAO recieved this first story: ".concat(JSON.stringify(val)));
                            break;
                        }
                        return [2 /*return*/, [vals, hasMore]];
                }
            });
        });
    };
    DynamoFeedDAO.prototype.getStoriesPage = function (userAlias, pageSize, lastItem) {
        return __awaiter(this, void 0, void 0, function () {
            var params, command, result, hasMore, items, statusDtos;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (lastItem) {
                            params = {
                                TableName: "stories",
                                KeyConditionExpression: "author_handle = :pk AND #tstamp > :tstamp",
                                ExpressionAttributeNames: { "#tstamp": "timestamp" },
                                ExpressionAttributeValues: {
                                    ":pk": "".concat(userAlias),
                                    ":tstamp": Number(lastItem.timestamp)
                                },
                                Limit: pageSize
                            };
                        }
                        else {
                            params = {
                                TableName: "stories",
                                KeyConditionExpression: "author_handle = :pk",
                                ExpressionAttributeValues: {
                                    ":pk": "".concat(userAlias)
                                },
                                Limit: pageSize
                            };
                        }
                        command = new lib_dynamodb_1.QueryCommand(params);
                        return [4 /*yield*/, this.ddb.send(command)];
                    case 1:
                        result = _a.sent();
                        if (result.$metadata.httpStatusCode == 200) {
                            hasMore = result.LastEvaluatedKey ? true : false;
                            items = result.Items;
                            if (items) {
                                statusDtos = this.itemsToDtos(items);
                                return [2 /*return*/, [statusDtos, hasMore]];
                            }
                            else {
                                return [2 /*return*/, [[], false]]; // >>Q<< is this right? Or should it be null rather than []?
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    DynamoFeedDAO.prototype.getPageOfStatuses = function (pkAttr, userAlias, pageSize, lastItem, getFeed) {
        return __awaiter(this, void 0, void 0, function () {
            var params, command, result, hasMore, items, statusDtos;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (getFeed == true) {
                            // get feed without worrying about timestamps
                            if (lastItem) {
                                params = {
                                    TableName: this.tableName,
                                    KeyConditionExpression: "feed_owner_handle = :pk AND #tstamp > :tstamp",
                                    ExpressionAttributeNames: { "#tstamp": "timestamp" },
                                    ExpressionAttributeValues: {
                                        ":pk": "".concat(userAlias),
                                        ":tstamp": Number(lastItem.timestamp)
                                    },
                                    Limit: pageSize
                                };
                            }
                            else {
                                params = {
                                    TableName: this.tableName,
                                    KeyConditionExpression: "feed_owner_handle = :pk", // TODO: replace condition with ExlucsiveStartKey
                                    ExpressionAttributeValues: { ":pk": userAlias },
                                    Limit: pageSize
                                };
                            }
                        }
                        else { // get stories
                            if (lastItem) {
                                // need additional condition with timestamp
                                params = {
                                    TableName: this.tableName,
                                    IndexName: this.gsiName,
                                    KeyConditionExpression: "author_handle = :pk AND #tstamp > :tstamp",
                                    ExpressionAttributeNames: { "#tstamp": "timestamp" },
                                    ExpressionAttributeValues: {
                                        ":pk": "".concat(userAlias),
                                        ":tstamp": Number(lastItem.timestamp)
                                    },
                                    Limit: pageSize
                                };
                            }
                            else { // don't need timestamp condition
                                params = {
                                    TableName: this.tableName,
                                    IndexName: this.gsiName,
                                    KeyConditionExpression: "author_handle = :pk",
                                    ExpressionAttributeValues: {
                                        ":pk": "".concat(userAlias)
                                    },
                                    Limit: pageSize
                                };
                            }
                        }
                        command = new lib_dynamodb_1.QueryCommand(params);
                        return [4 /*yield*/, this.ddb.send(command)];
                    case 1:
                        result = _a.sent();
                        if (result.$metadata.httpStatusCode == 200) {
                            hasMore = result.LastEvaluatedKey ? true : false;
                            items = result.Items;
                            if (items) {
                                statusDtos = this.itemsToDtos(items);
                                return [2 /*return*/, [statusDtos, hasMore]];
                            }
                            else {
                                return [2 /*return*/, [[], false]]; // >>Q<< is this right? Or should it be null rather than []?
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    DynamoFeedDAO.prototype.putPost = function (authorAlias, statusDto, destAlias) {
        return __awaiter(this, void 0, void 0, function () {
            var params, command, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            TableName: this.tableName,
                            Item: {
                                feed_owner_handle: destAlias,
                                timestamp: statusDto.timestamp,
                                author_handle: authorAlias,
                                authorDto: statusDto.userDto,
                                segments: statusDto.segments,
                                post: statusDto.post
                            },
                        };
                        command = new lib_dynamodb_1.PutCommand(params);
                        return [4 /*yield*/, this.ddb.send(command)];
                    case 1:
                        result = _a.sent();
                        if (result.$metadata.httpStatusCode == 200) {
                            return [2 /*return*/, true];
                        }
                        else {
                            throw new Error("Failed to send post to user ".concat(destAlias, "\nMetadata: ").concat(JSON.stringify(result.$metadata)));
                            ;
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    DynamoFeedDAO.prototype.putPostBatch = function (messages) {
        return __awaiter(this, void 0, void 0, function () {
            var tableName, requestItems, cmd, resp, unprocessed;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        tableName = "feed";
                        requestItems = (_a = {},
                            _a["feed"] = messages.map(function (item) { return ({
                                PutRequest: {
                                    Item: {
                                        feed_owner_handle: item.feed_owner_handle,
                                        timestamp: item.statusDto.timestamp,
                                        author_handle: item.statusDto.userDto.alias,
                                        authorDto: item.statusDto.userDto,
                                        segments: item.statusDto.segments,
                                        post: item.statusDto.post
                                    }
                                }
                            }); }),
                            _a);
                        cmd = new lib_dynamodb_1.BatchWriteCommand({ RequestItems: requestItems });
                        return [4 /*yield*/, this.ddb.send(cmd)];
                    case 1:
                        resp = _c.sent();
                        unprocessed = resp.UnprocessedItems && resp.UnprocessedItems[tableName]
                            ? (_b = {}, _b[tableName] = resp.UnprocessedItems[tableName], _b) : {};
                        if (Object.keys(unprocessed).length === 0) {
                            // all done for this chunk
                            return [2 /*return*/, true];
                        }
                        else {
                            return [2 /*return*/, false]; // need to refine this to actually retry failed ones
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    DynamoFeedDAO.prototype.putStory = function (userAlias, statusDto) {
        return __awaiter(this, void 0, void 0, function () {
            var params, command, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            TableName: "stories",
                            Item: {
                                author_handle: userAlias,
                                timestamp: statusDto.timestamp,
                                authorDto: statusDto.userDto,
                                segments: statusDto.segments,
                                post: statusDto.post
                            }
                        };
                        command = new lib_dynamodb_1.PutCommand(params);
                        return [4 /*yield*/, this.ddb.send(command)];
                    case 1:
                        result = _a.sent();
                        if (result.$metadata.httpStatusCode == 200) {
                            return [2 /*return*/, true];
                        }
                        else {
                            throw new Error("Failed to save post to story\nMetadata: ".concat(JSON.stringify(result.$metadata)));
                            ;
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    DynamoFeedDAO.prototype.itemsToDtos = function (items) {
        var statuses = (items.map(function (item) { return ({
            post: item.post,
            userDto: item.authorDto,
            timestamp: item.timestamp,
            segments: item.segments
        }); }));
        return statuses;
    };
    return DynamoFeedDAO;
}(ParentDAO_1.ParentDAO));
exports.DynamoFeedDAO = DynamoFeedDAO;
/* feed table
    - table name: feed
    - PK: feed_owner_handle, SK: timestamp
        - rest of statusDtoAttrs
    - GSI: stories
        - PK: author_handle
        - SK: timestamp
*/
