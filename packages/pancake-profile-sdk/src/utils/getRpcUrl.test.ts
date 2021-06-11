import getRpcUrl, { nodes } from "./getRpcUrl";

describe("getRpcUrl", () => {
  describe.each`
    randomRoll | expectedNode
    ${0.15}    | ${nodes[0]}
    ${0.35}    | ${nodes[1]}
    ${0.75}    | ${nodes[2]}
  `("$a + $b", ({ randomRoll, expectedNode }) => {
    it("returns random node", () => {
      jest.spyOn(global.Math, "random").mockReturnValue(randomRoll);
      const nodeUrl = getRpcUrl();
      expect(nodeUrl).toEqual(expectedNode);
    });
  });
});
