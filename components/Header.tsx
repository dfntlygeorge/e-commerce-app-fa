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
import { Button } from "./ui/button";
import { Input } from "./ui/input";

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
        <Button asChild variant="link" className="mx-auto text-2xl font-bold">
          <Link href="/">Aqua</Link>
        </Button>
        <Form
          action="/search"
          className="mt-2 flex w-full sm:mx-4 sm:mt-0 sm:w-auto sm:flex-1"
        >
          <Input
            type="text"
            name="query"
            placeholder="Search something..."
            className="max-w-4xl flex-1"
          />
          <Button
            type="submit"
            variant="secondary"
            className="ml-2 cursor-pointer"
          >
            Search
          </Button>
        </Form>
        <div className="mt-4 flex flex-1 items-center justify-end space-x-4 sm:mt-0 sm:flex-none">
          <Button className="relative" asChild>
            <Link
              href="/basket"
              className="flex items-center gap-2 font-semibold"
            >
              <TrolleyIcon className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-3 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[12px] font-bold text-white">
                  {itemCount}
                </span>
              )}
              <span className="xs:inline-block hidden">My Basket</span>
            </Link>
          </Button>

          {/* User area */}
          <ClerkLoaded>
            <SignedIn>
              <Button asChild>
                <Link
                  href="/orders"
                  className="relative flex flex-1 items-center gap-2 font-semibold"
                >
                  <PackageIcon className="h-6 w-6" />
                  <span className="text-sm sm:text-base">My Orders</span>
                </Link>
              </Button>
            </SignedIn>

            {/* If user is not logged in, show login button */}
            {user ? (
              <div className="flex items-center space-x-2">
                <UserButton />
                <div className="hidden text-xs lg:block">
                  <p className="text-muted-foreground">Happy shopping</p>
                  <p className="font-bold">{user.fullName}!</p>
                </div>
              </div>
            ) : (
              <SignInButton mode="modal" />
            )}

            {/* If the user has no passkey */}
            {user?.passkeys.length === 0 && (
              <button
                onClick={createClerkPasskey}
                className="border-primary bg-background text-primary hover:bg-primary hover:text-primary-foreground animate-pulse cursor-pointer rounded border px-4 py-2 font-bold"
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
