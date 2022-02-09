import type {ActionFunction, LoaderFunction} from "remix"
import { redirect } from "remix";
import { logout } from "~/utils/session.server";

export const action:ActionFunction = async({request}) => {
  await new Promise(res => setTimeout(res, 1000))
  return logout(request)
}

export const loader:LoaderFunction = async() => {
  return redirect('/')
}