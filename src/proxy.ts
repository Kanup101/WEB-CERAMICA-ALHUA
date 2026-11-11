import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, localeCookie, localizedPath } from "@/lib/i18n/config";

export function proxy(request: NextRequest) {
  const segment = request.nextUrl.pathname.split("/")[1];
  const preference = request.cookies.get(localeCookie)?.value;
  if (isLocale(segment)) {
    if (segment === defaultLocale) {
      const url = request.nextUrl.clone();
      url.pathname = localizedPath(url.pathname, defaultLocale);
      const response = NextResponse.redirect(url);
      response.cookies.set(localeCookie, defaultLocale, { path: "/", sameSite: "lax", maxAge: 31536000 });
      return response;
    }
    return NextResponse.next();
  }
  if (preference && isLocale(preference) && preference !== defaultLocale) {
    const url = request.nextUrl.clone();
    url.pathname = localizedPath(url.pathname, preference);
    return NextResponse.redirect(url);
  }
  const url = request.nextUrl.clone();
  url.pathname = `/es${url.pathname === "/" ? "" : url.pathname}`;
  return NextResponse.rewrite(url);
}

export const config = { matcher: ["/((?!api|_next|.*\\..*).*)"] };
