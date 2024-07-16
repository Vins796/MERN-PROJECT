import { Link } from "react-router-dom";
import gif from "../assets/773W.gif";

export default function NotFound() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <img src={gif} alt="404 not found" className="mx-auto h-[400px]" />
        <h1 className="mt-8 text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-mono">
          Ma dove sei finito Simo?
        </h1>
        <p className="mt-4 text-muted-foreground">
         Torna indietro asino!
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center rounded-md bg-stone-900 text-sm font-medium text-white p-3 font-mono"
            prefetch={false}
          >
            Homepage
          </Link>
        </div>
      </div>
    </div>
  )
}