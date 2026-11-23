import windows10Logo from "../pics/windows.png";
import windows11Logo from "../pics/windows 11.png";

const distrowatchLogos = {
  "arch linux": "arch",
  "cachyos": "cachyos",
  "debian": "debian",
  "elementary os": "elementary",
  "endeavouros": "endeavour",
  "fedora": "fedora",
  "kubuntu": "kubuntu",
  "linux mint": "mint",
  "manjaro": "manjaro",
  "manjaro linux": "manjaro",
  "mx linux": "mx",
  "opensuse": "opensuse",
  "pop!_os": "popos",
  "ubuntu": "ubuntu",
  "zorin os": "zorin",
};

export const getDistroLogo = (distro) => {
  if (!distro) return "";

  const name = distro.name?.toLowerCase() || "";
  const osType = distro.os_type?.toLowerCase() || "";

  if (osType === "windows") {
    return name.includes("11") ? windows11Logo : windows10Logo;
  }

  const storedSlug = distro.logo_name?.trim();
  const identifier = distrowatchLogos[name] ||
    (storedSlug && /^[a-z0-9_-]+$/i.test(storedSlug) ? storedSlug : "");

  return identifier
    ? `https://distrowatch.com/images/yvzhuwbpy/${identifier}.png`
    : "";
};
