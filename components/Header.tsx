"use client";

import {
  ClerkLoaded,
  SignedIn,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Link from "next/link";
import Form from "next/form";
import { PackageIcon, TrolleyIcon } from "@sanity/icons";
import useBasketStore from "@/state/store";

// We need access to the user.
function Header() {
  const { user } = useUser();

  const itemCount = useBasketStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0),
  );

  // Create a passkey for the clerk.

  const createClerkPasskey = async () => {
    try {
      const res = await user?.createPasskey();
      console.log(res);
    } catch (err) {
      console.error("Error creating passkey", JSON.stringify(err, null, 2));
    }
  };

  return (
    <header className="flex flex-wrap items-center justify-between px-4 py-2">
      {/* Top row */}
      <div className="flex w-full flex-wrap items-center justify-between">
        <Link
          href="/"
          className="mx-auto cursor-pointer text-2xl font-bold text-blue-500 hover:opacity-50 sm:px-0"
        >
          Aqua
        </Link>
        <Form
          action="/search"
          className="mt-2 w-full sm:mx-4 sm:mt-0 sm:w-auto sm:flex-1"
        >
          <input
            type="text"
            name="query"
            placeholder="Search something..."
            className="focus:ring-opacity-50 w-full max-w-4xl rounded border bg-gray-100 px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </Form>
        <div className="mt-4 flex flex-1 items-center space-x-4 sm:mt-0 sm:flex-none">
          <Link
            href="/basket"
            className="relative flex flex-1 items-center justify-center space-x-2 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 sm:flex-none sm:justify-start"
          >
            <TrolleyIcon className="h-6 w-6" />
            {/* Span item count once global state is implemented */}
            <span className="absolute top-[-5px] right-[-15px] inline-flex items-center justify-center rounded-full bg-red-500 px-2 py-1 text-xs leading-none font-bold text-white">
              {itemCount}
            </span>

            <span>My Basket</span>
          </Link>
          {/* User area */}
          {/* dont load unless clerk initialize it. */}
          <ClerkLoaded>
            <SignedIn>
              <Link
                href="/orders"
                className="relative flex flex-1 items-center justify-center space-x-2 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 sm:flex-none sm:justify-start"
              >
                <PackageIcon className="h-6 w-6" />
                <span>My Orders</span>
              </Link>
            </SignedIn>

            {/* If user is not logged in, show login button */}
            {user ? (
              <div className="flex items-center space-x-2">
                <UserButton />
                <div className="hidden text-xs sm:block">
                  <p className="text-gray-400">Welcome Back</p>
                  <p className="font-bold">{user.fullName}!</p>
                </div>
              </div>
            ) : (
              <SignInButton mode="modal" />
            )}
            {/* if the user has no passkey */}
            {user?.passkeys.length === 0 && (
              <button
                onClick={createClerkPasskey}
                className="animate-pulse rounded border border-blue-300 bg-white px-4 py-2 font-bold text-blue-500 hover:bg-blue-700 hover:text-white"
              >
                Create passkey
              </button>
            )}
          </ClerkLoaded>
        </div>
      </div>
    </header>
  );
}

export default Header;
