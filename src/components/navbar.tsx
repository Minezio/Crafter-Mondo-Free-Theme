"use client";

import Link from "next/link";
import {
  Menu,
  ShoppingCart,
  MessageSquare,
  HelpCircle,
  LifeBuoy,
  Home,
  User,
  LogOut,
  Wallet,
  CoinsIcon,
  BoxIcon,
  Ticket,
  UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AuthContext } from "@/lib/context/auth.context";
import { useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { WebsiteContext } from "@/lib/context/website.context";
import { Avatar } from "./ui/avatar";
import { useCart } from "@/lib/context/cart.context";
import { Badge } from "./ui/badge";
import { Head } from "./ui/head";

// Helper function to format balance as XX.00
const formatBalance = (balance: number | undefined): string => {
  if (balance === undefined || balance === null) return "0.00";
  return balance.toFixed(2);
};

export function Navbar() {
  const { isAuthenticated, user, signOut } = useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname();
  const { website } = useContext(WebsiteContext);
  const { cart } = useCart();
  const [isSticky, setIsSticky] = useState(false);

  // Calculate total items in cart
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const headerHeight = 280; // Daha hassas trigger noktası
          const scrollPosition = window.scrollY;

          if (scrollPosition > headerHeight) {
            setIsSticky(true);
          } else {
            setIsSticky(false);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getLinkClassName = (path: string) => {
    const isActive = path === "/" ? pathname === "/" : pathname.startsWith(path) && path !== "/";
    return `relative z-10 overflow-hidden rounded-xl px-5 py-2.5 transition-all duration-200 ease-in-out flex items-center gap-2 font-medium ${
      isActive
        ? "bg-gradient-to-r from-blue-500/20 via-cyan-400/20 to-blue-400/20 text-blue-700 dark:text-cyan-200 font-semibold shadow-[0_4px_32px_0_rgba(34,211,238,0.12)] scale-105"
        : "text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-500/10 hover:via-cyan-400/10 hover:to-blue-400/10 hover:text-blue-700 dark:hover:text-cyan-200 hover:shadow-[0_2px_16px_0_rgba(34,211,238,0.08)] hover:scale-105"
    }`;
  };

  const getMobileLinkClassName = (path: string) => {
    const isActive = pathname === path;
    return `rounded-xl px-4 py-2.5 transition-all duration-200 ease-in-out flex items-center gap-2 font-medium ${
      isActive
        ? "bg-gradient-to-r from-blue-500/20 via-cyan-400/20 to-blue-400/20 text-blue-700 dark:text-cyan-200 font-semibold shadow-[0_4px_32px_0_rgba(34,211,238,0.12)] scale-105"
        : "text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-500/10 hover:via-cyan-400/10 hover:to-blue-400/10 hover:text-blue-700 dark:hover:text-cyan-200 hover:shadow-[0_2px_16px_0_rgba(34,211,238,0.08)] hover:scale-105"
    }`;
  };

  const navigationItems = [
    { href: "/", icon: Home, label: "Anasayfa" },
    { href: "/store", icon: ShoppingCart, label: "Mağaza" },
    { href: "/redeem", icon: Ticket, label: "Kod Kullan" },
    { href: "/forum", icon: MessageSquare, label: "Forum" },
    { href: "/help", icon: HelpCircle, label: "Yardım" },
    { href: "/support", icon: LifeBuoy, label: "Destek" },
  ];

  const userMenuItems = [
    { href: "/profile", icon: User, label: "Profilim" },
    { href: "/wallet", icon: Wallet, label: "Cüzdanım" },
    { href: "/chest", icon: BoxIcon, label: "Sandığım" },
  ];

  return (
    <nav 
      className={`z-30 w-full bg-transparent transition-all duration-700 ease-out transform ${isSticky ? 'fixed top-0 shadow-xl shadow-black/10 dark:shadow-black/30 translate-y-0' : 'relative translate-y-0'}`}
      style={{
        background: "transparent",
        borderRadius: 0,
        boxShadow: "none",
        transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: 'transform, opacity, background-color',
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Mobile Menu Button - Sol tarafta */}
          <div className="flex items-center lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 ease-in-out hover:scale-105"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menü</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="z-50 w-[280px] bg-white dark:bg-gray-900 pl-2 pr-5 pt-5"
              >
                <div className="flex flex-col h-full pt-6">
                  {/* Mobile Navigation */}
                  <nav className="flex flex-col gap-2 flex-1">
                    {navigationItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={getMobileLinkClassName(item.href)}
                        >
                          <Icon className="h-5 w-5" />
                          {item.label}
                        </Link>
                      );
                    })}
                    
                    {/* Mobile Cart Item */}
                    <Link
                      href="/cart"
                      className={getMobileLinkClassName("/cart")}
                    >
                      <div className="relative">
                        <ShoppingCart className="h-5 w-5" />
                        {totalItems > 0 && (
                          <Badge 
                            variant="destructive" 
                            className="absolute -top-2 -right-2 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs font-bold"
                          >
                            {totalItems > 99 ? '99+' : totalItems}
                          </Badge>
                        )}
                      </div>
                      <span>Sepet ({totalItems})</span>
                    </Link>
                  </nav>

                  {/* Mobile User Section */}
                  <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                    {isAuthenticated ? (
                      <div className="space-y-4">
                        {/* User Info */}
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                            <Avatar username={user?.username || "steve"} size={48} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                              {user?.username}
                            </p>
                            <p className="flex items-center gap-1 text-sm text-green-500 dark:text-green-400">
                              <CoinsIcon className="h-4 w-4" />
                              {formatBalance(user?.balance)} {website?.currency}
                            </p>
                          </div>
                        </div>

                        {/* User Menu Items */}
                        <div className="space-y-1">
                          {userMenuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                              <Link
                                key={item.href}
                                href={item.href}
                                className={getMobileLinkClassName(item.href)}
                              >
                                <Icon className="h-5 w-5" />
                                {item.label}
                              </Link>
                            );
                          })}
                        </div>

                        {/* Logout Button */}
                        <Button
                          onClick={signOut}
                          variant="outline"
                          size="sm"
                          className="w-full text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800 dark:text-red-400 transition-all duration-300 ease-in-out hover:scale-105"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Çıkış Yap
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-4 px-5">
                        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto mb-3 overflow-hidden flex items-center justify-center">
                          <Avatar username="steve" size={64} />
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                          Misafir
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                          Tıkla Giriş Yap!
                        </p>
                        <Link
                          href="/auth/sign-in"
                          className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-300 mx-auto"
                          style={{ minWidth: 120 }}
                        >
                          <span>Giriş Yap</span>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Center Navigation - Desktop */}
          <div className="hidden lg:flex items-center justify-center flex-1 space-x-4">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={getLinkClassName(item.href)}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right Section - User & Avatar */}
          <div className="flex items-center">
            {/* Cart Icon - Desktop */}
            <div className="hidden lg:flex items-center mr-2">
              <Link href="/cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative rounded-lg transition-all duration-300 ease-in-out hover:scale-105 hover:bg-gradient-to-r hover:from-blue-500/10 hover:via-cyan-400/10 hover:to-blue-400/10 hover:text-blue-700 dark:hover:text-cyan-200"
                >
                  <ShoppingCart className="h-6 w-6" />
                  {totalItems > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs font-bold"
                    >
                      {totalItems > 99 ? '99+' : totalItems}
                    </Badge>
                  )}
                  <span className="sr-only">Sepet</span>
                </Button>
              </Link>
            </div>

            {/* Desktop User Section */}
            <div className="hidden lg:flex items-center">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant={null}
                      className="relative flex-shrink-0 ml-2 pr-2 transition-all duration-300 ease-in-out"
                    >
                      <div className="flex flex-col justify-center text-right py-2 pr-3">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {user?.username}
                          </p>
                          <p className="flex gap-2 text-sm text-green-500 dark:text-green-400">
                            <CoinsIcon className="h-4 w-4" /> {formatBalance(user?.balance)} {website?.currency}
                          </p>
                        </div>
                      </div>
                    <Head username={user?.username || "MHF_Steve"} size={300} className="w-20 h-20 z-35" />

                    </Button>

                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="bottom" align="start" className="w-56 mt-2 z-30 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/95 shadow-xl dark:shadow-lg p-2 dark:text-gray-100 text-gray-900 font-medium">
                    <DropdownMenuLabel>Hesabım</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <Link href={"/profile"}>
                      <DropdownMenuItem className="hover:bg-gradient-to-r hover:from-blue-500/10 hover:via-cyan-400/10 hover:to-blue-400/10 hover:text-blue-700 dark:hover:text-cyan-200">
                        <User className="mr-2 h-4 w-4" />
                        Profil
                      </DropdownMenuItem>
                    </Link>

                    <Link href={"/wallet"}>
                      <DropdownMenuItem className="hover:bg-gradient-to-r hover:from-blue-500/10 hover:via-cyan-400/10 hover:to-blue-400/10 hover:text-blue-700 dark:hover:text-cyan-200">
                        <Wallet className="mr-2 h-4 w-4" />
                        Cüzdan
                      </DropdownMenuItem>
                    </Link>

                    <Link href={"/chest"}>
                      <DropdownMenuItem className="hover:bg-gradient-to-r hover:from-blue-500/10 hover:via-cyan-400/10 hover:to-blue-400/10 hover:text-blue-700 dark:hover:text-cyan-200">
                        <BoxIcon className="mr-2 h-4 w-4" />
                        Sandığım
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600 hover:bg-gradient-to-r hover:from-blue-500/10 hover:via-cyan-400/10 hover:to-blue-400/10 hover:text-blue-700 dark:hover:text-cyan-200"
                      onClick={signOut}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Çıkış Yap
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  href="/auth/sign-in"
                  className="relative flex-shrink-0 ml-2 pr-2 z-10 transition-all duration-300 ease-in-out"
                >
                  <div className="flex flex-wrap justify-center items-center text-right py-2 pr-3">
                    <div className="flex flex-col justify-center text-right py-2 pr-3">
                      <span className="text-gray-800 font-semibold dark:text-green-300">
                        Misafir
                      </span>
                      <span className="text-sm text-gray-400 font-medium dark:text-green-300/75">
                        Tıkla Giriş Yap!
                      </span>
                    </div>
                    <UserIcon className="w-6 h-6" />
                  </div>
                </Link>
              )}
            </div>

            {/* Mobile Avatar */}
            <div className="lg:hidden flex items-center gap-2">
              {/* Mobile Cart Icon */}
              <Link href="/cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative rounded-lg transition-all duration-300 ease-in-out hover:scale-105 hover:bg-gradient-to-r hover:from-blue-500/10 hover:via-cyan-400/10 hover:to-blue-400/10 hover:text-blue-700 dark:hover:text-cyan-200"
                >
                  <ShoppingCart className="h-6 w-6" />
                  {totalItems > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs font-bold"
                    >
                      {totalItems > 99 ? '99+' : totalItems}
                    </Badge>
                  )}
                  <span className="sr-only">Sepet</span>
                </Button>
              </Link>
              
              {isAuthenticated ? (
                <Avatar username={user?.username || "steve"} size={40} />
              ) : (
                <Avatar username="steve" size={40} />
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
