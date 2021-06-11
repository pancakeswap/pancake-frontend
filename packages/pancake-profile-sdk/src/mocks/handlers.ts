import { rest, graphql } from "msw";
import { existingAddress1, existingAddress2, nonexistentAddress } from "./mockAddresses";
import { profileApi, profileSubgraphApi, IPFS_GATEWAY } from "../constants/common";

const subgraph = graphql.link(profileSubgraphApi);

const handlers = [
  rest.get(`${profileApi}/api/users/${existingAddress1}`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        username: "Cheems",
      })
    );
  }),
  rest.get(`${profileApi}/api/users/${nonexistentAddress}`, (req, res, ctx) => {
    return res(ctx.status(404), ctx.json({ error: { message: "Entity not found." } }));
  }),
  rest.get(`${IPFS_GATEWAY}/ipfs/QmYsTqbmGA3H5cgouCkh8tswJAQE1AsEko9uBZX9jZ3oTC/sleepy.json`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        name: "Sleepy",
        description: "Aww, looks like eating pancakes all day is tough work. Sweet dreams!",
        image: "ipfs://QmYD9AtzyQPjSa9jfZcZq88gSaRssdhGmKqQifUDjGFfXm/sleepy.png",
        attributes: {
          bunnyId: "5",
        },
      })
    );
  }),
  subgraph.query("getUser", (req, res, ctx) => {
    const address = req.variables.id;
    if (address === existingAddress1) {
      return res(
        ctx.data({
          user: {
            points: [
              {
                id: existingAddress1,
                campaignId: "511080000",
                points: 200,
              },
              {
                id: existingAddress1,
                campaignId: "512010010",
                points: 500,
              },
              {
                id: existingAddress1,
                campaignId: "511090000",
                points: 100,
              },
            ],
          },
        })
      );
    }
    if (address === existingAddress2) {
      return res(
        ctx.data({
          user: {
            points: [],
          },
        })
      );
    }
    // Address does not exists
    return res(
      ctx.data({
        user: null,
      })
    );
  }),
];

export default handlers;
