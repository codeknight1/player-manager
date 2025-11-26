import { prisma } from "@/app/lib/prisma";
import { parseProfile } from "@/app/lib/profile-utils";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortfolioTabs } from "@/components/portfolio/portfolio-tabs";

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

function normalizeUploadType(value: any) {
  const lower = (value ?? "").toString().toLowerCase();
  if (lower === "video" || lower === "certificate" || lower === "achievement") {
    return lower as "video" | "certificate" | "achievement";
  }
  return "achievement";
}

async function getPortfolioData(userId: string): Promise<PortfolioData | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, profileData: true },
    });

    if (!user) {
      return null;
    }

    const uploads = await prisma.upload.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    }).catch(() => []);

    const parsed = parseProfile(user.profileData ?? null, {
      name: user.name,
      email: user.email,
    });

    const normalizedUploads = uploads.map((upload: any) => ({
      id: upload.id,
      name: upload.name ?? "",
      type: normalizeUploadType(upload.type),
      url: upload.url ?? "",
      thumbnail: upload.thumbnail ?? "",
      createdAt: upload.createdAt.toISOString(),
    }));

    return {
      name: user.name,
      email: user.email,
      profile: {
        ...parsed,
        uploads: normalizedUploads.length > 0 ? normalizedUploads : (parsed.uploads || []),
      },
    };
  } catch (error) {
    console.error("[portfolio] Error fetching portfolio data:", error);
    return null;
  }
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

function formatDateOfBirth(age: number): string | null {
  if (age <= 0) return null;
  const currentYear = new Date().getFullYear();
  const birthYear = currentYear - age;
  return `January 1st, ${birthYear}`;
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
  const videos = uploads.filter((upload: any) => upload.type === "video" && upload.url);
  const images = uploads.filter((upload: any) => {
    const url = upload.thumbnail || upload.url || "";
    return isImageSource(url) && upload.type !== "video";
  });
  const certificates = uploads.filter((upload: any) => upload.type === "certificate");
  const achievements = uploads.filter((upload: any) => upload.type === "achievement");

  const playerName = `${profile.firstName} ${profile.lastName}`.trim() || data.name || "Player";
  const fullName = profile.lastName ? `${profile.firstName} ${profile.lastName}`.trim() : playerName;

  return (
    <div className="min-h-screen w-full bg-[#111a22] text-white" style={{ fontFamily: 'Manrope, "Noto Sans", sans-serif' }}>
      <div className="mx-auto w-full max-w-7xl">
        <div className="relative bg-gradient-to-b from-[#192633] to-[#111a22] pb-12 pt-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:gap-12">
              <div className="relative shrink-0">
                <div
                  className="bg-center bg-no-repeat bg-cover rounded-2xl border-4 border-white/20 shadow-2xl"
            style={{
                    width: "280px",
                    height: "350px",
              backgroundImage: profile.avatar ? `url("${profile.avatar}")` : undefined,
                    backgroundColor: profile.avatar ? undefined : "#192633",
                  }}
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl mb-4">
                  {playerName}
                </h1>
                {fullName !== playerName && (
                  <h2 className="text-2xl font-semibold text-[#92adc9] mb-6 md:text-3xl">
                    {fullName}
                  </h2>
                )}
                <div className="flex flex-col items-center gap-3 md:flex-row md:items-center md:gap-6">
                  {profile.position && (
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-medium text-white">{profile.position}</span>
                    </div>
                  )}
                  {profile.nationality && (
                    <div className="flex items-center gap-2">
                      <span className="text-lg text-[#92adc9]">{profile.nationality}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <PortfolioTabs
                profile={profile}
                videos={videos}
                images={images}
                achievements={achievements}
                certificates={certificates}
              />
            </div>

            <div className="space-y-6">
              <section className="rounded-xl border border-[#233648] bg-[#192633] overflow-hidden">
                <div className="bg-[#233648] px-6 py-4 border-b border-[#324d67]">
                  <h3 className="text-lg font-bold text-white">Player Profile</h3>
                        </div>
                <div className="p-6">
                  <table className="w-full">
                    <tbody className="space-y-4">
                      {profile.age > 0 && (
                        <tr className="border-b border-[#233648]">
                          <td className="py-3 text-sm font-medium text-[#92adc9]">Date of Birth</td>
                          <td className="py-3 text-sm text-white text-right">{formatDateOfBirth(profile.age) || `Age ${profile.age}`}</td>
                        </tr>
                      )}
                      {profile.nationality && (
                        <tr className="border-b border-[#233648]">
                          <td className="py-3 text-sm font-medium text-[#92adc9]">Citizenship</td>
                          <td className="py-3 text-sm text-white text-right">{profile.nationality}</td>
                        </tr>
                      )}
                      {profile.position && (
                        <tr className="border-b border-[#233648]">
                          <td className="py-3 text-sm font-medium text-[#92adc9]">Position</td>
                          <td className="py-3 text-sm text-white text-right">{profile.position}</td>
                        </tr>
                      )}
                      {profile.email && (
                        <tr className="border-b border-[#233648]">
                          <td className="py-3 text-sm font-medium text-[#92adc9]">Email</td>
                          <td className="py-3 text-sm text-white text-right break-all">{profile.email}</td>
                        </tr>
                      )}
                      {profile.phone && (
                        <tr className="border-b border-[#233648]">
                          <td className="py-3 text-sm font-medium text-[#92adc9]">Phone</td>
                          <td className="py-3 text-sm text-white text-right">{profile.phone}</td>
                        </tr>
                      )}
                      {profile.transferMarketLink && (
                        <tr className="border-b border-[#233648]">
                          <td className="py-3 text-sm font-medium text-[#92adc9]">Transfer Market</td>
                          <td className="py-3 text-sm text-right">
                            <a
                              href={profile.transferMarketLink}
                        target="_blank"
                        rel="noreferrer"
                              className="text-[#1172d4] hover:underline break-all"
                            >
                              View Profile
                            </a>
                          </td>
                        </tr>
                      )}
                      {profile.placeOfBirth && (
                        <tr className="border-b border-[#233648]">
                          <td className="py-3 text-sm font-medium text-[#92adc9]">Place of Birth</td>
                          <td className="py-3 text-sm text-white text-right">{profile.placeOfBirth}</td>
                        </tr>
                      )}
                      {profile.height && (
                        <tr className="border-b border-[#233648]">
                          <td className="py-3 text-sm font-medium text-[#92adc9]">Height</td>
                          <td className="py-3 text-sm text-white text-right">{profile.height}</td>
                        </tr>
                      )}
                      {profile.weight && (
                        <tr>
                          <td className="py-3 text-sm font-medium text-[#92adc9]">Weight</td>
                          <td className="py-3 text-sm text-white text-right">{profile.weight}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
          </div>
        </section>

              <section className="rounded-xl border border-[#233648] bg-[#192633] overflow-hidden">
                <div className="bg-[#233648] px-6 py-4 border-b border-[#324d67]">
                  <h3 className="text-lg font-bold text-white">Career Information</h3>
            </div>
                <div className="p-6">
                  <table className="w-full">
                    <tbody>
                      <tr className="border-b border-[#233648]">
                        <td className="py-3 text-sm font-medium text-[#92adc9]">Matches</td>
                        <td className="py-3 text-sm text-white text-right">{profile.stats.matches || 0} matches</td>
                      </tr>
                      <tr className="border-b border-[#233648]">
                        <td className="py-3 text-sm font-medium text-[#92adc9]">Goals</td>
                        <td className="py-3 text-sm text-white text-right">{profile.stats.goals || 0} goals</td>
                      </tr>
                      <tr className="border-b border-[#233648]">
                        <td className="py-3 text-sm font-medium text-[#92adc9]">Assists</td>
                        <td className="py-3 text-sm text-white text-right">{profile.stats.assists || 0} assists</td>
                      </tr>
                      {certificates.length > 0 && (
                        <tr className="border-b border-[#233648]">
                          <td className="py-3 text-sm font-medium text-[#92adc9]">Certificates</td>
                          <td className="py-3 text-sm text-white text-right">{certificates.length}</td>
                        </tr>
                      )}
                      {achievements.length > 0 && (
                        <tr className="border-b border-[#233648]">
                          <td className="py-3 text-sm font-medium text-[#92adc9]">Achievements</td>
                          <td className="py-3 text-sm text-white text-right">{achievements.length}</td>
                        </tr>
                      )}
                      {profile.discipline && (
                        <tr className="border-b border-[#233648]">
                          <td className="py-3 text-sm font-medium text-[#92adc9]">Discipline</td>
                          <td className="py-3 text-sm text-white text-right">{profile.discipline}</td>
                        </tr>
                      )}
                      {profile.spotKick && (
                        <tr className="border-b border-[#233648]">
                          <td className="py-3 text-sm font-medium text-[#92adc9]">Spot Kick</td>
                          <td className="py-3 text-sm text-white text-right">{profile.spotKick}</td>
                        </tr>
                      )}
                      {profile.clubDebut && (
                        <tr className="border-b border-[#233648]">
                          <td className="py-3 text-sm font-medium text-[#92adc9]">Club Debut</td>
                          <td className="py-3 text-sm text-white text-right">{profile.clubDebut}</td>
                        </tr>
                      )}
                      {profile.previousClub && (
                        <tr className="border-b border-[#233648]">
                          <td className="py-3 text-sm font-medium text-[#92adc9]">Previous Club</td>
                          <td className="py-3 text-sm text-white text-right">{profile.previousClub}</td>
                        </tr>
                      )}
                      {profile.presentClub && (
                        <tr>
                          <td className="py-3 text-sm font-medium text-[#92adc9]">Present Club</td>
                          <td className="py-3 text-sm text-white text-right">{profile.presentClub}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
          </div>
        </section>

              {videos.length > 0 && (
                <section className="rounded-xl border border-[#233648] bg-[#192633] overflow-hidden">
                  <div className="bg-[#233648] px-6 py-4 border-b border-[#324d67]">
                    <h3 className="text-lg font-bold text-white">Featured Video</h3>
                  </div>
                  <div className="p-6">
                    {(() => {
                      const featuredVideo = videos[0];
                      const videoId = featuredVideo ? extractYouTubeId(featuredVideo.url || "") : null;
                      return (
                        <div className="space-y-4">
                          {videoId ? (
                            <div className="aspect-video w-full overflow-hidden rounded-lg border border-[#233648] bg-black">
                              <iframe
                                src={`https://www.youtube.com/embed/${videoId}`}
                                title={featuredVideo.name || "Featured video"}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                className="h-full w-full"
                              />
                    </div>
                          ) : (
                      <a
                              href={featuredVideo.url}
                        target="_blank"
                        rel="noreferrer"
                              className="block aspect-video w-full overflow-hidden rounded-lg border border-[#233648] bg-[#0c141b] relative group"
                            >
                              {featuredVideo.thumbnail ? (
                                <>
                          <div
                            className="h-full w-full bg-cover bg-center"
                                    style={{ backgroundImage: `url('${featuredVideo.thumbnail}')` }}
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors">
                                    <div className="w-16 h-16 rounded-full bg-[#1172d4] flex items-center justify-center">
                                      <svg
                                        className="w-8 h-8 text-white ml-1"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path d="M8 5v14l11-7z" />
                                      </svg>
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-[#92adc9]">
                                  <div className="w-16 h-16 rounded-full bg-[#1172d4] flex items-center justify-center">
                                    <svg
                                      className="w-8 h-8 text-white ml-1"
                                      fill="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M8 5v14l11-7z" />
                                    </svg>
                                  </div>
                        </div>
                      )}
                            </a>
                          )}
                          {featuredVideo.name && (
                            <p className="text-sm font-semibold text-white">{featuredVideo.name}</p>
                          )}
                          {videos.length > 1 && (
                            <p className="text-xs text-[#92adc9]">
                              {videos.length - 1} more video{videos.length > 2 ? 's' : ''} available in Videos tab
                            </p>
                          )}
                        </div>
                      );
                    })()}
            </div>
          </section>
        )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
