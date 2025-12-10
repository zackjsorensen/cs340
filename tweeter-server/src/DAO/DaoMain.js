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
var DynamoFollowsDAO_1 = require("./DynamoFollowsDAO");
var DynamoFeedDAO_1 = require("./DynamoFeedDAO");
var DynamoUserDAO_1 = require("./DynamoUserDAO");
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var followsDao, _a, _b, _c, error_1, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
        return __generator(this, function (_t) {
            switch (_t.label) {
                case 0:
                    followsDao = new DynamoFollowsDAO_1.DynamoFollowsDAO();
                    _t.label = 1;
                case 1:
                    _t.trys.push([1, 3, , 4]);
                    _b = (_a = console).log;
                    _c = "Adding follower... ".concat;
                    return [4 /*yield*/, followsDao.addFollower("@Billy", "@Joel")];
                case 2:
                    _b.apply(_a, [_c.apply("Adding follower... ", [_t.sent()])]);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _t.sent();
                    console.log(error_1);
                    return [3 /*break*/, 4];
                case 4:
                    _e = (_d = console).log;
                    _f = "Getting follower... ".concat;
                    return [4 /*yield*/, followsDao.getFollowerCount("@Billy")];
                case 5:
                    _e.apply(_d, [_f.apply("Getting follower... ", [_t.sent()])]);
                    _h = (_g = console).log;
                    _j = " ".concat;
                    return [4 /*yield*/, followsDao.getFolloweeCount("@Joel")];
                case 6:
                    _h.apply(_g, [_j.apply(" ", [_t.sent()])]);
                    _l = (_k = console).log;
                    _m = "Get Follower: ".concat;
                    return [4 /*yield*/, followsDao.getFollower("@Billy", "@Joel")];
                case 7:
                    _l.apply(_k, [_m.apply("Get Follower: ", [_t.sent()])]);
                    _p = (_o = console).log;
                    _q = "Get Page... ".concat;
                    _s = (_r = JSON).stringify;
                    return [4 /*yield*/, followsDao.getPageOfFollowees("Joe", 5, undefined)];
                case 8:
                    _p.apply(_o, [_q.apply("Get Page... ", [_s.apply(_r, [_t.sent()])])]);
                    return [2 /*return*/];
            }
        });
    });
}
function testFeed() {
    return __awaiter(this, void 0, void 0, function () {
        var feedDao;
        return __generator(this, function (_a) {
            feedDao = new DynamoFeedDAO_1.DynamoFeedDAO();
            return [2 /*return*/];
        });
    });
}
var zay = {
    firstName: "Isaiah",
    lastName: "Glasker",
    alias: "@zay",
    imageUrl: "https://tweeter-cs340-images.s3.us-east-2.amazonaws.com/tweeter-byu/Zay.jpg"
};
function testUsers() {
    return __awaiter(this, void 0, void 0, function () {
        var usersDao, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    usersDao = new DynamoUserDAO_1.DynamoUserDAO();
                    // console.log(await usersDao.putBatchOfUsers(cougs));
                    _b = (_a = console).log;
                    return [4 /*yield*/, usersDao.getUser("@Utah_butt_kicker")];
                case 1:
                    // console.log(await usersDao.putBatchOfUsers(cougs));
                    _b.apply(_a, [_c.sent()]);
                    return [2 /*return*/];
            }
        });
    });
}
function populateFollowers() {
    return __awaiter(this, void 0, void 0, function () {
        var followsDAO, _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
        return __generator(this, function (_y) {
            switch (_y.label) {
                case 0:
                    followsDAO = new DynamoFollowsDAO_1.DynamoFollowsDAO();
                    console.log("Testing");
                    _b = (_a = console).log;
                    return [4 /*yield*/, followsDAO.addFollower("@zay", "@Cosmo")];
                case 1:
                    _b.apply(_a, [_y.sent()]);
                    _d = (_c = console).log;
                    return [4 /*yield*/, followsDAO.addFollower("@Bear", "@Cosmo")];
                case 2:
                    _d.apply(_c, [_y.sent()]);
                    _f = (_e = console).log;
                    return [4 /*yield*/, followsDAO.addFollower("@Cosmo", "@CHagen")];
                case 3:
                    _f.apply(_e, [_y.sent()]);
                    _h = (_g = console).log;
                    return [4 /*yield*/, followsDAO.addFollower("@Cosmo", "@JK_get_sacked")];
                case 4:
                    _h.apply(_g, [_y.sent()]);
                    _k = (_j = console).log;
                    return [4 /*yield*/, followsDAO.addFollower("@Cosmo", "@CRyan")];
                case 5:
                    _k.apply(_j, [_y.sent()]);
                    _m = (_l = console).log;
                    return [4 /*yield*/, followsDAO.addFollower("@Cosmo", "@the_Great_Wall")];
                case 6:
                    _m.apply(_l, [_y.sent()]);
                    _p = (_o = console).log;
                    return [4 /*yield*/, followsDAO.addFollower("@Cosmo", "@Super_Satu")];
                case 7:
                    _p.apply(_o, [_y.sent()]);
                    _r = (_q = console).log;
                    return [4 /*yield*/, followsDAO.addFollower("@Cosmo", "@EJ")];
                case 8:
                    _r.apply(_q, [_y.sent()]);
                    _t = (_s = console).log;
                    return [4 /*yield*/, followsDAO.addFollower("@Cosmo", "@Coach_Kilani")];
                case 9:
                    _t.apply(_s, [_y.sent()]);
                    _v = (_u = console).log;
                    return [4 /*yield*/, followsDAO.addFollower("@Cosmo", "@cant_chase_me")];
                case 10:
                    _v.apply(_u, [_y.sent()]);
                    _x = (_w = console).log;
                    return [4 /*yield*/, followsDAO.addFollower("@Cosmo", "@speed_King")];
                case 11:
                    _x.apply(_w, [_y.sent()]);
                    return [2 /*return*/];
            }
        });
    });
}
function createUsers() {
    return __awaiter(this, void 0, void 0, function () {
        var userDAO, followDAO, userDtos, followsDtos, i, nextUser, nextFollow;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userDAO = new DynamoUserDAO_1.DynamoUserDAO();
                    followDAO = new DynamoFollowsDAO_1.DynamoFollowsDAO();
                    userDtos = [];
                    followsDtos = [];
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < 100)) return [3 /*break*/, 5];
                    nextUser = {
                        firstName: "fan_".concat(i),
                        lastName: "".concat(i),
                        alias: "@fan_".concat(i),
                        imageUrl: "https://tweeter-cs340-images.s3.us-east-2.amazonaws.com/users/%40test"
                    };
                    userDtos.push(nextUser);
                    nextFollow = {
                        follower_handle: "@fan_".concat(i),
                        followee_handle: "@Bear"
                    };
                    followsDtos.push(nextFollow);
                    if (!(userDtos.length == 25)) return [3 /*break*/, 4];
                    return [4 /*yield*/, userDAO.putBatchOfUsers(userDtos)];
                case 2:
                    _a.sent();
                    userDtos = [];
                    return [4 /*yield*/, followDAO.putBatchOfFollowers(followsDtos)];
                case 3:
                    _a.sent();
                    followsDtos = [];
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 1];
                case 5: return [2 /*return*/];
            }
        });
    });
}
createUsers();
