import {
  Link,
  Links,
  LinksFunction,
  LiveReload,
  LoaderFunction,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData
} from "remix";
import type { MetaFunction } from "remix";
import globalStyleUrl from "./styles/global.css"
import Navbar from "./components/Navbar";
import { getUser } from "./utils/session.server";

export const meta: MetaFunction = () => {
  return { title: "New Remix App" };
};

export const links:LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: globalStyleUrl
    }
  ]
}

export const loader: LoaderFunction = async ({request}) => {
  const user = await getUser(request)
  const data = {
    user
  }
  return data
}

function Document({
  children
}:{
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  )
}

function Layout({children}:{children: React.ReactNode}) {
  const {user} = useLoaderData()
  return (
    <>
      <Navbar user={user} />
      <div className="container">
        {children}
      </div>
    </>
  )
}

export default function App() {
  return (
    <Document>
      <Layout>
        <Outlet/>
      </Layout>
    </Document>
  );
}