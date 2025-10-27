import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import QuillEditor from "../../../../components/QuillEditor";

export default function EditContent() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm();

  const type = watch("type");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const loggedIn = localStorage.getItem("adminLoggedIn");
    if (!loggedIn) {
      router.push("/admin/login");
      return;
    }

    if (id) {
      fetchContent();
    }
  }, [id, router]);

  const fetchContent = async () => {
    try {
      const res = await fetch(`/api/content/${id}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to load content");
      }
      const data = await res.json();
      reset(data);
    } catch (error) {
      console.error("Error loading content:", error);
      alert(error.message || "Failed to load content");
      router.push("/admin");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (formData) => {
    try {
      const res = await fetch(`/api/content/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(
          data.error ||
            "Error updating content. Please check the fields and try again."
        );
      }

      router.push("/admin");
    } catch (error) {
      console.error("Error updating content:", error);
      alert(error.message || "Error updating content");
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error uploading file");
      }

      const { url } = await res.json();
      const targetField =
        type === "blog" ? "imageUrl" : type === "podcast" ? "audioUrl" : "videoUrl";
      setValue(targetField, url);
    } catch (error) {
      console.error("Upload error:", error);
      alert(error.message || "Error uploading file");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading content...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Edit Content
            </h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <select
                  {...register("type", { required: true })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="blog">Blog</option>
                  <option value="podcast">Podcast</option>
                  <option value="video">Video</option>
                </select>
                {errors.type && (
                  <span className="text-red-500">This field is required</span>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    {...register("title", { required: true })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {errors.title && (
                    <span className="text-red-500">This field is required</span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Slug
                  </label>
                  <input
                    type="text"
                    {...register("slug", { required: true })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {errors.slug && (
                    <span className="text-red-500">This field is required</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  {...register("description", { required: true })}
                  rows={3}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
                {errors.description && (
                  <span className="text-red-500">This field is required</span>
                )}
              </div>

              {type === "blog" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Content
                  </label>
                  <Controller
                    name="content"
                    control={control}
                    rules={{ required: type === "blog" }}
                    render={({ field }) => (
                      <QuillEditor value={field.value} onChange={field.onChange} />
                    )}
                  />
                  {errors.content && (
                    <span className="text-red-500">This field is required</span>
                  )}
                </div>
              )}

              {type === "podcast" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Audio URL
                  </label>
                  <input
                    type="url"
                    {...register("audioUrl", { required: type === "podcast" })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {errors.audioUrl && (
                    <span className="text-red-500">This field is required</span>
                  )}
                </div>
              )}

              {type === "video" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Video URL
                  </label>
                  <input
                    type="url"
                    {...register("videoUrl", { required: type === "video" })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {errors.videoUrl && (
                    <span className="text-red-500">This field is required</span>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {type === "blog"
                    ? "Featured Image"
                    : type === "podcast"
                    ? "Audio File"
                    : "Video File"}
                </label>
                <input
                  type="file"
                  accept={
                    type === "blog"
                      ? "image/*"
                      : type === "podcast"
                      ? "audio/*"
                      : "video/*"
                  }
                  onChange={handleFileUpload}
                  className="mt-1 block w-full"
                />
                {uploading && <span>Uploading...</span>}
                {type === "blog" && watch("imageUrl") && (
                  <img
                    src={watch("imageUrl")}
                    alt="Preview"
                    className="mt-2 h-32 object-cover border border-gray-200"
                  />
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input type="checkbox" {...register("published")} />
                  <span className="text-sm text-gray-700">Published</span>
                </label>
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
