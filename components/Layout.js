// Main layout component for the news site
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Layout({ children }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(false);

  const isActive = (path) => router.pathname === path;

  const handleSafeLinkClick = (e, href) => {
    // Prevent attempting a navigation to the same path which can trigger
    // a hard navigation error in Next's router when origins/ports differ.
    if (router && router.pathname === href) {
      e.preventDefault();
      setMenuOpen(false);
      return;
    }
    setMenuOpen(false);
  };

  const handleBookmark = () => {
    const pageTitle = document.title;
    const pageUrl = window.location.href;

    // Get existing bookmarks from localStorage
    const bookmarks = JSON.parse(localStorage.getItem("siteBookmarks") || "[]");

    // Check if page is already bookmarked
    const isBookmarked = bookmarks.some((b) => b.url === pageUrl);

    if (isBookmarked) {
      // Remove bookmark
      const updatedBookmarks = bookmarks.filter((b) => b.url !== pageUrl);
      localStorage.setItem("siteBookmarks", JSON.stringify(updatedBookmarks));
      alert("Bookmark removed!");
    } else {
      // Add bookmark
      bookmarks.push({
        title: pageTitle,
        url: pageUrl,
        date: new Date().toISOString(),
      });
      localStorage.setItem("siteBookmarks", JSON.stringify(bookmarks));
      alert(
        "Page bookmarked! Click the bookmark icon to view your saved pages."
      );
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: document.title,
      text: "Check out this article from The Daily Truth",
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy link to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.log("Error sharing:", err);
    }
  };

  const handleAnnouncement = () => {
    setShowAnnouncement(true);
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      {/* Announcement Popup */}
      {showAnnouncement && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowAnnouncement(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white border-4 border-black rounded-2xl p-8 max-w-md mx-4 shadow-2xl"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 bg-black rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 0 1-1.44-4.282m3.102.069a18.03 18.03 0 0 1-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 0 1 8.835 2.535M10.34 6.66a23.847 23.847 0 0 0 8.835-2.535m0 0A23.74 23.74 0 0 0 18.795 3m.38 1.125a23.91 23.91 0 0 1 1.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 0 0 1.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 0 1 0 3.46"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-2xl font-bold mb-2">
                  Announcement
                </h3>
                <p className="font-serif text-lg text-gray-700 leading-relaxed">
                  Welcome to Real News by Real People. Because Real People don't
                  really care.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAnnouncement(false)}
              className="w-full px-6 py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors"
            >
              Got it!
            </button>
          </motion.div>
        </div>
      )}
      {/* Newspaper Header */}
      <header className="border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Top Bar - Date */}
          <div className="flex justify-between items-center text-xs mb-4 pb-4 border-b border-gray-300">
            <div className="font-serif">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>

          {/* Main Title - Newspaper Style */}
          <div className="text-center mb-6">
            <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight">
              The Daily Truth
            </h1>
            <p className="font-serif italic text-sm mt-2 text-gray-600">
              Real News from Real People
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pb-24 max-w-7xl mx-auto px-4 py-8 w-full">
        {children}
      </main>

      {/* Mobile Menu - Slides up from bottom */}
      {menuOpen && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="lg:hidden fixed left-0 right-0 z-20"
          style={{ bottom: "100px" }}
        >
          <div className="px-6">
            <div className="bg-white border-2 border-black rounded-3xl p-5 shadow-2xl max-w-sm mx-auto">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { href: "/", label: "HOME", delay: 0 },
                  { href: "/video", label: "VIDEO", delay: 0.1 },
                  { href: "/podcast", label: "PODCAST", delay: 0.2 },
                  { href: "/blog", label: "BLOG", delay: 0.3 },
                ].map((item) => (
                  <motion.div
                    key={item.href}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: item.delay, type: "spring" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href={item.href}
                      onClick={(e) => handleSafeLinkClick(e, item.href)}
                      className="h-20 flex items-center justify-center rounded-2xl border-2 border-black bg-transparent text-black text-sm font-semibold hover:bg-black hover:text-white transition-all active:scale-95"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Desktop Navigation - Hidden on Mobile */}
      <nav
        className="hidden lg:flex fixed left-0 right-0 justify-center z-30"
        style={{ bottom: "18px" }}
      >
        <div
          className="bg-white border-2 border-black shadow-2xl px-4 py-2"
          style={{ borderRadius: "8px" }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={handleBookmark}
              className="w-10 h-10 flex items-center justify-center rounded-lg border-2 bg-transparent hover:bg-black hover:text-white transition-colors"
            >
              {/* bookmark icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 text-black"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                />
              </svg>
            </button>

            <Link
              href="/"
              onClick={(e) => handleSafeLinkClick(e, "/")}
              className={`px-4 py-2 rounded-lg border-2 text-[18px] font-semibold transition-colors ${
                isActive("/")
                  ? "bg-black text-white border-black"
                  : "bg-transparent text-black border-gray-300 hover:border-black hover:bg-gray-100"
              }`}
            >
              HOME
            </Link>

            <Link
              href="/video"
              onClick={(e) => handleSafeLinkClick(e, "/video")}
              className={`px-4 py-2 rounded-lg border-2 text-[18px] font-semibold transition-colors ${
                isActive("/video")
                  ? "bg-black text-white border-black"
                  : "bg-transparent text-black border-gray-300 hover:border-black hover:bg-gray-100"
              }`}
            >
              VIDEO
            </Link>

            <Link
              href="/podcast"
              onClick={(e) => handleSafeLinkClick(e, "/podcast")}
              className={`px-4 py-2 rounded-lg border-2 text-[18px] font-semibold transition-colors ${
                isActive("/podcast")
                  ? "bg-black text-white border-black"
                  : "bg-transparent text-black border-gray-300 hover:border-black hover:bg-gray-100"
              }`}
            >
              PODCAST
            </Link>

            <Link
              href="/blog"
              onClick={(e) => handleSafeLinkClick(e, "/blog")}
              className={`px-4 py-2 rounded-lg border-2 text-[18px] font-semibold transition-colors ${
                isActive("/blog")
                  ? "bg-black text-white border-black"
                  : "bg-transparent text-black border-gray-300 hover:border-black hover:bg-gray-100"
              }`}
            >
              BLOG
            </Link>

            {/* Right Icons */}
            <button
              onClick={handleShare}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-black hover:bg-gray-800 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                />
              </svg>
            </button>

            <button
              onClick={handleAnnouncement}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-black hover:bg-gray-800 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 0 1-1.44-4.282m3.102.069a18.03 18.03 0 0 1-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 0 1 8.835 2.535M10.34 6.66a23.847 23.847 0 0 0 8.835-2.535m0 0A23.74 23.74 0 0 0 18.795 3m.38 1.125a23.91 23.91 0 0 1 1.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 0 0 1.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 0 1 0 3.46"
                />
              </svg>
            </button>

            <button
              onClick={() =>
                (window.location.href = "mailto:lawrencecorso1@gmail.com")
              }
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-black hover:bg-gray-800 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav
        className="lg:hidden fixed left-0 right-0 z-30"
        style={{ bottom: "0" }}
      >
        <div className="bg-black px-6 py-4 shadow-2xl">
          <div className="flex items-center justify-between max-w-md mx-auto">
            {/* Share Icon */}
            <motion.button
              onClick={handleShare}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              className="w-12 h-12 flex items-center justify-center rounded-xl bg-white hover:bg-gray-200 shadow-lg transition-transform"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-6 h-6 text-black"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                />
              </svg>
            </motion.button>

            {/* Menu Button */}
            <motion.button
              onClick={() => setMenuOpen(!menuOpen)}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              className="relative px-8 py-2.5 flex items-center justify-center rounded-xl border-2 border-white bg-transparent hover:bg-white/10 transition-all"
            >
              {/* Conditional Dot Indicator */}
              {menuOpen && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white rounded-full"></div>
              )}
              <span className="text-white text-base font-bold tracking-wider">
                MENU
              </span>
            </motion.button>

            {/* Announcement Icon */}
            <motion.button
              onClick={handleAnnouncement}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              className="w-12 h-12 flex items-center justify-center rounded-xl bg-white hover:bg-gray-200 shadow-lg transition-transform"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-6 h-6 text-black"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 0 1-1.44-4.282m3.102.069a18.03 18.03 0 0 1-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 0 1 8.835 2.535M10.34 6.66a23.847 23.847 0 0 0 8.835-2.535m0 0A23.74 23.74 0 0 0 18.795 3m.38 1.125a23.91 23.91 0 0 1 1.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 0 0 1.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 0 1 0 3.46"
                />
              </svg>
            </motion.button>
          </div>

          {/* Bottom Line Indicator */}
          <div className="mt-3 flex justify-center">
            <div className="w-48 h-1 bg-white/40 rounded-full"></div>
          </div>
        </div>
      </nav>
    </div>
  );
}
