import superjson from "superjson";
function superjsonResponse(data, init) {
  return new Response(superjson.stringify(data), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers
    }
  });
}
export {
  superjsonResponse as s
};
