import { useEffect, useState } from "react";

export default function Podcast() {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPodcasts();
  }, []);

  const fetchPodcasts = async () => {
    try {
      const res = await fetch("/api/content?type=podcast&published=true");
      const data = await res.json();
      console.log("fetchPodcasts response", data);
      setPodcasts(data || []);
    } catch (error) {
      console.error("Error fetching podcasts:", error);
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
          Podcast Series
        </h2>
        <p className="font-serif text-lg text-gray-700">
          Audio stories from real people about real life
        </p>
      </div>

      {/* Featured Podcast */}
      {podcasts.length > 0 && (
        <article className="border-4 border-black p-8">
          <div className="text-xs font-bold uppercase tracking-wider mb-2 text-red-600">
            Featured Episode
          </div>
          <h3 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            <span className="highlight">{podcasts[0].title}</span>
          </h3>
          <p className="font-serif text-lg text-gray-700 leading-relaxed mb-4">
            {podcasts[0].description}
          </p>
          <div className="mb-6">
            {podcasts[0].audioUrl ? (
              podcasts[0].audioUrl.includes("spotify") ? (
                <div className="w-full">
                  <iframe
                    src={podcasts[0].audioUrl.replace(
                      "open.spotify.com/",
                      "open.spotify.com/embed/"
                    )}
                    width="100%"
                    height="152"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                  ></iframe>
                </div>
              ) : podcasts[0].audioUrl.match(/\.(mp3|wav|ogg)$/i) ? (
                <audio controls src={podcasts[0].audioUrl} className="w-full" />
              ) : (
                <a
                  href={podcasts[0].audioUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline"
                >
                  Open audio
                </a>
              )
            ) : (
              <div className="text-sm text-gray-500">
                No audio file available
              </div>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm font-serif text-gray-600">
            <span>By {podcasts[0].author}</span>
            <span>•</span>
            <span>{new Date(podcasts[0].createdAt).toLocaleDateString()}</span>
          </div>
        </article>
      )}

      {/* More Episodes */}
      {podcasts.length > 1 && (
        <div className="space-y-6">
          {podcasts.slice(1).map((ep) => (
            <article key={ep._id} className="border-2 border-black p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="text-xs font-bold uppercase tracking-wider mb-2">
                    Podcast
                  </div>
                  <h3 className="font-serif text-2xl font-bold mb-3">
                    {ep.title}
                  </h3>
                  <p className="font-serif text-gray-700 leading-relaxed mb-4">
                    {ep.description}
                  </p>
                  <div className="mb-4">
                    {ep.audioUrl ? (
                      ep.audioUrl.includes("spotify") ? (
                        // Spotify requires an iframe embed
                        <div className="w-full">
                          <iframe
                            src={ep.audioUrl.replace(
                              "open.spotify.com/",
                              "open.spotify.com/embed/"
                            )}
                            width="100%"
                            height="80"
                            frameBorder="0"
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                          ></iframe>
                        </div>
                      ) : ep.audioUrl.match(/\.(mp3|wav|ogg)$/i) ? (
                        <audio controls src={ep.audioUrl} className="w-full" />
                      ) : (
                        // fallback: show a link
                        <a
                          href={ep.audioUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 underline"
                        >
                          Open audio
                        </a>
                      )
                    ) : (
                      <div className="text-sm text-gray-500">
                        No audio file available
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    By {ep.author} •{" "}
                    {new Date(ep.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {podcasts.length === 0 && (
        <section className="text-center py-12">
          <p className="font-serif text-xl text-gray-600">
            No podcasts published yet. Check back soon for new episodes.
          </p>
        </section>
      )}
    </div>
  );
}
