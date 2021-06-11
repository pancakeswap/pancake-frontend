import { rest } from "msw";
import { setupServer } from "msw/node";
import handlers from "./handlers";
// This configures a request mocking server with the given request handlers.
const server = setupServer(...handlers);

// Use these to set up special cases during tests
// No need for manual teardown, all runtime modifications are cleaned up in jest.setup.js afterEach
export { server, rest };
