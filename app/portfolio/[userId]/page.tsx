import { supabaseServerClient } from "@/app/lib/supabaseServer";
import { parseProfile } from "@/app/lib/profile-utils";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type PortfolioPageProps = {
  params: {
    userId: string;
  };
};

type PortfolioData = {
  name: string | null;
  email: string | null;
  profile: ReturnType<typeof parseProfile>;
};

const imageExtensions = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"];

const isPdfSource = (value?: string) => {
  if (!value) {
    return false;
  }
  const normalized = value.toLowerCase().split("?")[0];
  return normalized.startsWith("data:application/pdf") || normalized.endsWith(".pdf");
};

const isImageSource = (value?: string) => {
  if (!value) {
    return false;
  }
  const normalized = value.toLowerCase().split("?")[0];
  if (normalized.startsWith("data:image")) {
    return true;
  }
  return imageExtensions.some((ext) => normalized.endsWith(ext));
};

const formatDate = (value?: string) => {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date.toLocaleDateString();
};

function normalizeUploadType(value: any) {
  const lower = (value ?? "").toString().toLowerCase();
  if (lower === "video" || lower === "certificate" || lower === "achievement") {
    return lower as "video" | "certificate" | "achievement";
  }
  return "achievement";
}

async function getPortfolioData(userId: string): Promise<PortfolioData | null> {
  const { data: user, error: userError } = await supabaseServerClient
    .from("User")
    .select("id,name,email,profileData")
    .eq("id", userId)
    .maybeSingle();

  if (userError && userError.code !== "PGRST116") {
    throw userError;
  }

  if (!user) {
    return null;
  }

  const { data: uploads, error: uploadsError } = await supabaseServerClient
    .from("Upload")
    .select("*")
    .eq("userId", userId)
    .order("createdAt", { ascending: false });

  if (uploadsError) {
    throw uploadsError;
  }

  const parsed = parseProfile(user.profileData ?? null, {
    name: user.name,
    email: user.email,
  });

  const normalizedUploads = (uploads ?? []).map((upload) => ({
    id: upload.id,
    name: upload.name ?? "",
    type: normalizeUploadType(upload.type),
    url: upload.url ?? "",
    thumbnail: upload.thumbnail ?? "",
    createdAt: (() => {
      const value = upload.createdAt;
      if (!value) {
        return new Date().toISOString();
      }
      const date = new Date(value as any);
      return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
    })(),
  }));

  return {
    name: user.name,
    email: user.email,
    profile: {
      ...parsed,
      uploads: normalizedUploads.length ? normalizedUploads : parsed.uploads,
    },
  };
}

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

export async function generateMetadata({ params }: PortfolioPageProps): Promise<Metadata> {
  const data = await getPortfolioData(params.userId);
  if (!data) {
    return {
      title: "Profile not found",
    };
  }
  const name = `${data.profile.firstName} ${data.profile.lastName}`.trim() || data.name || "Player profile";
  return {
    title: name,
    description: data.profile.bio || `Portfolio for ${name}`,
  };
}

export default async function PortfolioPage({ params }: PortfolioPageProps) {
  const data = await getPortfolioData(params.userId);
  if (!data) {
    notFound();
  }

  const profile = data.profile;
  const uploads = Array.isArray(profile.uploads) ? profile.uploads : [];
  const videos = uploads.filter((upload) => upload.type === "video" && upload.url);
  const featuredVideo = videos[0];
  const featuredVideoId = featuredVideo ? extractYouTubeId(featuredVideo.url ?? "") : null;
  const secondaryVideos = videos.slice(1);
  const certificates = uploads.filter((upload) => upload.type === "certificate");
  const achievements = uploads.filter((upload) => upload.type === "achievement");

  const statBlocks = [
    { label: "Goals", value: profile.stats.goals || 0 },
    { label: "Assists", value: profile.stats.assists || 0 },
    { label: "Matches", value: profile.stats.matches || 0 },
  ];

  return (
    <div className="min-h-screen w-full bg-[#111a22] text-white" style={{ fontFamily: 'Manrope, "Noto Sans", sans-serif' }}>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10">
        <header className="flex flex-col gap-6 rounded-xl border border-[#233648] bg-[#192633] p-6 md:flex-row md:items-center md:gap-10">
          <div
            className="bg-center bg-no-repeat bg-cover rounded-full border-2 border-[#324d67]"
            style={{
              width: "120px",
              height: "120px",
              backgroundImage: profile.avatar ? `url("${profile.avatar}")` : undefined,
              backgroundColor: profile.avatar ? undefined : "#111a22",
            }}
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold leading-tight md:text-4xl">
              {`${profile.firstName} ${profile.lastName}`.trim() || data.name || "Player"}
            </h1>
            <p className="mt-3 text-sm text-[#92adc9] md:text-base">
              {[profile.position, profile.age > 0 ? `Age ${profile.age}` : null, profile.nationality]
                .filter(Boolean)
                .join(" • ") || "Complete profile details"}
            </p>
            {profile.bio && (
              <p className="mt-4 text-sm text-[#92adc9] md:text-base">{profile.bio}</p>
            )}
          </div>
        </header>

        {featuredVideoId && (
          <section className="rounded-2xl border border-[#233648] bg-[#0c141b] p-5 shadow-lg shadow-[#0b1824]/30">
            <div className="flex flex-col gap-4">
              <div className="aspect-video w-full overflow-hidden rounded-xl border border-[#324d67] bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${featuredVideoId}`}
                  title="Featured video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                {featuredVideo?.name && (
                  <p className="text-sm font-semibold text-white">{featuredVideo.name}</p>
                )}
                {formatDate(featuredVideo?.createdAt) && (
                  <span className="text-xs text-[#6d859f]">Added {formatDate(featuredVideo?.createdAt)}</span>
                )}
              </div>
            </div>
          </section>
        )}

        {secondaryVideos.length > 0 && (
          <section>
            <h2 className="text-xl font-bold">More Videos</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              {secondaryVideos.map((video) => (
                <article key={video.id} className="rounded-2xl border border-[#233648] bg-[#192633] p-4 shadow-lg shadow-[#0b1824]/20">
                  <div className="flex flex-col gap-3">
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noreferrer"
                      className="aspect-video w-full overflow-hidden rounded-lg border border-[#324d67] bg-black"
                    >
                      {video.thumbnail ? (
                        <div
                          className="h-full w-full bg-cover bg-center"
                          style={{ backgroundImage: `url('${video.thumbnail}')` }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-widest text-[#92adc9]">
                          Video
                        </div>
                      )}
                    </a>
                    <div className="flex flex-col gap-2">
                      <p className="text-sm font-semibold text-white">{video.name || "Video"}</p>
                      <a
                        href={video.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold text-[#1172d4] underline"
                      >
                        Watch
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-xl font-bold">Statistics</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            {statBlocks.map((stat) => (
              <div key={stat.label} className="rounded-xl border border-[#233648] bg-[#192633] p-6">
                <p className="text-sm text-[#92adc9]">{stat.label}</p>
                <p className="mt-2 text-3xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold">Profile Information</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 rounded-2xl border border-[#233648] bg-[#192633] p-6 md:grid-cols-2">
            <div>
              <p className="text-sm text-[#92adc9]">First Name</p>
              <p className="mt-1 text-base text-white">{profile.firstName || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-[#92adc9]">Last Name</p>
              <p className="mt-1 text-base text-white">{profile.lastName || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-[#92adc9]">Age</p>
              <p className="mt-1 text-base text-white">{profile.age > 0 ? profile.age : "—"}</p>
            </div>
            <div>
              <p className="text-sm text-[#92adc9]">Position</p>
              <p className="mt-1 text-base text-white">{profile.position || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-[#92adc9]">Nationality</p>
              <p className="mt-1 text-base text-white">{profile.nationality || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-[#92adc9]">Email</p>
              <p className="mt-1 text-base text-white">{profile.email || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-[#92adc9]">Phone</p>
              <p className="mt-1 text-base text-white">{profile.phone || "—"}</p>
            </div>
            {profile.bio && (
              <div className="md:col-span-2">
                <p className="text-sm text-[#92adc9]">Bio</p>
                <p className="mt-1 text-base text-white">{profile.bio}</p>
              </div>
            )}
          </div>
        </section>

        {certificates.length > 0 && (
          <section>
            <h2 className="text-xl font-bold">Certificates</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              {certificates.map((certificate) => (
                <article key={certificate.id} className="flex items-start gap-4 rounded-2xl border border-[#233648] bg-[#192633] p-5 shadow-lg shadow-[#0b1824]/20">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-dashed border-[#324d67] bg-[#0c141b] text-xs font-semibold uppercase tracking-widest text-[#92adc9]">
                    PDF
                  </div>
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="truncate text-sm font-semibold text-white">{certificate.name || "Certificate"}</p>
                      {formatDate(certificate.createdAt) && (
                        <span className="text-xs text-[#6d859f]">{formatDate(certificate.createdAt)}</span>
                      )}
                    </div>
                    <p className="text-xs uppercase tracking-wide text-[#92adc9]">Certificate</p>
                    {certificate.url && (
                      <a
                        href={certificate.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-9 items-center justify-center rounded-lg border border-[#324d67] px-4 text-xs font-semibold text-[#56a7ff] transition hover:border-[#1172d4] hover:text-[#1172d4]"
                      >
                        View PDF
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {achievements.length > 0 && (
          <section>
            <h2 className="text-xl font-bold">Achievements</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              {achievements.map((achievement) => {
                const imagePreview = isImageSource(achievement.thumbnail || achievement.url || "") ? (achievement.thumbnail || achievement.url || "") : null;
                const pdfAttached = isPdfSource(achievement.url);
                return (
                  <article key={achievement.id} className="flex flex-col gap-4 rounded-2xl border border-[#233648] bg-[#192633] p-5 shadow-lg shadow-[#0b1824]/20">
                    <div className="flex flex-wrap gap-4">
                      {imagePreview ? (
                        <a
                          href={achievement.url || imagePreview}
                          target="_blank"
                          rel="noreferrer"
                          className="block shrink-0 overflow-hidden rounded-xl border border-[#324d67]"
                          style={{ width: "120px", height: "80px" }}
                        >
                          <div
                            className="h-full w-full bg-cover bg-center"
                            style={{ backgroundImage: `url('${imagePreview}')` }}
                          />
                        </a>
                      ) : (
                        <div className="flex h-20 w-28 shrink-0 items-center justify-center rounded-xl border border-dashed border-[#324d67] bg-[#0c141b] text-[11px] font-semibold uppercase tracking-wide text-[#92adc9]">
                          {pdfAttached ? "PDF" : "Link"}
                        </div>
                      )}
                      <div className="flex min-w-0 flex-1 flex-col gap-2">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <p className="truncate text-sm font-semibold text-white">{achievement.name || "Achievement"}</p>
                          {formatDate(achievement.createdAt) && (
                            <span className="text-xs text-[#6d859f]">{formatDate(achievement.createdAt)}</span>
                          )}
                        </div>
                        <p className="text-xs uppercase tracking-wide text-[#92adc9]">Achievement</p>
                        {achievement.url && (
                          <a
                            href={achievement.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex h-9 items-center justify-center rounded-lg border border-[#324d67] px-4 text-xs font-semibold text-[#56a7ff] transition hover:border-[#1172d4] hover:text-[#1172d4]"
                          >
                            View
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

