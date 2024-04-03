import { type NextRequest, NextResponse } from "next/server";
import PathMiddleware from "./middlewares";

// middlewares to run in the order of the array
const middlewares = [PathMiddleware];

export default async function middleware(request: NextRequest) {
  // if a response is returned, return it otherwise call `next()`
  for (const fn of middlewares) {
    const response = await fn(request);
    if (response) return response;
  }

  return NextResponse.next();
}



