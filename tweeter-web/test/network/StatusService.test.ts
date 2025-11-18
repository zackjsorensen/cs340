import { StatusService } from "src/model.service/StatusService"
import { AuthToken, Status } from "tweeter-shared";
import "isomorphic-fetch"


describe("StatusService", () => {

    it("gets a user's story pages", async () => {
        const service = new StatusService();
        const [items, hasMore] = await service.loadMoreStoryItems(
            new AuthToken("token1", 9),
            "user1",
            15,
            null
        );
        expect(Array.isArray(items)).toBe(true);
        expect(items.every(item => item instanceof Status)).toBe(true);
        expect(hasMore).toBe(true);

    })

})