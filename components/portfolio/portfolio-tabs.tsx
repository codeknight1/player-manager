"use client";

import { useState } from "react";

type PortfolioTabsProps = {
  profile: any;
  videos: any[];
  images: any[];
  achievements: any[];
  certificates: any[];
};

function extractYouTubeId(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.slice(1) || null;
    }
    if (parsed.searchParams.get("v")) {
      return parsed.searchParams.get("v");
    }
    const parts = parsed.pathname.split("/").filter(Boolean);
    if (parts[0] === "shorts" && parts[1]) {
      return parts[1];
    }
    return null;
  } catch {
    return null;
  }
}

function isImageSource(value?: string) {
  if (!value) return false;
  const normalized = value.toLowerCase().split("?")[0];
  if (normalized.startsWith("data:image")) return true;
  return [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"].some((ext) => normalized.endsWith(ext));
}

export function PortfolioTabs({ profile, videos, images, achievements, certificates }: PortfolioTabsProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "gallery" | "videos">("overview");

  const tabs = [
    { id: "overview" as const, label: "Player Overview" },
    { id: "gallery" as const, label: "Player Gallery" },
    { id: "videos" as const, label: "Player Videos" },
  ];

  return (
    <div className="rounded-xl border border-[#233648] bg-[#192633] overflow-hidden" data-portfolio-tabs>
      <div className="border-b border-[#233648] bg-[#0c141b]">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              data-tab={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 text-sm font-semibold transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "text-white border-b-2 border-[#1172d4] bg-[#192633]"
                  : "text-[#92adc9] hover:text-white hover:bg-[#192633]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {activeTab === "overview" && (
          <div className="space-y-4">
            {profile.bio ? (
              <p className="text-[#92adc9] leading-relaxed">{profile.bio}</p>
            ) : (
              <p className="text-[#92adc9] italic">No overview available yet.</p>
            )}
            {achievements.length > 0 && (
              <div className="mt-8">
                <h4 className="text-lg font-bold text-white mb-4">Achievements</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement: any) => {
                    const imagePreview = isImageSource(achievement.thumbnail || achievement.url || "")
                      ? achievement.thumbnail || achievement.url || ""
                      : null;
                    return (
                      <div
                        key={achievement.id}
                        className="rounded-lg border border-[#233648] bg-[#0c141b] p-4"
                      >
                        {imagePreview && (
                          <div
                            className="w-full h-32 rounded-lg mb-3 bg-cover bg-center"
                            style={{ backgroundImage: `url('${imagePreview}')` }}
                          />
                        )}
                        <p className="text-sm font-semibold text-white">{achievement.name || "Achievement"}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {certificates.length > 0 && (
              <div className="mt-8">
                <h4 className="text-lg font-bold text-white mb-4">Certificates</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {certificates.map((certificate: any) => (
                    <div
                      key={certificate.id}
                      className="rounded-lg border border-[#233648] bg-[#0c141b] p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-dashed border-[#324d67] bg-[#192633] text-xs font-semibold uppercase text-[#92adc9]">
                          PDF
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white truncate">
                            {certificate.name || "Certificate"}
                          </p>
                          {certificate.url && (
                            <a
                              href={certificate.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-[#1172d4] hover:underline mt-1 inline-block"
                            >
                              View PDF
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "gallery" && (
          <div>
            {images.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image: any) => {
                  const imageUrl = image.thumbnail || image.url || "";
                  return (
                    <a
                      key={image.id}
                      href={image.url || imageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="block aspect-square overflow-hidden rounded-lg border border-[#233648] bg-[#0c141b] hover:border-[#1172d4] transition-colors"
                    >
                      <div
                        className="h-full w-full bg-cover bg-center"
                        style={{ backgroundImage: `url('${imageUrl}')` }}
                      />
                    </a>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-[#92adc9] py-12">No gallery images available yet.</p>
            )}
          </div>
        )}

        {activeTab === "videos" && (
          <div>
            {videos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {videos.map((video: any) => {
                  const videoId = extractYouTubeId(video.url || "");
                  return (
                    <div key={video.id} className="space-y-3">
                      {videoId ? (
                        <div className="aspect-video w-full overflow-hidden rounded-lg border border-[#233648] bg-black">
                          <iframe
                            src={`https://www.youtube.com/embed/${videoId}`}
                            title={video.name || "Video"}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            className="h-full w-full"
                          />
                        </div>
                      ) : (
                        <a
                          href={video.url}
                          target="_blank"
                          rel="noreferrer"
                          className="block aspect-video w-full overflow-hidden rounded-lg border border-[#233648] bg-[#0c141b]"
                        >
                          {video.thumbnail ? (
                            <div
                              className="h-full w-full bg-cover bg-center"
                              style={{ backgroundImage: `url('${video.thumbnail}')` }}
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[#92adc9]">
                              Video
                            </div>
                          )}
                        </a>
                      )}
                      {video.name && (
                        <p className="text-sm font-semibold text-white">{video.name}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-[#92adc9] py-12">No videos available yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

