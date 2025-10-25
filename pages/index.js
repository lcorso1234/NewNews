import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [videos, setVideos] = useState([]);
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllContent();
  }, []);

  const fetchAllContent = async () => {
    try {
      // Fetch blog posts
      const blogRes = await fetch("/api/content?type=blog&published=true");
      const blogData = await blogRes.json();
      setBlogPosts(blogData.slice(0, 6)); // Get first 6 posts

      // Fetch videos
      const videoRes = await fetch("/api/content?type=video&published=true");
      const videoData = await videoRes.json();
      setVideos(videoData.slice(0, 3)); // Get first 3 videos

      // Fetch podcasts
      const podcastRes = await fetch(
        "/api/content?type=podcast&published=true"
      );
      const podcastData = await podcastRes.json();
      setPodcasts(podcastData.slice(0, 3)); // Get first 3 podcasts
    } catch (error) {
      console.error("Error fetching content:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-serif">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Category Header */}
      <div className="border-b-4 border-black pb-8">
        <div className="text-xs font-bold uppercase tracking-wider mb-2 text-gray-600">
          CATEGORY
        </div>
        <h2 className="font-serif text-5xl md:text-6xl font-bold mb-4">
          <span className="highlight">Daily Life</span>
        </h2>
        <p className="font-serif text-lg text-gray-700 leading-relaxed">
          Real stories from everyday people navigating the moments that matter.
          From morning commutes to family dinners, we capture the authentic
          experiences that define our daily existence.
        </p>
      </div>

      {/* Featured Stories - Blog Posts */}
      {blogPosts.length > 0 && (
        <section>
          <div className="border-l-4 border-black pl-6 mb-6">
            <h3 className="font-serif text-3xl font-bold mb-2">
              Featured Stories
            </h3>
            <p className="text-sm text-gray-600 font-serif italic">
              LATEST BLOG POSTS
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogPosts.slice(0, 2).map((post, index) => (
              <Link
                key={post._id}
                href={`/blog/${post.slug}`}
                className="border-2 border-black p-6 hover:shadow-lg transition-shadow"
              >
                <div className="text-xs font-bold uppercase tracking-wider mb-2">
                  Blog
                </div>
                <h4 className="font-serif text-2xl font-bold mb-3">
                  <span
                    className={index === 0 ? "highlight" : "highlight-lime"}
                  >
                    {post.title}
                  </span>
                </h4>
                <p className="font-serif text-gray-700 leading-relaxed mb-4">
                  {post.description}
                </p>
                <div className="text-sm text-gray-600 font-serif">
                  By {post.author} •{" "}
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Videos Section */}
      {videos.length > 0 && (
        <section>
          <div className="border-l-4 border-black pl-6 mb-6">
            <h3 className="font-serif text-3xl font-bold mb-2">
              Video Reports
            </h3>
            <p className="text-sm text-gray-600 font-serif italic">
              LATEST VIDEO CONTENT
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {videos.map((video) => (
              <Link
                key={video._id}
                href={`/blog/${video.slug}`}
                className="block border-2 border-black hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="aspect-video bg-gray-200 border-b-2 border-black flex items-center justify-center relative">
                  {video.imageUrl ? (
                    <img
                      src={video.imageUrl}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="white"
                        className="w-8 h-8 ml-1"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="text-xs font-bold uppercase tracking-wider mb-2">
                    Video
                  </div>
                  <h4 className="font-serif text-lg font-bold mb-2">
                    {video.title}
                  </h4>
                  <p className="text-xs text-gray-600 font-serif line-clamp-2 mb-2">
                    {video.description}
                  </p>
                  <div className="text-xs text-gray-600 font-serif">
                    {new Date(video.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Podcasts Section */}
      {podcasts.length > 0 && (
        <section>
          <div className="border-l-4 border-black pl-6 mb-6">
            <h3 className="font-serif text-3xl font-bold mb-2">
              Latest Podcasts
            </h3>
            <p className="text-sm text-gray-600 font-serif italic">
              RECENT EPISODES
            </p>
          </div>
          <div className="space-y-6">
            {podcasts.map((podcast) => (
              <Link
                key={podcast._id}
                href={`/blog/${podcast.slug}`}
                className="block border-2 border-black p-6 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-32 h-32 bg-gray-200 border border-black flex items-center justify-center">
                    {podcast.imageUrl ? (
                      <img
                        src={podcast.imageUrl}
                        alt={podcast.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-12 h-12"
                      >
                        <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
                        <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold uppercase tracking-wider mb-2">
                      Podcast
                    </div>
                    <h4 className="font-serif text-2xl font-bold mb-2">
                      {podcast.title}
                    </h4>
                    <p className="font-serif text-gray-700 mb-3 line-clamp-2">
                      {podcast.description}
                    </p>
                    <div className="text-sm font-serif text-gray-600">
                      By {podcast.author} •{" "}
                      {new Date(podcast.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* More Blog Posts */}
      {blogPosts.length > 2 && (
        <section>
          <div className="border-l-4 border-black pl-6 mb-6">
            <h3 className="font-serif text-3xl font-bold mb-2">More Stories</h3>
            <p className="text-sm text-gray-600 font-serif italic">
              ADDITIONAL BLOG POSTS
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.slice(2, 5).map((post) => (
              <Link
                key={post._id}
                href={`/blog/${post.slug}`}
                className="border border-black p-4 hover:shadow-lg transition-shadow"
              >
                <h4 className="font-serif text-xl font-bold mb-2">
                  {post.title}
                </h4>
                <p className="font-serif text-sm text-gray-700 mb-2 line-clamp-3">
                  {post.description}
                </p>
                <div className="text-xs text-gray-600 font-serif">
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Latest Updates */}
      {blogPosts.length > 5 && (
        <section>
          <div className="border-l-4 border-black pl-6 mb-6">
            <h3 className="font-serif text-3xl font-bold mb-2">
              Latest Updates
            </h3>
            <p className="text-sm text-gray-600 font-serif italic">
              JUST PUBLISHED
            </p>
          </div>
          <div className="space-y-4">
            {blogPosts.slice(5).map((post) => (
              <Link
                key={post._id}
                href={`/blog/${post.slug}`}
                className="flex gap-4 p-4 border-b-2 border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink-0 w-32 h-32 bg-gray-200 border border-black">
                  {post.imageUrl && (
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold uppercase tracking-wider mb-1">
                    Blog
                  </div>
                  <h4 className="font-serif text-xl font-bold mb-2">
                    {post.title}
                  </h4>
                  <p className="font-serif text-sm text-gray-700 mb-2 line-clamp-2">
                    {post.description}
                  </p>
                  <div className="text-xs text-gray-600 font-serif">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Show message if no content */}
      {blogPosts.length === 0 &&
        videos.length === 0 &&
        podcasts.length === 0 && (
          <section className="text-center py-12">
            <p className="font-serif text-xl text-gray-600">
              No content published yet. Check back soon for new articles,
              videos, and podcasts.
            </p>
          </section>
        )}
    </div>
  );
}
