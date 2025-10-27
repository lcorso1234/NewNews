import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const router = useRouter();
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const loggedIn = localStorage.getItem("adminLoggedIn");
    if (!loggedIn) {
      router.push("/admin/login");
      return;
    }
    fetchContents();
  }, [router]);

  const fetchContents = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/content");
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to load content");
      }
      const data = await res.json();
      setContents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching contents:", err);
      setError(err.message || "Failed to load content");
      setContents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this content?")) {
      return;
    }

    try {
      const res = await fetch(`/api/content/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete content");
      }
      fetchContents();
    } catch (err) {
      console.error("Delete error:", err);
      alert(err.message || "Failed to delete content");
    }
  };

  const handlePublishToggle = async (id, published) => {
    try {
      const res = await fetch(`/api/content/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !published }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update content");
      }
      fetchContents();
    } catch (err) {
      console.error("Publish toggle error:", err);
      alert(err.message || "Failed to update content");
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        {error}
        <div>
          <button
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded"
            onClick={fetchContents}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold leading-tight text-gray-900">
                Admin Dashboard
              </h1>
              <div className="flex space-x-4">
                <button
                  onClick={() => router.push("/admin/content/new")}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
                >
                  Add New Content
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem("adminLoggedIn");
                    router.push("/");
                  }}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
                >
                  Log out
                </button>
              </div>
            </div>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {contents.map((content) => (
                    <li key={content._id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {content.imageUrl && (
                                <img
                                  className="h-10 w-10 rounded-full object-cover"
                                  src={content.imageUrl}
                                  alt={content.title}
                                />
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {content.title}
                              </div>
                              <div className="text-sm text-gray-500">
                                {content.type} •{" "}
                                {content.published ? "Published" : "Draft"}
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() =>
                                handlePublishToggle(
                                  content._id,
                                  content.published
                                )
                              }
                              className={`px-3 py-1 rounded-md text-sm ${
                                content.published
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {content.published ? "Unpublish" : "Publish"}
                            </button>
                            <button
                              onClick={() =>
                                router.push(`/admin/content/edit/${content._id}`)
                              }
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(content._id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                {contents.length === 0 && (
                  <div className="p-6 text-center text-gray-500">
                    No content yet. Click &ldquo;Add New Content&rdquo; to get
                    started.
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
