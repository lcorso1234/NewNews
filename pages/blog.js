import Link from "next/link";
import { useEffect, useState } from "react";

export default function Blog() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const res = await fetch("/api/content?type=blog&published=true");
      const data = await res.json();
      setBlogPosts(data);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="border-b-4 border-black pb-6">
        <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
          The Daily Truth Blog
        </h2>
        <p className="font-serif text-lg text-gray-700">
          Thoughtful perspectives on daily life, community, and what really
          matters
        </p>
      </div>

      {/* Featured Post */}
      {blogPosts.length > 0 && (
        <Link
          href={`/blog/${blogPosts[0].slug}`}
          className="block border-4 border-black p-8 hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="text-xs font-bold uppercase tracking-wider mb-2 text-red-600">
            Featured Story
          </div>
          <h3 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            <span className="highlight">{blogPosts[0].title}</span>
          </h3>
          <p className="font-serif text-lg text-gray-700 leading-relaxed mb-4">
            {blogPosts[0].description}
          </p>
          <div className="flex items-center gap-4 text-sm font-serif text-gray-600">
            <span>By {blogPosts[0].author}</span>
            <span>•</span>
            <span>{new Date(blogPosts[0].createdAt).toLocaleDateString()}</span>
          </div>
        </Link>
      )}

      {/* Blog Posts Grid */}
      <div className="space-y-6">
        {blogPosts.slice(1).map((post) => (
          <Link
            key={post._id}
            href={`/blog/${post.slug}`}
            className="block border-2 border-black p-6 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex flex-col md:flex-row gap-6">
              {post.imageUrl && (
                <div className="flex-shrink-0 w-full md:w-48 h-48 bg-gray-200 border border-black">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="text-xs font-bold uppercase tracking-wider mb-2">
                  Blog
                </div>
                <h3 className="font-serif text-2xl font-bold mb-3">
                  {post.title}
                </h3>
                <p className="font-serif text-gray-700 leading-relaxed mb-4">
                  {post.description}
                </p>
                <div className="flex items-center gap-4 text-sm font-serif text-gray-600">
                  <span>By {post.author}</span>
                  <span>•</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
