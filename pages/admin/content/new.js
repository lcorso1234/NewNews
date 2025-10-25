import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import QuillEditor from "../../../components/QuillEditor";

export default function NewContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ensure we're on the client side before accessing localStorage
    if (typeof window === "undefined") return;

    const loggedIn = localStorage.getItem("adminLoggedIn");
    if (!loggedIn) {
      router.push("/admin/login");
      return;
    }
    setLoading(false);
  }, [router]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm();
  const [uploading, setUploading] = useState(false);

  const type = watch("type");

  if (loading) return <div>Loading...</div>;

  const onSubmit = async (data) => {
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        if (router.pathname !== "/admin") router.push("/admin");
      } else {
        const errorData = await res.json();
        console.error("Error creating content:", errorData);

        let errorMessage = "Error creating content";
        if (errorData.details) {
          errorMessage += `: ${errorData.details}`;
        }
        if (errorData.validationErrors) {
          const validationMessages = Object.values(errorData.validationErrors)
            .map((err) => err.message)
            .join(", ");
          errorMessage += `\nValidation errors: ${validationMessages}`;
        }

        alert(errorMessage);
      }
    } catch (error) {
      console.error("Error creating content:", error);
      alert(
        "Network error: Unable to create content. Please check your connection and try again."
      );
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const { url } = await res.json();
      const fieldName =
        type === "blog"
          ? "imageUrl"
          : type === "podcast"
          ? "audioUrl"
          : "videoUrl";
      setValue(fieldName, url);
    } else {
      alert("Error uploading file");
    }
    setUploading(false);
  };

  // auth removed — open admin
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Create New Content
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
                  <option value="">Select type</option>
                  <option value="blog">Blog</option>
                  <option value="podcast">Podcast</option>
                  <option value="video">Video</option>
                </select>
                {errors.type && (
                  <span className="text-red-500">This field is required</span>
                )}
              </div>

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
                      <QuillEditor
                        value={field.value}
                        onChange={field.onChange}
                      />
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
                    ? "Image"
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
                    className="mt-2 h-20 w-20 object-cover"
                  />
                )}
                {type === "podcast" && watch("audioUrl") && (
                  <audio controls src={watch("audioUrl")} className="mt-2" />
                )}
                {type === "video" && watch("videoUrl") && (
                  <video
                    controls
                    src={watch("videoUrl")}
                    className="mt-2 h-20 w-20 object-cover"
                  />
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

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    if (router.pathname !== "/admin") router.push("/admin");
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
