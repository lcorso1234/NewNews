import { useEffect, useState } from "react";

export default function Video() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await fetch("/api/content?type=video&published=true");
      const data = await res.json();
      console.log("fetchVideos response", data);
      if (!res.ok) {
        console.error("Failed to fetch videos", res.status, data);
        setVideos([]);
      } else if (!Array.isArray(data)) {
        console.warn("Expected videos array but got:", data);
        setVideos([]);
      } else {
        setVideos(data);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
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
          Video Reports
        </h2>
        <p className="font-serif text-lg text-gray-700">
          Visual stories from the heart of our community
        </p>
      </div>

      {/* Featured Video */}
      {videos.length > 0 && (
        <article className="border-4 border-black p-8">
          <div className="text-xs font-bold uppercase tracking-wider mb-2 text-red-600">
            Featured Video
          </div>
          <h3 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            <span className="highlight">{videos[0].title}</span>
          </h3>
          {videos[0].videoUrl && (
            <div className="mb-6 bg-gray-200 border-2 border-black">
              {videos[0].videoUrl.includes("youtube.com") ||
              videos[0].videoUrl.includes("youtu.be") ? (
                <iframe
                  className="w-full aspect-video"
                  src={
                    videos[0].videoUrl.includes("youtu.be")
                      ? `https://www.youtube.com/embed/${videos[0].videoUrl
                          .split("/")
                          .pop()}`
                      : videos[0].videoUrl.includes("watch?v=")
                      ? `https://www.youtube.com/embed/${new URL(
                          videos[0].videoUrl
                        ).searchParams.get("v")}`
                      : videos[0].videoUrl
                  }
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                />
              ) : videos[0].videoUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                <video
                  controls
                  src={videos[0].videoUrl}
                  className="w-full aspect-video object-cover"
                />
              ) : (
                <a
                  href={videos[0].videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline"
                >
                  Open video
                </a>
              )}
            </div>
          )}
          <p className="font-serif text-lg text-gray-700 leading-relaxed mb-4">
            {videos[0].description}
          </p>
          <div className="flex items-center gap-4 text-sm font-serif text-gray-600">
            <span>By {videos[0].author}</span>
            <span>•</span>
            <span>{new Date(videos[0].createdAt).toLocaleDateString()}</span>
          </div>
        </article>
      )}

      {/* More Videos */}
      {videos.length > 1 && (
        <div className="space-y-6">
          {videos.slice(1).map((v) => (
            <article key={v._id} className="border-2 border-black p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {v.videoUrl ? (
                  <div className="flex-shrink-0 w-full md:w-1/3 bg-gray-200 border border-black">
                    {v.videoUrl.includes("youtube.com") ||
                    v.videoUrl.includes("youtu.be") ? (
                      // Render YouTube embed
                      <iframe
                        className="w-full h-full"
                        src={
                          v.videoUrl.includes("youtu.be")
                            ? `https://www.youtube.com/embed/${v.videoUrl
                                .split("/")
                                .pop()}`
                            : v.videoUrl.includes("watch?v=")
                            ? `https://www.youtube.com/embed/${new URL(
                                v.videoUrl
                              ).searchParams.get("v")}`
                            : v.videoUrl
                        }
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                      />
                    ) : v.videoUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                      <video
                        controls
                        src={v.videoUrl}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <a
                        href={v.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline"
                      >
                        Open video
                      </a>
                    )}
                  </div>
                ) : null}
                <div className="flex-1">
                  <div className="text-xs font-bold uppercase tracking-wider mb-2">
                    Video
                  </div>
                  <h3 className="font-serif text-2xl font-bold mb-3">
                    {v.title}
                  </h3>
                  <p className="font-serif text-gray-700 leading-relaxed mb-4">
                    {v.description}
                  </p>
                  <div className="text-sm text-gray-600">
                    By {v.author} • {new Date(v.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {videos.length === 0 && (
        <section className="text-center py-12">
          <p className="font-serif text-xl text-gray-600">
            No videos published yet. Check back soon for new content.
          </p>
        </section>
      )}
    </div>
  );
}
