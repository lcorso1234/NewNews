import Link from "next/link";

export default function BlogPost({ post }) {
  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <div className="mb-8">
        <Link
          href="/blog"
          className="text-black hover:text-gray-700 font-serif"
        >
          ← Back to Blog
        </Link>
      </div>

      {/* Article Header */}
      <header className="mb-12">
        <div className="text-xs font-bold uppercase tracking-wider mb-4 text-red-600">
          Blog
        </div>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6 leading-tight">
          {post.title}
        </h1>
        <div className="flex items-center gap-6 text-sm font-serif text-gray-600 border-b border-gray-200 pb-6">
          <span>By {post.author}</span>
          <span>•</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
      </header>

      {/* Article Content */}
      <article className="prose prose-lg max-w-none">
        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-64 object-cover mb-8"
          />
        )}
        <div className="whitespace-pre-line">{post.content}</div>
      </article>

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t-4 border-black">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="font-serif text-lg font-bold">Share this article</div>
          <div className="flex gap-3">
            {/* Facebook */}
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                typeof window !== "undefined" ? window.location.href : ""
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 flex items-center justify-center bg-black hover:bg-gray-800 text-white rounded-lg transition-colors"
              aria-label="Share on Facebook"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>

            {/* Twitter/X */}
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                typeof window !== "undefined" ? window.location.href : ""
              )}&text=${encodeURIComponent(post.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 flex items-center justify-center bg-black hover:bg-gray-800 text-white rounded-lg transition-colors"
              aria-label="Share on Twitter"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const { slug } = params;

  try {
    const res = await fetch(
      `${
        process.env.NEXTAUTH_URL || "http://localhost:3000"
      }/api/content?type=blog&published=true`
    );
    const posts = await res.json();
    const post = posts.find((p) => p.slug === slug);

    return {
      props: {
        post: post || null,
      },
    };
  } catch (error) {
    console.error("Error fetching post:", error);
    return {
      props: {
        post: null,
      },
    };
  }
}
